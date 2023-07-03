//! Contains the implementation of [`Map`].

use diesel::dsl::sql;
use diesel::pg::Pg;
use diesel::sql_types::{Double, Float, Integer};
use diesel::{
    debug_query, BoolExpressionMethods, ExpressionMethods, PgTextExpressionMethods, QueryDsl,
    QueryResult, QueryableByName,
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::db::function::{similarity, PgTrgmExpressionMethods};
use crate::db::pagination::Paginate;
use crate::model::dto::{MapSearchParameters, Page, PageParameters};
use crate::schema::maps::name;
use crate::{
    model::dto::{MapDto, NewMapDto},
    schema::maps::{self, all_columns, is_inactive, owner_id, privacy},
};

use super::{Map, NewMap};

#[derive(Debug, Clone, QueryableByName)]
pub struct HeatMapElement {
    #[diesel(sql_type = Double)]
    pub score: f64,
    #[diesel(sql_type = Integer)]
    pub x: i32,
    #[diesel(sql_type = Integer)]
    pub y: i32,
}

impl Map {
    pub async fn heatmap(
        map_id: i32,
        plant_id: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<Vec<f64>>> {
        // TODO: Compute from the maps geometry
        let num_rows = 10; // TODO: Calculate number of rows
        let num_cols = 10; // TODO: Calculate number of columns

        let query = diesel::sql_query("SELECT * FROM calculate_score($1, $2, $3, $4)")
            .bind::<Integer, _>(map_id)
            .bind::<Integer, _>(plant_id)
            .bind::<Integer, _>(num_rows)
            .bind::<Integer, _>(num_cols);

        let result = query.load::<HeatMapElement>(conn).await?;

        // TODO: figure out how to handle actual values (return matrix to frontend, create image, return matrix as binary?)
        let mut heatmap = vec![vec![0.0; num_cols as usize]; num_rows as usize];
        for HeatMapElement { score, x, y } in result {
            heatmap[x as usize][y as usize] = score;
        }
        Ok(heatmap)
    }

    /// Get the top maps matching the search query.
    ///
    /// Can be filtered by `is_inactive` and `owner_id` if provided in `search_parameters`.
    /// This will be done with equals and is additional functionality for maps (when compared to plant search).
    ///
    /// Uses `pg_trgm` to find matches in `name`.
    /// Ranks using the `pg_trgm` function `similarity()`.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: MapSearchParameters,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<MapDto>> {
        let mut query = maps::table
            .select((
                similarity(name, search_parameters.name.clone().unwrap_or_default()),
                all_columns,
            ))
            .into_boxed();

        if let Some(search_query) = &search_parameters.name {
            if !search_query.is_empty() {
                query = query.filter(
                    name.fuzzy(search_query)
                        .or(name.ilike(format!("%{search_query}%"))),
                );
            }
        }
        if let Some(is_inactive_search) = search_parameters.is_inactive {
            query = query.filter(is_inactive.eq(is_inactive_search));
        }
        if let Some(privacy_search) = search_parameters.privacy {
            query = query.filter(privacy.eq(privacy_search));
        }
        if let Some(owner_id_search) = search_parameters.owner_id {
            query = query.filter(owner_id.eq(owner_id_search));
        }

        let query = query
            .order(sql::<Float>("1").desc())
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page);
        debug!("{}", debug_query::<Pg, _>(&query));
        query
            .load_page::<(f32, Self)>(conn)
            .await
            .map(Page::from_entity)
    }

    /// Fetch map by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_id(id: i32, conn: &mut AsyncPgConnection) -> QueryResult<MapDto> {
        let query = maps::table.find(id);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.first::<Self>(conn).await.map(Into::into)
    }

    /// Create a new map in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        new_map: NewMapDto,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<MapDto> {
        let new_map = NewMap::from((new_map, user_id));
        let query = diesel::insert_into(maps::table).values(&new_map);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }
}
