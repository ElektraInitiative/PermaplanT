use postgis_diesel::types::{Point, Polygon};
use serde_json::json;

pub fn tall_rectangle() -> Polygon<Point> {
    let polygon = json!({
        "rings": [
            [
                {
                    "x": 0.0,
                    "y": 0.0
                },
                {
                    "x": 500.0,
                    "y": 0.0
                },
                {
                    "x": 500.0,
                    "y": 1000.0
                },
                {
                    "x": 0.0,
                    "y": 1000.0
                },
                {
                    "x": 0.0,
                    "y": 0.0
                }
            ]
        ],
        "srid": 4326
    });
    serde_json::from_value(polygon).unwrap()
}

pub fn small_rectangle() -> Polygon<Point> {
    let polygon = json!({
        "rings": [
            [
                {
                    "x": 0.0,
                    "y": 0.0
                },
                {
                    "x": 10.0,
                    "y": 0.0
                },
                {
                    "x": 10.0,
                    "y": 100.0
                },
                {
                    "x": 0.0,
                    "y": 100.0
                },
                {
                    "x": 0.0,
                    "y": 0.0
                }
            ]
        ],
        "srid": 4326
    });
    serde_json::from_value(polygon).unwrap()
}

pub fn small_rectangle_with_non_0_xmin() -> Polygon<Point> {
    let polygon = json!({
        "rings": [
            [
                {
                    "x": 10.0,
                    "y": 0.0
                },
                {
                    "x": 100.0,
                    "y": 0.0
                },
                {
                    "x": 100.0,
                    "y": 100.0
                },
                {
                    "x": 10.0,
                    "y": 100.0
                },
                {
                    "x": 10.0,
                    "y": 0.0
                }
            ]
        ],
        "srid": 4326
    });
    serde_json::from_value(polygon).unwrap()
}

pub fn rectangle_with_missing_bottom_left_corner() -> Polygon<Point> {
    let polygon = json!({
        "rings": [
            [
                {
                    "x": 0.0,
                    "y": 0.0
                },
                {
                    "x": 100.0,
                    "y": 0.0
                },
                {
                    "x": 100.0,
                    "y": 100.0
                },
                {
                    "x": 50.0,
                    "y": 100.0
                },
                {
                    "x": 50.0,
                    "y": 50.0
                },
                {
                    "x": 0.0,
                    "y": 50.0
                },
                {
                    "x": 0.0,
                    "y": 0.0
                }
            ]
        ],
        "srid": 4326
    });
    serde_json::from_value(polygon).unwrap()
}

pub fn small_square() -> Polygon<Point> {
    let polygon = json!({
        "rings": [
            [
                {
                    "x": 0.0,
                    "y": 0.0
                },
                {
                    "x": 20.0,
                    "y": 0.0
                },
                {
                    "x": 20.0,
                    "y": 20.0
                },
                {
                    "x": 0.0,
                    "y": 20.0
                },
                {
                    "x": 0.0,
                    "y": 0.0
                }
            ]
        ],
        "srid": 4326
    });
    serde_json::from_value(polygon).unwrap()
}
