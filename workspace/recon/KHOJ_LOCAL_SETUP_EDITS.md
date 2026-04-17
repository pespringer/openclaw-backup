# Khoj Local Setup Edits

## Purpose

Document the exact edits recommended before launching Khoj locally for the shared-brain setup.

Source compose file fetched to:
- `/home/claw/.khoj/docker-compose.yml`

This guidance assumes a local-only first deployment.

---

## High-Level Recommendations

Before starting Khoj, change the stock compose defaults.

### Do not leave these as-is
- `KHOJ_DJANGO_SECRET_KEY=secret`
- `KHOJ_ADMIN_EMAIL=username@example.com`
- `KHOJ_ADMIN_PASSWORD=password`
- anonymous mode enabled

The fetched file is a generic starter, not a production-ready local config.

---

## Recommended Edits

## 1. Set real admin credentials

Replace:

```yaml
- KHOJ_DJANGO_SECRET_KEY=secret
- KHOJ_ADMIN_EMAIL=username@example.com
- KHOJ_ADMIN_PASSWORD=password
```

With real values, for example:

```yaml
- KHOJ_DJANGO_SECRET_KEY=<strong-random-secret>
- KHOJ_ADMIN_EMAIL=<your-email>
- KHOJ_ADMIN_PASSWORD=<strong-password>
```

### Recommendation
Use a long random secret and a strong password.

---

## 2. Disable anonymous mode

The compose file currently runs:

```yaml
command: --host="0.0.0.0" --port=42110 -vv --anonymous-mode --non-interactive
```

### Recommendation
Remove `--anonymous-mode`.

Suggested replacement:

```yaml
command: --host="0.0.0.0" --port=42110 -vv --non-interactive
```

### Why
Anonymous mode is unnecessary for your personal local second-brain use case and makes less sense for a private knowledge system.

---

## 3. Choose one model backend path first

The compose file supports several model-provider paths.

### Simplest first choice
Uncomment only the provider you want to use now.

Examples:

#### Anthropic
```yaml
- ANTHROPIC_API_KEY=your_anthropic_api_key
```

#### OpenAI
```yaml
- OPENAI_API_KEY=your_openai_api_key
```

#### Gemini
```yaml
- GEMINI_API_KEY=your_gemini_api_key
```

#### Local OpenAI-compatible backend
If you already run Ollama or another compatible local backend, use:

```yaml
- OPENAI_BASE_URL=http://host.docker.internal:11434/v1/
- KHOJ_DEFAULT_CHAT_MODEL=<model-name>
```

### Recommendation
Start with whichever backend is already easiest and most reliable in your environment.

---

## 4. Keep the deployment local-only first

### Recommendation
Do not enable public/domain-related settings yet.

Leave these commented out for now:
- `KHOJ_NO_HTTPS=True`
- `KHOJ_DOMAIN=...`
- `KHOJ_ALLOWED_DOMAIN=...`

### Why
You want to validate retrieval first before exposing anything remotely.

---

## 5. Do not enable the operator/computer feature yet

The compose file includes an optional computer container and operator mode.

### Recommendation
Leave this disabled initially.

Keep commented:
```yaml
# - /var/run/docker.sock:/var/run/docker.sock
# - KHOJ_OPERATOR_ENABLED=True
```

### Why
That feature is outside the immediate shared-brain goal and increases surface area.

---

## 6. Web search extras are optional for day one

The compose file supports multiple paid web-search/read integrations.

### Recommendation
Skip these initially unless you already know you need them:
- Serper
- Olostep
- Firecrawl
- Exa

### Why
The first success condition is note retrieval over `/home/claw/shared-brain/`, not advanced web-grounded research.

---

## 7. Port is fine as-is unless there is a conflict

Current mapping:

```yaml
- "42110:42110"
```

### Recommendation
Keep it unless that port is already in use.

---

## Suggested Minimal First Configuration

A good first-pass local config should include:

- strong `KHOJ_DJANGO_SECRET_KEY`
- real `KHOJ_ADMIN_EMAIL`
- strong `KHOJ_ADMIN_PASSWORD`
- one model provider path enabled
- anonymous mode removed
- everything else left minimal

---

## Suggested Launch Flow

From `/home/claw/.khoj/`:

```bash
cd /home/claw/.khoj
# edit docker-compose.yml
docker-compose up
```

Then visit:
- `http://localhost:42110`
- `http://localhost:42110/server/admin`

---

## Suggested First Validation Checks

After launch:
- confirm the web UI loads
- confirm admin login works
- confirm chat works
- confirm the selected model responds
- connect or ingest the shared-brain corpus
- test retrieval on the seed notes

---

## Recommendation

Make the smallest secure local edits possible, remove anonymous mode, choose one model backend, and validate the shared-brain retrieval workflow before doing anything more advanced.
