//! Mock implementation for the keycloak admin API.
//! It is used for when the environment variables are not set which are needed to connect to the real keycloak API.

use async_trait::async_trait;

use crate::model::dto::{PageParameters, UserSearchParameters};

use super::{
    traits::{KeycloakApi, Result},
    UserDto,
};

pub struct MockApi;

#[async_trait]
impl KeycloakApi for MockApi {
    async fn search_users_by_username(
        &self,
        _search_params: &UserSearchParameters,
        _pagination: &PageParameters,
        _client: &reqwest::Client,
    ) -> Result<Vec<UserDto>> {
        Ok(vec![])
    }

    async fn get_users_by_ids(
        &self,
        _client: &reqwest::Client,
        _user_ids: Vec<uuid::Uuid>,
    ) -> Result<Vec<UserDto>> {
        Ok(vec![])
    }

    async fn get_user_by_id(
        &self,
        _client: &reqwest::Client,
        user_id: uuid::Uuid,
    ) -> Result<UserDto> {
        Ok(UserDto {
            id: user_id,
            username: "mock_user".to_owned(),
        })
    }
}
