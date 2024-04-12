use chrono::NaiveDate;
use diesel::{
    sql_query,
    sql_types::{Date, Integer},
    QueryResult, QueryableByName,
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use std::collections::HashMap;

use crate::model::dto::timeline::{TimelineDto, TimelineEntryDto, TimelineParameters};

///Query that calculates the timeline
const CALCULATE_TIMELINE_QUERY: &str = include_str!("../sql/calculate_timeline.sql");

/// Stores the result of the timeline query. Dates and sum of additions and removals of plantings.
#[derive(QueryableByName, Debug)]
struct TimelineQeueryResult {
    /// a date where at least one addition or removal of a planting took place
    #[diesel(sql_type = Date)]
    date: NaiveDate,
    /// the sum of planting additions on this date
    #[diesel(sql_type = Integer)]
    additions: i32,
    /// the sum of planting removals on this date
    #[diesel(sql_type = Integer)]
    removals: i32,
}

/// Summarize all plantings into a timeline.
///
/// # Errors
/// * Unknown, diesel doesn't say why it might error.
pub async fn calculate(
    map_id: i32,
    params: TimelineParameters,
    conn: &mut AsyncPgConnection,
) -> QueryResult<TimelineDto> {
    let query = sql_query(CALCULATE_TIMELINE_QUERY)
        .bind::<diesel::sql_types::Integer, _>(map_id)
        .bind::<diesel::sql_types::Date, _>(params.start)
        .bind::<diesel::sql_types::Date, _>(params.end);

    let results = query.load::<TimelineQeueryResult>(conn).await?;

    let mut years: HashMap<String, TimelineEntryDto> = HashMap::new();
    let mut months: HashMap<String, TimelineEntryDto> = HashMap::new();
    let mut dates: HashMap<String, TimelineEntryDto> = HashMap::new();

    for result in results {
        let date = result.date;
        let date_string = date.format("%Y-%m-%d").to_string();
        let month_string = date.format("%Y-%m").to_string();
        let year_string = date.format("%Y").to_string();

        dates.insert(
            date_string,
            TimelineEntryDto {
                additions: result.additions,
                removals: result.removals,
            },
        );

        let (month_additions, month_removals) =
            months
                .get(&month_string)
                .map_or((result.additions, result.removals), |entry| {
                    (
                        entry.additions + result.additions,
                        entry.removals + result.removals,
                    )
                });
        months.insert(
            month_string,
            TimelineEntryDto {
                additions: month_additions,
                removals: month_removals,
            },
        );

        let (year_additions, year_removals) =
            years
                .get(&year_string)
                .map_or((result.additions, result.removals), |entry| {
                    (
                        entry.additions + result.additions,
                        entry.removals + result.removals,
                    )
                });
        years.insert(
            year_string,
            TimelineEntryDto {
                additions: year_additions,
                removals: year_removals,
            },
        );
    }

    Ok(TimelineDto {
        years,
        months,
        dates,
    })
}
