use actix_web::web::Data;

use crate::{
    config::db::Pool,
    error::ServiceError,
    model::{dto::MapDto, entity::Map},
};

pub fn find_all(pool: &Data<Pool>) -> Result<Vec<MapDto>, ServiceError> {
    let mut conn = pool.get()?;
    let result = Map::find_all(&mut conn)?;
    Ok(result)
}
