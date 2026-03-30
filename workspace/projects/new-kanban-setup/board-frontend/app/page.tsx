"use client";

import { useEffect, useMemo, useState } from 'react';

type BoardItem = { id: string; title: string };
type BoardData = Record<string, BoardItem[]>;

type HealthState = 'loading' | 'ready' | 'error' | 'saving';

type SystemHealth = {
  checkedAt: string;
  ui: { port: number; listening: boolean };
  api: { port: number; listening: boolean };
  gateway: { running: boolean };
  channels: { telegram: string };
  updates: { available: boolean; version: string | null };
  issues: string[];
};

function isBoardItem(item: unknown): item is BoardItem {
  return Boolean(
    item &&
    typeof item === 'object' &&
    'id' in item &&
    typeof (item as { id?: unknown }).id === 'string' &&
    'title' in item &&
    typeof (item as { title?: unknown }).title === 'string'
  );
}

type StoryDetails = {
  id: string;
  title: string;
  status: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  story: string;
  why: string;
  deliverable: string;
};

const columns = ['Backlog', 'Ready', 'In Progress', 'Done'];

function PriorityPill({ priority }: { priority: string }) {
  const normalized = priority.toLowerCase();
  const priorityClass = normalized === 'high' ? 'high' : normalized === 'low' ? 'low' : 'medium';
  return <span className={`priority ${priorityClass}`}>{priority}</span>;
}

function StatusBanner({ state, message }: { state: HealthState; message: string }) {
  return <div className={`statusBanner ${state}`}>{message}</div>;
}

function StoryEditor({
  story,
  onClose,
  onSave,
  onMove,
  saving,
}: {
  story: StoryDetails;
  onClose: () => void;
  onSave: (story: StoryDetails) => Promise<void>;
  onMove: (id: string, targetColumn: string) => Promise<void>;
  saving: boolean;
}) {
  const [draft, setDraft] = useState(story);

  useEffect(() => setDraft(story), [story]);

  return (
    <div className="drawerBackdrop" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawerHeader">
          <div>
            <div className="cardId">{draft.id}</div>
            <h2>{draft.title}</h2>
          </div>
          <button className="ghostButton" onClick={onClose}>Close</button>
        </div>

        <div className="fieldGrid">
          <label>
            <span>Status</span>
            <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
              {columns.map((column) => <option key={column} value={column}>{column}</option>)}
            </select>
          </label>

          <label>
            <span>Owner</span>
            <input value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} />
          </label>

          <label>
            <span>Priority</span>
            <select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
        </div>

        <label className="textField">
          <span>Story Details</span>
          <textarea rows={8} value={draft.story} onChange={(e) => setDraft({ ...draft, story: e.target.value })} />
        </label>

        <div className="drawerMeta">
          <div><strong>Why:</strong> {draft.why || 'Not captured yet.'}</div>
          <div><strong>Deliverable:</strong> {draft.deliverable || 'Not specified.'}</div>
        </div>

        <div className="drawerActions">
          <button className="secondaryButton" onClick={() => onMove(draft.id, draft.status)} disabled={saving}>Move to selected status</button>
          <button className="primaryButton" onClick={() => onSave(draft)} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      </aside>
    </div>
  );
}

