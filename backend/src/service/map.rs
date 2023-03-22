use actix_web::web::Data;

use crate::{
    config::db::Pool,
    error::ServiceError,
    model::{
        dto::{MapDto, NewMapDto},
        entity::{Map, NewMap},
    },
};

pub fn find_all(pool: &Data<Pool>) -> Result<Vec<MapDto>, ServiceError> {
    let mut conn = pool.get()?;
    let result = Map::find_all(&mut conn)?;
    Ok(result)
}

pub fn find_by_id(id: i32, pool: &Data<Pool>) -> Result<MapDto, ServiceError> {
    let mut conn = pool.get()?;
    let result = Map::find_by_id(&mut conn, id)?;
    Ok(result)
}

pub fn update_by_id(id: i32, request: NewMapDto, pool: &Data<Pool>) -> Result<MapDto, ServiceError> {
    let mut conn = pool.get()?;
    let result = Map::update_by_id(&mut conn, id, request)?;
    Ok(result)
}
