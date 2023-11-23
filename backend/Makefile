.PHONY: run
run: ## Run backend
	cargo run

.PHONY: test
test: ## Build & Test backend
	cargo test && cargo check && cargo clippy && cargo doc

.PHONY: build
build: install migration ## Build backend
	cargo build

# Diesel setup, this makes sure that diesel will create the database if it doesn't exist yet and will run all migrations.
# Diesel migrations, to bring the database up to date with the current schema
.PHONY: migration
migration: install
	LC_ALL=C diesel setup && LC_ALL=C diesel migration run

.PHONY: migration-redo
migration-redo: ## Run down.sql and then up.sql for most recent migrations
	LC_ALL=C diesel migration redo

.PHONY: migration-redo-a
migration-redo-a: ## Run down.sql and then up.sql for all migration
	LC_ALL=C diesel migration redo -a

.PHONY: reset-database
reset-database: ## Reset diesel database
	diesel database reset

.PHONY: install
install: ## Install dependencies within the source repo
	rustup component add rustfmt clippy
	cargo install diesel_cli@2.0.1 --no-default-features --features postgres && cargo install typeshare-cli

.PHONY: uninstall
uninstall: ## Uninstall and clean everything in the backend
	-cargo clean
	-rustup component remove rustfmt clippy
	-cargo uninstall diesel_cli@2.0.1 && cargo install typeshare-cli
	-rm -rf target/*