export default function Page() {
  const [board, setBoard] = useState<BoardData>({ Backlog: [], Ready: [], 'In Progress': [], Done: [] });
  const [stories, setStories] = useState<Record<string, StoryDetails>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthState>('loading');
  const [statusMessage, setStatusMessage] = useState('Loading board…');
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);

  async function loadBoard() {
    try {
      setLoading(true);
      setHealth('loading');
      setStatusMessage('Loading board…');

      const res = await fetch('/api/kanban', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Board request failed: ${res.status}`);
      const data = await res.json();
      const nextBoard = data.board || { Backlog: [], Ready: [], 'In Progress': [], Done: [] };
      setBoard(nextBoard);

      const ids = [
        ...new Set(
          Object.values(nextBoard)
            .flat()
            .filter(isBoardItem)
            .map((item) => item.id)
        ),
      ];

      const [loadedStories, healthRes] = await Promise.all([
        Promise.all(ids.map(async (id: string) => {
          const storyRes = await fetch(`/api/stories/${id}`, { cache: 'no-store' });
          if (!storyRes.ok) return undefined;
          const storyData = await storyRes.json();
          return storyData.story as StoryDetails | undefined;
        })),
        fetch('/api/health', { cache: 'no-store' }),
      ]);

      const validStories = loadedStories.filter((story): story is StoryDetails => Boolean(story && story.id));
      const mapped = Object.fromEntries(validStories.map((story) => [story.id, story]));
      setStories(mapped);

      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setSystemHealth(healthData.health as SystemHealth);
      }

      setHealth('ready');
      setStatusMessage(`Board ready • ${ids.length} tracked stories`);
    } catch (error) {
      console.error('Failed to load board', error);
      setHealth('error');
      setStatusMessage('Board load failed. Refresh or check API health.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard();
  }, []);

  const selectedStory = useMemo(() => (selectedId ? stories[selectedId] : null), [selectedId, stories]);
  const totalStories = useMemo(() => Object.values(board).flat().filter(isBoardItem).length, [board]);

  async function saveStory(story: StoryDetails) {
    setSaving(true);
    setHealth('saving');
    setStatusMessage(`Saving ${story.id}…`);
    try {
      await fetch(`/api/stories/${story.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: story.status,
          owner: story.owner,
          priority: story.priority,
          story: story.story,
        }),
      });
      await loadBoard();
      setSelectedId(story.id);
    } finally {
      setSaving(false);
    }
  }

  async function moveStory(id: string, targetColumn: string) {
    setSaving(true);
    setHealth('saving');
    setStatusMessage(`Moving ${id} to ${targetColumn}…`);
    try {
      await fetch('/api/kanban/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, targetColumn }),
      });
      await loadBoard();
      setSelectedId(id);
      setDraggingId(null);
      setDropTarget(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="heroLeft">
          <div className="eyebrow">Mission Control</div>
          <h1>Execution surface for stories, tasks, and agent-driven delivery.</h1>
          <p className="heroText">Portable markdown storage underneath. Operational controls and board visibility on top.</p>
        </div>
        <div className="heroStats">
          <div className="statCard"><span>Total stories</span><strong>{totalStories}</strong></div>
          <div className="statCard"><span>Active columns</span><strong>{columns.length}</strong></div>
          <div className="statCard"><span>Mode</span><strong>Production</strong></div>
        </div>
      </header>

      <StatusBanner state={health} message={statusMessage} />

      <div className="toolbar">
        <div className="badgeRow">
          <div className="badge">Dark mode enabled</div>
          <div className="badge">Editable stories</div>
          <div className="badge">Drag and drop enabled</div>
          <div className="badge">Markdown source of truth</div>
        </div>
        <button className="ghostButton" onClick={loadBoard} disabled={loading || saving}>Refresh board</button>
      </div>

      {systemHealth && (
        <section className="healthPanel">
          <div className="healthHeader">
            <h2>System Health</h2>
            <span className="healthTimestamp">Checked {new Date(systemHealth.checkedAt).toLocaleTimeString()}</span>
          </div>
          <div className="healthGrid">
            <div className="healthCard"><span>Frontend</span><strong>{systemHealth.ui.listening ? 'Listening' : 'Down'}</strong></div>
            <div className="healthCard"><span>API</span><strong>{systemHealth.api.listening ? 'Listening' : 'Down'}</strong></div>
            <div className="healthCard"><span>Gateway</span><strong>{systemHealth.gateway.running ? 'Running' : 'Unknown'}</strong></div>
            <div className="healthCard"><span>Telegram</span><strong>{systemHealth.channels.telegram}</strong></div>
          </div>
          <div className="healthMetaRow">
            <div className="healthNote">{systemHealth.updates.available ? `Update available: ${systemHealth.updates.version}` : 'No update signal detected'}</div>
            <div className="healthNote">Issues: {systemHealth.issues.length}</div>
          </div>
          {systemHealth.issues.length > 0 && (
            <ul className="healthIssues">
              {systemHealth.issues.map((issue) => <li key={issue}>{issue}</li>)}
            </ul>
          )}
        </section>
      )}

      <section className="board">
        {columns.map((column) => {
          const items = board[column] ?? [];
          return (
            <div
              key={column}
              className={`column ${dropTarget === column ? 'columnDropTarget' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDropTarget(column);
              }}
              onDragLeave={() => setDropTarget((current) => (current === column ? null : current))}
              onDrop={async (e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData('text/story-id') || draggingId;
                if (draggedId) await moveStory(draggedId, column);
              }}
            >
              <div className="columnHeader">
                <h2>{column}</h2>
                <span className="count">{items.length}</span>
              </div>
              <div className="columnControls">
                <span className="columnHint">Drag a story here, use quick move buttons, or edit via the drawer.</span>
              </div>
              <div className="cardList">
                {items.length === 0 ? (
                  <div className="empty">No stories here.</div>
                ) : (
                  items.map((item) => {
                    const story = stories[item.id];
                    return (
                      <article
                        key={item.id}
                        className={`card clickableCard ${draggingId === item.id ? 'draggingCard' : ''}`}
                        onClick={() => setSelectedId(item.id)}
                        draggable
                        onDragStart={(e) => {
                          setDraggingId(item.id);
                          e.dataTransfer.setData('text/story-id', item.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragEnd={() => {
                          setDraggingId(null);
                          setDropTarget(null);
                        }}
                      >
                        <div className="cardTop">
                          <div>
                            <div className="cardId">{item.id}</div>
                            <h3>{story?.title ?? item.title}</h3>
                          </div>
                          <PriorityPill priority={story?.priority ?? 'Medium'} />
                        </div>
                        <div className="meta">
                          <div className="metaRow"><span>Status</span><strong>{story?.status ?? column}</strong></div>
                          <div className="metaRow"><span>Owner</span><strong>{story?.owner ?? 'Apex'}</strong></div>
                          <div className="metaRow"><span>Deliverable</span><strong>{story?.deliverable ?? 'Not specified'}</strong></div>
                        </div>
                        <div className="story">{story?.story ?? 'No story text available.'}</div>
                        <div className="quickActions" onClick={(e) => e.stopPropagation()}>
                          {columns.filter((target) => target !== column).map((target) => (
                            <button key={target} className="tinyButton" onClick={() => moveStory(item.id, target)} disabled={saving}>
                              Move to {target}
                            </button>
                          ))}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </section>

      <p className="footerNote">
        {loading ? 'Loading stories…' : health === 'error' ? 'Mission Control hit a load problem.' : 'Click a story to edit it, or drag it between columns.'}
      </p>

      {selectedStory && (
        <StoryEditor
          story={selectedStory}
          onClose={() => setSelectedId(null)}
          onSave={saveStory}
          onMove={moveStory}
          saving={saving}
        />
      )}
    </main>
  );
}
