.PHONY: all
all: build

.PHONY: help
help: ## Show help for each of the Makefile recipes.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {gsub("\\\\n",sprintf("\n%22c",""), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: run-frontend
run-frontend: build-frontend  ## Starts the frontend server.
	cd frontend && npm run dev

.PHONY: run-backend
run-backend: build-backend  ## Starts the backend server.
	cd backend && make run

.PHONY: run-mdbook
run-mdbook: build-mdbook ## Starts the mdbook server.
	mdbook serve --open

.PHONY: run-storybook
run-storybook: build-storybook  ## Starts the storybook server.
	cd frontend && npm run storybook

# TEST

.PHONY: test
test: test-frontend test-backend test-mdbook  ## Runs all tests + pre-commit
	pre-commit

.PHONY: test-frontend
test-frontend: build-frontend ## Tests the frontend.
	cd frontend && npm install && npm run format:check && npm run lint && npm run test

.PHONY: test-backend
test-backend: build-backend  ## Tests the backend.
	cd backend && make test

.PHONY: test-mdbook
test-mdbook: build-mdbook  ## Tests the mdbook.
	mdbook test

.PHONY: test-storybook
test-storybook:
	@echo "\033[0;31m Not supported \033[0m" && exit 1

# BUILD

.PHONY: build
build: install generate-api-types build-frontend build-backend build-storybook build-mdbook  # Builds everything.

.PHONY: build-frontend
build-frontend: install generate-api-types  ## Builds the frontend.
	cd frontend && npm install && npm run generate-api-types && npm run build

.PHONY: build-backend
build-backend: install generate-api-types  ## Builds the backend.
	cd backend && make build

.PHONY: build-mdbook
build-mdbook: install  ## Builds the mdbook.
	mdbook build

.PHONY: build-storybook
build-storybook: install generate-api-types  ## Builds the storybook.
	cd frontend && npm install && npm run build-storybook

# MISC

.PHONY: generate-type-doc
generate-type-doc:  ## Generates typedoc.
	cd frontend && npm install && npm run doc

.PHONY: generate-api-types
generate-api-types:  ## Generates typescript types.
	cd frontend && npm run generate-api-types

.PHONY: psql-r
psql-r:  ## Remote connect to postgis, uses $POSTGRES_USER and $POSTGRES_DB
	psql -h db -p 5432 -U $(POSTGRES_USER) $(POSTGRES_DB)

.PHONY: pre-commit-all
pre-commit-all:  ## pre-commit on all files.
	pre-commit run --all-files

.PHONY: distclean
distclean: clean uninstall ## Cleans everything and uninstalls dependencies.

.PHONY: clean
clean: clean-frontend clean-backend clean-mdbook clean-storybook  ## Cleans fronted, backend, mdbook and storybook.

.PHONY: clean-frontend
clean-frontend:  ## Removes node modules.
	cd frontend && rm -rf node_modules

.PHONY: clean-backend
clean-backend:  ## Cleans the backend.
	cd backend && make clean

.PHONY: clean-mdbook
clean-mdbook:  ## Removes the mdbook folder.
	mdbook clean

.PHONY: clean-storybook
clean-storybook:  ## Removes the storybook static folder.
	cd frontend && rm -rf storybook-static

.PHONY: install
install:  ## Install necessary packages within the source repo.
	cd backend && make install
	cargo install mdbook mdbook-mermaid
	cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
	npm install @typescript-eslint/eslint-plugin@latest --save-dev

.PHONY: uninstall
uninstall:  ## Uninstalls dependencies within the source repo.
	cd backend && make uninstall
	cargo uninstall mdbook mdbook-mermaid
	cargo uninstall mdbook-generate-summary
