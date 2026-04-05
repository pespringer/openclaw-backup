"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

type BoardItem = { id: string; title: string };
type BoardData = Record<string, BoardItem[]>;

type HealthState = 'loading' | 'ready' | 'error' | 'saving';

type SystemHealth = {
  checkedAt: string;
  ui: { port: number; listening: boolean; supervised?: boolean };
  api: { port: number; listening: boolean; supervised?: boolean };
  gateway: { running: boolean };
  supervision?: { targetActive: boolean; mode: string };
  channels: { telegram: string };
  updates: { available: boolean; version: string | null };
  issues: string[];
};

type AgentState = 'running' | 'recent' | 'blocked' | 'failed' | 'idle';

type AgentSession = {
  key: string;
  kind: string;
  age: string;
  model: string;
  tokens: string;
  state: AgentState;
  storyId: string | null;
  storyTitle: string | null;
  blockedReason: string | null;
  failedReason: string | null;
};

type AgentOperations = {
  checkedAt: string;
  summary: {
    activeCount: number;
    recentCount: number;
    blockedCount: number;
    failedCount: number;
    statusSignals: string[];
    defaultModel: string | null;
    gatewayRunning: boolean;
    telegramOk: boolean;
  };
  active: AgentSession[];
  recent: AgentSession[];
  blocked: AgentSession[];
  failed: AgentSession[];
  expansion: {
    supportsDetailView: boolean;
    supportedStates: AgentState[];
    nextHooks: string[];
  };
};

type DocumentationDoc = {
  id: string;
  title: string;
  path: string;
  group: string;
  summary: string;
  tags: string[];
  heading: string;
  preview: string;
  lineCount: number;
  lastReviewedAt: string | null;
};

type DocumentationHub = {
  checkedAt: string;
  summary: {
    totalDocs: number;
    runbookCount: number;
    architectureCount: number;
    planningCount: number;
    decisionCount: number;
  };
  groups: Record<string, DocumentationDoc[]>;
  docs: DocumentationDoc[];
  expansion: {
    supportsDetailView: boolean;
    nextHooks: string[];
  };
};

type LaunchIntent = {
  id: string;
  createdAt: string;
  storyId: string;
  project: string;
  title: string;
  agent: string;
  executionMode: string;
  status: string;
  prompt: string;
  resolvedAt?: string;
  linkedSession?: string;
  linkedRun?: string;
  summary?: string;
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
  agent: string;
  executionMode: string;
  linkedSession: string;
  linkedRun: string;
  lastExecutionStatus: string;
  lastExecutionSummary: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  project: string;
  story: string;
  why: string;
  deliverable: string;
  dependencies: string[];
  blockers: string[];
  updateLog: string[];
  executionTimeline: string[];
  openedAt: string | null;
  updatedAt: string | null;
  closedAt: string | null;
};

type DependencyStoryState = {
  id: string;
  title: string;
  status: string;
  priority: string;
  project: string;
  dependencies: string[];
  blockers: string[];
  blockingReasons: string[];
  isBlocked: boolean;
  unlocks: string[];
};

type NextActionCandidate = DependencyStoryState & {
  score: number;
  reasons: string[];
};

type DependencyInsights = {
  checkedAt: string;
  summary: {
    blockedCount: number;
    readyToUnblockCount: number;
    linkedStoryCount: number;
    nextActionCandidateCount: number;
  };
  stories: DependencyStoryState[];
  unblockCandidates: DependencyStoryState[];
  nextActionCandidates: NextActionCandidate[];
  recommendedNextAction: NextActionCandidate | null;
};

const namedAgents = ['Apex', 'Recon', 'Groove', 'Mach', 'Pitstop', 'Marker'];
const executionModes = ['manual', 'subagent', 'acp', 'cron', 'mixed'];
const executionStatuses = ['idle', 'running', 'recent', 'blocked', 'failed', 'completed'];

const columns = ['Backlog', 'Ready', 'In Progress', 'Done'];
const AUTO_REFRESH_MS = 30_000;

function PriorityPill({ priority }: { priority: string }) {
  const normalized = priority.toLowerCase();
  const priorityClass = normalized === 'high' ? 'high' : normalized === 'low' ? 'low' : 'medium';
  return <span className={`priority ${priorityClass}`}>{priority}</span>;
}

function AgentStatePill({ state }: { state: AgentState }) {
  return <span className={`agentState ${state}`}>{state}</span>;
}

function ProjectBadge({ project }: { project: string }) {
  return <span className="projectBadge">{project}</span>;
}

function StatusBanner({ state, message }: { state: HealthState; message: string }) {
  return <div className={`statusBanner ${state}`}>{message}</div>;
}

