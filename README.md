# Info FAT

A lightweight and efficient tool aimed at telecommunications and network support engineers. The system processes massive text files containing OLT equipment configurations to extract, structure, and present FAT box information in an intuitive way.

## Table of Contents

- [Features](#features)
- [Environment Variables](#environment-variables)
- [Makefile Reference](#makefile-reference)
  - [Local Operations](#local-operations)
  - [Deployment](#deployment)
- [Backend CLI](#backend-cli)
---

## Features

- **Automated Parsing** — Processes and cleans raw text data into a structured tabular format.
- **Smart Filters** — Global search and per-column filters to instantly locate any FAT, port, splitter, or status.
- **Data Export** — On-demand download of the currently filtered view or the full dataset in a single click.

---

## Environment Variables

The frontend reads its environment variables from `client/.env` at **build time** (values are embedded into the static bundle by Vite).

| Variable       | Description                 | Example                     |
| -------------- | --------------------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the backend API | `http://127.0.0.1:8000` |

> **Note:** Update `client/.env` before building if the backend is not running on `localhost`.

---

## Makefile Reference

### Local Operations

| Command       | Description                                              |
| ------------- | -------------------------------------------------------- |
| `make build`  | Builds the Docker images without starting any container. |
| `make start`  | Starts all containers in the background (`-d`).          |
| `make stop`   | Stops running containers without removing them.          |
| `make delete` | Stops and removes containers, networks, and volumes.     |

### Deployment

For servers without internet access, images can be exported, compressed, and transferred via SCP.

| Command       | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| `make pack`   | Builds the images and compresses them into `infofat-images.tar.gz`. |
| `make deploy` | Runs `pack` and transfers the archive to a remote server via SCP.   |

**`make deploy` parameters:**

| Parameter     | Required   | Default | Description                                  |
| ------------- | ---------- | ------- | -------------------------------------------- |
| `REMOTE_USER` | Yes        | —       | SSH user on the remote server.               |
| `REMOTE_HOST` | Yes        | —       | IP address or hostname of the remote server. |
| `REMOTE_PATH` | No         | `~/`    | Destination path on the remote server.       |

**Example:**
```bash
make deploy REMOTE_USER=ubuntu REMOTE_HOST=127.0.0.1 REMOTE_PATH=/opt/infofat/
```

**Loading images on the remote server:**
```bash
gunzip -c infofat-images.tar.gz | docker load
docker compose up -d
```

## Backend CLI

All commands are run inside the backend container:

```bash
docker exec -it info_fat python -m infofat [COMMAND] [OPTIONS]
```

The CLI is organised into two command groups:

| Group      | Description                               |
| ---------- | ----------------------------------------- |
| `updater`  | Commands to update all system information |
| `report`   | Commands for report output                |

---

### `updater database`

Updates the system database file by processing the source data files.

```bash
docker exec -it info_fat python -m infofat updater database --asf <path> --olt <path>
```

| Option  | Required | Description                   |
| ------- | -------- | ----------------------------- |
| `--asf` | Yes      | Path to the ASF file          |
| `--olt` | Yes      | Path to the RELACION_OLT file |

**Example:**
```bash
docker exec -it info_fat python -m infofat updater database \
  --asf /data/asf.txt \
  --olt /data/relacion_olt.txt
```

---

### `report fat`

Generates and exports a report with FAT information derived from the source data files.

```bash
docker exec -it info_fat python -m infofat report fat --asf <path> --olt <path> [--dir <path>]
```

| Option  | Required | Description                              |
| ------- | -------- | ---------------------------------------- |
| `--asf` | Yes      | Path to the ASF file                     |
| `--olt` | Yes      | Path to the RELACION_OLT file            |
| `--dir` | No       | Output directory for the exported report |

**Example:**
```bash
docker exec -it info_fat python -m infofat report fat \
  --asf /data/asf.txt \
  --olt /data/relacion_olt.txt \
  --dir /data/output/
```