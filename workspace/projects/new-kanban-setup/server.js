import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const PORT = 4311;
const HOST = '0.0.0.0';
const ROOT_DIR = path.resolve('./');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const KANBAN_FILE = path.join(ROOT_DIR, 'KANBAN.md');
const STORIES_DIR = path.join(ROOT_DIR, 'stories');

async function gatherSystemHealth() {
  const { execFile } = await import('child_process');
  const execFileAsync = (cmd, args = []) => new Promise((resolve) => {
    execFile(cmd, args, { timeout: 10000 }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        stdout: stdout?.toString() ?? '',
        stderr: stderr?.toString() ?? '',
        code: error?.code ?? 0,
      });
    });
  });

  const [statusResult, ssResult] = await Promise.all([
    execFileAsync('openclaw', ['status']),
    execFileAsync('ss', ['-ltnp', '( sport = :4310 or sport = :4311 )']),
  ]);

  const gatewayRunning = /Gateway service\s+.*running/i.test(statusResult.stdout);
  const channelOk = /Telegram\s+│ ON\s+│ OK/i.test(statusResult.stdout) || /Telegram\s+ON\s+OK/i.test(statusResult.stdout);
  const uiListening = /:4310/.test(ssResult.stdout);
  const apiListening = /:4311/.test(ssResult.stdout);
  const updateAvailableMatch = statusResult.stdout.match(/Update\s+available.*?(\d{4}\.\d+\.\d+)/i);

  const issues = [];
  if (!gatewayRunning) issues.push('Gateway service not confirmed running');
  if (!uiListening) issues.push('Frontend port 4310 not listening');
  if (!apiListening) issues.push('API port 4311 not listening');
  if (!channelOk) issues.push('Telegram channel not confirmed OK');

  return {
    checkedAt: new Date().toISOString(),
    ui: { port: 4310, listening: uiListening },
    api: { port: 4311, listening: apiListening },
    gateway: { running: gatewayRunning },
    channels: { telegram: channelOk ? 'OK' : 'Unknown' },
    updates: { available: Boolean(updateAvailableMatch), version: updateAvailableMatch?.[1] ?? null },
    issues,
    raw: {
      statusExcerpt: statusResult.stdout.split('\n').slice(0, 40),
      socketsExcerpt: ssResult.stdout.split('\n').slice(0, 20),
    },
  };
}

function json(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
}

function normalizeColumnName(name) {
  if (name === 'InProgress') return 'In Progress';
  return name;
}

function parseSection(raw, sectionName) {
  const escaped = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = raw.match(new RegExp(`^## ${escaped}\\n([\\s\\S]*?)(?:\\n## |$)`, 'm'));
  return match?.[1]?.trim() ?? '';
}

