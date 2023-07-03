//! Contains the implementation of [`NewMapDto`].

use postgis_diesel::types::{Point, Polygon};
use uuid::Uuid;

use crate::model::entity::NewMap;

use super::NewMapDto;

impl From<(NewMapDto, Uuid)> for NewMap {
    fn from((new_map, owner_id): (NewMapDto, Uuid)) -> Self {
        let mut map_geom = Polygon::new(Some(4326));
        map_geom.add_points(vec![
            Point {
                x: 0.0,
                y: 0.0,
                srid: None,
            },
            Point {
                x: 5.0,
                y: 0.0,
                srid: None,
            },
            Point {
                x: 5.0,
                y: 5.0,
                srid: None,
            },
            Point {
                x: 0.0,
                y: 5.0,
                srid: None,
            },
            Point {
                x: 0.0,
                y: 0.0,
                srid: None,
            },
        ]);

        Self {
            name: new_map.name,
            map_geom,
            creation_date: new_map.creation_date,
            deletion_date: new_map.deletion_date,
            last_visit: new_map.last_visit,
            is_inactive: new_map.is_inactive,
            zoom_factor: new_map.zoom_factor,
            honors: new_map.honors,
            visits: new_map.visits,
            harvested: new_map.harvested,
            privacy: new_map.privacy,
            description: new_map.description,
            location: new_map.location.map(From::from),
            owner_id,
        }
    }
}
