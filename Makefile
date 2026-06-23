IMAGES_FILE = infofat-images.tar.gz
REMOTE_PATH ?= ~/

build:
	docker compose build

start:
	docker compose up -d

stop:
	docker compose stop

delete:
	docker compose down -v

pack:
	docker compose build
	docker compose config --images | xargs docker save | gzip > $(IMAGES_FILE)
	@echo "Imágenes comprimidas en $(IMAGES_FILE)"

deploy:
ifndef REMOTE_USER
	$(error REMOTE_USER no definido. Uso: make deploy REMOTE_USER=usuario REMOTE_HOST=ip REMOTE_PATH=/ruta)
endif
ifndef REMOTE_HOST
	$(error REMOTE_HOST no definido. Uso: make deploy REMOTE_USER=usuario REMOTE_HOST=ip REMOTE_PATH=/ruta)
endif
	$(MAKE) pack
	scp $(IMAGES_FILE) docker-compose.prod.yml $(REMOTE_USER)@$(REMOTE_HOST):$(REMOTE_PATH)
	rm -f $(IMAGES_FILE)
	@echo "Transferencia completada a $(REMOTE_USER)@$(REMOTE_HOST):$(REMOTE_PATH)"

.PHONY: build start stop delete pack deploy