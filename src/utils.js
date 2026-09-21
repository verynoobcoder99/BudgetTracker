// ========================================================================
// UTILITIES — Currency formatting, date helpers, DOM helpers, toasts
// ========================================================================

// ---------- Categories ----------
export const CATEGORIES = [
  { id: 'housing',       label: 'Housing',       icon: '🏠', color: '#818cf8' },
  { id: 'groceries',     label: 'Groceries',     icon: '🛒', color: '#34d399' },
  { id: 'dining',        label: 'Dining Out',    icon: '🍽️', color: '#f97316' },
  { id: 'transport',     label: 'Transportation',icon: '🚗', color: '#60a5fa' },
  { id: 'utilities',     label: 'Utilities',     icon: '💡', color: '#a78bfa' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#f472b6' },
  { id: 'shopping',      label: 'Shopping',      icon: '🛍️', color: '#fbbf24' },
  { id: 'health',        label: 'Health',        icon: '🏥', color: '#2dd4bf' },
  { id: 'subscriptions', label: 'Subscriptions', icon: '📱', color: '#c084fc' },
  { id: 'personal',      label: 'Personal Care', icon: '💆', color: '#fb923c' },
  { id: 'savings',       label: 'Savings',       icon: '💰', color: '#4ade80' },
  { id: 'misc',          label: 'Miscellaneous', icon: '📦', color: '#94a3b8' },
];

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export function getCategoryByLabel(label) {
  return CATEGORIES.find(c => c.label.toLowerCase() === label.toLowerCase()) || CATEGORIES[CATEGORIES.length - 1];
}

// ---------- Currency ----------
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ---------- Dates ----------
export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatMonthYear(dateStr) {
  // dateStr = 'YYYY-MM'
  const [year, month] = dateStr.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getPreviousMonth(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const d = new Date(year, month - 2); // month-1 for 0-indexed, -1 for previous
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function getNextMonth(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const d = new Date(year, month); // month-1 for 0-indexed, +1 for next
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getDaysInMonth(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

// ---------- DOM Helpers ----------
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') el.className = val;
    else if (key === 'innerHTML') el.innerHTML = val;
    else if (key === 'textContent') el.textContent = val;
    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
    else el.setAttribute(key, val);
  }
  for (const child of children) {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  }
  return el;
}

// ---------- Toast Notifications ----------
let toastContainer = null;

export function showToast(message, type = 'success', duration = 3000) {
  if (!toastContainer) toastContainer = document.getElementById('toast-container');

  const iconMap = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  };

  const toast = createElement('div', { className: `toast ${type}` });
  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---------- Animated Counter ----------
export function animateCounter(element, target, duration = 800) {
  const start = parseFloat(element.textContent.replace(/[^0-9.-]/g, '')) || 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    element.textContent = formatCurrency(current);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ---------- Percentage helpers ----------
export function getBudgetStatus(spent, limit) {
  if (limit <= 0) return 'safe';
  const pct = (spent / limit) * 100;
  if (pct >= 100) return 'danger';
  if (pct >= 75) return 'caution';
  return 'safe';
}

export function getPercentage(spent, limit) {
  if (limit <= 0) return 0;
  return Math.min((spent / limit) * 100, 100);
}

// ---------- Settings / localStorage ----------
const SETTINGS_KEY = 'budgetduo_settings';

const DEFAULT_SETTINGS = {
  apiUrl: '',
  person1Name: 'Person 1',
  person2Name: 'Person 2',
  budgets: {
    housing: 2000,
    groceries: 600,
    dining: 400,
    transport: 300,
    utilities: 250,
    entertainment: 200,
    shopping: 300,
    health: 200,
    subscriptions: 100,
    personal: 150,
    savings: 500,
    misc: 200,
  },
};

export function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SETTINGS, ...parsed, budgets: { ...DEFAULT_SETTINGS.budgets, ...parsed.budgets } };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}
