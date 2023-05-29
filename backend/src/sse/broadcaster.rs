use actix_web::{web::Json, HttpResponse, Responder};
use actix_web_lab::sse::{self, ChannelStream, Sse};
use futures_util::future;
use std::{sync::Arc, time::Duration};
use tokio::{sync::Mutex, time::interval};

#[derive(Debug, Clone, Default)]
struct BroadcasterInner {
    clients: Vec<Client>,
}

#[derive(Debug, Clone)]
pub struct Client {
    id: String,
    sender: sse::Sender,
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

        let client_ids = ok_clients
            .clone()
            .iter()
            .map(|client| client.id.clone())
            .collect::<Vec<_>>();
        println!("clients: {:?}", client_ids);

        self.inner.lock().await.clients = ok_clients;
    }

    /// Registers client with broadcaster, returning an SSE response body.
    pub async fn new_client(
        &self,
        user_id: String,
    ) -> Result<Sse<ChannelStream>, Box<dyn std::error::Error>> {
        let (tx, rx) = sse::channel(10);

        let has_client = self
            .inner
            .lock()
            .await
            .clients
            .iter()
            .any(|client| client.id == user_id);

        if has_client {
            return Err("client already exists".into());
        }

        tx.send(sse::Data::new("connected")).await.unwrap();
        self.inner.lock().await.clients.push(Client {
            id: user_id,
            sender: tx,
        });

        Ok(rx)
    }

    /// Broadcasts `msg` to all clients.
    pub async fn broadcast(&self, from: &str, msg: &str) {
        let clients = self
            .inner
            .lock()
            .await
            .clients
            .clone()
            .into_iter()
            .filter(|client| client.id != from)
            .collect::<Vec<_>>();

        let send_futures = clients
            .iter()
            .map(|client| client.sender.send(sse::Data::new(msg)));

        // try to send to all clients, ignoring failures
        // disconnected clients will get swept up by `remove_stale_clients`
        let _ = future::join_all(send_futures).await;
    }
}
