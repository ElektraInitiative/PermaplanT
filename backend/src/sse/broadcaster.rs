//! SSE broadcaster.

use actix_web_lab::sse::{self, ChannelStream, Sse};
use futures_util::{future::ready, stream, StreamExt};
use std::{collections::HashMap, sync::Arc, time::Duration};
use tokio::{sync::Mutex, time::interval};

/// Inner state of SSE broadcaster.
#[derive(Debug, Clone)]
struct BroadcasterInner {
    /// Map of map_id to a connected map.
    /// The map_id is the id of the map that the client connected to.
    /// The connected map contains the map_id and a list of clients connected to that map.
    maps: HashMap<i32, ConnectedMap>,
}

/// Map that clients are connected to.
#[derive(Debug, Clone)]
struct ConnectedMap {
    map_id: i32,
    clients: Vec<ConnectedClient>,
}

/// Client listening to updates on a map.
#[derive(Debug, Clone)]
pub struct ConnectedClient {
    /// Client ID.
    id: String,
    /// SSE sender for writing messages to the client.
    sender: sse::Sender,
}

#[derive(Debug, Clone)]
/// SSE broadcaster.
pub struct Broadcaster(Arc<Mutex<BroadcasterInner>>);

impl Broadcaster {
    /// Constructs new broadcaster and spawns ping loop.
    #[must_use]
    pub fn new() -> Self {
        let broadcaster = Self::default();
        Self::spawn_ping(broadcaster.clone());
        broadcaster
    }

    /// Pings clients every 10 seconds to see if they are alive and remove them from the broadcast list if not.
    fn spawn_ping(self) {
        actix_web::rt::spawn(async move {
            let mut interval = interval(Duration::from_secs(10));
            loop {
                interval.tick().await;
                self.clone().remove_stale_clients().await;
            }
        });
    }

    /// Removes all non-responsive clients from broadcast list.
    /// TODO: this is a naive implementation, we should probably use a better data structure for this.
    ///       Things to consider:
    ///        - how can we do this without having to iterate over all clients?
    async fn remove_stale_clients(&self) {
        let mut guard = self.0.lock().await;

        let mut ok_maps = HashMap::with_capacity(guard.maps.capacity());

        let old_maps = guard.maps.values();

        for map in old_maps {
            let ok_clients = stream::iter(&map.clients)
                .filter(|client| async {
                    client
                        .sender
                        .send(sse::Event::Comment("ping".into()))
                        .await
                        .is_ok()
                })
                .map(|client| ready(client.clone()))
                .buffer_unordered(15)
                .collect::<Vec<_>>()
                .await;

            if !ok_clients.is_empty() {
                ok_maps.insert(
                    map.map_id,
                    ConnectedMap {
                        map_id: map.map_id,
                        clients: ok_clients,
                    },
                );
            }
        }

        guard.maps = ok_maps;
    }

    /// Registers client with broadcaster, returning an SSE response body.
    ///
    /// # Errors
    /// * If sender.send() fails for the new client.
    pub async fn new_client(
        &self,
        map_id: i32,
        user_id: String,
    ) -> Result<Sse<ChannelStream>, Box<dyn std::error::Error>> {
        let (sender, channel_stream) = sse::channel(10);
        let mut guard = self.0.lock().await;

        let map = guard.maps.entry(map_id).or_insert_with(|| ConnectedMap {
            map_id,
            clients: Vec::new(),
        });

        sender.send(sse::Data::new("connected")).await?;

        map.clients.push(ConnectedClient {
            id: user_id.clone(),
            sender,
        });

        Ok(channel_stream)
    }

    /// Broadcasts `msg` to all clients on the same map.
    ///
    /// # Errors
    /// * If serialization of `msg` fails.
    pub async fn broadcast<T: serde::Serialize + Send>(
        &self,
        map_id: i32,
        msg: T,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let serialized_data = sse::Data::new_json(msg)?;
        let guard = self.0.lock().await;

        if let Some(map) = guard.maps.get(&map_id) {
            // try to send to all clients, ignoring failures
            // disconnected clients will get swept up by `remove_stale_clients`
            let _ = stream::iter(&map.clients)
                .map(|client| client.sender.send(serialized_data.clone()))
                .buffer_unordered(15)
                .collect::<Vec<_>>()
                .await;
        }

        Ok(())
    }
}

impl Default for Broadcaster {
    fn default() -> Self {
        Self(Arc::new(Mutex::new(BroadcasterInner {
            maps: HashMap::new(), // TODO: how can we choose a better initial capacity?
        })))
    }
}
