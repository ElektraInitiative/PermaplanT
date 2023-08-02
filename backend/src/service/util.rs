//! Utility traits and implementations.

use std::ops::Div;

use chrono::Datelike;

/// Trait for getting the half month bucket of a `NaiveDate`.
pub trait HalfMonthBucket {
    /// Returns the half month bucket of the date.
    /// This is a number between 0 and 23.
    /// 0 is the first half of January, 1 is the second half of January, 2 is the first half of February, etc.
    fn half_month_bucket(&self) -> i32;
}

impl<T> HalfMonthBucket for T
where
    T: Datelike,
{
    // I know what I'm doing.
    #[allow(
        clippy::cast_possible_wrap,
        clippy::expect_used,
        clippy::cast_sign_loss
    )]
    fn half_month_bucket(&self) -> i32 {
        /// The number of days in each month.
        const DAYS_PER_MONTH: [i32; 12] = [
            31, // January
            28, // February
            31, // March
            30, // April
            31, // May
            30, // June
            31, // July
            31, // August
            30, // September
            31, // October
            30, // November
            31, // December
        ];

        let month = self.month0() as i32;
        let day = self.day() as i32;

        let days_in_month = DAYS_PER_MONTH
            .get(month as usize)
            .copied()
            .expect("month is between 0 and 11, so this should never panic.");

        let half_month = i32::from(day > days_in_month.div(2));

        month * 2 + half_month
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::NaiveDate;

    #[allow(clippy::shadow_unrelated, clippy::unwrap_used)]
    #[test]
    fn test_half_month_bucket() {
        let date = NaiveDate::from_ymd_opt(2020, 1, 1).unwrap();
        assert_eq!(date.half_month_bucket(), 0);

        let date = NaiveDate::from_ymd_opt(2020, 1, 15).unwrap();
        assert_eq!(date.half_month_bucket(), 0);

        let date = NaiveDate::from_ymd_opt(2020, 1, 16).unwrap();
        assert_eq!(date.half_month_bucket(), 1);

        let date = NaiveDate::from_ymd_opt(2020, 2, 1).unwrap();
        assert_eq!(date.half_month_bucket(), 2);

        let date = NaiveDate::from_ymd_opt(2020, 2, 15).unwrap();
        assert_eq!(date.half_month_bucket(), 3);

        let date = NaiveDate::from_ymd_opt(2020, 12, 31).unwrap();
        assert_eq!(date.half_month_bucket(), 23);
    }
}
