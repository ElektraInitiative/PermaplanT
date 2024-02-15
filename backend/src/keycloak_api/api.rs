//! This module contains the implementation of the client for the keycloak admin API.
//! Find the documentation here of the keycloak admin API here:
//! <https://www.keycloak.org/docs-api/22.0.1/rest-api/index.html#_users/>

use std::sync::Arc;
use std::time::Instant;

use actix_web::cookie::time::Duration;
use futures_util::{stream, StreamExt};
use reqwest::header::HeaderValue;
use reqwest::Url;
use secrecy::{ExposeSecret, Secret};
use serde::de::DeserializeOwned;
use tokio::sync::Mutex;

use crate::config::app::Config;
use crate::keycloak_api::dtos::UserDto;
use crate::model::dto::{PageParameters, UserSearchParameters};

use super::errors::KeycloakApiError;

/// Helper type for results.
type Result<T> = std::result::Result<T, KeycloakApiError>;

/// The default number of rows returned from a paginated request.
pub const DEFAULT_PER_PAGE: i32 = 10;
/// The minimum value for page number in a paginated request.
/// Pages start at 1. Using a lower value would lead to nonsensical queries.
pub const MIN_PAGE: i32 = 1;
/// The minimum number of rows returned from a paginated query.
pub const MIN_PER_PAGE: i32 = 1;

/// The keycloak admin API.
#[derive(Clone)]
pub struct Api {
    /// Base url for the Keycloak admin REST API.
    base_url: Url,
    /// Cached access token (needs to be thread safe).
    /// Might be expired, in which case it will be refreshed.
    auth_data: Arc<Mutex<Option<AuthData>>>,
    /// Url for requesting the access token from the auth server.
    token_url: Url,
    /// The client id for the oauth2 client.
    client_id: String,
    /// The client secret for the oauth2 client.
    client_secret: Secret<String>,
}

/// Helper struct to cache the access token and its expiration time.
#[derive(Clone)]
struct AuthData {
    /// The access token.
    access_token: Secret<String>,
    /// Timestamp the token expires.
    expires_at: Instant,
}

/// Helper struct to deserialize the token response.
#[derive(serde::Deserialize)]
struct TokenResponse {
    /// The access token.
    pub access_token: Secret<String>,
    /// Timestamp the token expires.
    pub expires_in: i64,
}

impl Api {
    /// Creates a new Keycloak API.
    ///
    /// # Panics
    /// If the config does not contain a valid keycloak auth URI.
    #[allow(clippy::expect_used)]
    #[must_use]
    pub fn new(config: &Config) -> Self {
        let token_url = config.auth_token_uri.clone();
        let mut base_url = to_base_url(token_url.clone());
        base_url.set_path("admin/realms/PermaplanT");

        let client_secret = config.auth_admin_client_secret.clone();
        let client_id = config.auth_admin_client_id.clone();

        Self {
            base_url,
            token_url,
            client_id,
            client_secret,
            auth_data: Arc::new(Mutex::new(None)),
        }
    }

    /// Search for users by their username.
    ///
    /// # Errors
    /// - If the url cannot be parsed.
    /// - If the authorization header cannot be created.
    /// - If the request fails or the response cannot be deserialized.
    pub async fn search_users_by_username(
        &self,
        search_params: &UserSearchParameters,
        pagination: &PageParameters,
        client: &reqwest::Client,
    ) -> Result<Vec<UserDto>> {
        let mut url = self.make_url("/users");

        url.query_pairs_mut()
            .append_pair("username", &search_params.username)
            .append_pair(
                "first",
                &format!("{}", &pagination.page.unwrap_or(MIN_PAGE)),
            )
            .append_pair(
                "max",
                &format!("{}", &pagination.per_page.unwrap_or(MIN_PAGE)),
            );
        self.get::<Vec<UserDto>>(client, url).await
    }

