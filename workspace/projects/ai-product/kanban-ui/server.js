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
  const line = `${new Date().toISOString()} | ${action} | ${JSON.stringify(detail)}\n`;
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
    const m = line.match(/^- \[[ x]\] (STORY-\d+) — (.+)$/);
    if (m) columns[current].push({ id: m[1], title: m[2] });
  }

  return { raw, lines, columns };
}

function normalizeColumnEmpties(lines) {
  const out = [];
  let currentColumn = null;
  let buffered = [];

  function flushBuffer() {
    if (!currentColumn) {
      out.push(...buffered);
      buffered = [];
      return;
    }
    const cards = buffered.filter(l => /^- \[[ x]\] STORY-\d+ — /.test(l));
    const nonEmptyNoise = buffered.filter(
      l => l.trim() && l.trim() !== '- [ ] (empty)' && !/^## /.test(l) && !/^- \[[ x]\] STORY-\d+ — /.test(l)
    );
    out.push(...nonEmptyNoise.filter(l => l.trim() !== ''));
    if (cards.length > 0) out.push(...cards);
    else out.push('- [ ] (empty)');
    buffered = [];
  }

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flushBuffer();
      const header = line.replace('## ', '').trim();
      currentColumn = COLUMNS.includes(header) ? header : null;
      out.push(line);
      continue;
    }
    if (currentColumn) buffered.push(line);
    else out.push(line);
  }
  flushBuffer();
  return out;
}

async function writeBoardLines(lines) {
  const normalized = normalizeColumnEmpties(lines);
  await fs.writeFile(KANBAN_PATH, normalized.join('\n'), 'utf8');
}

async function listStories() {
  const names = await fs.readdir(STORIES_DIR);
  return names.filter(n => /^STORY-\d+\.md$/.test(n));
}

async function getStory(storyId) {
  const filePath = path.join(STORIES_DIR, `${storyId}.md`);
  const content = await fs.readFile(filePath, 'utf8');
  return { storyId, content };
}

function nextStoryIdFromNames(names) {
  let max = 0;
  for (const n of names) {
    const m = n.match(/^STORY-(\d+)\.md$/);
    if (!m) continue;
    max = Math.max(max, Number(m[1]));
  }
  return `STORY-${String(max + 1).padStart(3, '0')}`;
}

async function updateStoryStatus(storyId, newStatus) {
  if (!COLUMNS.includes(newStatus)) throw new Error(`Invalid status: ${newStatus}`);
  const { lines } = await readBoard();
  const pattern = new RegExp(`^- \\[\\s|x\\] ${storyId} — (.+)$`);
  let oldStatus = null;
  let title = null;
  let current = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      const h = line.replace('## ', '').trim();
      current = COLUMNS.includes(h) ? h : null;
      continue;
    }
    const m = line.match(pattern);
    if (current && m) {
      oldStatus = current;
      title = m[1];
      break;
    }
  }
  if (!oldStatus || !title) throw new Error(`Story ${storyId} not found on board`);

  const cardLine = `- [ ] ${storyId} — ${title}`;
  const out = [];
  current = null;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      current = COLUMNS.includes(line.replace('## ', '').trim()) ? line.replace('## ', '').trim() : null;
      out.push(line);
      continue;
    }
    if (current === oldStatus && pattern.test(line)) continue;
    out.push(line);
  }

  const insertAt = out.findIndex(l => l.trim() === `## ${newStatus}`);
  if (insertAt < 0) throw new Error(`Target status section missing: ${newStatus}`);
  out.splice(insertAt + 1, 0, cardLine);

  await writeBoardLines(out);

  const storyPath = path.join(STORIES_DIR, `${storyId}.md`);
  let storyRaw = await fs.readFile(storyPath, 'utf8');
  storyRaw = storyRaw.replace(/(## Status\n)([^\n]+)/, `$1${newStatus}`);
  await fs.writeFile(storyPath, storyRaw, 'utf8');

  await appendActivity('move_story', { storyId, title, oldStatus, newStatus });
  return { storyId, oldStatus, newStatus };
}

async function updateStoryContent(storyId, content) {
  const storyPath = path.join(STORIES_DIR, `${storyId}.md`);
  await fs.writeFile(storyPath, content, 'utf8');
  await appendActivity('update_story', { storyId });
}

function makeStoryTemplate({ storyId, title, status }) {
  return `# ${storyId} — ${title}\n\n## Status\n${status}\n\n## Story\nAs a <user>, I want <capability>, so that <outcome>.\n\n## Why this matters\n- \n\n## Acceptance Criteria\n- [ ] \n- [ ] \n- [ ] \n\n## Projected Work\n- Estimate: <S|M|L or hours>\n- Approach:\n  1. \n  2. \n  3. \n- Dependencies:\n- Risks:\n\n## Deliverables\n- \n\n## Work Log\n- ${new Date().toISOString().slice(0, 10)}: Card created in GUI.\n\n## Decision Log\n- \n\n## Actual Work\n- Time spent:\n- What was completed:\n- Deviations from plan:\n\n## Next Actions\n- \n`;
}

async function createStory(title, status = 'Backlog') {
  if (!title?.trim()) throw new Error('Title is required');
  if (!COLUMNS.includes(status)) throw new Error(`Invalid status: ${status}`);

  const names = await listStories();
  const storyId = nextStoryIdFromNames(names);
  const cleanTitle = title.trim();
  const content = makeStoryTemplate({ storyId, title: cleanTitle, status });
  await fs.writeFile(path.join(STORIES_DIR, `${storyId}.md`), content, 'utf8');

  const { lines } = await readBoard();
  const insertAt = lines.findIndex(l => l.trim() === `## ${status}`);
  if (insertAt < 0) throw new Error(`Target status section missing: ${status}`);
  lines.splice(insertAt + 1, 0, `- [ ] ${storyId} — ${cleanTitle}`);
  await writeBoardLines(lines);

  await appendActivity('create_story', { storyId, title: cleanTitle, status });
  return { storyId, title: cleanTitle, status };
}

async function archiveStory(storyId) {
  const { lines } = await readBoard();
  const pattern = new RegExp(`^- \\[\\s|x\\] ${storyId} — (.+)$`);
  let title = null;
  let status = null;
  let current = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      current = COLUMNS.includes(line.replace('## ', '').trim()) ? line.replace('## ', '').trim() : null;
      continue;
    }
    const m = line.match(pattern);
    if (current && m) {
      title = m[1];
      status = current;
      break;
    }
  }

  const storyPath = path.join(STORIES_DIR, `${storyId}.md`);
  const archivePath = path.join(ARCHIVE_DIR, `${storyId}.md`);
  const storyRaw = await fs.readFile(storyPath, 'utf8');
  await fs.writeFile(archivePath, storyRaw, 'utf8');
  await fs.unlink(storyPath);

  const filtered = lines.filter(l => !pattern.test(l));
  await writeBoardLines(filtered);

  await appendActivity('archive_story', { storyId, title, status });
  return { storyId, title, status };
}

