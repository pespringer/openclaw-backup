# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Agent names

- Apex — orchestrator
- Recon — research
- Groove — planning
- Mach — coding
- Pitstop — QA
- Marker — documentation
- Patrick explicitly wants to keep these names exactly as-is.

## Browser / OpenClaw workaround

- Managed OpenClaw browser profile path is currently broken on this host:
  - `/home/claw/.openclaw/browser/openclaw/user-data`
  - Chromium fails there with `SingletonLock: Permission denied (13)`
- Working workaround profile:
  - OpenClaw browser profile: `tmp-cdp`
  - Chromium temp profile dir: `/tmp/openclaw-browser-existing`
  - CDP port: `18950`
- If browser automation breaks again, prefer restoring the temp Chromium session and attaching via `tmp-cdp` instead of debugging the managed profile first.

Add whatever helps you do your job. This is your cheat sheet.
