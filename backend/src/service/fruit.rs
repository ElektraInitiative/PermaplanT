use actix_web::web::Data;

use crate::{
    config::db::Pool,
    error::ServiceError,
    model::{dto::FruitDto, entity::Fruit},
};

pub fn find_all(pool: &Data<Pool>) -> Result<Vec<FruitDto>, ServiceError> {
    let mut conn = pool.get()?;
    let result = Fruit::find_all(&mut conn)?;
    Ok(result)
}
