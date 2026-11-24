// Python Flask Web App Client JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  fetchSystemStats();
  fetchItems();
  setupItemForm();

  const refreshBtn = document.getElementById('refreshStatsBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', fetchSystemStats);
  }
});

// --- Theme Management ---
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('py_web_theme') || 'dark';

  if (savedTheme === 'light') {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
    themeIcon.textContent = '🌙';
  } else {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
    themeIcon.textContent = '☀️';
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-dark');
    if (isDark) {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      themeIcon.textContent = '🌙';
      localStorage.setItem('py_web_theme', 'light');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      themeIcon.textContent = '☀️';
      localStorage.setItem('py_web_theme', 'dark');
    }
  });
}

// --- Fetch System Diagnostics ---
async function fetchSystemStats() {
  const statusLabel = document.getElementById('serverStatusText');
  if (!statusLabel) return;

  try {
    statusLabel.textContent = 'Querying Python backend...';
    const res = await fetch('/api/system-stats');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    document.getElementById('statPython').textContent = `v${data.python_version}`;
    document.getElementById('statOS').textContent = data.platform.split('-')[0] || 'Windows';
    document.getElementById('statUptime').textContent = data.uptime;
    document.getElementById('statItems').textContent = `${data.total_items} items`;
    statusLabel.textContent = `Python Server Online (${data.timestamp})`;
  } catch (err) {
    console.error('Failed to load system stats:', err);
    statusLabel.textContent = 'Python Server Offline';
  }
}

// --- Fetch & Render Items ---
async function fetchItems() {
  const container = document.getElementById('itemsContainer');
  if (!container) return;

  try {
    const res = await fetch('/api/items');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();

    if (!items.length) {
      container.innerHTML = '<div class="loading-state">No items found. Create your first task above!</div>';
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="task-item ${item.completed ? 'completed' : ''}" id="item-${item.id}">
        <div class="task-left">
          <input type="checkbox" class="task-checkbox" ${item.completed ? 'checked' : ''} onchange="toggleItem(${item.id})">
          <div>
            <div class="task-title">${escapeHtml(item.title)}</div>
            <div class="task-meta">
              <span class="task-badge">${escapeHtml(item.category)}</span>
              <span>Added at ${escapeHtml(item.created_at)}</span>
            </div>
          </div>
        </div>
        <button class="delete-task-btn" title="Delete item" onclick="deleteItem(${item.id})">✕</button>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error fetching items:', err);
    container.innerHTML = '<div class="loading-state">Could not connect to Python API.</div>';
  }
}

// --- Add Item ---
function setupItemForm() {
  const form = document.getElementById('itemForm');
  if (!form) return;

  const titleInput = document.getElementById('itemTitle');
  const catInput = document.getElementById('itemCategory');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const category = catInput.value;

    if (!title) return;

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category })
      });

      if (!res.ok) throw new Error('Failed to create item');

      titleInput.value = '';
      fetchItems();
      fetchSystemStats();
    } catch (err) {
      alert('Error creating item: ' + err.message);
    }
  });
}

// --- Toggle Item Completion ---
async function toggleItem(id) {
  try {
    const res = await fetch(`/api/items/${id}/toggle`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle item');
    fetchItems();
  } catch (err) {
    alert('Error updating item: ' + err.message);
  }
}

// --- Delete Item ---
async function deleteItem(id) {
  try {
    const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete item');
    fetchItems();
    fetchSystemStats();
  } catch (err) {
    alert('Error deleting item: ' + err.message);
  }
}

// Helper: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
