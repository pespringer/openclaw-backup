# Khoj Provider Recommendation

## Requested setup

Patrick wants:
- OpenAI and Ollama if Khoj supports multiple providers cleanly
- otherwise Ollama as the primary path
- with a commented OpenAI section left in place for easy future switching

---

## Recommendation

Use **Ollama first** as the active provider path.

Leave an **OpenAI block commented out** in `docker-compose.yml` for future switching.

This is the safest and simplest first configuration unless we confirm Khoj is happy with multiple active provider paths at once and that the admin model-selection flow is already understood.

---

## Why this recommendation makes sense

### Ollama first
- aligns with a local-first setup
- avoids dependence on external API costs for the first shared-brain retrieval tests
- simpler for a private second-brain use case

### OpenAI commented out
- keeps the upgrade/switch path easy
- avoids ambiguity during first setup
- reduces troubleshooting surface area

---

## Suggested environment block

### Active block

```yaml
# Local OpenAI-compatible backend via Ollama
- OPENAI_BASE_URL=http://192.168.1.235:11434/v1
- KHOJ_DEFAULT_CHAT_MODEL=minimax-m2.7:cloud
```

### Commented backup block

```yaml
# OpenAI fallback, leave commented until needed
# - OPENAI_API_KEY=REPLACE_WITH_OPENAI_API_KEY
```

---

## Suggested first model choice

Planned first model:
- `minimax-m2.7:cloud`

Planned Ollama-compatible endpoint:
- `http://192.168.1.235:11434/v1`

The exact value should match what your Ollama-compatible endpoint exposes.

---

## Important note

Even if Khoj can technically support multiple provider definitions, I still recommend starting with **one active path** only for first launch.

That makes it much easier to answer:
- does the service start?
- does the model respond?
- does retrieval work?

Once that is stable, adding or switching providers is easy.

---

## Recommendation summary

### First launch
- active: Ollama
- inactive but preserved: OpenAI

### Later
- if you want, switch to OpenAI
- or investigate whether multiple configured providers can coexist cleanly in the admin model settings
