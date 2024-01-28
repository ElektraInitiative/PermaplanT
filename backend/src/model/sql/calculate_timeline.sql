WITH t1 AS (
    SELECT
        add_date,
        count(*)::integer AS additions
    FROM
        plantings
    WHERE
        add_date BETWEEN $1 AND $2
    GROUP BY
        add_date
),

t2 AS (
    SELECT
        remove_date,
        count(*)::integer AS removals
    FROM
        plantings
    WHERE
        remove_date BETWEEN $1 AND $2
    GROUP BY
        remove_date
)

SELECT
    coalesce(t1.add_date, t2.remove_date) AS "date",
    coalesce(t1.additions, 0) AS additions,
    coalesce(t2.removals, 0) AS removals
FROM
    t1
FULL OUTER JOIN
    t2
    ON t1.add_date = t2.remove_date;
