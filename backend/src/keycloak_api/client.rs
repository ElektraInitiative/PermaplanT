//! This module contains the implementation of the client for the keycloak admin API.

use std::time::Instant;

use oauth2::basic::BasicClient;
use oauth2::reqwest::Error;
use oauth2::{
    AccessToken, AuthUrl, HttpRequest, HttpResponse, ResourceOwnerPassword, ResourceOwnerUsername,
    TokenResponse, TokenUrl,
};
use reqwest::header::HeaderValue;
use serde::de::DeserializeOwned;

use crate::config::app::Config;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

pub struct KeycloakClient {
    oauth_api: BasicClient,
    username: ResourceOwnerUsername,
    password: ResourceOwnerPassword,
    base_url: String,
    auth_data: Option<AuthData>,
}

struct AuthData {
    access_token: AccessToken,
    expires_at: Instant,
}

impl KeycloakClient {
    pub fn new(config: &Config) -> Self {
        let auth_url = AuthUrl::from_url(config.keycloak_auth_uri.to_owned());
        let token_url = TokenUrl::from_url(config.keycloak_auth_uri.to_owned());
        let base_url = config
            .keycloak_auth_uri
            .host()
            .expect("URI should have host")
            .to_string();

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
            auth_data: None,
        }
    }

    async fn refresh_access_token(&mut self, client: &reqwest::Client) -> Result<AccessToken> {
        match &self.auth_data {
            Some(AuthData {
                access_token,
                expires_at,
            }) if *expires_at > Instant::now() => {
                return Ok(access_token.clone());
            }
            _ => self.get_access_token(client).await,
        }
    }

    /// Helper function to get a new access token from the Keycloak API.
    async fn get_access_token(&mut self, client: &reqwest::Client) -> Result<AccessToken> {
        let token_result = self
            .oauth_api
            .exchange_password(&self.username, &self.password)
            .request_async(|req| self.send_token_request(client, req))
            .await?;

        let token = token_result.access_token().clone();
        let expires_in = token_result.expires_in();

        if expires_in.is_none() {
            return Err("No expires_in in token response".into());
        }

        self.auth_data = Some(AuthData {
            access_token: token.clone(),
            expires_at: Instant::now() + expires_in.unwrap(),
        });

        return Ok(token);
    }

    /// Helper function to send a token request to the Keycloak API.
    ///
    /// Basically a copy of [`oauth2::reqwest::async_http_client`]
    /// but using a client instance instead of a new client.
    /// This enables connection pooling. See: https://github.com/seanmonstar/reqwest/discussions/2067
    async fn send_token_request(
        &self,
        client: &reqwest::Client,
        request: HttpRequest,
    ) -> std::result::Result<HttpResponse, Error<reqwest::Error>> {
        let mut request_builder = client
            .request(request.method, request.url.as_str())
            .body(request.body);
        for (name, value) in &request.headers {
            request_builder = request_builder.header(name.as_str(), value.as_bytes());
        }
        let request = request_builder.build().map_err(Error::Reqwest)?;

        let response = client.execute(request).await.map_err(Error::Reqwest)?;

        let status_code = response.status();
        let headers = response.headers().to_owned();
        let chunks = response.bytes().await.map_err(Error::Reqwest)?;
        Ok(HttpResponse {
            status_code,
            headers,
            body: chunks.to_vec(),
        })
    }

    /// Executes a get request authenticated with the access token.
    pub async fn get<T: DeserializeOwned>(
        &mut self,
        client: &reqwest::Client,
        path: &str,
    ) -> Result<T> {
        let url = format!("{}{}", self.base_url, path);
        let mut request = reqwest::Request::new(reqwest::Method::GET, url.parse()?);
        let token = self.refresh_access_token(client).await?;
        let token_header = HeaderValue::from_str(&format!("Bearer {}", token.secret()))?;
        request.headers_mut().append("Authorization", token_header);

        let res = client.execute(request.into()).await?;

        res.json().await.map_err(|e| e.into())
    }
}
