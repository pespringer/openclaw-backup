import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const PORT = 4311;
const HOST = '0.0.0.0';
const ROOT_DIR = path.resolve('./');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const KANBAN_FILE = path.join(ROOT_DIR, 'KANBAN.md');
const STORIES_DIR = path.join(ROOT_DIR, 'stories');
const LAUNCH_INTENTS_DIR = path.join(ROOT_DIR, 'launch-intents');
const DOCS_INDEX = [
  {
    id: 'README',
    title: 'Mission Control README',
    path: 'README.md',
    group: 'Runbooks',
    summary: 'Core operating guide, ports, startup commands, and source-of-truth notes.',
    tags: ['runbook', 'operations', 'overview'],
  },
  {
    id: 'OPERATIONS',
    title: 'Kanban Operations',
    path: 'OPERATIONS.md',
    group: 'Runbooks',
    summary: 'Backup, recovery, migration, and change-control guidance for the markdown board.',
    tags: ['backup', 'recovery', 'migration'],
  },
  {
    id: 'MODULES',
    title: 'Mission Control Modules',
    path: 'MODULES.md',
    group: 'Architecture',
    summary: 'Defines module roadmap, rollout order, and the long-term Mission Control surface.',
    tags: ['architecture', 'roadmap', 'modules'],
  },
  {
    id: 'ROADMAP',
    title: 'AI Product Roadmap',
    path: 'ROADMAP.md',
    group: 'Planning',
    summary: 'High-level phases, success metrics, and constraints for the AI product effort.',
    tags: ['planning', 'milestones', 'product'],
  },
  {
    id: 'NOTES',
    title: 'Mission Control Notes',
    path: 'NOTES.md',
    group: 'Decisions',
    summary: 'Working notes and operational decisions, including the Telegram notification rule.',
    tags: ['decisions', 'notes', 'notifications'],
  },
  {
    id: 'DECISION_MATRIX',
    title: 'Weighted Decision Matrix',
    path: 'DECISION_MATRIX.md',
    group: 'Planning',
    summary: 'Scoring model for evaluating product ideas against weighted criteria.',
    tags: ['decision-making', 'scoring', 'product'],
  },
];

