.PHONY: all
all: build

help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {gsub("\\\\n",sprintf("\n%22c",""), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: run-frontend
run-frontend: build-frontend
	cd frontend && npm run dev

.PHONY: run-backend
run-backend: build-backend
	cd backend && make run

.PHONY: run-mdbook
run-mdbook: build-mdbook
	mdbook serve --open

.PHONY: run-storybook
run-storybook: build-storybook
	cd frontend && npm run storybook

# TEST

.PHONY: test
test: test-frontend test-backend test-mdbook
	pre-commit

.PHONY: test-frontend
test-frontend: build-frontend
	cd frontend && npm install && npm run format:check && npm run lint && npm run test

.PHONY: test-backend
test-backend: build-backend
	cd backend && make test

.PHONY: test-mdbook
test-mdbook: build-mdbook
	mdbook test

.PHONY: test-storybook
test-storybook:
	@echo "\033[0;31m Not supported \033[0m" && exit 1

# BUILD

.PHONY: build
build: install generate-api-types build-frontend build-backend build-storybook build-mdbook

.PHONY: build-frontend
build-frontend: install generate-api-types
	cd frontend && npm install && npm run generate-api-types && npm run build

.PHONY: build-backend
build-backend: install generate-api-types
	cd backend && make build

.PHONY: build-mdbook
build-mdbook: install
	mdbook build

.PHONY: build-storybook
build-storybook: install generate-api-types
	cd frontend && npm install && npm run build-storybook

# MISC

.PHONY: generate-type-doc
generate-type-doc:
	cd frontend && npm install && npm run doc

.PHONY: generate-api-types
generate-api-types:
	cd frontend && npm run generate-api-types

.PHONY: psql-r
psql-r:
	psql -h db -p 5432 -U $(POSTGRES_USER) $(POSTGRES_DB)

.PHONY: pre-commit-all
pre-commit-all:
	pre-commit run --all-files

.PHONY: distclean
distclean: clean uninstall

.PHONY: clean
clean: clean-frontend clean-backend clean-mdbook clean-storybook

.PHONY: clean-frontend
clean-frontend:
	cd frontend && rm -rf node_modules

.PHONY: clean-backend
clean-backend:
	cd backend && make clean

.PHONY: clean-mdbook
clean-mdbook:
	mdbook clean

.PHONY: clean-storybook
clean-storybook:
	cd frontend && rm -rf storybook-static

.PHONY: install
install:
	cd backend && make install
	npm install @typescript-eslint/eslint-plugin@latest --save-dev

.PHONY: uninstall
uninstall:
	cd backend && make uninstall
