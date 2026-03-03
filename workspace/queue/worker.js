#!/usr/bin/env node
/**
 * Minimal queue worker.
 *
 * Usage:
 *   node worker.js <role>
 * where role is one of: coder | researcher | doc
 *
 * It claims one job JSON from queue/<role>/, runs it as an agentTurn in an isolated session,
 * and writes a result JSON to queue/done or queue/failed.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROLE = process.argv[2];
if (!['coder', 'researcher', 'doc'].includes(ROLE)) {
  console.error('Usage: node worker.js <coder|researcher|doc>');
  process.exit(2);
}

const ROOT = path.resolve(__dirname);
const INBOX = path.join(ROOT, ROLE);
const DONE = path.join(ROOT, 'done');
const FAILED = path.join(ROOT, 'failed');

function nowIso() {
  return new Date().toISOString();
}

function listJobs() {
  return fs.readdirSync(INBOX)
    .filter(f => f.endsWith('.json') && !f.endsWith('.claimed.json'))
    .sort();
}

function tryClaim(jobFile) {
  const src = path.join(INBOX, jobFile);
  const claimed = path.join(INBOX, jobFile.replace(/\.json$/, `.claimed.${process.pid}.json`));
  try {
    fs.renameSync(src, claimed); // atomic on same filesystem
    return claimed;
  } catch {
    return null;
  }
}

function runJob(jobPath) {
  const raw = fs.readFileSync(jobPath, 'utf8');
  const job = JSON.parse(raw);

  const agentPrompt = [
    `You are ${ROLE.toUpperCase()} (specialist).`,
    `Title: ${job.title}`,
    job.context?.repo ? `Repo: ${job.context.repo}` : null,
    '',
    job.task,
    '',
    'Output format:',
    '1) Summary (5-10 bullets)',
    '2) Concrete next actions',
    '3) Files/commands (if any)',
    '4) Risks/assumptions',
  ].filter(Boolean).join('\n');

  // Spawn isolated agent turn.
  // We use OpenClaw CLI to run an isolated agent turn synchronously.
  // Note: this is a minimal shim; it assumes openclaw is on PATH and configured.
  const payload = {
    kind: 'agentTurn',
    message: agentPrompt,
  };

  // Use `openclaw cron` runner would be overkill; use `openclaw gateway` is not right.
  // We rely on `openclaw run` style command via `openclaw agents` not available.
  // So we just write the job to done with a placeholder until we wire a supported internal call.

  return {
    ok: false,
    note: 'Worker queue scaffolded; needs a supported internal agent-turn invocation path (e.g., gateway API endpoint) to execute jobs automatically.'
  };
}

function writeResult(jobPath, result) {
  const base = path.basename(jobPath).replace(/\.claimed\..*\.json$/, '.json');
  const out = {
    finishedAt: nowIso(),
    role: ROLE,
    jobFile: base,
    ...result,
  };

  const destDir = result.ok ? DONE : FAILED;
  const dest = path.join(destDir, base);
  fs.writeFileSync(dest, JSON.stringify(out, null, 2));
  fs.unlinkSync(jobPath);
}

(function main() {
  const jobs = listJobs();
  if (jobs.length === 0) process.exit(0);

  const claimed = tryClaim(jobs[0]);
  if (!claimed) process.exit(0);

  let res;
  try {
    res = runJob(claimed);
  } catch (e) {
    res = { ok: false, error: String(e?.stack || e) };
  }

  writeResult(claimed, res);
})();
