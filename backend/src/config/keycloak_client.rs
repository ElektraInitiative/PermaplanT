use std::time::Instant;

use super::app::Config;

use oauth2::basic::BasicClient;
use oauth2::reqwest::async_http_client;
use oauth2::{
    AccessToken, AuthUrl, HttpRequest, ResourceOwnerPassword, ResourceOwnerUsername, TokenResponse,
    TokenUrl,
};
use reqwest::header::HeaderMap;

pub struct KeycloakClient {
    client: BasicClient,
    access_token: Option<AccessToken>,
    expires_at: Option<Instant>,
    username: ResourceOwnerUsername,
    password: ResourceOwnerPassword,
}

impl KeycloakClient {
    pub fn new(config: &Config) -> Result<Self, Box<dyn std::error::Error>> {
        // Create an OAuth2 client by specifying the client ID, client secret, authorization URL and
        // token URL.
        let client = BasicClient::new(
            config.keycloak_client_id.clone(),
            Some(config.keycloak_client_secret.clone()),
            AuthUrl::new(
                "http://localhost:8081/realms/master/protocol/openid-connect/token".to_owned(),
            )?,
            Some(TokenUrl::new(
                "http://localhost:8081/realms/master/protocol/openid-connect/token".to_owned(),
            )?),
        );

        Ok(Self {
            client,
            access_token: None,
            expires_at: None,
            username: config.keycloak_username.clone(),
            password: config.keycloak_password.clone(),
        })
    }

    async fn refresh_access_token(&mut self) -> Result<&AccessToken, Box<dyn std::error::Error>> {
        if let Some(expires_at) = self.expires_at {
            if expires_at > Instant::now() {
                return Ok(self.access_token.as_ref().unwrap());
            }
        }

        self.get_access_token().await
    }

    async fn get_access_token(&mut self) -> Result<&AccessToken, Box<dyn std::error::Error>> {
        let token_result = self
            .client
            .exchange_password(&self.username, &self.password)
            .request_async(async_http_client)
            .await?;

        self.access_token = Some(token_result.access_token().clone());
        if let Some(expires_in) = token_result.expires_in() {
            self.expires_at = Instant::now().checked_add(expires_in);
        }

        // unwrap is safe here because we just set it
        Ok(self.access_token.as_ref().unwrap())
    }

    pub async fn get_users(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        let token = self.refresh_access_token().await?;
        let mut headers = HeaderMap::new();
        headers.append(
            "Authorization",
            format!("Bearer {}", token.secret()).parse()?,
        );

        let res = async_http_client(HttpRequest {
            url: "http://localhost:8081/admin/realms/PermaplanT/users".parse()?,
            method: reqwest::Method::GET,
            headers,
            body: vec![],
        })
        .await?;

        log::info!("Body: {}", String::from_utf8(res.body)?);

        Ok(())
    }
}

// pub async fn new(config: &Config) -> Result<(), Box<dyn std::error::Error>> {
//     // Create an OAuth2 client by specifying the client ID, client secret, authorization URL and
//     // token URL.
//     let client = BasicClient::new(
//         config.keycloak_client_id.clone(),
//         Some(config.keycloak_client_secret.clone()),
//         AuthUrl::new(
//             "http://localhost:8081/realms/master/protocol/openid-connect/token".to_owned(),
//         )?,
//         Some(TokenUrl::new(
//             "http://localhost:8081/realms/master/protocol/openid-connect/token".to_owned(),
//         )?),
//     );

//     let token_result = client
//         .exchange_password(&config.keycloak_username, &config.keycloak_password)
//         .request_async(async_http_client)
//         .await?;

//     log::info!("Token result: {:?}", token_result);

//     Ok(())
// }
