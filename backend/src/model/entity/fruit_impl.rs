use diesel::{PgConnection, QueryDsl, QueryResult, RunQueryDsl};

use crate::{
    model::dto::FruitDto,
    schema::fruit::{self, all_columns},
};

use super::Fruit;

impl Fruit {
    pub fn find_all(conn: &mut PgConnection) -> QueryResult<Vec<FruitDto>> {
        let query_result = fruit::table.select(all_columns).load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }
}
