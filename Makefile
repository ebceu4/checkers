dev:
	#docker-compose -f docker-compose.yaml -f docker-development.yaml up --build
	docker-compose -f docker-compose.yaml -f docker-development.yaml up
.PHONY: dev

dev-backend:
	docker-compose -f docker-compose.yaml -f docker-development.yaml up --build backend
.PHONY: dev-backend

dev-client:
	docker-compose -f docker-compose.yaml -f docker-development.yaml up --build client
.PHONY: dev-client

prod-backend:
	docker-compose up --build backend
.PHONY: prod-backend

prod-client:
	docker-compose up --build client
.PHONY: prod-client

prod:
	docker-compose up --build
.PHONY: prod

build:
	docker-compose -f docker-compose.yaml -f docker-development.yaml build client
.PHONY: build

link:
	#cd ./generic; npm run build;
	cd ./backend; npm link ../generic;
	cd ./client; npm link ../generic;
.PHONY: link
