// ========================================================================
// TRANSACTIONS — Full transaction log with filters
// ========================================================================

import { fetchTransactions, deleteTransaction, computeSummary } from './api.js';
import {
  $, $$, createElement, formatCurrency, formatDate, formatMonthYear,
  getCurrentMonth, getPreviousMonth, getNextMonth,
  CATEGORIES, getCategoryByLabel, loadSettings, showToast,
} from './utils.js';

let currentMonth = getCurrentMonth();

export function renderTransactions(container) {
  currentMonth = getCurrentMonth();
  const settings = loadSettings();

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-row">
        <div>
          <h1>Transactions</h1>
          <p class="subtitle">All your expenses in one place</p>
        </div>
        <div class="month-selector">
          <button class="month-btn" id="tx-prev-month" aria-label="Previous month">
            <i data-lucide="chevron-left"></i>
          </button>
          <span class="month-label" id="tx-month-label">${formatMonthYear(currentMonth)}</span>
          <button class="month-btn" id="tx-next-month" aria-label="Next month">
            <i data-lucide="chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-row" id="filters-row">
      <select class="filter-select" id="filter-person">
        <option value="all">All People</option>
        <option value="${settings.person1Name}">${settings.person1Name}</option>
        <option value="${settings.person2Name}">${settings.person2Name}</option>
      </select>
      <select class="filter-select" id="filter-category">
        <option value="all">All Categories</option>
        ${CATEGORIES.map(c => `<option value="${c.label}">${c.icon} ${c.label}</option>`).join('')}
      </select>
      <button class="btn-secondary" id="export-csv">
        <i data-lucide="download" style="width:14px;height:14px;display:inline;vertical-align:middle;margin-right:4px;"></i>
        Export CSV
      </button>
    </div>

    <!-- Table -->
    <div class="card table-container">
      <table class="data-table" id="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Person</th>
            <th>Category</th>
            <th>Description</th>
            <th style="text-align:right;">Amount</th>
            <th style="width:60px;"></th>
          </tr>
        </thead>
        <tbody id="transactions-body">
        </tbody>
      </table>
      <div class="table-footer" id="table-footer">
        <span id="tx-count">0 transactions</span>
        <span class="table-total" id="tx-total">Total: $0.00</span>
      </div>
    </div>
  `;

  // Wire events
  $('#tx-prev-month', container).addEventListener('click', () => {
    currentMonth = getPreviousMonth(currentMonth);
    loadTransactions(container);
  });

  $('#tx-next-month', container).addEventListener('click', () => {
    currentMonth = getNextMonth(currentMonth);
    loadTransactions(container);
  });

  $('#filter-person', container).addEventListener('change', () => applyFilters(container));
  $('#filter-category', container).addEventListener('change', () => applyFilters(container));
  $('#export-csv', container).addEventListener('click', () => exportCSV(container));

  loadTransactions(container);
}

let allTransactions = [];

async function loadTransactions(container) {
  const settings = loadSettings();
  const monthLabel = $('#tx-month-label', container);
  if (monthLabel) monthLabel.textContent = formatMonthYear(currentMonth);

  try {
    allTransactions = await fetchTransactions(currentMonth);
    applyFilters(container);
  } catch (err) {
    showToast('Failed to load transactions', 'error');
  }

  if (window.lucide) window.lucide.createIcons();
}

function applyFilters(container) {
  const settings = loadSettings();
  const personFilter = $('#filter-person', container)?.value || 'all';
  const categoryFilter = $('#filter-category', container)?.value || 'all';

  let filtered = [...allTransactions];

  if (personFilter !== 'all') {
    filtered = filtered.filter(tx => {
      if (personFilter === settings.person1Name) {
        return tx.person === settings.person1Name || tx.person === 'Person 1';
      }
      return tx.person === settings.person2Name || tx.person === 'Person 2';
    });
  }

  if (categoryFilter !== 'all') {
    filtered = filtered.filter(tx => tx.category === categoryFilter);
  }

  renderTable(container, filtered, settings);
}

function renderTable(container, transactions, settings) {
  const tbody = $('#transactions-body', container);
  const txCount = $('#tx-count', container);
  const txTotal = $('#tx-total', container);

  if (!tbody) return;

  if (transactions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: var(--space-2xl);">
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="inbox"></i></div>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or add a new expense.</p>
          </div>
        </td>
      </tr>
    `;
    txCount.textContent = '0 transactions';
    txTotal.textContent = 'Total: $0.00';
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Sort by date descending
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  let total = 0;
  tbody.innerHTML = '';

  // Inline SVG for trash icon (avoids Lucide replacing elements after event binding)
  const trashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;

  for (const tx of sorted) {
    const cat = getCategoryByLabel(tx.category);
    const isPerson1 = tx.person === settings.person1Name || tx.person === 'Person 1';
    const amount = parseFloat(tx.amount) || 0;
    total += amount;

    const row = createElement('tr');
    row.innerHTML = `
      <td>${formatDate(tx.date)}</td>
      <td>
        <span class="person-badge ${isPerson1 ? 'p1' : 'p2'}">
          ${isPerson1 ? settings.person1Name : settings.person2Name}
        </span>
      </td>
      <td>
        <span class="category-badge">
          <span class="budget-dot" style="background:${cat.color};width:8px;height:8px;"></span>
          ${cat.icon} ${tx.category}
        </span>
      </td>
      <td>${tx.description}</td>
      <td style="text-align:right; font-weight:600;">${formatCurrency(amount)}</td>
      <td>
        <button class="btn-danger delete-tx" data-row="${tx.row}" title="Delete">
          ${trashSvg}
        </button>
      </td>
    `;

    tbody.appendChild(row);
  }

  // Use event delegation on tbody for delete clicks (two-click inline confirm)
  let pendingDeleteRow = null;
  let pendingDeleteTimeout = null;

  tbody.onclick = async (e) => {
    const btn = e.target.closest('.delete-tx');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const row = parseInt(btn.dataset.row);
    if (isNaN(row)) return;

    // If this button is already in "confirm" state, perform the delete
    if (pendingDeleteRow === row) {
      clearTimeout(pendingDeleteTimeout);
      pendingDeleteRow = null;

      btn.disabled = true;
      btn.style.opacity = '0.4';
      btn.innerHTML = '...';

      try {
        await deleteTransaction(row, currentMonth);
        showToast('Transaction deleted', 'info');
        await loadTransactions(container);
      } catch (err) {
        showToast('Failed to delete transaction', 'error');
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerHTML = trashSvg;
      }
      return;
    }

    // First click — switch to confirm state
    // Reset any other pending button
    if (pendingDeleteRow !== null) {
      const prevBtn = tbody.querySelector(`.delete-tx[data-row="${pendingDeleteRow}"]`);
      if (prevBtn) {
        prevBtn.innerHTML = trashSvg;
        prevBtn.style.background = '';
      }
      clearTimeout(pendingDeleteTimeout);
    }

    pendingDeleteRow = row;
    btn.innerHTML = '<span style="font-size:11px;font-weight:700;">Sure?</span>';
    btn.style.background = 'var(--danger-bg)';

    // Auto-reset after 3 seconds if user doesn't confirm
    pendingDeleteTimeout = setTimeout(() => {
      pendingDeleteRow = null;
      btn.innerHTML = trashSvg;
      btn.style.background = '';
    }, 3000);
  };

  txCount.textContent = `${sorted.length} transaction${sorted.length !== 1 ? 's' : ''}`;
  txTotal.textContent = `Total: ${formatCurrency(total)}`;
}

function exportCSV(container) {
  const settings = loadSettings();
  const personFilter = $('#filter-person', container)?.value || 'all';
  const categoryFilter = $('#filter-category', container)?.value || 'all';

  let filtered = [...allTransactions];
  if (personFilter !== 'all') {
    filtered = filtered.filter(tx => tx.person === personFilter || (personFilter === settings.person1Name && tx.person === 'Person 1'));
  }
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(tx => tx.category === categoryFilter);
  }

  const headers = ['Date', 'Person', 'Category', 'Description', 'Amount'];
  const rows = filtered.map(tx => [
    tx.date,
    tx.person,
    tx.category,
    `"${tx.description}"`,
    tx.amount,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `budget_${currentMonth}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('CSV exported!', 'success');
}
