.DEFAULT_GOAL := help

RED := \033[0;31m
RESET := \033[0m

FAKE_FILE := .install
FAKE_CONTENT := "This is a fake file generated by 'make install'"

NODE_MODULES := frontend/node_modules
PACKAGE_JSON := frontend/package.json
NODE_MODULES_NEWER := $(shell [ ! -e $(NODE_MODULES) ] || [ $(NODE_MODULES) -ot $(PACKAGE_JSON) ]; echo $$?)
E2E_VENV := e2e/venv
E2E_INSTALL := e2e/install_sh
E2E_REQUIREMENTS := e2e/requirements.txt
E2E_INSTALL_NEWER := $(shell [ ! -e "$(E2E_VENV)" ] || [ "$(E2E_VENV)" -ot "$(E2E_INSTALL)" ] || [ "$(E2E_VENV)" -ot "$(E2E_REQUIREMENTS)" ]; echo $$?)

# Extract host from DATABASE_URL
HOST := $(shell echo $(DATABASE_URL) | sed -n 's/.*@\(.*\)\/.*/\1/p')


.PHONY: all
all: build


.PHONY: help
help:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {gsub("\\\\n",sprintf("\n%22c",""), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)


# Runs (Implicit builds)


.PHONY: run-frontend
run-frontend: build-frontend  ## Build & Run frontend
	@cd frontend && npm run dev -- --host

.PHONY: run-backend
run-backend: build-backend  ## Build & Run backend
	@cd backend && make run

.PHONY: run-reset-backend
run-reset-backend: reset-database  ## Build & Run backend with a database reset
	$(MAKE) run-backend

.PHONY: run-mdbook
run-mdbook: build-mdbook  ## Build & Run mdbook
	@mdbook serve --open

.PHONY: run-storybook
run-storybook: build-storybook  ## Build & Run storybook
	@cd frontend && npm run storybook


# TEST (Implicit builds)


.PHONY: test
test: test-frontend test-backend test-mdbook test-e2e  ## Test everything
	$(MAKE) pre-commit

.PHONY: test-e2e
test-e2e:  ## End-to-End tests. Needs install-e2e, backend and frontend running
	@cd e2e && ./e2e.sh

.PHONY: test-frontend
test-frontend:  build-frontend  ## Build & Test Frontend
	@cd frontend && npm install && npm run format:check && npm run lint && npm run test

.PHONY: test-backend
test-backend:  build-backend  ## Build & Test Backend
	@make test -C ./backend

.PHONY: test-mdbook
test-mdbook:  build-mdbook  ## Build & Test Mdbook
	@mdbook test

# Test all makefile targets except the ones with "run-".
test-makefile: $(MAKEFILE_LIST)
	@for target in `grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; !/^run-/ { printf "%s\n", $$1 }'`; do \
		echo "$(RED)Testing target: $$target$(RESET)"; \
		$(MAKE) $$target || (echo "$(RED)Test for target: $$target failed$(RESET)" && exit 1); \
	done
	@echo "$(RED)All non 'run-' targets passed the test$(RESET)"


# BUILD (Implicit installs)


.PHONY: build
build: generate-api-types build-frontend build-backend build-storybook build-mdbook  # Build everything

.PHONY: build-frontend
build-frontend: install-frontend generate-api-types  ## Build Frontend
	@cd frontend npm run generate-api-types && npm run build

.PHONY: build-backend
build-backend: install-backend generate-api-types  ## Build Backend
	@make build -C ./backend

.PHONY: build-mdbook
build-mdbook: install-backend  ## Build Mdbook
	@mdbook build

.PHONY: build-storybook
build-storybook: generate-api-types  ## Build Storybook
	@cd frontend && npm install && npm run doc && npm run build-storybook


# MISC


.PHONY: insert-scraper
insert-scraper:  ## Insert scraped data into the database
	@cd scraper && npm install && mkdir -p data && npm run insert

.PHONY: migration
migration:  ## Database migration.
	@make migration -C ./backend

.PHONY: migration-redo
migration-redo:  ## Run down.sql and then up.sql for most recent migrations
	@make migration-redo -C ./backend

.PHONY: migration-redo-a
migration-redo-a:  ## Run down.sql and then up.sql for all migrations
	@make migration-redo-a -C ./backend

.PHONY: reset-database
reset-database:  ## Reset diesel database AND insert data again
	@make reset-database -C ./backend
	$(MAKE) insert-scraper

.PHONY: generate-type-doc
generate-type-doc:  ## Generate typedoc
	@cd frontend && npm install && npm run doc

.PHONY: generate-api-types
generate-api-types:  ## Generate api-types
	@cd frontend && npm run generate-api-types

.PHONY: psql-r
psql-r:  ## Remote connect to postgis, uses $POSTGRES_USER and $POSTGRES_DB
	@psql -h $(HOST) -p 5432 -U $(POSTGRES_USER) $(POSTGRES_DB)

.PHONY: pre-commit
pre-commit:  ## Check all files with pre-commit
	@pre-commit run --all-files

.PHONY: docker-up
docker-up:  ## Start a containerized dev environment
	@docker compose -p "permaplant_devcontainer" -f .devcontainer/docker-compose.yml up


# Install


.PHONY: install
install: install-pre-commit install-backend install-frontend install-e2e  ## Install ALL dependencies within the source repo
	@echo "Installation completed."

.PHONY: install-pre-commit
install-pre-commit:  ## Install pre-commit
	@if [ ! -f $$(which pre-commit) ]; then \
		echo "pre-commit is not installed. Installing..."; \
		pip install pre-commit; \
        pre-commit install; \
	else \
		echo "pre-commit is already installed."; \
	fi

.PHONY: install-frontend
install-frontend:  ## Install frontend
	@echo "Checking if npm install is required..."
	@if [ $(NODE_MODULES_NEWER) -eq 0 ]; then \
		echo "Running 'npm install'..."; \
		npm install --prefix frontend; \
	else \
		echo "No need to run 'npm install'. node_modules is up to date."; \
	fi

.PHONY: install-backend
install-backend:  $(FAKE_FILE)  ## Install backend and mdbook deps
	@echo "Checking if backend dependencies install is required..."

$(FAKE_FILE):  Makefile
	@echo $(FAKE_CONTENT) > $(FAKE_FILE)
	cd backend && make install
	cargo install mdbook mdbook-mermaid mdbook-linkcheck
	cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary --locked

.PHONY: install-e2e
install-e2e:  ## Install e2e dependencies within this repo
	@echo "Checking if e2e install is required..."
	@if [ $(E2E_INSTALL_NEWER) -eq 0 ]; then \
		echo "Running 'e2e install'..."; \
		cd e2e && ./install.sh; \
	else \
		echo "No need to run 'e2e install'. venv is up to date."; \
	fi


# Uninstall


.PHONY: uninstall
uninstall:  uninstall-e2e ## Uninstall and clean everything up
	-rm -rf frontend/node_modules
	-rm -rf frontend/storybook-static
	-rm -rf scraper/node_modules
	-rm -rf e2e/venv
	-cargo uninstall mdbook mdbook-mermaid mdbook-linkcheck mdbook-generate-summary
	@echo "Ignore errors here."

.PHONY: uninstall-e2e
uninstall-e2e:
	-cd e2e && ./uninstall.sh
