WITH t1 AS (
    SELECT
        p.add_date,
        count(*)::integer AS additions
    FROM
        plantings AS p
    INNER JOIN
        layers AS l
        ON p.layer_id = l.id
    WHERE
        l.map_id = $1 AND
        p.add_date BETWEEN $2 AND $3
    GROUP BY
        p.add_date
),

t2 AS (
    SELECT
        p.remove_date,
        count(*)::integer AS removals
    FROM
        plantings AS p
    INNER JOIN
        layers AS l
        ON p.layer_id = l.id
    WHERE
        l.map_id = $1 AND
        p.remove_date BETWEEN $2 AND $3
    GROUP BY
        p.remove_date
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
