# Khoj Docker Compose Ready-to-Fill Template

## Purpose

Provide a clean, minimal, ready-to-fill template based on the fetched Khoj Docker Compose file.

Use this as a reference when editing:
- `/home/claw/.khoj/docker-compose.yml`

This template is intentionally conservative:
- local-first
- non-anonymous
- one model backend at a time
- no public exposure by default
- no operator/computer mode on day one

---

## Recommended Minimal Template

```yaml
services:
  database:
    image: docker.io/pgvector/pgvector:pg15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    volumes:
      - khoj_db:/var/lib/postgresql/data/
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 5

  sandbox:
    image: ghcr.io/khoj-ai/terrarium:latest
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 2

  search:
    image: docker.io/searxng/searxng:latest
    volumes:
      - khoj_search:/etc/searxng
    environment:
      - SEARXNG_BASE_URL=http://localhost:8080/

  server:
    depends_on:
      database:
        condition: service_healthy
    image: ghcr.io/khoj-ai/khoj:latest
    ports:
      - "42110:42110"
    extra_hosts:
      - "host.docker.internal:host-gateway"
    working_dir: /app
    volumes:
      - khoj_config:/root/.khoj/
      - khoj_models:/root/.cache/torch/sentence_transformers
      - khoj_models:/root/.cache/huggingface
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_HOST=database
      - POSTGRES_PORT=5432

      # Replace these with real values
      - KHOJ_DJANGO_SECRET_KEY=REPLACE_WITH_STRONG_RANDOM_SECRET
      - KHOJ_ADMIN_EMAIL=REPLACE_WITH_ADMIN_EMAIL
      - KHOJ_ADMIN_PASSWORD=REPLACE_WITH_STRONG_PASSWORD

      - KHOJ_DEBUG=False
      - KHOJ_TERRARIUM_URL=http://sandbox:8080
      - KHOJ_SEARXNG_URL=http://search:8080

      # Active provider path, recommended for first launch
      # Local OpenAI-compatible backend via Ollama
      - OPENAI_BASE_URL=http://192.168.1.235:11434/v1
      - KHOJ_DEFAULT_CHAT_MODEL=minimax-m2.7:cloud

      # Optional future switch paths, keep commented until needed
      # - OPENAI_API_KEY=REPLACE_WITH_OPENAI_API_KEY
      # - ANTHROPIC_API_KEY=REPLACE_WITH_ANTHROPIC_API_KEY
      # - GEMINI_API_KEY=REPLACE_WITH_GEMINI_API_KEY

      # Optional: disable telemetry
      # - KHOJ_TELEMETRY_DISABLE=True

    command: --host="0.0.0.0" --port=42110 -vv --non-interactive

volumes:
  khoj_config:
  khoj_db:
  khoj_models:
  khoj_search:
```

---

## What Changed From the Stock File

### Removed
- anonymous mode
- computer service from the minimal template
- operator mode
- public internet/domain settings
- optional paid web integrations

### Left in place
- database
- sandbox
- search
- server
- local port mapping
- local model/provider flexibility

---

## Fields You Must Replace

Replace these before launch:

- `REPLACE_WITH_STRONG_RANDOM_SECRET`
- `REPLACE_WITH_ADMIN_EMAIL`
- `REPLACE_WITH_STRONG_PASSWORD`
- one provider-specific API key or local model configuration

---

## Provider Selection Guidance

## Anthropic path

Use if Anthropic is your easiest available provider.

Uncomment:

```yaml
- ANTHROPIC_API_KEY=REPLACE_WITH_ANTHROPIC_API_KEY
```

---

## OpenAI path

Use if OpenAI is your easiest available provider.

Uncomment:

```yaml
- OPENAI_API_KEY=REPLACE_WITH_OPENAI_API_KEY
```

---

## Gemini path

Use if Gemini is your easiest available provider.

Uncomment:

```yaml
- GEMINI_API_KEY=REPLACE_WITH_GEMINI_API_KEY
```

---

## Local backend path

Use if you want Khoj to talk to a local OpenAI-compatible endpoint such as Ollama.

Uncomment and fill:

```yaml
- OPENAI_BASE_URL=http://host.docker.internal:11434/v1/
- KHOJ_DEFAULT_CHAT_MODEL=REPLACE_WITH_MODEL_NAME
```

---

## What Not to Turn On Yet

Do not enable yet unless you explicitly need them:
- public access domain settings
- `KHOJ_NO_HTTPS`
- `KHOJ_DOMAIN`
- `KHOJ_ALLOWED_DOMAIN`
- operator/computer mode
- Docker socket mount
- paid web-search providers

---

## Launch Commands

After editing:

```bash
cd /home/claw/.khoj
docker-compose up
```

Then open:
- `http://localhost:42110`
- `http://localhost:42110/server/admin`

---

## First Validation Checklist

- web UI loads
- admin login works
- chat works
- chosen model responds
- shared-brain notes can be ingested or indexed
- test queries return grounded answers

---

## Recommendation

Use this template as the minimal starting point and resist adding advanced features until the core shared-brain retrieval flow works.
