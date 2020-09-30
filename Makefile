dev:
	#docker-compose -f docker-compose.yaml -f docker-development.yaml up --build
	docker-compose -f docker-compose.yaml -f docker-development.yaml up
.PHONY: dev

prod:
	docker-compose -f docker-compose.yaml -f docker-development.yaml up --build
.PHONY: prod

build:
	docker-compose -f docker-compose.yaml -f docker-development.yaml build client
.PHONY: build

link:
	#cd ./generic; npm run build;
	cd ./backend; npm link ../generic;
	cd ./client; npm link ../generic;
.PHONY: link
