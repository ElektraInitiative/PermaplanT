# Rust

Nearly all guidelines are implemented by rust-clippy, so this document is short.

- Always derive `Debug` and `Clone` (but beware of deriving Copy).
- Actions must be created in `backend/src/model/dto/actions.rs`.
- Read also about [logging](logging.md).
