use postgis_diesel::types::{Point, Polygon};
use serde_json::json;

pub fn tall_rectangle() -> Polygon<Point> {
    let polygon = json!({
        "rings": [
            [
                {
                    "x": 100.0,
                    "y": 100.0
                },
                {
                    "x": 500.0,
                    "y": 100.0
                },
                {
                    "x": 500.0,
                    "y": 1000.0
                },
                {
                    "x": 100.0,
                    "y": 1000.0
                },
                {
                    "x": 100.0,
                    "y": 100.0
                }
            ]
        ],
        "srid": 4326
    });
    serde_json::from_value(polygon).unwrap()
}
