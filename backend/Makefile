.PHONY: run
run:
	cargo run

.PHONY: test
test: build
	cargo test && cargo check && cargo clippy && cargo doc

.PHONY: build
build: install migration
	cargo build

# Diesel setup, this makes sure that diesel will create the database if it doesn't exist yet and will run all migrations.
# Diesel migrations, to bring the database up to date with the current schema.
.PHONY: migration
migration: install
	LC_ALL=C diesel setup && LC_ALL=C diesel migration run

.PHONY: migration-redo
migration-redo: ## Runs the down.sql and then the up.sql for the most recent migration.
	LC_ALL=C diesel migration redo

.PHONY: migration-redo-a
migration-redo-a: ## Runs the down.sql and then the up.sql for all migration.
	LC_ALL=C diesel migration redo -a

.PHONY: migration-reset
migration-reset:  ## Reset diesel database.
	diesel database reset

.PHONY: clean
clean:
	cargo clean

.PHONY: install
install:
	rustup component add rustfmt clippy
	cargo install diesel_cli@2.0.1 --no-default-features --features postgres && cargo install typeshare-cli

.PHONY: uninstall
uninstall:
	rustup component remove rustfmt clippy
	cargo uninstall diesel_cli@2.0.1 --no-default-features --features postgres && cargo install typeshare-cli
