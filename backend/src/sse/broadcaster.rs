//! SSE broadcaster.

use actix_web_lab::sse::{self, ChannelStream, Sse};
use futures_util::future;
use std::{sync::Arc, time::Duration};
use tokio::{sync::Mutex, time::interval};

/// Inner state of SSE broadcaster.
#[derive(Debug, Clone, Default)]
struct BroadcasterInner {
    /// List of connected clients.
    clients: Vec<Client>,
}

/// Connected client.
#[derive(Debug, Clone)]
pub struct Client {
    /// Client ID.
    id: String,
    /// SSE sender for writing messages to the client.
    sender: sse::Sender,
}

/// SSE broadcaster.
pub struct Broadcaster {
    /// Inner state of SSE broadcaster, guarded by a mutex.
    inner: Mutex<BroadcasterInner>,
}

impl Broadcaster {
    /// Constructs new broadcaster and spawns ping loop.
    #[must_use]
    pub fn create() -> Arc<Self> {
        let this = Arc::new(Self {
            inner: Mutex::new(BroadcasterInner::default()),
        });

        Self::spawn_ping(Arc::clone(&this));
        this
    }

    /// Pings clients every 10 seconds to see if they are alive and remove them from the broadcast list if not.
    fn spawn_ping(this: Arc<Self>) {
        actix_web::rt::spawn(async move {
            let mut interval = interval(Duration::from_secs(10));

            loop {
                interval.tick().await;
                this.remove_stale_clients().await;
            }
        });
    }

    /// Removes all non-responsive clients from broadcast list.
    async fn remove_stale_clients(&self) {
        let clients = self.inner.lock().await.clients.clone();

        let mut ok_clients = Vec::new();

        for client in clients {
            if client
                .sender
                .send(sse::Event::Comment("ping".into()))
                .await
                .is_ok()
            {
                ok_clients.push(client.clone());
            }
        }

        self.inner.lock().await.clients = ok_clients;
    }

    /// Registers client with broadcaster, returning an SSE response body.
    ///
    /// # Errors
    /// * If sender.send() fails for the new client.
    pub async fn new_client(
        &self,
        user_id: String,
    ) -> Result<Sse<ChannelStream>, Box<dyn std::error::Error>> {
        let (sender, channel_stream) = sse::channel(10);

        let mut new_clients = Vec::new();
        let old_clients = self.inner.lock().await.clients.clone();

        for old_client in old_clients {
            if old_client.id != user_id {
                new_clients.push(old_client);
            }
        }

        sender.send(sse::Data::new("connected")).await?;

        new_clients.push(Client {
            id: user_id,
            sender,
        });
        self.inner.lock().await.clients = new_clients;

        Ok(channel_stream)
    }

    /// Broadcasts `msg` to all clients.
    ///
    /// # Errors
    /// * If serialization of `msg` fails.
    pub async fn broadcast<T: serde::Serialize + Send>(
        &self,
        msg: T,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let serialized_data = sse::Data::new_json(msg)?;

        let clients = self.inner.lock().await.clients.clone();
        let send_futures = clients
            .iter()
            .map(|client| client.sender.send(serialized_data.clone()));

        // try to send to all clients, ignoring failures
        // disconnected clients will get swept up by `remove_stale_clients`
        let _ = future::join_all(send_futures).await;

        Ok(())
    }
}
