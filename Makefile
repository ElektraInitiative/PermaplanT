include frontend/.env
include backend/.env

.PHONY: all
all: test build

.PHONY: run-frontend
run-frontend: build-frontend
	cd frontend && npm run dev

.PHONY: run-backend
run-backend: build-backend
	cd backend && cargo run

.PHONY: run-mdbook
run-mdbook: build-mdbook
	mdbook serve --open

.PHONY: run-storybook
run-storybook:
	cd frontend && npm install && npm run storybook

# TEST

.PHONY: test
test: pre-commit-all test-frontend test-backend test-mdbook

.PHONY: test-frontend
test-frontend:
	cd frontend && npm install && npm run format:check && npm run lint && npm run test

.PHONY: test-backend
test-backend:
	cd backend && cargo test

.PHONY: test-mdbook
test-mdbook:
	mdbook test

.PHONY: test-storybook
test-storybook:
	cd frontend && npm install && npm run dev-storybook --smoke-test

# BUILD

.PHONY: build
build: generate-api-types build-frontend build-backend build-storybook build-mdbook

.PHONY: build-frontend
build-frontend: generate-api-types
	cd frontend && npm install && npm run generate-api-types && npm run build

.PHONY: build-backend
build-backend: generate-api-types
	cargo install diesel_cli@2.0.1 --no-default-features --features postgres && cargo install typeshare-cli
	cd backend && LC_ALL=C diesel setup && LC_ALL=C diesel migration run && cargo build

.PHONY: build-mdbook
build-mdbook:
	cargo install mdbook mdbook-mermaid
	cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
	mdbook build

.PHONY: build-storybook
build-storybook:
	cd frontend && npm install && npm run build-storybook

# MISC

.PHONY: generate-api-types
generate-api-types:
	cd frontend && npm run generate-api-types

.PHONY: psql-r
psql-r:
	psql -h db -p 5432 -U $(POSTGRES_USER) $(POSTGRES_DB)

.PHONY: pre-commit-all
pre-commit-all:
	pre-commit run --all-files

.PHONY: clean
clean: clean-frontend clean-backend clean-mdbook clean-storybook

.PHONY: clean-frontend
clean-frontend:
	cd frontend && rm -rf node_modules

.PHONY: clean
clean-backend:
	cd backend && cargo clean

.PHONY: clean-mdbook
clean-mdbook:
	mdbook clean

.PHONY: clean-storybook
clean-storybook:
	cd frontend && rm -rf storybook-static
