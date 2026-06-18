# Builder
FROM python:3.12-alpine AS builder

WORKDIR /app

RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev

COPY pyproject.toml README.md ./
COPY infofat/ ./infofat/

RUN pip install --upgrade pip \
    && pip install --prefix=/install .


# Runtime
FROM python:3.12-alpine AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

WORKDIR /app

COPY --from=builder /install /usr/local
COPY infofat/ ./infofat/

RUN mkdir -p /app/data /app/logs

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "infofat.infrastructure.api.app:app", \
     "--host", "0.0.0.0", "--port", "8000"]