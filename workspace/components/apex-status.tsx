"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"

type ApexStatus = {
  mode: "idle" | "working" | "error"
  detail?: string | null
  at: number
}

function timeAgo(ms: number) {
  if (!ms) return "just now"
  const delta = Date.now() - ms
  if (!Number.isFinite(delta) || delta < 0) return "just now"
  const s = Math.floor(delta / 1000)
  if (s < 10) return "just now"
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return `${h}h ago`
}

export function ApexStatusIndicator() {
  // Avoid Date.now() in render (React purity rule). We'll stamp times inside effects.
  const [status, setStatus] = useState<ApexStatus>(() => ({ mode: "idle", detail: null, at: 0 }))
  const [open, setOpen] = useState(false)

  // Track OpenClaw runtime activity (preferred signal)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastWorkingAtRef = useRef<number>(0)

  useEffect(() => {
    let stopped = false

    const setWorking = (detail?: string) => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      lastWorkingAtRef.current = Date.now()
      setStatus({ mode: "working", detail: detail ?? null, at: Date.now() })
    }

    const setError = (detail: string) => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      setStatus({ mode: "error", detail, at: Date.now() })
    }

    const setIdleSoon = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      // Hysteresis: avoid rapid flipping (e.g., background polling / quick bursts)
      idleTimerRef.current = setTimeout(() => {
        setStatus({ mode: "idle", detail: null, at: Date.now() })
      }, 3000)
    }

    const poll = async () => {
      try {
        const res = await fetch("/api/openclaw/runtime/sessions?agent=main", { cache: "no-store" })
        if (!res.ok) {
          setError(`runtime sessions: ${res.status}`)
          return
        }

        const data = (await res.json()) as {
          sessions?: Array<{
            sessionKey: string
            updatedAtMs: number | null
            active: boolean
            inFlight?: { tool?: string | null; at?: number | null } | null
            lastAction?: { kind?: string; tool?: string | null; ok?: boolean } | null
          }>
        }

        const sessions = Array.isArray(data.sessions) ? data.sessions : []
        const now = Date.now()

        // Prefer explicit in-flight signal.
        const inFlight = sessions.find((s) => s?.inFlight)
        if (inFlight) {
          setWorking(`In-flight: ${inFlight.inFlight?.tool || inFlight.sessionKey}`)
          return
        }

        // “Recently active” keeps the widget stable and avoids flapping.
        const recentlyActive = sessions.find((s) => {
          const updatedAt = s?.updatedAtMs
          if (!updatedAt) return false
          return now - updatedAt < 120_000
        })

        if (recentlyActive) {
          setWorking(`Active: ${recentlyActive.sessionKey}`)
          return
        }

        // If we *just* showed working, don't immediately flip to idle.
        if (now - lastWorkingAtRef.current < 7000) {
          setIdleSoon()
          return
        }

        setIdleSoon()
      } catch (e) {
        const msg = e instanceof Error ? e.message : "runtime poll failed"
        setError(msg)
      }
    }

    // Kick once immediately.
    void poll()

    // Stable schedule (reduced drift)
    const POLL_MS = 6000
    let timer: ReturnType<typeof setTimeout> | null = null
    let nextAt = Date.now() + POLL_MS

    const tick = async () => {
      if (stopped) return
      await poll()
      nextAt += POLL_MS
      const delay = Math.max(0, nextAt - Date.now())
      timer = setTimeout(tick, delay)
    }

    timer = setTimeout(tick, POLL_MS)

    return () => {
      stopped = true
      if (timer) clearTimeout(timer)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  const label = useMemo(() => {
    if (status.mode === "working") return "Apex: working"
    if (status.mode === "error") return "Apex: error"
    return "Apex: idle"
  }, [status.mode])

  const dotClass =
    status.mode === "working"
      ? "bg-blue-500 animate-pulse"
      : status.mode === "error"
        ? "bg-red-500"
        : "bg-green-500"

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted/50"
        onClick={() => setOpen((v) => !v)}
        title="Apex status"
      >
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-[320px] rounded border bg-background p-3 shadow-lg z-50">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-medium">Apex status</div>
            <Badge
              variant={
                status.mode === "error" ? "destructive" : status.mode === "working" ? "secondary" : "outline"
              }
            >
              {status.mode}
            </Badge>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Updated {timeAgo(status.at)}</div>
          {status.detail ? <div className="mt-2 text-xs break-words">{status.detail}</div> : null}
          <div className="mt-3 flex justify-end">
            <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
