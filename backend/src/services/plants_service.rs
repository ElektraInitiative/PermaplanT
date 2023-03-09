use actix_web::web::Data;

use crate::{
    config::db::Pool,
    error::ServiceError,
    models::{dto::plants_dto::PlantsDTO, plants::Plants},
};

pub fn find_all(pool: &Data<Pool>) -> Result<Vec<PlantsDTO>, ServiceError> {
    let mut conn = pool.get()?;
    let result = Plants::find_all(&mut conn)?;
    Ok(result)
}
