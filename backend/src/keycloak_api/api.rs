//! This module contains the implementation of the client for the keycloak admin API.

use std::sync::RwLock;
use std::time::Instant;

use oauth2::basic::BasicClient;
use oauth2::reqwest::Error;
use oauth2::{
    AccessToken, AuthUrl, HttpRequest, HttpResponse, ResourceOwnerPassword, ResourceOwnerUsername,
    TokenResponse, TokenUrl,
};
use reqwest::header::HeaderValue;
use reqwest::Url;
use serde::de::DeserializeOwned;

use crate::config::app::Config;
use crate::keycloak_api::dtos::UserDto;

/// Helper type for results.
type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

/// The keycloak admin API.
pub struct KeycloakApi {
    /// Oauth2 client for auth with Keycloak.
    oauth_api: BasicClient,
    /// Username for auth with Keycloak.
    username: ResourceOwnerUsername,
    /// Password for auth with Keycloak.
    password: ResourceOwnerPassword,
    /// Base url for the Keycloak admin API.
    base_url: Url,
    /// Cached access token (needs to be thread safe).
    /// Might be expired, in which case it will be refreshed.
    auth_data: RwLock<Option<AuthData>>,
}

/// Helper struct to cache the access token and its expiration time.
#[derive(Clone)]
struct AuthData {
    /// The access token.
    access_token: AccessToken,
    /// The time when the access token expires.
    expires_at: Instant,
}

impl KeycloakApi {
    /// Creates a new Keycloak API.
    ///
    /// # Panics
    /// If the config does not contain a valid keycloak auth URI.
    #[allow(clippy::expect_used)]
    #[must_use]
    pub fn new(config: &Config) -> Self {
        let auth_url = AuthUrl::from_url(config.keycloak_auth_uri.clone());
        let token_url = TokenUrl::from_url(config.keycloak_auth_uri.clone());
        let mut base_url = to_base_url(token_url.url().clone());
        base_url.set_path("admin/realms/PermaplanT");

        let oauth_api = BasicClient::new(
            config.keycloak_client_id.clone(),
            Some(config.keycloak_client_secret.clone()),
            auth_url,
            Some(token_url),
        );

        Self {
            oauth_api,
            username: config.keycloak_username.clone(),
            password: config.keycloak_password.clone(),
            base_url,
            auth_data: RwLock::new(None),
        }
    }

    /// Gets all users from the Keycloak API.
    ///
    /// # Errors
    /// - If the url cannot be parsed.
    /// - If the authorization header cannot be created.
    /// - If the request fails or the response cannot be deserialized.
    pub async fn get_users(&self, client: &reqwest::Client) -> Result<Vec<UserDto>> {
        self.get::<Vec<UserDto>>(client, "/users").await
    }

    /// Executes a get request authenticated with the access token.
    async fn get<T: DeserializeOwned>(&self, client: &reqwest::Client, path: &str) -> Result<T> {
        let url = format!("{}{}", self.base_url, path);

        let mut request = reqwest::Request::new(reqwest::Method::GET, url.parse()?);
        let token = self.refresh_access_token(client).await?;
        let token_header = HeaderValue::from_str(&format!("Bearer {}", token.secret()))?;
        request.headers_mut().append("Authorization", token_header);

        let res = client.execute(request).await?.json::<T>().await?;

        Ok(res)
    }

    /// Refreshes the access token if it is expired.
    #[allow(clippy::unwrap_used)]
    async fn refresh_access_token(&self, client: &reqwest::Client) -> Result<AccessToken> {
        let auth_data = self.cloned_auth_data();

        match auth_data.as_ref() {
            Some(AuthData {
                access_token,
                expires_at,
            }) if *expires_at > Instant::now() => Ok(access_token.clone()),
            _ => self.get_access_token(client).await,
        }
    }

    /// Gets a new access token from the keycloak API.
    async fn get_access_token(&self, client: &reqwest::Client) -> Result<AccessToken> {
        let token_result = self
            .oauth_api
            .exchange_password(&self.username, &self.password)
            .request_async(|req| send_token_request(client, req))
            .await?;

        let token = token_result.access_token().clone();

        token_result.expires_in().map_or_else(
            || Err("No expires_in in token response".into()),
            |expires_in| {
                self.update_auth_data(AuthData {
                    access_token: token.clone(),
                    expires_at: Instant::now() + expires_in,
                });

                Ok(token)
            },
        )
    }

    /// We clone the auth data to avoid holding the read lock longer than necessary.
    /// The critical section should be as short as possible.
    #[allow(clippy::unwrap_in_result, clippy::unwrap_used)]
    fn cloned_auth_data(&self) -> Option<AuthData> {
        self.auth_data.read().unwrap().clone()
    }

    /// We acquire the write lock to update the token and expiration time.
    /// The critical section should be as short as possible.
    #[allow(clippy::unwrap_used)]
    fn update_auth_data(&self, update: AuthData) {
        let mut auth_data = self.auth_data.write().unwrap();
        *auth_data = Some(update);
    }
}

/// Helper function to send a token request.
///
/// Basically a copy of [`oauth2::reqwest::async_http_client`].
/// Uses a client instance instead of a new client.
/// This enables connection pooling. See: <https://github.com/seanmonstar/reqwest/discussions/2067>
async fn send_token_request(
    client: &reqwest::Client,
    request: HttpRequest,
) -> std::result::Result<HttpResponse, Error<reqwest::Error>> {
    let mut request_builder = client
        .request(request.method, request.url.as_str())
        .body(request.body);
    for (name, value) in &request.headers {
        request_builder = request_builder.header(name.as_str(), value.as_bytes());
    }

    let req = request_builder.build().map_err(Error::Reqwest)?;

    let response = client.execute(req).await.map_err(Error::Reqwest)?;

    let status_code = response.status();
    let headers = response.headers().to_owned();
    let chunks = response.bytes().await.map_err(Error::Reqwest)?;
    Ok(HttpResponse {
        status_code,
        headers,
        body: chunks.to_vec(),
    })
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
