IMAGE_NAME=versa-boilerplate
CONTAINER_NAME=versa-boilerplate
APP_VERSION=latest
NETWORK=net-db
PATH_CODE=./
TAG=0.0.1

.PHONY: build
build: ## Build the production docker image.
	docker compose build

.PHONY: start
start: ## Start the production docker container.
	docker compose up -d

.PHONY: stop
stop: ## Stop the production docker container.
	docker compose down