function parseOpenClawStatus(raw) {
  const lines = raw.split('\n');
  const sessions = [];
  let inSessionsTable = false;

  for (const line of lines) {
    if (/^Sessions\s*$/.test(line.trim())) {
      inSessionsTable = true;
      continue;
    }

    if (!inSessionsTable) continue;
    if (!line.includes('│')) continue;

    const cells = line.split('│').map((cell) => cell.trim()).filter(Boolean);
    if (cells.length !== 5) continue;
    if (cells[0] === 'Key' || /^agent[:]/.test(cells[0]) === false) continue;

    sessions.push({
      key: cells[0],
      kind: cells[1],
      age: cells[2],
      model: cells[3],
      tokens: cells[4],
    });
  }

  const overview = {
    gatewayRunning: /Gateway service\s+.*running/i.test(raw),
    tasksLine: raw.match(/│\s*Tasks\s*│\s*(.+?)\s*│/)?.[1]?.trim() ?? null,
    heartbeatLine: raw.match(/│\s*Heartbeat\s*│\s*(.+?)\s*│/)?.[1]?.trim() ?? null,
    defaultSessionModel: raw.match(/│\s*Sessions\s*│\s*\d+ active · default\s+([^·]+?)\s+\(/)?.[1]?.trim() ?? null,
    channelTelegramOk: /Telegram\s+│\s+ON\s+│\s+OK/i.test(raw) || /Telegram\s+ON\s+OK/i.test(raw),
  };

  return { overview, sessions };
}

async function gatherDocumentationHub() {
  const docs = await Promise.all(DOCS_INDEX.map(async (doc) => {
    const filePath = path.join(ROOT_DIR, doc.path);
    const raw = await fs.readFile(filePath, 'utf-8');
    const lines = raw.split(/\r?\n/);
    const heading = lines.find((line) => line.trim().startsWith('#'))?.replace(/^#+\s*/, '').trim() ?? doc.title;
    const preview = lines
      .filter((line) => line.trim() && !line.trim().startsWith('#'))
      .slice(0, 3)
      .join(' ')
      .slice(0, 280);

    return {
      ...doc,
      heading,
      preview,
      lineCount: lines.length,
      lastReviewedAt: null,
    };
  }));

  const groups = docs.reduce((acc, doc) => {
    acc[doc.group] ??= [];
    acc[doc.group].push(doc);
    return acc;
  }, {});

  return {
    checkedAt: new Date().toISOString(),
    summary: {
      totalDocs: docs.length,
      runbookCount: docs.filter((doc) => doc.group === 'Runbooks').length,
      architectureCount: docs.filter((doc) => doc.group === 'Architecture').length,
      planningCount: docs.filter((doc) => doc.group === 'Planning').length,
      decisionCount: docs.filter((doc) => doc.group === 'Decisions').length,
    },
    groups,
    docs,
    expansion: {
      supportsDetailView: true,
      nextHooks: [
        'Render full document previews in drawer',
        'Index story-linked docs automatically',
        'Add search and recent-doc activity',
      ],
    },
  };
}

async function gatherAgentOperations() {
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

  const [statusResult, boardResult] = await Promise.all([
    execFileAsync('openclaw', ['status']),
    getKanbanData(),
  ]);

  const parsed = parseOpenClawStatus(statusResult.stdout);
  const storyMap = new Map(Object.values(boardResult).flat().map((item) => [item.id, item.title]));

  const sessionStates = parsed.sessions.map((session) => {
    const storyIdMatch = session.key.match(/(STORY-\d+)/i);
    const storyId = storyIdMatch?.[1]?.toUpperCase() ?? null;
    const lowerAge = session.age.toLowerCase();
    const recentMatch = lowerAge.match(/(\d+)\s*([mhdw])/);
    const amount = recentMatch ? Number(recentMatch[1]) : null;
    const unit = recentMatch?.[2] ?? null;

    let state = 'running';
    if (unit === 'm' && amount !== null && amount > 30) state = 'recent';
    if (unit === 'h') state = 'recent';
    if (unit === 'd' || unit === 'w') state = 'recent';

    return {
      key: session.key,
      kind: session.kind,
      age: session.age,
      model: session.model,
      tokens: session.tokens,
      state,
      storyId,
      storyTitle: storyId ? storyMap.get(storyId) ?? null : null,
      blockedReason: null,
      failedReason: null,
    };
  });

  const running = sessionStates.filter((session) => session.state === 'running');
  const recent = sessionStates.filter((session) => session.state === 'recent');
  const blocked = sessionStates.filter((session) => session.state === 'blocked');
  const failed = sessionStates.filter((session) => session.state === 'failed');

  const statusSignals = [];
  if (parsed.overview.tasksLine) statusSignals.push(`Tasks: ${parsed.overview.tasksLine}`);
  if (parsed.overview.heartbeatLine) statusSignals.push(`Heartbeat: ${parsed.overview.heartbeatLine}`);

  const expansion = {
    supportsDetailView: true,
    supportedStates: ['running', 'recent', 'blocked', 'failed', 'idle'],
    nextHooks: [
      'Attach session detail endpoints',
      'Add event history timeline',
      'Map sessions and tasks directly to stories',
    ],
  };

  return {
    checkedAt: new Date().toISOString(),
    summary: {
      activeCount: running.length,
      recentCount: recent.length,
      blockedCount: blocked.length,
      failedCount: failed.length,
      statusSignals,
      defaultModel: parsed.overview.defaultSessionModel,
      gatewayRunning: parsed.overview.gatewayRunning,
      telegramOk: parsed.overview.channelTelegramOk,
    },
    active: running,
    recent,
    blocked,
    failed,
    expansion,
  };
}

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

  const [statusResult, ssResult, apiUnitResult, uiUnitResult, targetResult] = await Promise.all([
    execFileAsync('openclaw', ['status']),
    execFileAsync('ss', ['-ltnp', '( sport = :4310 or sport = :4311 )']),
    execFileAsync('systemctl', ['--user', 'is-active', 'mission-control-api.service']),
    execFileAsync('systemctl', ['--user', 'is-active', 'mission-control-ui.service']),
    execFileAsync('systemctl', ['--user', 'is-active', 'mission-control.target']),
  ]);

  const gatewayRunning = /Gateway service\s+.*running/i.test(statusResult.stdout);
  const channelOk = /Telegram\s+│ ON\s+│ OK/i.test(statusResult.stdout) || /Telegram\s+ON\s+OK/i.test(statusResult.stdout);
  const uiListening = /:4310/.test(ssResult.stdout);
  const apiListening = /:4311/.test(ssResult.stdout);
  const updateAvailableMatch = statusResult.stdout.match(/Update\s+available.*?(\d{4}\.\d+\.\d+)/i);
  const supervisedApi = apiUnitResult.stdout.trim() === 'active';
  const supervisedUi = uiUnitResult.stdout.trim() === 'active';
  const supervisedTarget = targetResult.stdout.trim() === 'active';

  const issues = [];
  if (!gatewayRunning) issues.push('Gateway service not confirmed running');
  if (!uiListening) issues.push('Frontend port 4310 not listening');
  if (!apiListening) issues.push('API port 4311 not listening');
  if (!channelOk) issues.push('Telegram channel not confirmed OK');
  if (!supervisedApi) issues.push('Mission Control API systemd unit not active');
  if (!supervisedUi) issues.push('Mission Control UI systemd unit not active');
  if (!supervisedTarget) issues.push('Mission Control target not active');

  return {
    checkedAt: new Date().toISOString(),
    ui: { port: 4310, listening: uiListening, supervised: supervisedUi },
    api: { port: 4311, listening: apiListening, supervised: supervisedApi },
    gateway: { running: gatewayRunning },
    supervision: {
      targetActive: supervisedTarget,
      mode: supervisedApi && supervisedUi ? 'systemd-user' : 'unsupervised',
    },
    channels: { telegram: channelOk ? 'OK' : 'Unknown' },
    updates: { available: Boolean(updateAvailableMatch), version: updateAvailableMatch?.[1] ?? null },
    issues,
    raw: {
      statusExcerpt: statusResult.stdout.split('\n').slice(0, 40),
      socketsExcerpt: ssResult.stdout.split('\n').slice(0, 20),
      supervision: {
        api: apiUnitResult.stdout.trim(),
        ui: uiUnitResult.stdout.trim(),
        target: targetResult.stdout.trim(),
      },
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

function getStoryLifecycle(raw, fallbackStatus) {
  const openedAt = parseSection(raw, 'Opened') || null;
  const updatedAt = parseSection(raw, 'Updated') || openedAt || null;
  const closedAt = parseSection(raw, 'Closed') || null;

  if (fallbackStatus === 'Done' && !closedAt) {
    return { openedAt, updatedAt, closedAt: updatedAt || openedAt || null };
  }

  if (fallbackStatus !== 'Done' && closedAt) {
    return { openedAt, updatedAt, closedAt: null };
  }

  return { openedAt, updatedAt, closedAt };
}

function parseBulletSection(raw, sectionName) {
  const section = parseSection(raw, sectionName);
  if (!section) return [];
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.startsWith('- '));
}

function parseReferenceSection(raw, sectionName) {
  return parseBulletSection(raw, sectionName)
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

function formatBulletSection(entries) {
  if (!entries.length) return '';
  return entries.join('\n');
}

function formatReferenceSection(entries) {
  const cleaned = Array.from(new Set((entries || []).map((entry) => String(entry).trim()).filter(Boolean)));
  if (!cleaned.length) return '';
  return cleaned.map((entry) => `- ${entry}`).join('\n');
}

function parseUpdateLog(raw) {
  return parseBulletSection(raw, 'Update Log');
}

function parseExecutionTimeline(raw) {
  return parseBulletSection(raw, 'Execution Timeline');
}

function formatUpdateLog(entries) {
  return formatBulletSection(entries);
}

function formatExecutionTimeline(entries) {
  return formatBulletSection(entries);
}

function buildUpdateLogEntry(timestamp, summary) {
  return `- ${timestamp} — ${summary}`;
}

function buildExecutionTimelineEntry(timestamp, agent, status, summary) {
  const parts = [agent || 'Unknown', status || 'unknown'];
  if (summary) parts.push(summary);
  return `- ${timestamp} — ${parts.join(' • ')}`;
}

function makeUpdateLog(raw, summary, timestamp) {
  const entries = parseUpdateLog(raw);
  const nextEntry = buildUpdateLogEntry(timestamp, summary);
  if (entries[0] === nextEntry) return formatUpdateLog(entries);
  return formatUpdateLog([nextEntry, ...entries].slice(0, 12));
}

function makeExecutionTimeline(raw, agent, status, summary, timestamp) {
  const entries = parseExecutionTimeline(raw);
  const nextEntry = buildExecutionTimelineEntry(timestamp, agent, status, summary);
  if (entries[0] === nextEntry) return formatExecutionTimeline(entries);
  return formatExecutionTimeline([nextEntry, ...entries].slice(0, 20));
}

async function readStory(id) {
  const filePath = path.join(STORIES_DIR, `${id}.md`);
  const raw = await fs.readFile(filePath, 'utf-8');
  const titleMatch = raw.match(/^#\s+(STORY-\d+)\s+—\s+(.+)$/m);
  const status = parseSection(raw, 'Status');
  const lifecycle = getStoryLifecycle(raw, status);
  return {
    id,
    title: titleMatch?.[2]?.trim() ?? id,
    status,
    story: parseSection(raw, 'Story'),
    why: parseSection(raw, 'Why this matters'),
    deliverable: parseSection(raw, 'Deliverables') || parseSection(raw, 'Deliverable'),
    owner: parseSection(raw, 'Owner') || 'Apex',
    agent: parseSection(raw, 'Agent') || 'Apex',
    executionMode: parseSection(raw, 'Execution Mode') || 'manual',
    linkedSession: parseSection(raw, 'Linked Session') || '',
    linkedRun: parseSection(raw, 'Linked Run') || '',
    lastExecutionStatus: parseSection(raw, 'Last Execution Status') || 'idle',
    lastExecutionSummary: parseSection(raw, 'Last Execution Summary') || '',
    priority: parseSection(raw, 'Priority') || 'Medium',
    project: parseSection(raw, 'Project') || 'Mission Control',
    dependencies: parseReferenceSection(raw, 'Dependencies'),
    blockers: parseReferenceSection(raw, 'Blockers'),
    updateLog: parseUpdateLog(raw),
    executionTimeline: parseExecutionTimeline(raw),
    openedAt: lifecycle.openedAt,
    updatedAt: lifecycle.updatedAt,
    closedAt: lifecycle.closedAt,
    raw,
  };
}

async function writeStory(id, updates) {
  const filePath = path.join(STORIES_DIR, `${id}.md`);
  let raw = await fs.readFile(filePath, 'utf-8');
  const currentStatus = parseSection(raw, 'Status');
  const currentStory = parseSection(raw, 'Story');
  const currentOwner = parseSection(raw, 'Owner') || 'Apex';
  const currentAgent = parseSection(raw, 'Agent') || 'Apex';
  const currentExecutionMode = parseSection(raw, 'Execution Mode') || 'manual';
  const currentLinkedSession = parseSection(raw, 'Linked Session') || '';
  const currentLinkedRun = parseSection(raw, 'Linked Run') || '';
  const currentLastExecutionStatus = parseSection(raw, 'Last Execution Status') || 'idle';
  const currentLastExecutionSummary = parseSection(raw, 'Last Execution Summary') || '';
  const currentPriority = parseSection(raw, 'Priority') || 'Medium';
  const currentProject = parseSection(raw, 'Project') || 'Mission Control';
  const currentDependencies = parseReferenceSection(raw, 'Dependencies');
  const currentBlockers = parseReferenceSection(raw, 'Blockers');
  const currentExecutionTimeline = parseExecutionTimeline(raw);
  const currentOpenedAt = parseSection(raw, 'Opened') || null;
  const currentClosedAt = parseSection(raw, 'Closed') || null;
  const nextStatus = updates.status === undefined ? currentStatus : String(updates.status).trim();
  const nextStory = updates.story === undefined ? currentStory : String(updates.story).trim();
  const nextOwner = updates.owner === undefined ? currentOwner : String(updates.owner).trim();
  const nextAgent = updates.agent === undefined ? currentAgent : String(updates.agent).trim();
  const nextExecutionMode = updates.executionMode === undefined ? currentExecutionMode : String(updates.executionMode).trim();
  const nextLinkedSession = updates.linkedSession === undefined ? currentLinkedSession : String(updates.linkedSession).trim();
  const nextLinkedRun = updates.linkedRun === undefined ? currentLinkedRun : String(updates.linkedRun).trim();
  const nextLastExecutionStatus = updates.lastExecutionStatus === undefined ? currentLastExecutionStatus : String(updates.lastExecutionStatus).trim();
  const nextLastExecutionSummary = updates.lastExecutionSummary === undefined ? currentLastExecutionSummary : String(updates.lastExecutionSummary).trim();
  const nextPriority = updates.priority === undefined ? currentPriority : String(updates.priority).trim();
  const nextProject = updates.project === undefined ? currentProject : String(updates.project).trim();
  const nextDependencies = updates.dependencies === undefined ? currentDependencies : (Array.isArray(updates.dependencies) ? updates.dependencies : String(updates.dependencies).split(/\r?\n|,/)).map((entry) => String(entry).trim()).filter(Boolean);
  const nextBlockers = updates.blockers === undefined ? currentBlockers : (Array.isArray(updates.blockers) ? updates.blockers : String(updates.blockers).split(/\r?\n|,/)).map((entry) => String(entry).trim()).filter(Boolean);
  const nowIso = new Date().toISOString();
  const nextUpdatedAt = updates.updatedAt ?? nowIso;
  const nextClosedAt = updates.closedAt ?? (nextStatus === 'Done' ? currentClosedAt || nextUpdatedAt : '');
  const nextOpenedAt = updates.openedAt ?? currentOpenedAt ?? currentClosedAt ?? nextUpdatedAt;

  const changeParts = [];
  if (nextStatus !== currentStatus) changeParts.push(`status ${currentStatus || 'unset'} → ${nextStatus}`);
  if (nextOwner !== currentOwner) changeParts.push(`owner ${currentOwner} → ${nextOwner}`);
  if (nextAgent !== currentAgent) changeParts.push(`agent ${currentAgent} → ${nextAgent}`);
  if (nextExecutionMode !== currentExecutionMode) changeParts.push(`execution mode ${currentExecutionMode} → ${nextExecutionMode}`);
  if (nextLinkedSession !== currentLinkedSession) changeParts.push(`linked session updated`);
  if (nextLinkedRun !== currentLinkedRun) changeParts.push(`linked run updated`);
  if (nextLastExecutionStatus !== currentLastExecutionStatus) changeParts.push(`execution status ${currentLastExecutionStatus} → ${nextLastExecutionStatus}`);
  if (nextLastExecutionSummary !== currentLastExecutionSummary) changeParts.push('execution summary updated');
  if (nextPriority !== currentPriority) changeParts.push(`priority ${currentPriority} → ${nextPriority}`);
  if (nextProject !== currentProject) changeParts.push(`project ${currentProject} → ${nextProject}`);
  if (JSON.stringify(nextDependencies) !== JSON.stringify(currentDependencies)) changeParts.push('dependencies updated');
  if (JSON.stringify(nextBlockers) !== JSON.stringify(currentBlockers)) changeParts.push('blockers updated');
  if (nextStory !== currentStory) changeParts.push('story details updated');

  let nextUpdateLog = updates.updateLog;
  if (nextUpdateLog === undefined && changeParts.length > 0) {
    nextUpdateLog = makeUpdateLog(raw, changeParts.join(' · '), nextUpdatedAt);
  }

  let nextExecutionTimeline = updates.executionTimeline;
  if (nextExecutionTimeline === undefined && (
    nextAgent !== currentAgent ||
    nextLastExecutionStatus !== currentLastExecutionStatus ||
    nextLastExecutionSummary !== currentLastExecutionSummary ||
    nextLinkedSession !== currentLinkedSession ||
    nextLinkedRun !== currentLinkedRun ||
    nextExecutionMode !== currentExecutionMode
  )) {
    const timelineSummaryParts = [];
    if (nextExecutionMode !== currentExecutionMode) timelineSummaryParts.push(`mode ${nextExecutionMode}`);
    if (nextLinkedSession !== currentLinkedSession && nextLinkedSession) timelineSummaryParts.push(`session ${nextLinkedSession}`);
    if (nextLinkedRun !== currentLinkedRun && nextLinkedRun) timelineSummaryParts.push(`run ${nextLinkedRun}`);
    if (nextLastExecutionSummary) timelineSummaryParts.push(nextLastExecutionSummary);
    nextExecutionTimeline = makeExecutionTimeline(
      raw,
      nextAgent,
      nextLastExecutionStatus,
      timelineSummaryParts.join(' • '),
      nextUpdatedAt,
    );
  } else if (nextExecutionTimeline === undefined) {
    nextExecutionTimeline = formatExecutionTimeline(currentExecutionTimeline);
  }

  const sections = [
    ['Status', updates.status],
    ['Owner', updates.owner],
    ['Agent', updates.agent],
    ['Execution Mode', updates.executionMode],
    ['Linked Session', updates.linkedSession],
    ['Linked Run', updates.linkedRun],
    ['Last Execution Status', updates.lastExecutionStatus],
    ['Last Execution Summary', updates.lastExecutionSummary],
    ['Priority', updates.priority],
    ['Project', updates.project],
    ['Dependencies', formatReferenceSection(nextDependencies)],
    ['Blockers', formatReferenceSection(nextBlockers)],
    ['Story', updates.story],
    ['Update Log', nextUpdateLog],
    ['Execution Timeline', nextExecutionTimeline],
    ['Opened', nextOpenedAt],
    ['Updated', nextUpdatedAt],
    ['Closed', nextClosedAt],
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

function roleExecutionMode(agentName) {
  const modeByAgent = {
    Apex: 'manual',
    Recon: 'subagent',
    Groove: 'subagent',
    Mach: 'subagent',
    Pitstop: 'subagent',
    Marker: 'subagent',
  };
  return modeByAgent[agentName] || 'manual';
}

function roleLaunchSummary(agentName) {
  const summaryByAgent = {
    Recon: 'Recon launch requested for research/discovery pass',
    Groove: 'Groove launch requested for planning/decomposition pass',
    Mach: 'Mach launch requested for implementation pass',
    Pitstop: 'Pitstop launch requested for QA/review pass',
    Marker: 'Marker launch requested for documentation/handoff pass',
    Apex: 'Apex assigned orchestration follow-up',
  };
  return summaryByAgent[agentName] || `${agentName} launch requested`;
}

async function ensureLaunchIntentDir() {
  await fs.mkdir(LAUNCH_INTENTS_DIR, { recursive: true });
}

function priorityWeight(priority) {
  const normalized = String(priority || '').toLowerCase();
  if (normalized === 'high') return 30;
  if (normalized === 'low') return 5;
  return 15;
}

function statusWeight(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'in progress') return 40;
  if (normalized === 'ready') return 28;
  if (normalized === 'backlog') return 12;
  return 0;
}

function recencyPenalty(updatedAt) {
  if (!updatedAt) return 0;
  const timestamp = new Date(updatedAt).getTime();
  if (Number.isNaN(timestamp)) return 0;
  const hours = (Date.now() - timestamp) / 3_600_000;
  if (hours < 2) return 8;
  if (hours < 12) return 4;
  if (hours > 72) return -4;
  return 0;
}

async function gatherDependencyInsights() {
  const board = await getKanbanData();
  const allIds = Object.values(board).flat().map((item) => item.id);
  const stories = await Promise.all(allIds.map((id) => readStory(id)));
  const storyMap = new Map(stories.map((story) => [story.id, story]));

  const blockersByStory = new Map();
  const blockedByMap = new Map();

  for (const story of stories) {
    const reasons = [];

    for (const dependencyId of story.dependencies) {
      const dependency = storyMap.get(dependencyId);
      if (!dependency) {
        reasons.push(`Missing dependency ${dependencyId}`);
        continue;
      }
      if (dependency.status !== 'Done') {
        reasons.push(`${dependency.id} not done (${dependency.status})`);
        const currentBlockedBy = blockedByMap.get(dependency.id) || [];
        currentBlockedBy.push(story.id);
        blockedByMap.set(dependency.id, currentBlockedBy);
      }
    }

    for (const blocker of story.blockers) {
      if (/^STORY-\d+$/i.test(blocker)) {
        const blockerStoryId = blocker.toUpperCase();
        const blockerStory = storyMap.get(blockerStoryId);
        if (!blockerStory) {
          reasons.push(`Missing blocker ${blockerStoryId}`);
        } else if (blockerStory.status !== 'Done') {
          reasons.push(`Blocked by ${blockerStory.id} (${blockerStory.status})`);
          const currentBlockedBy = blockedByMap.get(blockerStory.id) || [];
          currentBlockedBy.push(story.id);
          blockedByMap.set(blockerStory.id, currentBlockedBy);
        }
      } else {
        reasons.push(blocker);
      }
    }

    blockersByStory.set(story.id, reasons);
  }

  const storyStates = stories.map((story) => {
    const blockingReasons = Array.from(new Set(blockersByStory.get(story.id) || []));
    const unlocks = Array.from(new Set(blockedByMap.get(story.id) || []));
    return {
      id: story.id,
      title: story.title,
      status: story.status,
      priority: story.priority,
      project: story.project,
      dependencies: story.dependencies,
      blockers: story.blockers,
      updatedAt: story.updatedAt,
      blockingReasons,
      isBlocked: blockingReasons.length > 0,
      unlocks,
    };
  });

  const unblockCandidates = storyStates
    .filter((story) => !story.isBlocked && story.status !== 'Done' && story.unlocks.length > 0)
    .sort((a, b) => {
      const unlockDelta = (b.unlocks.length - a.unlocks.length);
      if (unlockDelta !== 0) return unlockDelta;
      return a.id.localeCompare(b.id);
    });

  const nextActionCandidates = storyStates
    .filter((story) => !story.isBlocked && story.status !== 'Done')
    .map((story) => {
      const reasons = [];
      let score = 0;

      const statusScore = statusWeight(story.status);
      score += statusScore;
      if (statusScore > 0) reasons.push(`${story.status} work gets priority`);

      const priorityScore = priorityWeight(story.priority);
      score += priorityScore;
      reasons.push(`${story.priority} priority`);

      if (story.unlocks.length > 0) {
        const unlockScore = story.unlocks.length * 10;
        score += unlockScore;
        reasons.push(`unblocks ${story.unlocks.length} ${story.unlocks.length === 1 ? 'story' : 'stories'}`);
      }

      const freshnessScore = recencyPenalty(story.updatedAt);
      score += freshnessScore;
      if (freshnessScore > 0) reasons.push('recently active, good to continue');
      if (freshnessScore < 0) reasons.push('stale enough to revisit soon');

      if ((story.status || '').toLowerCase() === 'backlog' && story.unlocks.length === 0) {
        score -= 6;
        reasons.push('less urgent than active or leverage-driving work');
      }

      return {
        ...story,
        score,
        reasons,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.id.localeCompare(b.id);
    });

  const recommendedNextAction = nextActionCandidates[0] || null;

  return {
    checkedAt: new Date().toISOString(),
    summary: {
      blockedCount: storyStates.filter((story) => story.isBlocked).length,
      readyToUnblockCount: unblockCandidates.length,
      linkedStoryCount: storyStates.filter((story) => story.dependencies.length || story.blockers.length).length,
      nextActionCandidateCount: nextActionCandidates.length,
    },
    stories: storyStates,
    unblockCandidates,
    nextActionCandidates,
    recommendedNextAction,
  };
}

async function createLaunchIntent(storyId, agentName) {
  await ensureLaunchIntentDir();
  const story = await readStory(storyId);
  const timestamp = new Date().toISOString();
  const safeAgent = String(agentName || story.agent || 'Apex').trim() || 'Apex';
  const executionMode = roleExecutionMode(safeAgent);
  const intentId = `intent-${storyId}-${safeAgent}-${timestamp.replace(/[:.]/g, '-')}`;
  const intent = {
    id: intentId,
    createdAt: timestamp,
    storyId,
    project: story.project,
    title: story.title,
    agent: safeAgent,
    executionMode,
    status: 'pending',
    prompt: `${safeAgent} requested from ${storyId}: ${story.story}`,
  };
  await fs.writeFile(path.join(LAUNCH_INTENTS_DIR, `${intentId}.json`), JSON.stringify(intent, null, 2));

  await writeStory(storyId, {
    agent: safeAgent,
    executionMode,
    linkedRun: intentId,
    lastExecutionStatus: executionMode === 'subagent' ? 'pending' : 'idle',
    lastExecutionSummary: roleLaunchSummary(safeAgent),
    updatedAt: timestamp,
  });

  return { intent, story: await readStory(storyId) };
}

async function listLaunchIntents() {
  await ensureLaunchIntentDir();
  const files = await fs.readdir(LAUNCH_INTENTS_DIR);
  const intents = [];
  for (const file of files.filter((file) => file.endsWith('.json')).sort()) {
    const raw = await fs.readFile(path.join(LAUNCH_INTENTS_DIR, file), 'utf-8');
    intents.push(JSON.parse(raw));
  }
  return intents.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function resolveLaunchIntent(intentId, resolution) {
  await ensureLaunchIntentDir();
  const filePath = path.join(LAUNCH_INTENTS_DIR, `${intentId}.json`);
  const raw = await fs.readFile(filePath, 'utf-8');
  const intent = JSON.parse(raw);
  const resolvedAt = new Date().toISOString();
  const nextIntent = {
    ...intent,
    status: resolution.status || 'running',
    resolvedAt,
    linkedSession: resolution.linkedSession || '',
    linkedRun: resolution.linkedRun || intent.id,
    summary: resolution.summary || intent.prompt,
  };
  await fs.writeFile(filePath, JSON.stringify(nextIntent, null, 2));

  await writeStory(intent.storyId, {
    agent: intent.agent,
    executionMode: intent.executionMode,
    linkedSession: nextIntent.linkedSession,
    linkedRun: nextIntent.linkedRun,
    lastExecutionStatus: nextIntent.status,
    lastExecutionSummary: nextIntent.summary,
    updatedAt: resolvedAt,
  });

  return { intent: nextIntent, story: await readStory(intent.storyId) };
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

    if (req.method === 'GET' && req.url === '/api/agent-operations') {
      const agentOperations = await gatherAgentOperations();
      json(res, 200, { success: true, agentOperations });
      return;
    }

    if (req.method === 'GET' && req.url === '/api/documentation-hub') {
      const documentationHub = await gatherDocumentationHub();
      json(res, 200, { success: true, documentationHub });
      return;
    }

    if (req.method === 'GET' && req.url === '/api/dependencies') {
      const dependencyInsights = await gatherDependencyInsights();
      json(res, 200, { success: true, dependencyInsights });
      return;
    }

    if (req.method === 'GET' && req.url === '/api/next-action') {
      const dependencyInsights = await gatherDependencyInsights();
      json(res, 200, {
        success: true,
        nextAction: {
          checkedAt: dependencyInsights.checkedAt,
          recommended: dependencyInsights.recommendedNextAction,
          candidates: dependencyInsights.nextActionCandidates,
          summary: dependencyInsights.summary,
        },
      });
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
      const currentStory = await readStory(payload.id);
      await moveCardInBoard(payload.id, payload.targetColumn);
      if (payload.targetColumn) {
        const targetStatus = normalizeColumnName(payload.targetColumn);
        await writeStory(payload.id, {
          status: targetStatus,
          updateLog: makeUpdateLog(currentStory.raw, `moved ${currentStory.status} → ${targetStatus}`, new Date().toISOString()),
        });
      }
      json(res, 200, { success: true, board: await getKanbanData() });
      return;
    }

    const storyLaunchMatch = req.url?.match(/^\/api\/stories\/(STORY-\d+)\/launch$/);
    if (req.method === 'POST' && storyLaunchMatch) {
      const body = await collectBody(req);
      const payload = JSON.parse(body || '{}');
      const agent = String(payload.agent || '').trim();
      if (!agent) {
        json(res, 400, { success: false, error: 'agent is required' });
        return;
      }
      const result = await createLaunchIntent(storyLaunchMatch[1], agent);
      json(res, 200, { success: true, story: result.story, launchIntent: result.intent });
      return;
    }

    if (req.method === 'GET' && req.url === '/api/launch-intents') {
      const intents = await listLaunchIntents();
      json(res, 200, { success: true, launchIntents: intents });
      return;
    }

    const launchIntentResolveMatch = req.url?.match(/^\/api\/launch-intents\/([^/]+)\/resolve$/);
    if (req.method === 'POST' && launchIntentResolveMatch) {
      const body = await collectBody(req);
      const payload = JSON.parse(body || '{}');
      const result = await resolveLaunchIntent(launchIntentResolveMatch[1], {
        status: payload.status,
        linkedSession: payload.linkedSession,
        linkedRun: payload.linkedRun,
        summary: payload.summary,
      });
      json(res, 200, { success: true, launchIntent: result.intent, story: result.story });
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