function formatTimestamp(value: string | null) {
  if (!value) return 'Not recorded';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

function FreshnessBadge({ lastUpdatedAt, autoRefreshPaused }: { lastUpdatedAt: string | null; autoRefreshPaused: boolean }) {
  const label = lastUpdatedAt ? `Fresh as of ${new Date(lastUpdatedAt).toLocaleTimeString()}` : 'Freshness pending';
  return (
    <div className="freshnessRow">
      <div className="badge">Auto-refresh every 30s</div>
      <div className="badge">{label}</div>
      <div className="badge">{autoRefreshPaused ? 'Auto-refresh paused while editing' : 'Auto-refresh active'}</div>
    </div>
  );
}

function StoryEditor({
  story,
  dependencyState,
  onClose,
  onSave,
  onMove,
  onLaunch,
  saving,
}: {
  story: StoryDetails;
  dependencyState?: DependencyStoryState;
  onClose: () => void;
  onSave: (story: StoryDetails) => Promise<void>;
  onMove: (id: string, targetColumn: string) => Promise<void>;
  onLaunch: (id: string, agent: string) => Promise<void>;
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

        <div className="fieldGrid fourUp">
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

          <label>
            <span>Agent</span>
            <select value={draft.agent} onChange={(e) => setDraft({ ...draft, agent: e.target.value })}>
              {namedAgents.map((agent) => <option key={agent} value={agent}>{agent}</option>)}
            </select>
          </label>

          <label>
            <span>Execution Mode</span>
            <select value={draft.executionMode} onChange={(e) => setDraft({ ...draft, executionMode: e.target.value })}>
              {executionModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
            </select>
          </label>

          <label>
            <span>Execution Status</span>
            <select value={draft.lastExecutionStatus} onChange={(e) => setDraft({ ...draft, lastExecutionStatus: e.target.value })}>
              {executionStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>

          <label>
            <span>Project</span>
            <input value={draft.project} onChange={(e) => setDraft({ ...draft, project: e.target.value })} />
          </label>
        </div>

        <div className="fieldGrid">
          <label>
            <span>Linked Session</span>
            <input value={draft.linkedSession} onChange={(e) => setDraft({ ...draft, linkedSession: e.target.value })} placeholder="agent:... or session key" />
          </label>

          <label>
            <span>Linked Run</span>
            <input value={draft.linkedRun} onChange={(e) => setDraft({ ...draft, linkedRun: e.target.value })} placeholder="run id / task ref" />
          </label>

          <label>
            <span>Execution Summary</span>
            <input value={draft.lastExecutionSummary} onChange={(e) => setDraft({ ...draft, lastExecutionSummary: e.target.value })} placeholder="Short latest run summary" />
          </label>
        </div>

        <div className="fieldGrid twoUp">
          <label className="textField compactTextField">
            <span>Dependencies</span>
            <textarea
              rows={5}
              value={draft.dependencies.join('\n')}
              onChange={(e) => setDraft({ ...draft, dependencies: e.target.value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) })}
              placeholder="One per line, e.g. STORY-017"
            />
          </label>

          <label className="textField compactTextField">
            <span>Blockers</span>
            <textarea
              rows={5}
              value={draft.blockers.join('\n')}
              onChange={(e) => setDraft({ ...draft, blockers: e.target.value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) })}
              placeholder="Story IDs or free-text blockers"
            />
          </label>
        </div>

        <label className="textField">
          <span>Story Details</span>
          <textarea rows={8} value={draft.story} onChange={(e) => setDraft({ ...draft, story: e.target.value })} />
        </label>

        <div className="dependencyMetaPanel">
          <div><strong>Blocked now:</strong> {dependencyState?.isBlocked ? 'Yes' : 'No'}</div>
          <div><strong>Blocking reasons:</strong> {dependencyState?.blockingReasons?.length ? dependencyState.blockingReasons.join(' • ') : 'None'}</div>
          <div><strong>Unblocks:</strong> {dependencyState?.unlocks?.length ? dependencyState.unlocks.join(', ') : 'No downstream stories yet'}</div>
        </div>

        <div className="drawerMeta">
          <div><strong>Why:</strong> {draft.why || 'Not captured yet.'}</div>
          <div><strong>Deliverable:</strong> {draft.deliverable || 'Not specified.'}</div>
          <div><strong>Execution:</strong> {draft.executionMode} • {draft.lastExecutionStatus}</div>
          <div><strong>Linked session:</strong> {draft.linkedSession || 'Not linked'}</div>
          <div><strong>Linked run:</strong> {draft.linkedRun || 'Not linked'}</div>
          <div><strong>Last execution summary:</strong> {draft.lastExecutionSummary || 'No execution summary yet.'}</div>
        </div>

        <div className="timestampGrid">
          <div className="timestampCard"><span>Opened</span><strong>{formatTimestamp(draft.openedAt)}</strong></div>
          <div className="timestampCard"><span>Updated</span><strong>{formatTimestamp(draft.updatedAt)}</strong></div>
          <div className="timestampCard"><span>Closed</span><strong>{formatTimestamp(draft.closedAt)}</strong></div>
        </div>

        <div className="updateLogPanel">
          <h3>Execution Timeline</h3>
          {draft.executionTimeline?.length ? (
            <ul className="updateLogList">
              {draft.executionTimeline.map((entry, index) => <li key={`${draft.id}-timeline-${index}`}>{entry.replace(/^\-\s*/, '')}</li>)}
            </ul>
          ) : (
            <div className="updateLogEmpty">No execution events recorded yet.</div>
          )}
        </div>

        <div className="updateLogPanel">
          <h3>Update History</h3>
          {draft.updateLog?.length ? (
            <ul className="updateLogList">
              {draft.updateLog.map((entry, index) => <li key={`${draft.id}-log-${index}`}>{entry.replace(/^\-\s*/, '')}</li>)}
            </ul>
          ) : (
            <div className="updateLogEmpty">No updates recorded yet.</div>
          )}
        </div>

        <div className="launchControls">
          <span>Launch as:</span>
          {namedAgents.filter((agent) => agent !== 'Apex').map((agent) => (
            <button key={agent} className="tinyButton" onClick={() => onLaunch(draft.id, agent)} disabled={saving}>
              {agent}
            </button>
          ))}
        </div>

        <div className="drawerActions">
          <button className="secondaryButton" onClick={() => onMove(draft.id, draft.status)} disabled={saving}>Move to selected status</button>
          <button className="primaryButton" onClick={() => onSave(draft)} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      </aside>
    </div>
  );
}

function AgentOperationsPanel({ agentOperations }: { agentOperations: AgentOperations }) {
  const buckets = [
    { key: 'active', label: 'Active', items: agentOperations.active },
    { key: 'blocked', label: 'Blocked', items: agentOperations.blocked },
    { key: 'failed', label: 'Failed', items: agentOperations.failed },
    { key: 'recent', label: 'Recent', items: agentOperations.recent },
  ] as const;

  return (
    <section className="operationsPanel">
      <div className="operationsHeader">
        <div>
          <h2>Agent Operations</h2>
          <p>Execution visibility for what is running now, what recently finished, and what needs attention.</p>
        </div>
        <span className="healthTimestamp">Checked {new Date(agentOperations.checkedAt).toLocaleTimeString()}</span>
      </div>

      <div className="operationsSummaryGrid">
        <div className="healthCard"><span>Running now</span><strong>{agentOperations.summary.activeCount}</strong></div>
        <div className="healthCard"><span>Recent sessions</span><strong>{agentOperations.summary.recentCount}</strong></div>
        <div className="healthCard"><span>Blocked</span><strong>{agentOperations.summary.blockedCount}</strong></div>
        <div className="healthCard"><span>Failed</span><strong>{agentOperations.summary.failedCount}</strong></div>
      </div>

      <div className="operationsSignals">
        <div className="signalCard">
          <span>Default model</span>
          <strong>{agentOperations.summary.defaultModel ?? 'Unknown'}</strong>
        </div>
        <div className="signalCard">
          <span>Gateway</span>
          <strong>{agentOperations.summary.gatewayRunning ? 'Running' : 'Unknown'}</strong>
        </div>
        <div className="signalCard">
          <span>Telegram</span>
          <strong>{agentOperations.summary.telegramOk ? 'OK' : 'Unknown'}</strong>
        </div>
      </div>

      {agentOperations.summary.statusSignals.length > 0 && (
        <div className="statusSignalList">
          {agentOperations.summary.statusSignals.map((signal) => (
            <div key={signal} className="statusSignal">{signal}</div>
          ))}
        </div>
      )}

      <div className="operationsBuckets">
        {buckets.map((bucket) => (
          <div key={bucket.key} className="operationsBucket">
            <div className="operationsBucketHeader">
              <h3>{bucket.label}</h3>
              <span>{bucket.items.length}</span>
            </div>
            {bucket.items.length === 0 ? (
              <div className="empty">No {bucket.label.toLowerCase()} agent activity.</div>
            ) : (
              <div className="agentList">
                {bucket.items.map((session) => (
                  <article key={`${bucket.key}-${session.key}`} className="agentCard">
                    <div className="agentCardTop">
                      <div>
                        <div className="agentKey">{session.key}</div>
                        <div className="agentMetaLine">{session.kind} • {session.age}</div>
                      </div>
                      <AgentStatePill state={session.state} />
                    </div>
                    <div className="agentMetaGrid">
                      <div><span>Model</span><strong>{session.model}</strong></div>
                      <div><span>Tokens</span><strong>{session.tokens}</strong></div>
                      <div><span>Story</span><strong>{session.storyId ? `${session.storyId}${session.storyTitle ? ` — ${session.storyTitle}` : ''}` : 'Unlinked'}</strong></div>
                    </div>
                    {(session.blockedReason || session.failedReason) && (
                      <div className="agentIssue">{session.blockedReason || session.failedReason}</div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="operationsFooter">
        <div>
          <strong>Expansion ready:</strong> {agentOperations.expansion.supportsDetailView ? 'yes' : 'no'}
        </div>
        <ul>
          {agentOperations.expansion.nextHooks.map((hook) => <li key={hook}>{hook}</li>)}
        </ul>
      </div>
    </section>
  );
}

function DocumentationHubPanel({ documentationHub }: { documentationHub: DocumentationHub }) {
  return (
    <section className="operationsPanel">
      <div className="operationsHeader">
        <div>
          <h2>Documentation Hub</h2>
          <p>Key docs, runbooks, decisions, and planning references pulled into the same operating surface.</p>
        </div>
        <span className="healthTimestamp">Checked {new Date(documentationHub.checkedAt).toLocaleTimeString()}</span>
      </div>

      <div className="operationsSummaryGrid">
        <div className="healthCard"><span>Total docs</span><strong>{documentationHub.summary.totalDocs}</strong></div>
        <div className="healthCard"><span>Runbooks</span><strong>{documentationHub.summary.runbookCount}</strong></div>
        <div className="healthCard"><span>Architecture</span><strong>{documentationHub.summary.architectureCount}</strong></div>
        <div className="healthCard"><span>Planning + decisions</span><strong>{documentationHub.summary.planningCount + documentationHub.summary.decisionCount}</strong></div>
      </div>

      <div className="operationsBuckets">
        {Object.entries(documentationHub.groups).map(([group, docs]) => (
          <div key={group} className="operationsBucket">
            <div className="operationsBucketHeader">
              <h3>{group}</h3>
              <span>{docs.length}</span>
            </div>
            <div className="agentList">
              {docs.map((doc) => (
                <article key={doc.id} className="agentCard">
                  <div className="agentCardTop">
                    <div>
                      <div className="agentKey">{doc.path}</div>
                      <div className="agentMetaLine">{doc.heading}</div>
                    </div>
                    <span className="agentState idle">{doc.lineCount} lines</span>
                  </div>
                  <div className="docSummary">{doc.summary}</div>
                  <div className="docPreview">{doc.preview || 'Preview not available yet.'}</div>
                  <div className="docTags">
                    {doc.tags.map((tag) => <span key={`${doc.id}-${tag}`} className="statusSignal">{tag}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="operationsFooter">
        <div>
          <strong>Expansion ready:</strong> {documentationHub.expansion.supportsDetailView ? 'yes' : 'no'}
        </div>
        <ul>
          {documentationHub.expansion.nextHooks.map((hook) => <li key={hook}>{hook}</li>)}
        </ul>
      </div>
    </section>
  );
}

function NextActionPanel({ dependencyInsights }: { dependencyInsights: DependencyInsights }) {
  const recommended = dependencyInsights.recommendedNextAction;
  const alternates = dependencyInsights.nextActionCandidates.slice(1, 4);

  return (
    <section className="operationsPanel nextActionPanel">
      <div className="operationsHeader">
        <div>
          <h2>Next Action</h2>
          <p>Best recommended move right now based on status, priority, blockers, and leverage.</p>
        </div>
        <span className="healthTimestamp">Checked {new Date(dependencyInsights.checkedAt).toLocaleTimeString()}</span>
      </div>

      {recommended ? (
        <div className="nextActionHero">
          <div className="nextActionTop">
            <div>
              <div className="agentKey">{recommended.id}</div>
              <h3>{recommended.title}</h3>
            </div>
            <div className="nextActionScore">Score {recommended.score}</div>
          </div>
          <div className="cardBadges">
            <ProjectBadge project={recommended.project} />
            <PriorityPill priority={recommended.priority} />
            <span className="agentState running">{recommended.status}</span>
          </div>
          <div className="nextActionReasons">
            {recommended.reasons.map((reason) => <span key={`${recommended.id}-${reason}`} className="statusSignal">{reason}</span>)}
          </div>
          <div className="nextActionMeta">
            <div><span>Why this one</span><strong>{recommended.reasons.join(' • ')}</strong></div>
            <div><span>Would unblock</span><strong>{recommended.unlocks.length ? recommended.unlocks.join(', ') : 'No downstream stories'}</strong></div>
          </div>
        </div>
      ) : (
        <div className="empty">No actionable story is ready right now.</div>
      )}

      {alternates.length > 0 && (
        <div className="operationsBuckets singleColumnBucket">
          <div className="operationsBucket">
            <div className="operationsBucketHeader">
              <h3>Alternates</h3>
              <span>{alternates.length}</span>
            </div>
            <div className="agentList">
              {alternates.map((story) => (
                <article key={story.id} className="agentCard candidateCard">
                  <div className="agentCardTop">
                    <div>
                      <div className="agentKey">{story.id}</div>
                      <div className="agentMetaLine">{story.title}</div>
                    </div>
                    <span className="agentState recent">score {story.score}</span>
                  </div>
                  <div className="agentMetaGrid">
                    <div><span>Status</span><strong>{story.status}</strong></div>
                    <div><span>Priority</span><strong>{story.priority}</strong></div>
                    <div><span>Reasoning</span><strong>{story.reasons.join(' • ')}</strong></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function DependencyPanel({ dependencyInsights }: { dependencyInsights: DependencyInsights }) {
  const blockedStories = dependencyInsights.stories.filter((story) => story.isBlocked);

  return (
    <section className="operationsPanel">
      <div className="operationsHeader">
        <div>
          <h2>Dependency Radar</h2>
          <p>Shows blocked stories, what is waiting on what, and the best stories to finish first to unlock more work.</p>
        </div>
        <span className="healthTimestamp">Checked {new Date(dependencyInsights.checkedAt).toLocaleTimeString()}</span>
      </div>

      <div className="operationsSummaryGrid">
        <div className="healthCard"><span>Stories with links</span><strong>{dependencyInsights.summary.linkedStoryCount}</strong></div>
        <div className="healthCard"><span>Blocked now</span><strong>{dependencyInsights.summary.blockedCount}</strong></div>
        <div className="healthCard"><span>Unblock-first candidates</span><strong>{dependencyInsights.summary.readyToUnblockCount}</strong></div>
        <div className="healthCard"><span>Dependency view</span><strong>Active</strong></div>
      </div>

      <div className="operationsBuckets dependencyBuckets">
        <div className="operationsBucket">
          <div className="operationsBucketHeader">
            <h3>Blocked Stories</h3>
            <span>{blockedStories.length}</span>
          </div>
          {blockedStories.length === 0 ? (
            <div className="empty">No stories are blocked right now.</div>
          ) : (
            <div className="agentList">
              {blockedStories.map((story) => (
                <article key={story.id} className="agentCard dependencyCard blockedCard">
                  <div className="agentCardTop">
                    <div>
                      <div className="agentKey">{story.id}</div>
                      <div className="agentMetaLine">{story.title}</div>
                    </div>
                    <span className="agentState blocked">blocked</span>
                  </div>
                  <div className="agentMetaGrid">
                    <div><span>Status</span><strong>{story.status}</strong></div>
                    <div><span>Dependencies</span><strong>{story.dependencies.length ? story.dependencies.join(', ') : 'None'}</strong></div>
                    <div><span>Blockers</span><strong>{story.blockers.length ? story.blockers.join(', ') : 'None'}</strong></div>
                    <div><span>Reasons</span><strong>{story.blockingReasons.join(' • ')}</strong></div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="operationsBucket">
          <div className="operationsBucketHeader">
            <h3>Unblock-First Candidates</h3>
            <span>{dependencyInsights.unblockCandidates.length}</span>
          </div>
          {dependencyInsights.unblockCandidates.length === 0 ? (
            <div className="empty">No unblock-first candidates yet.</div>
          ) : (
            <div className="agentList">
              {dependencyInsights.unblockCandidates.map((story) => (
                <article key={story.id} className="agentCard dependencyCard candidateCard">
                  <div className="agentCardTop">
                    <div>
                      <div className="agentKey">{story.id}</div>
                      <div className="agentMetaLine">{story.title}</div>
                    </div>
                    <span className="agentState running">ready</span>
                  </div>
                  <div className="agentMetaGrid">
                    <div><span>Status</span><strong>{story.status}</strong></div>
                    <div><span>Project</span><strong>{story.project}</strong></div>
                    <div><span>Priority</span><strong>{story.priority}</strong></div>
                    <div><span>Would unblock</span><strong>{story.unlocks.length ? story.unlocks.join(', ') : 'No downstream stories'}</strong></div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function LaunchIntentsPanel({ launchIntents }: { launchIntents: LaunchIntent[] }) {
  const pending = launchIntents.filter((intent) => intent.status === 'pending');
  const active = launchIntents.filter((intent) => intent.status === 'running');
  const resolved = launchIntents.filter((intent) => intent.status !== 'pending' && intent.status !== 'running');
  const buckets = [
    { key: 'pending', label: 'Pending', items: pending },
    { key: 'running', label: 'Running', items: active },
    { key: 'resolved', label: 'Resolved', items: resolved },
  ] as const;

  return (
    <section className="operationsPanel">
      <div className="operationsHeader">
        <div>
          <h2>Launch Intents</h2>
          <p>Durable queue for named-agent launches before and after runtime execution is linked back into Mission Control.</p>
        </div>
        <span className="healthTimestamp">{launchIntents.length} total</span>
      </div>

      <div className="operationsSummaryGrid">
        <div className="healthCard"><span>Pending</span><strong>{pending.length}</strong></div>
        <div className="healthCard"><span>Running</span><strong>{active.length}</strong></div>
        <div className="healthCard"><span>Resolved</span><strong>{resolved.length}</strong></div>
        <div className="healthCard"><span>Queue source</span><strong>launch-intents/</strong></div>
      </div>

      <div className="operationsBuckets">
        {buckets.map((bucket) => (
          <div key={bucket.key} className="operationsBucket">
            <div className="operationsBucketHeader">
              <h3>{bucket.label}</h3>
              <span>{bucket.items.length}</span>
            </div>
            {bucket.items.length === 0 ? (
              <div className="empty">No {bucket.label.toLowerCase()} launch intents.</div>
            ) : (
              <div className="agentList">
                {bucket.items.map((intent) => (
                  <article key={intent.id} className="agentCard">
                    <div className="agentCardTop">
                      <div>
                        <div className="agentKey">{intent.id}</div>
                        <div className="agentMetaLine">{intent.storyId} • {intent.agent} • {intent.project}</div>
                      </div>
                      <span className={`agentState ${intent.status === 'running' ? 'running' : intent.status === 'pending' ? 'blocked' : 'recent'}`}>{intent.status}</span>
                    </div>
                    <div className="agentMetaGrid">
                      <div><span>Title</span><strong>{intent.title}</strong></div>
                      <div><span>Mode</span><strong>{intent.executionMode}</strong></div>
                      <div><span>Created</span><strong>{new Date(intent.createdAt).toLocaleString()}</strong></div>
                      <div><span>Linked run</span><strong>{intent.linkedRun || 'Pending'}</strong></div>
                    </div>
                    <div className="docPreview">{intent.summary || intent.prompt}</div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
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
  const [agentOperations, setAgentOperations] = useState<AgentOperations | null>(null);
  const [documentationHub, setDocumentationHub] = useState<DocumentationHub | null>(null);
  const [launchIntents, setLaunchIntents] = useState<LaunchIntent[]>([]);
  const [dependencyInsights, setDependencyInsights] = useState<DependencyInsights | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<string>('All Projects');
  const [groupByProject, setGroupByProject] = useState<boolean>(false);
  const refreshInFlight = useRef(false);

  async function loadBoard(options?: { silent?: boolean }) {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;

    try {
      if (!options?.silent) {
        setLoading(true);
        setHealth('loading');
        setStatusMessage('Loading board…');
      }

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

      const [loadedStories, healthRes, agentOpsRes, docsRes, launchIntentsRes, dependencyRes] = await Promise.all([
        Promise.all(ids.map(async (id: string) => {
          try {
            const storyRes = await fetch(`/api/stories/${id}`, { cache: 'no-store' });
            if (!storyRes.ok) {
              console.warn(`Story request failed for ${id}: ${storyRes.status}`);
              return undefined;
            }
            const storyData = await storyRes.json();
            return storyData.story as StoryDetails | undefined;
          } catch (error) {
            console.warn(`Story request crashed for ${id}`, error);
            return undefined;
          }
        })),
        fetch('/api/health', { cache: 'no-store' }),
        fetch('/api/agent-operations', { cache: 'no-store' }),
        fetch('/api/documentation-hub', { cache: 'no-store' }),
        fetch('/api/launch-intents', { cache: 'no-store' }),
        fetch('/api/dependencies', { cache: 'no-store' }),
      ]);

      const validStories = loadedStories.filter((story): story is StoryDetails => Boolean(story && story.id));
      const mapped = Object.fromEntries(validStories.map((story) => [story.id, story]));
      setStories(mapped);

      const failedStoryCount = ids.length - validStories.length;

      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setSystemHealth(healthData.health as SystemHealth);
      }

      if (agentOpsRes.ok) {
        const agentOpsData = await agentOpsRes.json();
        setAgentOperations(agentOpsData.agentOperations as AgentOperations);
      }

      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocumentationHub(docsData.documentationHub as DocumentationHub);
      }

      if (launchIntentsRes.ok) {
        const launchData = await launchIntentsRes.json();
        setLaunchIntents((launchData.launchIntents ?? []) as LaunchIntent[]);
      }

      if (dependencyRes.ok) {
        const dependencyData = await dependencyRes.json();
        setDependencyInsights(dependencyData.dependencyInsights as DependencyInsights);
      }

      const nowIso = new Date().toISOString();
      setLastUpdatedAt(nowIso);
      setHealth(failedStoryCount > 0 ? 'error' : 'ready');
      setStatusMessage(
        failedStoryCount > 0
          ? `Board loaded with ${failedStoryCount} story fetch issue(s) • ${validStories.length}/${ids.length} stories available`
          : options?.silent
            ? `Board refreshed • ${ids.length} tracked stories`
            : `Board ready • ${ids.length} tracked stories`
      );
    } catch (error) {
      console.error('Failed to load board', error);
      setHealth('error');
      setStatusMessage('Board load failed. Refresh or check API health.');
    } finally {
      refreshInFlight.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard();
  }, []);

  useEffect(() => {
    if (selectedId) return;
    const intervalId = window.setInterval(() => {
      loadBoard({ silent: true });
    }, AUTO_REFRESH_MS);
    return () => window.clearInterval(intervalId);
  }, [selectedId]);

  const selectedStory = useMemo(() => (selectedId ? stories[selectedId] : null), [selectedId, stories]);
  const totalStories = useMemo(() => Object.values(board).flat().filter(isBoardItem).length, [board]);

  const projectOptions = useMemo(() => {
    const set = new Set<string>();
    Object.values(stories).forEach((story) => set.add(story.project || 'Unassigned'));
    return ['All Projects', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [stories]);

  const filteredBoard = useMemo(() => {
    if (activeProject === 'All Projects') return board;
    return Object.fromEntries(
      Object.entries(board).map(([column, items]) => [
        column,
        items.filter((item) => (stories[item.id]?.project || 'Unassigned') === activeProject),
      ]),
    ) as BoardData;
  }, [activeProject, board, stories]);

  const groupedProjects = useMemo(() => {
    const projectNames = activeProject === 'All Projects'
      ? Array.from(new Set(Object.values(stories).map((story) => story.project || 'Unassigned'))).sort((a, b) => a.localeCompare(b))
      : [activeProject];

    return projectNames.map((project) => ({
      project,
      board: Object.fromEntries(
        Object.entries(board).map(([column, items]) => [
          column,
          items.filter((item) => (stories[item.id]?.project || 'Unassigned') === project),
        ]),
      ) as BoardData,
    }));
  }, [activeProject, board, stories]);

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
          agent: story.agent,
          executionMode: story.executionMode,
          linkedSession: story.linkedSession,
          linkedRun: story.linkedRun,
          lastExecutionStatus: story.lastExecutionStatus,
          lastExecutionSummary: story.lastExecutionSummary,
          priority: story.priority,
          project: story.project,
          dependencies: story.dependencies,
          blockers: story.blockers,
          story: story.story,
        }),
      });
      await loadBoard({ silent: true });
      setSelectedId(story.id);
      setStatusMessage(`${story.id} saved and board refreshed`);
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
      await loadBoard({ silent: true });
      setSelectedId(id);
      setDraggingId(null);
      setDropTarget(null);
      setStatusMessage(`${id} moved to ${targetColumn} and board refreshed`);
    } finally {
      setSaving(false);
    }
  }

  async function launchStoryAgent(id: string, agent: string) {
    setSaving(true);
    setHealth('saving');
    setStatusMessage(`Launching ${agent} for ${id}…`);
    try {
      await fetch(`/api/stories/${id}/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent }),
      });
      await loadBoard({ silent: true });
      setSelectedId(id);
      setStatusMessage(`${agent} launched for ${id}`);
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
        <div className="toolbarActions">
          <select className="toolbarSelect" value={activeProject} onChange={(e) => setActiveProject(e.target.value)}>
            {projectOptions.map((project) => <option key={project} value={project}>{project}</option>)}
          </select>
          <button className="ghostButton" onClick={() => setGroupByProject((current) => !current)}>
            {groupByProject ? 'Ungroup projects' : 'Group by project'}
          </button>
          <button className="ghostButton" onClick={() => loadBoard()} disabled={loading || saving}>Refresh board</button>
        </div>
      </div>

      <FreshnessBadge lastUpdatedAt={lastUpdatedAt} autoRefreshPaused={Boolean(selectedId)} />

      {documentationHub && <DocumentationHubPanel documentationHub={documentationHub} />}
      {agentOperations && <AgentOperationsPanel agentOperations={agentOperations} />}
      {dependencyInsights && <NextActionPanel dependencyInsights={dependencyInsights} />}
      {dependencyInsights && <DependencyPanel dependencyInsights={dependencyInsights} />}
      <LaunchIntentsPanel launchIntents={launchIntents} />

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
            <div className="healthCard"><span>Supervision</span><strong>{systemHealth.supervision?.mode ?? 'Unknown'}</strong></div>
          </div>
          <div className="healthMetaRow">
            <div className="healthNote">{systemHealth.updates.available ? `Update available: ${systemHealth.updates.version}` : 'No update signal detected'}</div>
            <div className="healthNote">Telegram: {systemHealth.channels.telegram}</div>
            <div className="healthNote">Target active: {systemHealth.supervision?.targetActive ? 'yes' : 'no'}</div>
            <div className="healthNote">Issues: {systemHealth.issues.length}</div>
          </div>
          {systemHealth.issues.length > 0 && (
            <ul className="healthIssues">
              {systemHealth.issues.map((issue) => <li key={issue}>{issue}</li>)}
            </ul>
          )}
        </section>
      )}

      {groupByProject ? (
        <div className="groupedBoards">
          {groupedProjects.map(({ project, board: projectBoard }) => (
            <section key={project} className="projectGroupSection">
              <div className="projectGroupHeader">
                <h2>{project}</h2>
                <span>{Object.values(projectBoard).flat().length} stories</span>
              </div>
              <div className="board">
                {columns.map((column) => {
                  const items = projectBoard[column] ?? [];
                  return (
                    <div
                      key={`${project}-${column}`}
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
                                className={`card clickableCard ${draggingId === item.id ? 'draggingCard' : ''} ${dependencyInsights?.stories.find((entry) => entry.id === item.id)?.isBlocked ? 'blockedStoryCard' : ''}`}
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
                                <div className="cardBadges">
                                  <ProjectBadge project={story?.project ?? 'Mission Control'} />
                                  {dependencyInsights?.stories.find((entry) => entry.id === item.id)?.isBlocked && <span className="agentState blocked">Blocked</span>}
                                  {dependencyInsights?.stories.find((entry) => entry.id === item.id)?.unlocks?.length ? <span className="agentState running">Unblocks {dependencyInsights.stories.find((entry) => entry.id === item.id)?.unlocks.length}</span> : null}
                                </div>
                                <div className="meta">
                                  <div className="metaRow"><span>Status</span><strong>{story?.status ?? column}</strong></div>
                                  <div className="metaRow"><span>Owner</span><strong>{story?.owner ?? 'Apex'}</strong></div>
                                  <div className="metaRow"><span>Agent</span><strong>{story?.agent ?? 'Apex'}</strong></div>
                                  <div className="metaRow"><span>Execution</span><strong>{story?.executionMode ?? 'manual'} • {story?.lastExecutionStatus ?? 'idle'}</strong></div>
                                  <div className="metaRow"><span>Project</span><strong>{story?.project ?? 'Mission Control'}</strong></div>
                                  <div className="metaRow"><span>Updated</span><strong>{formatTimestamp(story?.updatedAt ?? null)}</strong></div>
                                  <div className="metaRow"><span>Deliverable</span><strong>{story?.deliverable ?? 'Not specified'}</strong></div>
                                  <div className="metaRow"><span>Dependencies</span><strong>{story?.dependencies?.length ? story.dependencies.join(', ') : 'None'}</strong></div>
                                  <div className="metaRow"><span>Blockers</span><strong>{story?.blockers?.length ? story.blockers.join(', ') : 'None'}</strong></div>
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
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="board">
          {columns.map((column) => {
            const items = filteredBoard[column] ?? [];
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
                          className={`card clickableCard ${draggingId === item.id ? 'draggingCard' : ''} ${dependencyInsights?.stories.find((entry) => entry.id === item.id)?.isBlocked ? 'blockedStoryCard' : ''}`}
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
                          <div className="cardBadges">
                            <ProjectBadge project={story?.project ?? 'Mission Control'} />
                            {dependencyInsights?.stories.find((entry) => entry.id === item.id)?.isBlocked && <span className="agentState blocked">Blocked</span>}
                            {dependencyInsights?.stories.find((entry) => entry.id === item.id)?.unlocks?.length ? <span className="agentState running">Unblocks {dependencyInsights.stories.find((entry) => entry.id === item.id)?.unlocks.length}</span> : null}
                          </div>
                          <div className="meta">
                            <div className="metaRow"><span>Status</span><strong>{story?.status ?? column}</strong></div>
                            <div className="metaRow"><span>Owner</span><strong>{story?.owner ?? 'Apex'}</strong></div>
                            <div className="metaRow"><span>Agent</span><strong>{story?.agent ?? 'Apex'}</strong></div>
                            <div className="metaRow"><span>Execution</span><strong>{story?.executionMode ?? 'manual'} • {story?.lastExecutionStatus ?? 'idle'}</strong></div>
                            <div className="metaRow"><span>Project</span><strong>{story?.project ?? 'Mission Control'}</strong></div>
                            <div className="metaRow"><span>Updated</span><strong>{formatTimestamp(story?.updatedAt ?? null)}</strong></div>
                            <div className="metaRow"><span>Deliverable</span><strong>{story?.deliverable ?? 'Not specified'}</strong></div>
                            <div className="metaRow"><span>Dependencies</span><strong>{story?.dependencies?.length ? story.dependencies.join(', ') : 'None'}</strong></div>
                            <div className="metaRow"><span>Blockers</span><strong>{story?.blockers?.length ? story.blockers.join(', ') : 'None'}</strong></div>
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
      )}

      <p className="footerNote">
        {loading ? 'Loading stories…' : health === 'error' ? 'Mission Control hit a load problem.' : 'Click a story to edit it, or drag it between columns.'}
      </p>

      {selectedStory && (
        <StoryEditor
          story={selectedStory}
          dependencyState={dependencyInsights?.stories.find((entry) => entry.id === selectedStory.id)}
          onClose={() => setSelectedId(null)}
          onSave={saveStory}
          onMove={moveStory}
          onLaunch={launchStoryAgent}
          saving={saving}
        />
      )}
    </main>
  );
}
