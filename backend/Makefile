.PHONY: run
run:
	cargo run

.PHONY: test
test:
	cargo test && cargo check && cargo clippy && cargo doc

.PHONY: build
build:
	cargo install diesel_cli@2.0.1 --no-default-features --features postgres && cargo install typeshare-cli
	LC_ALL=C diesel setup && LC_ALL=C diesel migration run && cargo build

.PHONY: clean
clean:
	cargo clean

.PHONY: install
install:
	rustup component add rustfmt clippy
	cargo install mdbook mdbook-mermaid
	cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
	cargo install diesel_cli@2.0.1 --no-default-features --features postgres && cargo install typeshare-cli

.PHONY: uninstall
uninstall:
	rustup component remove rustfmt clippy
	cargo uninstall mdbook mdbook-mermaid
	cargo uninstall mdbook-generate-summary
	cargo uninstall diesel_cli@2.0.1 --no-default-features --features postgres && cargo install typeshare-cli