    /// Gets all users given their ids from the Keycloak API.
    ///
    /// # Errors
    /// - If the url cannot be parsed.
    /// - If the authorization header cannot be created.
    /// - If the request fails or the response cannot be deserialized.
    pub async fn get_users_by_ids(
        &self,
        client: &reqwest::Client,
        user_ids: Vec<uuid::Uuid>,
    ) -> Result<Vec<UserDto>> {
        let x = stream::iter(user_ids)
            .map(|id| {
                let client = client.clone();
                let api = self.clone();
                tokio::spawn(async move { api.get_user_by_id(&client, id).await })
            })
            .buffer_unordered(10);

        let y = x
            .map(|res| match res {
                Ok(Ok(user)) => Ok(user),
                Ok(Err(e)) => Err(e),
                Err(e) => Err(KeycloakApiError::Other(e.to_string())),
            })
            .collect::<Vec<_>>()
            .await
            .into_iter()
            .collect::<std::result::Result<Vec<_>, _>>()?;

        Ok(y)
    }

    /// Gets a user by its id from the Keycloak API.
    ///
    /// # Errors
    /// - If the url cannot be parsed.
    /// - If the authorization header cannot be created.
    /// - If the request fails or the response cannot be deserialized.
    pub async fn get_user_by_id(
        &self,
        client: &reqwest::Client,
        user_id: uuid::Uuid,
    ) -> Result<UserDto> {
        let url = self.make_url(&format!("/users/{user_id}"));
        self.get::<UserDto>(client, url).await
    }

    /// Executes a get request authenticated with the access token.
    async fn get<T: DeserializeOwned>(&self, client: &reqwest::Client, url: Url) -> Result<T> {
        let mut request = reqwest::Request::new(reqwest::Method::GET, url);
        let token = self.get_or_refresh_access_token(client).await?;
        let token_header =
            HeaderValue::from_str(&format!("Bearer {}", token.expose_secret().as_str()))?;
        request.headers_mut().append("Authorization", token_header);

        // There is a `json` method, but then we can not log the response for debugging easily.
        let response = client.execute(request).await?;

        if let Err(err) = response.error_for_status_ref() {
            return Err(KeycloakApiError::Reqwest(err.to_string()));
        }

        let response_text = response.text().await?;
        Ok(serde_json::from_str(&response_text)?)
    }

    /// Gets the access token or refreshes it if it is expired.
    async fn get_or_refresh_access_token(
        &self,
        client: &reqwest::Client,
    ) -> Result<Secret<String>> {
        let mut guard = self.auth_data.lock().await;

        match &*guard {
            Some(AuthData {
                access_token,
                expires_at,
            }) if *expires_at > Instant::now() => Ok(access_token.clone()),
            _ => {
                let new_auth_data = self.refresh_access_token(client).await?;

                *guard = Some(new_auth_data.clone());
                drop(guard);

                Ok(new_auth_data.access_token)
            }
        }
    }

    /// Refresh the access token.
    async fn refresh_access_token(&self, client: &reqwest::Client) -> Result<AuthData> {
        let token_response = client
            .post(self.token_url.clone())
            .form(&[
                ("grant_type", "client_credentials"),
                ("client_id", &self.client_id),
                ("client_secret", self.client_secret.expose_secret().as_str()),
            ])
            .send()
            .await?
            .json::<TokenResponse>()
            .await?;

        let access_token = token_response.access_token.clone();
        let expires_at =
            Instant::now() + Duration::seconds(token_response.expires_in) - Duration::seconds(5);

        Ok(AuthData {
            access_token,
            expires_at,
        })
    }

    /// Creates a URL from the base URL and the given path.
    fn make_url(&self, path: &str) -> url::Url {
        let mut url = self.base_url.clone();
        url.set_path(&format!("{}{}", self.base_url.path(), path));
        url
    }
}

/// Helper function to create a base URL.
///
/// # Panics
/// If the URL cannot be a base URL.
fn to_base_url(mut url: Url) -> Url {
    url.path_segments_mut().map_or_else(
        |()| panic!("Cannot set base url"),
        |mut segments| {
            segments.clear();
        },
    );

    url.set_query(None);
    url
}