async function buildExportRows() {
  const { columns } = await readBoard();
  const rows = [];
  for (const [status, cards] of Object.entries(columns)) {
    for (const card of cards) {
      rows.push({ storyId: card.id, title: card.title, status, path: `stories/${card.id}.md` });
    }
  }
  rows.sort((a, b) => a.storyId.localeCompare(b.storyId));
  return rows;
}

function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function serveStatic(req, res) {
  const url = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(PUBLIC_DIR, url);
  if (!filePath.startsWith(PUBLIC_DIR)) return json(res, 403, { error: 'forbidden' });

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    const type = ext === '.html' ? 'text/html' : ext === '.js' ? 'text/javascript' : 'text/css';
    res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` });
    res.end(data);
  } catch {
    json(res, 404, { error: 'not found' });
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/board') {
      const board = await readBoard();
      const files = await listStories();
      const stories = {};
      for (const file of files) {
        const id = file.replace('.md', '');
        stories[id] = (await getStory(id)).content;
      }
      return json(res, 200, { columns: board.columns, stories, columnOrder: COLUMNS });
    }

    if (req.method === 'GET' && req.url?.startsWith('/api/activity')) {
      const limit = Number(new URL(req.url, `http://127.0.0.1:${PORT}`).searchParams.get('limit') || 100);
      const entries = await readActivity(limit);
      return json(res, 200, { entries });
    }

    if (req.method === 'GET' && req.url?.startsWith('/api/export')) {
      const format = new URL(req.url, `http://127.0.0.1:${PORT}`).searchParams.get('format') || 'json';
      const rows = await buildExportRows();
      if (format === 'csv') {
        const header = 'storyId,title,status,path\n';
        const csv = header + rows.map(r => [r.storyId, r.title, r.status, r.path].map(csvEscape).join(',')).join('\n');
        return text(res, 200, csv, 'text/csv; charset=utf-8');
      }
      return json(res, 200, { exportedAt: new Date().toISOString(), rows });
    }

    const moveMatch = req.url?.match(/^\/api\/story\/(STORY-\d+)\/status$/);
    if (req.method === 'PUT' && moveMatch) {
      try {
        const { status } = await readBody(req);
        const result = await updateStoryStatus(moveMatch[1], status);
        return json(res, 200, { ok: true, ...result });
      } catch (e) {
        return json(res, 400, { ok: false, error: String(e.message || e) });
      }
    }

    const storyMatch = req.url?.match(/^\/api\/story\/(STORY-\d+)$/);
    if (req.method === 'PUT' && storyMatch) {
      try {
        const { content } = await readBody(req);
        await updateStoryContent(storyMatch[1], content);
        return json(res, 200, { ok: true });
      } catch (e) {
        return json(res, 400, { ok: false, error: String(e.message || e) });
      }
    }

    if (req.method === 'POST' && req.url === '/api/story') {
      try {
        const { title, status } = await readBody(req);
        const created = await createStory(title, status || 'Backlog');
        return json(res, 200, { ok: true, ...created });
      } catch (e) {
        return json(res, 400, { ok: false, error: String(e.message || e) });
      }
    }

    const archiveMatch = req.url?.match(/^\/api\/story\/(STORY-\d+)\/archive$/);
    if (req.method === 'POST' && archiveMatch) {
      try {
        const archived = await archiveStory(archiveMatch[1]);
        return json(res, 200, { ok: true, ...archived });
      } catch (e) {
        return json(res, 400, { ok: false, error: String(e.message || e) });
      }
    }

    return serveStatic(req, res);
  } catch (e) {
    return json(res, 500, { error: String(e.message || e) });
  }
});

await ensureDirs();
server.listen(PORT, () => {
  console.log(`Kanban UI running: http://127.0.0.1:${PORT}`);
});
