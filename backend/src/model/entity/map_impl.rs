//! Contains the implementation of [`Map`].

use diesel::dsl::sql;
use diesel::pg::Pg;
use diesel::sql_types::Float;
use diesel::{
    debug_query, BoolExpressionMethods, ExpressionMethods, PgTextExpressionMethods, QueryDsl,
    QueryResult,
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::db::function::{similarity, PgTrgmExpressionMethods};
use crate::db::pagination::Paginate;
use crate::model::dto::{
    MapSearchParameters, Page, PageParameters, UpdateMapDto, UpdateMapGeometryDto,
};
use crate::model::entity::{UpdateMap, UpdateMapGeometry};
use crate::schema::maps::name;
use crate::{
    model::dto::{MapDto, NewMapDto},
    schema::maps::{self, all_columns, created_by, is_inactive, privacy},
};

use super::{Map, NewMap};

impl Map {
    /// Get the top maps matching the search query.
    ///
    /// Can be filtered by `is_inactive` and `created_by` if provided in `search_parameters`.
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
        if let Some(created_by_search) = search_parameters.created_by {
            query = query.filter(created_by.eq(created_by_search));
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

    /// Update a map in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn update(
        map_update: UpdateMapDto,
        id: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<MapDto> {
        let map_update = UpdateMap::from(map_update);
        let query = diesel::update(maps::table.find(id)).set(&map_update);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    /// Update a maps bounds in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn update_geometry(
        map_update_bounds: UpdateMapGeometryDto,
        id: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<MapDto> {
        let map_update = UpdateMapGeometry::from(map_update_bounds);
        let query = diesel::update(maps::table.find(id)).set(&map_update);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }
}
