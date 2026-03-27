import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const PORT = 4310;
const HOST = '0.0.0.0'; // Bind to all network interfaces
const ROOT_DIR = path.resolve('./'); // Project's root directory
const KANBAN_FILE = path.join(ROOT_DIR, 'KANBAN.md');
const STORIES_DIR = path.join(ROOT_DIR, 'stories');

async function getKanbanData() {
  const raw = await fs.readFile(KANBAN_FILE, 'utf-8');
  const lines = raw.split(/\r?\n/);
  const board = { Backlog: [], Ready: [], InProgress: [], Done: [] };

  let currentColumn = null;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentColumn = line.replace('## ', '').trim();
    } else if (currentColumn && line.startsWith('- ')) {
      const match = line.match(/^- \[.\] (STORY-\d+) - (.+)/);
      if (match) {
        board[currentColumn]?.push({ id: match[1], title: match[2] });
      }
    }
  }

  return board;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/api/kanban') {
    try {
      const data = await getKanbanData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, board: data }));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});