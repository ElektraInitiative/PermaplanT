//! Contains DTO implementations for [`Users`].

use uuid::Uuid;

use crate::model::entity::Users;

use super::UsersDto;

impl From<(UsersDto, Uuid)> for Users {
    fn from((user_data, user_id): (UsersDto, Uuid)) -> Self {
        Self {
            id: user_id,
            salutation: user_data.salutation,
            title: user_data.title,
            country: user_data.country,
            phone: user_data.phone,
            website: user_data.website,
            organization: user_data.organization,
            experience: user_data.experience,
            membership: user_data.membership,
            member_years: user_data.member_years,
            member_since: user_data.member_since,
            permacoins: user_data.permacoins,
        }
    }
}

impl From<Users> for UsersDto {
    fn from(user_data: Users) -> Self {
        Self {
            salutation: user_data.salutation,
            title: user_data.title,
            country: user_data.country,
            phone: user_data.phone,
            website: user_data.website,
            organization: user_data.organization,
            experience: user_data.experience,
            membership: user_data.membership,
            member_years: user_data.member_years,
            member_since: user_data.member_since,
            permacoins: user_data.permacoins,
        }
    }
}

impl<T> From<(T, Users)> for UsersDto {
    fn from((_, user_data): (T, Users)) -> Self {
        Self::from(user_data)
    }
}
