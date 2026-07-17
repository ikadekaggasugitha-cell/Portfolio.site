.PHONY: up down build restart logs ps shell-api shell-next migrate seed test

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

restart: down up

logs:
	docker compose logs -f

ps:
	docker compose ps

shell-api:
	docker compose exec portfolio-api bash

shell-next:
	docker compose exec portfolio-next sh

migrate:
	docker compose exec portfolio-api php artisan migrate

seed:
	docker compose exec portfolio-api php artisan db:seed

test:
	docker compose exec portfolio-api php artisan test
