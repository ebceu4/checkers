dev:
	docker-compose --env-file ./.env.development -f docker-base.yaml -f docker-development.yaml up --build
.PHONY: dev

prod:
	docker-compose --env-file ./.env.production -f docker-base.yaml -f docker-production.yaml up --remove-orphans --build
.PHONY: prod

down:
	docker-compose --env-file ./.env.development -f docker-base.yaml -f docker-development.yaml -f docker-production.yaml down
.PHONY: down

link:
	cd ./backend; npm link ../generic;
	cd ./client; npm link ../generic;
.PHONY: link
