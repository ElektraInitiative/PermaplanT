//! Contains the implementation of [`Coordinates`].

use postgis_diesel::types::Point;

use super::Coordinates;

impl From<Point> for Coordinates {
    fn from(point: Point) -> Self {
        Self {
            latitude: point.y,
            longitude: point.x,
        }
    }
}

impl From<Coordinates> for Point {
    fn from(coordinates: Coordinates) -> Self {
        Self {
            x: coordinates.longitude,
            y: coordinates.latitude,
            srid: Some(4326),
        }
    }
}
