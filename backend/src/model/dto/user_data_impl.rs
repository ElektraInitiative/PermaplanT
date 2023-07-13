//! Contains DTO implementations for [`UserData`].

use uuid::Uuid;

use crate::model::entity::UserData;

use super::{GuidedToursDto, UserDataDto};

impl From<UserData> for GuidedToursDto {
    fn from(user_data: UserData) -> Self {
        Self {
            editor_introduction: user_data.editor_introduction,
        }
    }
}

impl From<(UserDataDto, Uuid)> for UserData {
    fn from((user_data, user_id): (UserDataDto, Uuid)) -> Self {
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
            editor_introduction: user_data.editor_introduction,
        }
    }
}

impl From<UserData> for UserDataDto {
    fn from(user_data: UserData) -> Self {
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
            editor_introduction: user_data.editor_introduction,
        }
    }
}

impl<T> From<(T, UserData)> for UserDataDto {
    fn from((_, user_data): (T, UserData)) -> Self {
        Self::from(user_data)
    }
}
