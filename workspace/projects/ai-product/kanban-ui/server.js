import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const KANBAN_PATH = path.join(ROOT, 'KANBAN.md');
const STORIES_DIR = path.join(ROOT, 'stories');
const ARCHIVE_DIR = path.join(ROOT, 'archive');
const PUBLIC_DIR = path.join(__dirname, 'public');
const ACTIVITY_LOG = path.join(ROOT, 'activity.log');
const PORT = process.env.PORT || 4310;

const COLUMNS = ['Backlog', 'Ready', 'In Progress', 'Blocked', 'Review', 'Done', 'Shipped / Measured'];

function json(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function text(res, code, data, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': contentType });
  res.end(data);
}

async function ensureDirs() {
  await fs.mkdir(STORIES_DIR, { recursive: true });
  await fs.mkdir(ARCHIVE_DIR, { recursive: true });
}

async function appendActivity(action, detail = {}) {
  const line = `${new Date().toISOString()} | ${action} | ${JSON.stringify(detail)}
`;
  await fs.appendFile(ACTIVITY_LOG, line, 'utf8');
}

async function readActivity(limit = 200) {
  try {
    const raw = await fs.readFile(ACTIVITY_LOG, 'utf8');
    const lines = raw.split(/\r?\n/).filter(Boolean);
    return lines.slice(-limit).reverse();
  } catch {
    return [];
  }
}

async function readBoard() {
  const raw = await fs.readFile(KANBAN_PATH, 'utf8');
  const lines = raw.split(/\r?\n/);
  const columns = Object.fromEntries(COLUMNS.map(c => [c, []]));
  let current = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      const header = line.replace('## ', '').trim();
      current = COLUMNS.includes(header) ? header : null;
      continue;
    }
    if (!current) continue;

    const m = line.match(/^- \[[x ]\] (STORY-\d+) — (.+)$/); // Accepts [ ] and [x]
    if (m) columns[current].push({ id: m[1], title: m[2].trim() });
  }

  return { raw, lines, columns };
}

async function writeBoardLines(lines) {
  const normalized = normalizeColumnEmpties(lines);
  await fs.writeFile(KANBAN_PATH, normalized.join('\n'), 'utf8');
}

// Rest of the original code remains unchanged