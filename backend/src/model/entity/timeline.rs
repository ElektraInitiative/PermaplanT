use chrono::NaiveDate;
use diesel::{
    sql_query,
    sql_types::{BigInt, Date, Nullable},
    QueryResult, QueryableByName,
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use std::collections::HashMap;

use crate::model::dto::timeline::{TimelineDto, TimelineEntryDto, TimelineParameters};

/// Stores the result of the timeline query. Dates and sum of addtions and removals.
#[derive(QueryableByName, Debug)]
struct TimelineQeueryResult {
    #[diesel(sql_type = Nullable<Date>)]
    date: Option<NaiveDate>,
    #[diesel(sql_type = BigInt)]
    additions: i64,
    #[diesel(sql_type = BigInt)]
    removals: i64,
}

/// Summarize all plantings into a timeline.
///
/// # Errors
/// * Unknown, diesel doesn't say why it might error.
pub async fn calculate(
    params: TimelineParameters,
    conn: &mut AsyncPgConnection,
) -> QueryResult<TimelineDto> {
    // the following query gives us additions and removals per day
    // date        additions  removals
    // 2000-01-01  7          3
    // 2000-01-02  4          0
    // 2000-01-03  2          8

    let query = sql_query(
        "SELECT
            COALESCE(t1.add_date, t2.remove_date) as date,
            COALESCE(t1.additions, 0) as additions,
            COALESCE(t2.removals, 0) as removals
        FROM
            (
                SELECT
                    add_date,
                    COUNT(*) as additions
                FROM
                    plantings
                WHERE
                    add_date BETWEEN $1 AND $2
                GROUP BY
                    add_date
            ) t1
        FULL OUTER JOIN
            (
                SELECT
                    remove_date,
                    COUNT(*) as removals
                FROM
                    plantings
                WHERE
                    remove_date BETWEEN $1 AND $2
                GROUP BY
                    remove_date
            ) t2
        ON
            t1.add_date = t2.remove_date",
    )
    .bind::<diesel::sql_types::Date, _>(params.start)
    .bind::<diesel::sql_types::Date, _>(params.end);

    let results = query.load::<TimelineQeueryResult>(conn).await?;

    let mut date_map: HashMap<String, TimelineEntryDto> = HashMap::new();
    let mut month_map: HashMap<String, TimelineEntryDto> = HashMap::new();
    let mut year_map: HashMap<String, TimelineEntryDto> = HashMap::new();

    for result in results {
        // Due to the query date cannot actually be null
        let date = result.date.unwrap();
        let date_string = date.format("%Y-%m-%d").to_string();
        let month_string = date.format("%Y-%m").to_string();
        let year_string = date.format("%Y").to_string();

        date_map.insert(
            date_string,
            TimelineEntryDto {
                additions: result.additions as i32,
                removals: result.removals as i32,
            },
        );

        let (month_additions, month_removals) = month_map.get(&month_string).map_or(
            (result.additions as i32, result.removals as i32),
            |entry| {
                (
                    entry.additions + result.additions as i32,
                    entry.removals + result.removals as i32,
                )
            },
        );
        month_map.insert(
            month_string,
            TimelineEntryDto {
                additions: month_additions as i32,
                removals: month_removals as i32,
            },
        );

        let (year_additions, year_removals) = year_map.get(&year_string).map_or(
            (result.additions as i32, result.removals as i32),
            |entry| {
                (
                    entry.additions + result.additions as i32,
                    entry.removals + result.removals as i32,
                )
            },
        );
        year_map.insert(
            year_string,
            TimelineEntryDto {
                additions: year_additions as i32,
                removals: year_removals as i32,
            },
        );
    }

    Ok(TimelineDto {
        years: year_map,
        months: month_map,
        dates: date_map,
    })
}
