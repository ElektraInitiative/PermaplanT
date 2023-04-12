//! Service layer for plants.

use actix_web::web::Data;
use diesel_async::AsyncPgConnection;

use crate::{
    config::db::Pool,
    error::ServiceError,
    model::{
        dto::{PlantsSearchDto, PlantsSearchParameters, PlantsSummaryDto},
        entity::Plants, r#enum::language::{Language},
    },
};

use std::cmp;

/// Fetch all plants from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_all(pool: &Data<Pool>) -> Result<Vec<PlantsSummaryDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Plants::find_all(&mut conn).await?;
    Ok(result)
}

/// Search plants from in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn search(
    pool: &Data<Pool>,
    query: &PlantsSearchParameters,
) -> Result<PlantsSearchDto, ServiceError> {
    let mut conn = pool.get().await?;

    let pages_start_at_1 = 1;
    let calculated_offset = query.limit * (query.page - pages_start_at_1);
    // disallows negative offsets
    let offset = cmp::max(calculated_offset, 0);

    // Perform an explicit conversion to make clippy happy.
    let unsigned_limit = query.limit.unsigned_abs() as usize;

    // Results where a column could be matched excactly should be prefered.
    let mut result = Plants::search_exact(&query.search_term, query.limit, offset, &mut conn).await?;

    // Only load more if there is still space left in the page.
    if result.plants.len() >= unsigned_limit {
       return Ok(result)
    }

    // Next comes the users preferred language. 
    let common_name_result = search_preferred_language(query, offset, &mut conn).await?;
    let deduplicated_common_name_result = search_deduplicate(&common_name_result.plants, &result.plants);
    
    result.plants.extend(deduplicated_common_name_result);

    // Again, no need to continue if the page is already full.
    if result.plants.len() >= unsigned_limit { 
        result.has_more = result.has_more || common_name_result.has_more;
        result.plants = result.plants.into_iter().take(unsigned_limit).collect(); 
        
        return Ok(result)
    }

    // Second most preferred language. 
    let common_name_result = search_second_preferred_language(query, offset, &mut conn).await?;
    let deduplicated_common_name_result = search_deduplicate(&common_name_result.plants, &result.plants);
    
    result.plants.extend(deduplicated_common_name_result);

    if result.plants.len() >= unsigned_limit { 
        result.has_more = result.has_more || common_name_result.has_more;
        result.plants = result.plants.into_iter().take(unsigned_limit).collect(); 
        
        return Ok(result)
    }

    // Third most preferred language. 
    let common_name_result = search_third_preferred_language(query, offset, &mut conn).await?;
    let deduplicated_common_name_result = search_deduplicate(&common_name_result.plants, &result.plants);
    
    result.plants.extend(deduplicated_common_name_result);

    if result.plants.len() >= unsigned_limit { 
        result.has_more = result.has_more || common_name_result.has_more;
        result.plants = result.plants.into_iter().take(unsigned_limit).collect(); 
        
        return Ok(result)
    }
 
    Ok(result)
}

/// Find the plant by id from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, pool: &Data<Pool>) -> Result<PlantsSummaryDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Plants::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Select best search method from the persistance layer based on the users preferred search language.
async fn search_preferred_language(query: &PlantsSearchParameters, offset: i32, conn: &mut AsyncPgConnection) -> Result<PlantsSearchDto, ServiceError>{
    let result = match query.preferred_language {
        Language::English => Plants::search_plant_english_name(&query.search_term, query.limit, offset, conn).await?,
        Language::German => Plants::search_plant_german_name(&query.search_term, query.limit, offset, conn).await?,
        Language::Latin => Plants::search_plant_latin_name(&query.search_term, query.limit, offset, conn).await?,
    }; 

   Ok(result)
}

/// Select second best search method from the persistance layer based on the users preferred search language.
async fn search_second_preferred_language(query: &PlantsSearchParameters, offset: i32, conn: &mut AsyncPgConnection) -> Result<PlantsSearchDto, ServiceError>{
    let result = match query.preferred_language {
        Language::English => Plants::search_plant_latin_name(&query.search_term, query.limit, offset, conn).await?,
        Language::German => Plants::search_plant_english_name(&query.search_term, query.limit, offset, conn).await?,
        Language::Latin => Plants::search_plant_english_name(&query.search_term, query.limit, offset, conn).await?,
    }; 

    Ok(result)
}

/// Select the third best search method from the persistance layer based on the users preferred search language.
async fn search_third_preferred_language(query: &PlantsSearchParameters, offset: i32, conn: &mut AsyncPgConnection) -> Result<PlantsSearchDto, ServiceError>{
   let result = match query.preferred_language {
        Language::English => Plants::search_plant_german_name(&query.search_term, query.limit, offset, conn).await?,
        Language::German => Plants::search_plant_latin_name(&query.search_term, query.limit, offset, conn).await?,
        Language::Latin => Plants::search_plant_german_name(&query.search_term, query.limit, offset, conn).await?,
    }; 

    Ok(result)
}

/// Remove duplicates from a new search result based on a previous search result
fn search_deduplicate(input: &Vec<PlantsSummaryDto>, compare: &Vec<PlantsSummaryDto>) -> Vec<PlantsSummaryDto> {
    let mut result: Vec<PlantsSummaryDto> = vec![];

    for input_dto in input {
        let mut found = false; 
        
        for compare_dto in compare {
            found = compare_dto.eq(input_dto);
            if found {
                break;
            }
        }

        if !found {
            result.push(input_dto.clone());
        }
    }

    result    
} 