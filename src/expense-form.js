// ========================================================================
// EXPENSE FORM — Quick entry for new expenses
// ========================================================================

import { addTransaction } from './api.js';
import {
  $, createElement, showToast, CATEGORIES,
  loadSettings, getTodayStr, formatCurrency,
} from './utils.js';

export function renderExpenseForm(container) {
  const settings = loadSettings();

  container.innerHTML = `
    <div class="page-header">
      <h1>Add Expense</h1>
      <p class="subtitle">Quickly log a new transaction</p>
    </div>

    <div class="form-container">
      <div class="card form-card">
        <form id="expense-form" autocomplete="off">
          <!-- Amount (first for prominence) -->
          <div class="form-group">
            <label class="form-label" for="expense-amount">Amount</label>
            <div class="amount-wrapper">
              <span class="currency-symbol">$</span>
              <input
                type="number"
                id="expense-amount"
                class="form-input"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
                inputmode="decimal"
              />
            </div>
          </div>

          <!-- Person Toggle -->
          <div class="form-group">
            <label class="form-label">Who spent it?</label>
            <div class="person-toggle" id="person-toggle">
              <button type="button" class="person-btn person-1 active" data-person="${settings.person1Name}">
                ${settings.person1Name}
              </button>
              <button type="button" class="person-btn person-2" data-person="${settings.person2Name}">
                ${settings.person2Name}
              </button>
            </div>
          </div>

          <!-- Category -->
          <div class="form-group">
            <label class="form-label" for="expense-category">Category</label>
            <select id="expense-category" class="form-select" required>
              <option value="" disabled selected>Select a category</option>
              ${CATEGORIES.map(c => `<option value="${c.label}">${c.icon} ${c.label}</option>`).join('')}
            </select>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label" for="expense-description">Description</label>
            <input
              type="text"
              id="expense-description"
              class="form-input"
              placeholder="What was this for?"
              required
            />
          </div>

          <!-- Date -->
          <div class="form-group">
            <label class="form-label" for="expense-date">Date</label>
            <input
              type="date"
              id="expense-date"
              class="form-input"
              value="${getTodayStr()}"
              required
            />
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-primary" id="submit-expense">
            Add Expense
          </button>
        </form>

        <!-- Success state (hidden) -->
        <div id="success-state" style="display: none; text-align: center; padding: var(--space-xl) 0;">
          <div class="success-check">
            <i data-lucide="check"></i>
          </div>
          <h3 style="margin-bottom: var(--space-xs);">Expense Added!</h3>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);" id="success-message"></p>
          <button class="btn-primary" id="add-another" style="max-width: 200px; margin: 0 auto;">
            Add Another
          </button>
        </div>
      </div>
    </div>
  `;

  // Person toggle logic
  const personToggle = $('#person-toggle', container);
  let selectedPerson = settings.person1Name;

  personToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.person-btn');
    if (!btn) return;

    personToggle.querySelectorAll('.person-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedPerson = btn.dataset.person;
  });

  // Form submission
  const form = $('#expense-form', container);
  const successState = $('#success-state', container);
  const submitBtn = $('#submit-expense', container);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = parseFloat($('#expense-amount', container).value);
    const category = $('#expense-category', container).value;
    const description = $('#expense-description', container).value.trim();
    const date = $('#expense-date', container).value;

    if (!amount || !category || !description || !date) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
      await addTransaction({
        date,
        person: selectedPerson,
        category,
        description,
        amount,
      });

      // Show success state
      form.style.display = 'none';
      successState.style.display = 'block';
      $('#success-message', container).textContent =
        `${formatCurrency(amount)} for "${description}" added under ${category}`;

      showToast('Expense added successfully!', 'success');

      // Reinit icons for the checkmark
      if (window.lucide) window.lucide.createIcons();

    } catch (err) {
      showToast('Failed to add expense. Please try again.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add Expense';
    }
  });

  // Add another button
  container.addEventListener('click', (e) => {
    if (e.target.id === 'add-another' || e.target.closest('#add-another')) {
      form.style.display = 'block';
      successState.style.display = 'none';
      form.reset();
      $('#expense-date', container).value = getTodayStr();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add Expense';

      // Reset person toggle
      personToggle.querySelectorAll('.person-btn').forEach(b => b.classList.remove('active'));
      personToggle.querySelector('.person-1').classList.add('active');
      selectedPerson = settings.person1Name;

      // Focus amount
      setTimeout(() => $('#expense-amount', container).focus(), 100);
    }
  });
}
