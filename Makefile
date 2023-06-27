export VITE_BASE_API_URL=""
export VITE_NEXTCLOUD_URI="https://cloud.permaplant.net"


build-frontend: test-frontend
	cd frontend && npm run build

.PHONY: test
test: test-backend test-frontend

.PHONY: test-backend
test-backend:
	cd backend && make build
	cd backend && cargo test

.PHONY: test-frontend
test-frontend:
	cd frontend && npm ci
	cd frontend && npm run format:check
	cd frontend && npm run lint
	cd frontend && npm run test

test-mdbook:
	mdbook test

test-storybook:
	cd frontend && dev-storybook --smoke-test

.PHONY: doc
docs: build-storybook build-mdbook

.PHONY: build-storybook
build-storybook:
	cd frontend && npm install
	cd frontend && npm run build-storybook

.PHONY: build-mdbook
build-mdbook:
	cargo install mdbook mdbook-mermaid
	cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
	mdbook build

.PHONY: pre-commit
pre-commit:
	pre-commit run --all-files

.PHONY: clean
clean:
	cd backend && cargo clean
	cd frontend && rm -rf node_modules
	mdbook clean
