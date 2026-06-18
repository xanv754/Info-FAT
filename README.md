# Docker
## Create Image
```bash
docker build -t infofat:latest .
```

## Run docker
```bash
docker run -d -p 8000:8000 \
  --name info_fat \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  infofat:latest
```

## CLI
```bash
docker exec -it info_fat python -m infofat --help
```