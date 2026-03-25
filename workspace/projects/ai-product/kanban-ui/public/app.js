const boardEl = document.getElementById('board');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('searchInput');
const newCardBtn = document.getElementById('newCardBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');

const storyTitleEl = document.getElementById('storyTitle');
const storyEditorEl = document.getElementById('storyEditor');
const statusSelect = document.getElementById('statusSelect');
const saveStoryBtn = document.getElementById('saveStoryBtn');
const archiveStoryBtn = document.getElementById('archiveStoryBtn');
const activityListEl = document.getElementById('activityList');

let state = null;
let selectedStoryId = null;
let filterText = '';

async function api(url, options = {}) {
  const res = await fetch(url, options);
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = isJson ? data.error || data.message || res.status : `${res.status}`;
    throw new Error(msg);
  }
  return data;
}

async function fetchBoard() {
  return api('/api/board');
}

async function fetchActivity() {
  const data = await api('/api/activity?limit=50');
  return data.entries || [];
}

function storyMatchesFilter(card) {
  if (!filterText) return true;
  const hay = `${card.id} ${card.title}`.toLowerCase();
  return hay.includes(filterText);
}

function populateStatusSelect() {
  statusSelect.innerHTML = '';
  for (const status of state.columnOrder) {
    const opt = document.createElement('option');
    opt.value = status;
    opt.textContent = status;
    statusSelect.appendChild(opt);
  }
}

function findCurrentStatus(storyId) {
  for (const [status, items] of Object.entries(state.columns)) {
    if (items.find(i => i.id === storyId)) return status;
  }
  return '';
}

function renderBoard() {
  boardEl.innerHTML = '';

  for (const columnName of state.columnOrder) {
    const col = document.createElement('div');
    col.className = 'column';

    const items = (state.columns[columnName] || []).filter(storyMatchesFilter);

    const h = document.createElement('h3');
    h.textContent = `${columnName} (${items.length})`;
    col.appendChild(h);

    for (const item of items) {
      const card = document.createElement('div');
      card.className = 'card';
      card.draggable = true;
      card.dataset.storyId = item.id;

      card.innerHTML = `<div class="id">${item.id}</div><div class="title">${item.title}</div>`;

      card.addEventListener('click', () => selectStory(item.id));
      card.addEventListener('dragstart', e => {
        card.classList.add('dragging');
        e.dataTransfer.setData('text/story-id', item.id);
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));

      col.appendChild(card);
    }

    const dropzone = document.createElement('div');
    dropzone.className = 'dropzone';
    dropzone.textContent = 'Drop card here';
    dropzone.addEventListener('dragover', e => e.preventDefault());
    dropzone.addEventListener('drop', async e => {
      e.preventDefault();
      const storyId = e.dataTransfer.getData('text/story-id');
      if (!storyId) return;
      await moveStory(storyId, columnName);
    });

    col.appendChild(dropzone);
    boardEl.appendChild(col);
  }
}

function renderActivity(entries) {
  activityListEl.innerHTML = '';
  if (!entries.length) {
    activityListEl.textContent = 'No activity yet.';
    return;
  }
  for (const line of entries) {
    const row = document.createElement('div');
    row.className = 'entry';
    row.textContent = line;
    activityListEl.appendChild(row);
  }
}

function selectStory(storyId) {
  selectedStoryId = storyId;
  storyTitleEl.textContent = storyId;
  storyEditorEl.value = state.stories[storyId] || '';
  statusSelect.value = findCurrentStatus(storyId);
  saveStoryBtn.disabled = false;
  archiveStoryBtn.disabled = false;
}

async function moveStory(storyId, status) {
  await api(`/api/story/${storyId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  await load();
}

async function saveStory() {
  if (!selectedStoryId) return;
  const content = storyEditorEl.value;
  await api(`/api/story/${selectedStoryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  state.stories[selectedStoryId] = content;
  await refreshActivity();
}

async function archiveStory() {
  if (!selectedStoryId) return;
  if (!confirm(`Archive ${selectedStoryId}?`)) return;
  await api(`/api/story/${selectedStoryId}/archive`, { method: 'POST' });
  selectedStoryId = null;
  storyTitleEl.textContent = 'Select a card';
  storyEditorEl.value = '';
  saveStoryBtn.disabled = true;
  archiveStoryBtn.disabled = true;
  await load();
}

async function createCard() {
  const title = prompt('Card title:');
  if (!title) return;
  const status = prompt(`Initial status (${state.columnOrder.join(', ')}):`, 'Backlog') || 'Backlog';
  await api('/api/story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, status })
  });
  await load();
}

async function exportFile(format) {
  const url = `/api/export?format=${format}`;
  const res = await fetch(url);
  const blob = await res.blob();
  const a = document.createElement('a');
  const href = URL.createObjectURL(blob);
  a.href = href;
  a.download = `kanban-export-${new Date().toISOString().slice(0, 10)}.${format === 'csv' ? 'csv' : 'json'}`;
  a.click();
  URL.revokeObjectURL(href);
}

async function refreshActivity() {
  const entries = await fetchActivity();
  renderActivity(entries);
}

async function load() {
  state = await fetchBoard();
  populateStatusSelect();
  renderBoard();
  await refreshActivity();
  if (selectedStoryId && state.stories[selectedStoryId]) selectStory(selectedStoryId);
}

refreshBtn.addEventListener('click', load);
newCardBtn.addEventListener('click', createCard);
exportJsonBtn.addEventListener('click', () => exportFile('json'));
exportCsvBtn.addEventListener('click', () => exportFile('csv'));
saveStoryBtn.addEventListener('click', saveStory);
archiveStoryBtn.addEventListener('click', archiveStory);
statusSelect.addEventListener('change', async () => {
  if (!selectedStoryId) return;
  await moveStory(selectedStoryId, statusSelect.value);
});
searchInput.addEventListener('input', () => {
  filterText = searchInput.value.trim().toLowerCase();
  renderBoard();
});

load().catch(e => alert(e.message));
