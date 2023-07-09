release ?=
ifdef MAKE_RELEASE
  release :=--release
  extension :
else
  release :=
endif

.PHONY: help
help: ## Show help for each of the Makefile recipes.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {gsub("\\\\n",sprintf("\n%22c",""), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: run
run: migrate ## Run the server.
	cargo run

.PHONY: test
test: migrate ## Runs cargo tests, check, clippy and doc.
	cargo check && cargo clippy && cargo doc && cargo test

.PHONY: build
build: migrate ## Build. If MAKE_RELEASE is set, build a release.
	cargo fetch && cargo build $(release)
	$(info MAKE_RELEASE is $(release))

# Diesel setup, this makes sure that diesel will create the database if it doesn't exist yet and will run all migrations.
# Diesel migrations, to bring the database up to date with the current schema.
.PHONY: migrate
migrate: generate-api-types ## Setups database if it doesn't exist yet and brings it up to date with the current schema.
	LC_ALL=C diesel setup && LC_ALL=C diesel migration run

.PHONY: generate-api-types
generate-api-types:  install ## Generates typescript types.
	cd ../frontend && npm run generate-api-types

# Workaround: we can't stop rustfmt from linting the generated schema.rs
.PHONE: fmt
fmt: migrate ## Format rust code according to guidelines and refresh schema.rs
	/bin/bash -c 'echo "" > src/schema.rs'
	cargo fmt --check
	$(MAKE) migrate

.PHONY: clean
clean:  ## Cargo clean.
	cargo clean

.PHONY: install
install:  ## Install extra rust dependencies within the source repo.
	rustup component add rustfmt clippy
	cargo install diesel_cli@2.0.1 --no-default-features --features postgres && cargo install typeshare-cli

.PHONY: uninstall
uninstall:  ## Uninstall extra rust dependencies within the source repo.
	rustup component remove rustfmt clippy
	cargo uninstall diesel_cli@2.0.1 --no-default-features --features postgres && cargo install typeshare-cli
