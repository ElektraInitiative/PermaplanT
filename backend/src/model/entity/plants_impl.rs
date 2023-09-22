//! Contains the implementation of [`Plants`].

use diesel::{
    debug_query,
    dsl::sql,
    pg::Pg,
    sql_types::{Bool, Float, Integer},
    BoolExpressionMethods, ExpressionMethods, QueryDsl, QueryResult,
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::model::entity::Seed;
use crate::{
    db::{
        function::{array_to_string, greatest, similarity, similarity_nullable},
        pagination::Paginate,
    },
    model::{
        dto::{Page, PageParameters, PlantsSummaryDto},
        r#enum::quantity::Quantity,
    },
    schema::{
        plants::{
            self, all_columns, common_name_de, common_name_en, edible_uses_en, sowing_outdoors,
            unique_name,
        },
        seeds::{self, all_columns as seed_all_columns},
    },
};

use super::Plants;

impl Plants {
    /// Get the top plants matching the search query.
    ///
    /// Uses `pg_trgm` to find matches in `unique_name`, `common_name_de`, `common_name_en` and `edible_uses_en`.
    /// Ranks them using the `pg_trgm` function `similarity()`.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn search(
        search_query: &str,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<PlantsSummaryDto>> {
        let query = plants::table
            .select((
                greatest(
                    similarity(unique_name, search_query),
                    similarity(array_to_string(common_name_de, " "), search_query),
                    similarity(array_to_string(common_name_en, " "), search_query),
                    similarity_nullable(edible_uses_en, search_query),
                ),
                plants::all_columns,
            ))
            .filter(
                similarity(unique_name, search_query)
                    .gt(0.1)
                    .or(similarity(array_to_string(common_name_de, " "), search_query).gt(0.1))
                    .or(similarity(array_to_string(common_name_en, " "), search_query).gt(0.1))
                    .or(similarity_nullable(edible_uses_en, search_query).gt(0.1)),
            )
            .order(sql::<Float>("1").desc())
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page);
        debug!("{}", debug_query::<Pg, _>(&query));
        query
            .load_page::<(f32, Self)>(conn)
            .await
            .map(Page::from_entity)
    }

    /// Get a page of some plants.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_any(
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<PlantsSummaryDto>> {
        let query = plants::table
            .select(all_columns)
            .into_boxed()
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.load_page::<Self>(conn).await.map(Page::from_entity)
    }

    /// Fetch plant by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_id(
        id: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<PlantsSummaryDto> {
        let query = plants::table.find(id);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.first::<Self>(conn).await.map(Into::into)
    }

    /// Fetch available and seasonal plants.
    /// - A plant is available if for the given `user_id` there is a `Seed` with `quantity` not `Nothing`.
    /// - A plant is seasonal if the given `half_of_month` is included in a `Plant`'s `sowing_outdoors`
    /// or the `sowing_outdoors` is empty.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_available_seasonal(
        half_month_bucket: i32,
        user_id: Uuid,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<PlantsSummaryDto>> {
        // select unique_name, p.id from plants p inner join seeds s on p.id = s.plant_id
        // where s.quantity != 'Nothing' and 5 = ANY(p.sowing_outdoors);
        // let half_of_month_expr = Some(vec![Some(half_of_month)]);

        let query = plants::table
            .inner_join(seeds::table)
            .select((all_columns, seed_all_columns))
            .filter(
                seeds::quantity
                    .ne(Quantity::Nothing)
                    .and(seeds::owner_id.eq(user_id))
                    .and(
                        sql::<Bool>("")
                            .bind::<Integer, _>(half_month_bucket)
                            .sql(" = ANY(")
                            .bind(sowing_outdoors)
                            .sql(")")
                            .or(sowing_outdoors.is_null()),
                    ),
            )
            .order(seeds::quantity.desc())
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page);
        debug!("{}", debug_query::<Pg, _>(&query));

        query
            .load_page::<(Self, Seed)>(conn)
            .await
            .map(Page::from_entity)
    }
}
