# Mission Control Notes

## Cron / Notification Rule
For Telegram-visible cron notifications, do **not** rely on cron `delivery.mode=announce`.

Use this pattern instead:
- cron job with `payload.kind = agentTurn`
- inside the agent turn, send the update explicitly with the `message` tool to Telegram
- use `delivery.mode = none` on the cron job itself

Reason:
- cron announce reported `delivered`, but Patrick did not receive visible Telegram messages
- direct Telegram sends from the agent turn worked immediately

## Working notification pattern
Cron → agentTurn → explicit `message.send` to Telegram

This should be treated as the default for future reminder/update jobs until announce-delivery behavior is investigated/fixed more deeply.
