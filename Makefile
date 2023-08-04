.PHONY: all
all: build

.PHONY: help
help:  ## Show help for each of the Makefile recipes.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {gsub("\\\\n",sprintf("\n%22c",""), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: run-frontend
run-frontend: build-frontend  ## Build & Run frontend.
	cd frontend && npm run dev -- --host

.PHONY: run-backend
run-backend: build-backend  ## Build & Run backend.
	cd backend && make run

.PHONY: run-reset-backend
run-reset-backend: build-backend reset-database  ## Build & Run backend with a database reset.
	cd backend && make run

.PHONY: run-mdbook
run-mdbook: build-mdbook  ## Build & Run mdbook.
	mdbook serve --open

.PHONY: run-storybook
run-storybook: build-storybook  ## Build & Run storybook.
	cd frontend && npm run storybook

# TEST

.PHONY: test
test: test-frontend test-backend test-mdbook test-e2e  ## Test everything.
	pre-commit

.PHONY: test-e2e
test-e2e: ## End-to-End tests. Needs backend and frontend running.
	cd e2e && ./e2e.sh

.PHONY: test-frontend
test-frontend:  ## Test Frontend.
	cd frontend && npm install && npm run format:check && npm run lint && npm run test

.PHONY: test-backend
test-backend:  ## Test Backend.
	cd backend && make test

.PHONY: test-mdbook
test-mdbook:  ## Test Mdbook.
	mdbook test

.PHONY: test-storybook
test-storybook:
	@echo "\033[0;31m Not supported \033[0m" && exit 1

# BUILD

.PHONY: build
build: generate-api-types build-frontend build-backend build-storybook build-mdbook  # Build everything.

.PHONY: build-frontend
build-frontend: generate-api-types  ## Build frontend.
	cd frontend && npm install && npm run generate-api-types && npm run build

.PHONY: build-backend
build-backend: generate-api-types  ## Build backend.
	cd backend && make build

.PHONY: build-mdbook
build-mdbook:  ## Build mdbook.
	mdbook build

.PHONY: build-storybook
build-storybook: install generate-api-types  ## Build storybook.
	cd frontend && npm install && npm run build-storybook

# MISC

.PHONY: scraper-start-full
scraper-start-full:  ## Scrape and then insert scraped data into the database.
	cd scraper && npm install && mkdir -p data && npm run start:full

.PHONY: insert-scraper
insert-scraper:  ## Insert scraped data into the database.
	cd scraper && npm install && mkdir -p data && npm run insert

.PHONY: migration
migration:  ## Database migration.
	cd backend && make migration

.PHONY: migration-redo
migration-redo:  ## Run down.sql and then up.sql for most recent migrations.
	cd backend && make migration-redo

.PHONY: migration-redo-a
migration-redo-a:  ## Run down.sql and then up.sql for all migrations.
	cd backend && make migration-redo-a

.PHONY: reset-database
reset-database:  ## Reset diesel database AND insert data again.
	cd backend && make reset-database
	$(MAKE) insert-scraper

.PHONY: generate-type-doc
generate-type-doc:  ## Generate typedoc.
	cd frontend && npm install && npm run doc

.PHONY: generate-api-types
generate-api-types:  ## Generate api-types.
	cd frontend && npm run generate-api-types

.PHONY: psql-r
psql-r:  ## Remote connect to postgis, uses $POSTGRES_USER and $POSTGRES_DB.
	psql -h db -p 5432 -U $(POSTGRES_USER) $(POSTGRES_DB)

.PHONY: pre-commit-a
pre-commit-a:  ## Check all files with pre-commit.
	pre-commit run --all-files

.PHONY: distclean
distclean: clean uninstall  ## Clean everything and uninstalls.

.PHONY: clean
clean: clean-frontend clean-backend clean-mdbook clean-storybook clean-scraper  ## Clean everything.

.PHONY: clean-frontend
clean-frontend:  ## Remove /frontend node_modules .
	cd frontend && rm -rf node_modules

.PHONY: clean-backend
clean-backend:  ## Remove /backend/target .
	cd backend && make clean

.PHONY: clean-mdbook
clean-mdbook:  ## Remove /mdbook .
	mdbook clean

.PHONY: clean-scraper
clean-scraper:  ## Remove /scraper/node_modules .
	cd scraper && rm -rf node_modules

.PHONY: clean-storybook
clean-storybook:  ## Remove storybook static folder.
	cd frontend && rm -rf storybook-static

.PHONY: install
install:  ## Install ALL dependencies within the source repo.
	cd backend && make install
	cargo install mdbook mdbook-mermaid mdbook-linkcheck
	cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary --locked

.PHONY: uninstall
uninstall:  ## Uninstall ALL dependencies within the source repo.
	-cd backend && make uninstall
	-cargo uninstall mdbook mdbook-mermaid mdbook-linkcheck
	-cargo uninstall mdbook-generate-summary

.PHONY: install-e2e
install-e2e:
	cd e2e && ./install.sh

-PHONY: uninstall-e2e
uninstall-e2e:
	cd e2e && ./uninstall.sh
