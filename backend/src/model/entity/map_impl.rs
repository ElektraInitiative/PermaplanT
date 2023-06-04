//! Contains the implementation of [`Map`].

use diesel::dsl::sql;
use diesel::pg::Pg;
use diesel::sql_types::Float;
use diesel::{debug_query, ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;

use crate::db::function::{similarity, AliasExpressionMethod, PgTrgmExpressionMethods};
use crate::db::pagination::Paginate;
use crate::model::dto::{MapSearchParameters, Page, PageParameters};
use crate::schema::maps::name;
use crate::{
    model::dto::{MapDto, NewMapDto},
    schema::maps::{self, all_columns, is_inactive, owner_id},
};

use super::{Map, NewMap};

impl Map {
    /// Get the top plants matching the search query.
    ///
    /// Can be filtered by active status and owner id if provided in `search_parameters`.
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
        // Set higher search sensitivity so that the user gets more search results than with default
        // settings (0.3).
        let set_similarity_threshold = diesel::sql_query("SET pg_trgm.similarity_threshold=0.1");
        debug!("{}", debug_query::<Pg, _>(&set_similarity_threshold));
        let _ = set_similarity_threshold.execute(conn).await?;

        let mut query = maps::table
            .select((
                all_columns,
                similarity(name, search_parameters.name.clone().unwrap_or_default()).alias("rank"),
            ))
            .into_boxed();
        if let Some(search_query) = search_parameters.name {
            query = query.filter(name.fuzzy(search_query));
        }
        if let Some(is_inactive_search) = search_parameters.is_inactive {
            query = query.filter(is_inactive.eq(is_inactive_search));
        }
        if let Some(owner_id_search) = search_parameters.owner_id {
            query = query.filter(owner_id.eq(owner_id_search));
        }

        let query = query
            .order(sql::<Float>("rank").desc())
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page);
        debug!("{}", debug_query::<Pg, _>(&query));
        query
            .load_page::<(Self, f32)>(conn)
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
    pub async fn create(new_map: NewMapDto, conn: &mut AsyncPgConnection) -> QueryResult<MapDto> {
        let new_map = NewMap::from(new_map);
        let query = diesel::insert_into(maps::table).values(&new_map);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }
}
