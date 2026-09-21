// ========================================================================
// TRANSACTIONS — Full transaction log with filters
// ========================================================================

import { fetchTransactions, deleteTransaction, editTransaction, computeSummary } from './api.js';
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
            <th style="width:90px;"></th>
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

    <!-- Edit Modal Overlay -->
    <div class="edit-modal-overlay" id="edit-modal-overlay" style="display:none;">
      <div class="edit-modal">
        <div class="edit-modal-header">
          <h3>Edit Transaction</h3>
          <button class="edit-modal-close" id="edit-modal-close" title="Close">✕</button>
        </div>
        <form id="edit-form" autocomplete="off">
          <input type="hidden" id="edit-row" />

          <div class="form-group">
            <label class="form-label" for="edit-amount">Amount</label>
            <div class="amount-wrapper">
              <span class="currency-symbol">$</span>
              <input type="number" id="edit-amount" class="form-input" step="0.01" min="0.01" required inputmode="decimal" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Who spent it?</label>
            <div class="person-toggle" id="edit-person-toggle">
              <button type="button" class="person-btn person-1" data-person="${settings.person1Name}">
                ${settings.person1Name}
              </button>
              <button type="button" class="person-btn person-2" data-person="${settings.person2Name}">
                ${settings.person2Name}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-category">Category</label>
            <select id="edit-category" class="form-select" required>
              ${CATEGORIES.map(c => `<option value="${c.label}">${c.icon} ${c.label}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-description">Description</label>
            <input type="text" id="edit-description" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-date">Date</label>
            <input type="date" id="edit-date" class="form-input" required />
          </div>

          <div class="edit-modal-actions">
            <button type="button" class="btn-secondary" id="edit-cancel">Cancel</button>
            <button type="submit" class="btn-primary" id="edit-save">Save Changes</button>
          </div>
        </form>
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

  // Edit modal events
  wireEditModal(container);

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

  // Inline SVGs for icons (avoids Lucide replacing elements after event binding)
  const trashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
  const editSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>`;

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
        <div class="tx-actions">
          <button class="btn-icon edit-tx" data-row="${tx.row}" data-date="${tx.date}" data-person="${tx.person}" data-category="${tx.category}" data-description="${tx.description}" data-amount="${amount}" title="Edit">
            ${editSvg}
          </button>
          <button class="btn-danger delete-tx" data-row="${tx.row}" title="Delete">
            ${trashSvg}
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  }

  // Use event delegation on tbody for delete clicks (two-click inline confirm)
  let pendingDeleteRow = null;
  let pendingDeleteTimeout = null;

  tbody.onclick = async (e) => {
    // Handle edit button click
    const editBtn = e.target.closest('.edit-tx');
    if (editBtn) {
      e.preventDefault();
      e.stopPropagation();
      openEditModal(container, editBtn.dataset);
      return;
    }

    // Handle delete button click
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

// ---------- Edit Modal Logic ----------

let editSelectedPerson = '';

function openEditModal(container, data) {
  const overlay = $('#edit-modal-overlay', container);
  if (!overlay) return;

  const settings = loadSettings();

  // Populate fields
  $('#edit-row', container).value = data.row;
  $('#edit-amount', container).value = data.amount;
  $('#edit-category', container).value = data.category;
  $('#edit-description', container).value = data.description;
  $('#edit-date', container).value = data.date;

  // Set person toggle
  editSelectedPerson = data.person;
  const personBtns = $$('.person-btn', $('#edit-person-toggle', container));
  personBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.person === data.person ||
        (data.person === 'Person 1' && btn.dataset.person === settings.person1Name) ||
        (data.person === 'Person 2' && btn.dataset.person === settings.person2Name)) {
      btn.classList.add('active');
      editSelectedPerson = btn.dataset.person;
    }
  });

  overlay.style.display = 'flex';
  // Animate in
  requestAnimationFrame(() => overlay.classList.add('active'));
  setTimeout(() => $('#edit-amount', container).focus(), 150);
}

function closeEditModal(container) {
  const overlay = $('#edit-modal-overlay', container);
  if (!overlay) return;
  overlay.classList.remove('active');
  setTimeout(() => { overlay.style.display = 'none'; }, 200);
}

function wireEditModal(container) {
  const settings = loadSettings();

  // Close modal
  $('#edit-modal-close', container).addEventListener('click', () => closeEditModal(container));
  $('#edit-cancel', container).addEventListener('click', () => closeEditModal(container));

  // Close on overlay click
  $('#edit-modal-overlay', container).addEventListener('click', (e) => {
    if (e.target.id === 'edit-modal-overlay') closeEditModal(container);
  });

  // Person toggle in edit modal
  const editPersonToggle = $('#edit-person-toggle', container);
  editPersonToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.person-btn');
    if (!btn) return;
    editPersonToggle.querySelectorAll('.person-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    editSelectedPerson = btn.dataset.person;
  });

  // Save edits
  $('#edit-form', container).addEventListener('submit', async (e) => {
    e.preventDefault();

    const row = parseInt($('#edit-row', container).value);
    const amount = parseFloat($('#edit-amount', container).value);
    const category = $('#edit-category', container).value;
    const description = $('#edit-description', container).value.trim();
    const date = $('#edit-date', container).value;

    if (!amount || !category || !description || !date) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const saveBtn = $('#edit-save', container);
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      await editTransaction({
        row,
        date,
        person: editSelectedPerson,
        category,
        description,
        amount,
      });
      showToast('Transaction updated!', 'success');
      closeEditModal(container);
      await loadTransactions(container);
    } catch (err) {
      showToast('Failed to update transaction', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Changes';
    }
  });
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
