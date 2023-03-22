use crate::model::entity::NewMap;

use super::NewMapDto;

impl From<NewMapDto> for NewMap {
    fn from(new_map: NewMapDto) -> Self {
        Self {
            detail: new_map.detail,
        }
    }
}
