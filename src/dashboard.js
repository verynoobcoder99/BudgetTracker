// ========================================================================
// DASHBOARD — Main overview page
// ========================================================================

import { fetchTransactions, computeSummary } from './api.js';
import {
  $, $$, createElement, formatCurrency, formatMonthYear,
  getCurrentMonth, getPreviousMonth, getNextMonth, getDaysInMonth,
  CATEGORIES, getCategoryByLabel, animateCounter, getBudgetStatus,
  getPercentage, loadSettings, formatDate,
} from './utils.js';
import {
  createCategoryChart, createPersonChart, createDailyChart, createComparisonChart,
} from './charts.js';

let currentMonth = getCurrentMonth();
let charts = [];

function destroyCharts() {
  charts.forEach(c => c.destroy());
  charts = [];
}

export function renderDashboard(container) {
  destroyCharts();
  currentMonth = getCurrentMonth();

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-row">
        <div>
          <h1>Dashboard</h1>
          <p class="subtitle">Your spending overview at a glance</p>
        </div>
        <div class="month-selector" id="month-selector">
          <button class="month-btn" id="prev-month" aria-label="Previous month">
            <i data-lucide="chevron-left"></i>
          </button>
          <span class="month-label" id="month-label">${formatMonthYear(currentMonth)}</span>
          <button class="month-btn" id="next-month" aria-label="Next month">
            <i data-lucide="chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="stats-grid" id="stats-grid">
      <div class="card" id="stat-total">
        <div class="card-header">
          <span class="card-title">Total Spent</span>
          <div class="card-icon" style="background: rgba(129,140,248,0.15); color: #818cf8;">
            <i data-lucide="trending-up"></i>
          </div>
        </div>
        <div class="stat-value" id="total-spent">$0.00</div>
      </div>
      <div class="card" id="stat-transactions">
        <div class="card-header">
          <span class="card-title">Transactions</span>
          <div class="card-icon" style="background: rgba(96,165,250,0.15); color: #60a5fa;">
            <i data-lucide="receipt"></i>
          </div>
        </div>
        <div class="stat-value" id="total-txns">0</div>
      </div>
      <div class="card" id="stat-person1">
        <div class="card-header">
          <span class="card-title" id="p1-label">Person 1</span>
          <div class="card-icon" style="background: rgba(129,140,248,0.15); color: #818cf8;">
            <i data-lucide="user"></i>
          </div>
        </div>
        <div class="stat-value" id="p1-total">$0.00</div>
      </div>
      <div class="card" id="stat-person2">
        <div class="card-header">
          <span class="card-title" id="p2-label">Person 2</span>
          <div class="card-icon" style="background: rgba(244,114,182,0.15); color: #f472b6;">
            <i data-lucide="user"></i>
          </div>
        </div>
        <div class="stat-value" id="p2-total">$0.00</div>
      </div>
    </div>

    <!-- Budget Progress -->
    <div class="card" style="margin-bottom: var(--space-xl);">
      <div class="card-header">
        <span class="card-title">Budget Overview</span>
      </div>
      <div class="budget-grid" id="budget-grid"></div>
    </div>

    <!-- Charts -->
    <div class="charts-grid" id="charts-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Spending by Category</span>
        </div>
        <div class="chart-container" style="height: 320px;">
          <canvas id="chart-category"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Spending by Person</span>
        </div>
        <div class="chart-container" style="height: 320px;">
          <canvas id="chart-person"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Daily Spending Trend</span>
        </div>
        <div class="chart-container" style="height: 280px;">
          <canvas id="chart-daily"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Month-over-Month</span>
        </div>
        <div class="chart-container" style="height: 280px;">
          <canvas id="chart-comparison"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="card" style="margin-top: var(--space-xl);">
      <div class="card-header">
        <span class="card-title">Recent Transactions</span>
        <a href="#transactions" class="btn-secondary">View All</a>
      </div>
      <div class="recent-transactions" id="recent-transactions"></div>
    </div>
  `;

  // Wire month navigation
  $('#prev-month', container).addEventListener('click', () => {
    currentMonth = getPreviousMonth(currentMonth);
    loadDashboardData(container);
  });

  $('#next-month', container).addEventListener('click', () => {
    currentMonth = getNextMonth(currentMonth);
    loadDashboardData(container);
  });

  loadDashboardData(container);
}

async function loadDashboardData(container) {
  const settings = loadSettings();
  destroyCharts();

  // Update month label
  const monthLabel = $('#month-label', container);
  if (monthLabel) monthLabel.textContent = formatMonthYear(currentMonth);

  // Update person labels
  const p1Label = $('#p1-label', container);
  const p2Label = $('#p2-label', container);
  if (p1Label) p1Label.textContent = settings.person1Name;
  if (p2Label) p2Label.textContent = settings.person2Name;

  try {
    // Fetch current and previous month
    const [transactions, prevTransactions] = await Promise.all([
      fetchTransactions(currentMonth),
      fetchTransactions(getPreviousMonth(currentMonth)),
    ]);

    const summary = computeSummary(transactions, settings);
    const prevSummary = computeSummary(prevTransactions, settings);

    // Update stat cards
    animateCounter($('#total-spent', container), summary.totalSpent);
    $('#total-txns', container).textContent = summary.transactionCount;
    animateCounter($('#p1-total', container), summary.byPerson[settings.person1Name] || 0);
    animateCounter($('#p2-total', container), summary.byPerson[settings.person2Name] || 0);

    // Budget grid
    renderBudgetGrid(container, summary);

    // Charts
    const catCtx = $('#chart-category', container);
    const personCtx = $('#chart-person', container);
    const dailyCtx = $('#chart-daily', container);
    const compCtx = $('#chart-comparison', container);

    if (catCtx) charts.push(createCategoryChart(catCtx, summary.byCategory));
    if (personCtx) charts.push(createPersonChart(personCtx, summary.byPerson));
    if (dailyCtx) charts.push(createDailyChart(dailyCtx, summary.byDay, getDaysInMonth(currentMonth)));
    if (compCtx) charts.push(createComparisonChart(compCtx, summary.byCategory, prevSummary.byCategory));

    // Recent transactions
    renderRecentTransactions(container, transactions, settings);

  } catch (err) {
    console.error('Failed to load dashboard:', err);
  }

  // Re-init icons
  if (window.lucide) window.lucide.createIcons();
}

function renderBudgetGrid(container, summary) {
  const grid = $('#budget-grid', container);
  if (!grid) return;

  grid.innerHTML = '';

  for (const cat of CATEGORIES) {
    const data = summary.byCategory[cat.label];
    if (!data) continue;

    const spent = data.spent;
    const limit = data.limit;
    const pct = getPercentage(spent, limit);
    const status = getBudgetStatus(spent, limit);

    const item = createElement('div', { className: 'card budget-item' });
    item.innerHTML = `
      <div class="budget-item-header">
        <div class="budget-category">
          <span class="budget-dot" style="background: ${cat.color}"></span>
          <span>${cat.icon} ${cat.label}</span>
        </div>
        <div class="budget-amounts">
          <span class="spent">${formatCurrency(spent)}</span> / ${formatCurrency(limit)}
        </div>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill ${status}" style="width: ${pct}%"></div>
      </div>
      <div class="budget-percentage ${status === 'danger' ? 'text-danger' : status === 'caution' ? 'text-warning' : 'text-success'}">
        ${pct.toFixed(0)}%
      </div>
    `;

    grid.appendChild(item);
  }
}

function renderRecentTransactions(container, transactions, settings) {
  const recentEl = $('#recent-transactions', container);
  if (!recentEl) return;

  const recent = [...transactions].reverse().slice(0, 8);

  if (recent.length === 0) {
    recentEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i data-lucide="inbox"></i></div>
        <h3>No transactions yet</h3>
        <p>Start tracking your expenses by adding your first transaction.</p>
      </div>
    `;
    return;
  }

  recentEl.innerHTML = '';

  for (const tx of recent) {
    const cat = getCategoryByLabel(tx.category);
    const isPerson1 = tx.person === settings.person1Name || tx.person === 'Person 1';

    const item = createElement('div', { className: 'recent-tx-item' });
    item.innerHTML = `
      <div class="recent-tx-left">
        <div class="recent-tx-cat-icon" style="background: ${cat.color}20; color: ${cat.color}">
          ${cat.icon}
        </div>
        <div class="recent-tx-details">
          <span class="recent-tx-desc">${tx.description}</span>
          <span class="recent-tx-meta">${formatDate(tx.date)} · <span class="${isPerson1 ? 'text-accent' : ''}" style="${!isPerson1 ? 'color: #f472b6' : ''}">${tx.person}</span></span>
        </div>
      </div>
      <span class="recent-tx-amount">${formatCurrency(tx.amount)}</span>
    `;

    recentEl.appendChild(item);
  }
}