function replaceSection(raw, sectionName, newContent) {
  const escaped = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(^## ${escaped}\\n)([\\s\\S]*?)(?=\\n## |$)`, 'm');
  return raw.replace(pattern, `$1${newContent.trim()}\n`);
}

async function getKanbanData() {
  const raw = await fs.readFile(KANBAN_FILE, 'utf-8');
  const lines = raw.split(/\r?\n/);
  const board = { Backlog: [], Ready: [], 'In Progress': [], Done: [] };

  let currentColumn = null;
  for (const originalLine of lines) {
    const line = originalLine.trim();

    if (line === '## Board Rules') {
      currentColumn = null;
      continue;
    }

    if (line.startsWith('## ')) {
      const heading = line.replace('## ', '').trim();
      if (Object.prototype.hasOwnProperty.call(board, heading)) {
        currentColumn = heading;
      } else {
        currentColumn = null;
      }
      continue;
    }

    if (!currentColumn || !line.startsWith('- ')) continue;
    if (line === '- None') continue;

    const match = line.match(/^- \[[xX ]\]\s+(STORY-\d+)\s+[—-]\s+(.+)$/);
    if (match) {
      board[currentColumn].push({ id: match[1], title: match[2] });
    }
  }

  return board;
}

async function readStory(id) {
  const filePath = path.join(STORIES_DIR, `${id}.md`);
  const raw = await fs.readFile(filePath, 'utf-8');
  const titleMatch = raw.match(/^#\s+(STORY-\d+)\s+—\s+(.+)$/m);
  return {
    id,
    title: titleMatch?.[2]?.trim() ?? id,
    status: parseSection(raw, 'Status'),
    story: parseSection(raw, 'Story'),
    why: parseSection(raw, 'Why this matters'),
    deliverable: parseSection(raw, 'Deliverables') || parseSection(raw, 'Deliverable'),
    owner: parseSection(raw, 'Owner') || 'Apex',
    priority: parseSection(raw, 'Priority') || 'Medium',
    raw,
  };
}

async function writeStory(id, updates) {
  const filePath = path.join(STORIES_DIR, `${id}.md`);
  let raw = await fs.readFile(filePath, 'utf-8');

  const sections = [
    ['Status', updates.status],
    ['Owner', updates.owner],
    ['Priority', updates.priority],
    ['Story', updates.story],
  ];

  for (const [section, value] of sections) {
    if (value === undefined) continue;
    if (raw.match(new RegExp(`^## ${section}$`, 'm'))) {
      raw = replaceSection(raw, section, String(value).trim());
    } else {
      raw += `\n\n## ${section}\n${String(value).trim()}`;
    }
  }

  await fs.writeFile(filePath, raw);
}

async function moveCardInBoard(id, targetColumn) {
  const normalizedColumn = normalizeColumnName(targetColumn);
  const raw = await fs.readFile(KANBAN_FILE, 'utf-8');
  const lines = raw.split(/\r?\n/);
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const cardRegex = new RegExp(`^- \\[[xX ]\\]\\s+${escapedId}\\s+[—-]\\s+(.+)$`);

  let removedLine = null;
  let currentSection = null;
  const rebuilt = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) currentSection = trimmed.replace('## ', '').trim();

    if (cardRegex.test(trimmed)) {
      removedLine = trimmed;
      continue;
    }

    rebuilt.push(line);
  }

  if (!removedLine) throw new Error(`Card ${id} not found in board`);

  const output = [];
  let inserted = false;
  currentSection = null;

  for (let i = 0; i < rebuilt.length; i++) {
    const line = rebuilt[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) currentSection = trimmed.replace('## ', '').trim();
    output.push(line);

    if (currentSection === normalizedColumn) {
      const nextLine = rebuilt[i + 1]?.trim();
      if (!inserted && (nextLine === undefined || nextLine.startsWith('## ') || nextLine === '- None' || nextLine.startsWith('- '))) {
        if (nextLine === '- None') {
          continue;
        }
        output.push(removedLine.replace(/^\- \[[xX ]\]/, normalizedColumn === 'Done' ? '- [X]' : '- [ ]'));
        inserted = true;
      }
    }
  }

  let finalLines = output;
  if (!inserted) {
    finalLines = [];
    let inTarget = false;
    for (const line of output) {
      finalLines.push(line);
      const trimmed = line.trim();
      if (trimmed === `## ${normalizedColumn}`) {
        inTarget = true;
        continue;
      }
      if (inTarget) {
        finalLines.push(removedLine.replace(/^\- \[[xX ]\]/, normalizedColumn === 'Done' ? '- [X]' : '- [ ]'));
        inTarget = false;
        inserted = true;
      }
    }
  }

  const cleaned = [];
  for (let i = 0; i < finalLines.length; i++) {
    const line = finalLines[i];
    const trimmed = line.trim();
    const next = finalLines[i + 1]?.trim();
    if (trimmed.startsWith('## ') && next?.startsWith('## ')) {
      cleaned.push(line, '- None');
      continue;
    }
    if (trimmed === '- None' && next?.startsWith('- ')) continue;
    cleaned.push(line);
  }

  await fs.writeFile(KANBAN_FILE, cleaned.join('\n'));
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) reject(new Error('Request too large'));
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  try {
    if (req.method === 'GET' && req.url === '/') {
      const html = await fs.readFile(path.join(PUBLIC_DIR, 'index.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }

    if (req.method === 'GET' && req.url === '/api/kanban') {
      const data = await getKanbanData();
      json(res, 200, { success: true, board: data });
      return;
    }

    if (req.method === 'GET' && req.url === '/api/health') {
      const health = await gatherSystemHealth();
      json(res, 200, { success: true, health });
      return;
    }

    const storyMatch = req.url?.match(/^\/api\/stories\/(STORY-\d+)$/);
    if (req.method === 'GET' && storyMatch) {
      const story = await readStory(storyMatch[1]);
      json(res, 200, { success: true, story });
      return;
    }

    if (req.method === 'POST' && storyMatch) {
      const body = await collectBody(req);
      const updates = JSON.parse(body || '{}');
      await writeStory(storyMatch[1], updates);
      const story = await readStory(storyMatch[1]);
      json(res, 200, { success: true, story });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/kanban/move') {
      const body = await collectBody(req);
      const payload = JSON.parse(body || '{}');
      if (!payload.id || !payload.targetColumn) {
        json(res, 400, { success: false, error: 'id and targetColumn are required' });
        return;
      }
      await moveCardInBoard(payload.id, payload.targetColumn);
      if (payload.targetColumn) {
        await writeStory(payload.id, { status: normalizeColumnName(payload.targetColumn) });
      }
      json(res, 200, { success: true, board: await getKanbanData() });
      return;
    }

    json(res, 404, { success: false, error: 'Not Found' });
  } catch (err) {
    json(res, 500, { success: false, error: err.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});