use actix_web::web::Json;
use actix_web_lab::sse::{self, ChannelStream, Sse};
use futures_util::future;
use parking_lot::Mutex;
use std::{sync::Arc, time::Duration};
use tokio::time::interval;

#[derive(Debug, Clone, Default)]
struct BroadcasterInner {
    clients: Vec<sse::Sender>,
}

pub struct Broadcaster {
    inner: Mutex<BroadcasterInner>,
}

impl Broadcaster {
    /// Constructs new broadcaster and spawns ping loop.
    pub fn create() -> Arc<Self> {
        let this = Arc::new(Self {
            inner: Mutex::new(BroadcasterInner::default()),
        });

        Broadcaster::spawn_ping(Arc::clone(&this));
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
        let clients = self.inner.lock().clients.clone();

        let mut ok_clients = Vec::new();

        for client in clients {
            if client
                .send(sse::Event::Comment("ping".into()))
                .await
                .is_ok()
            {
                ok_clients.push(client.clone());
            }
        }

        self.inner.lock().clients = ok_clients;
    }

    /// Registers client with broadcaster, returning an SSE response body.
    pub async fn new_client(&self) -> Sse<ChannelStream> {
        println!("starting creation");
        let (tx, rx) = sse::channel(10);

        tx.send(sse::Data::new("connected")).await.unwrap();
        println!("creating new clients success {:?}", tx);
        self.inner.lock().clients.push(tx);
        rx
    }

    /// Broadcasts `msg` to all clients.
    pub async fn broadcast(&self, msg: &str) {
        let clients = self.inner.lock().clients.clone();

        let send_futures = clients
            .iter()
            .map(|client| client.send(sse::Data::new(msg)));

        // try to send to all clients, ignoring failures
        // disconnected clients will get swept up by `remove_stale_clients`
        let _ = future::join_all(send_futures).await;
    }
}
