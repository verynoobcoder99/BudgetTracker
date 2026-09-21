// ========================================================================
// SETTINGS — API URL, person names, budget limits
// ========================================================================

import {
  $, $$, showToast, CATEGORIES, loadSettings, saveSettings, formatCurrency,
} from './utils.js';

export function renderSettings(container) {
  const settings = loadSettings();

  container.innerHTML = `
    <div class="page-header">
      <h1>Settings</h1>
      <p class="subtitle">Configure your budget tracker</p>
    </div>

    <div class="settings-grid">
      <!-- API Connection -->
      <div class="card settings-section">
        <div class="settings-section-title">
          <i data-lucide="link" style="width:18px;height:18px;color:var(--accent-primary);"></i>
          Google Sheets Connection
        </div>
        <div class="form-group" style="margin-bottom: var(--space-sm);">
          <label class="form-label" for="api-url">Apps Script Web App URL</label>
          <input
            type="url"
            id="api-url"
            class="api-url-input"
            placeholder="https://script.google.com/macros/s/.../exec"
            value="${settings.apiUrl || ''}"
          />
          <p class="settings-note">
            Paste your Google Apps Script web app URL here. Leave blank to use demo mode with sample data.
          </p>
        </div>
        <button class="btn-secondary" id="save-api-url" style="margin-top: var(--space-sm);">
          Save URL
        </button>
        <span id="api-status" style="margin-left: var(--space-md); font-size: 0.85rem;"></span>
      </div>

      <!-- Person Names -->
      <div class="card settings-section">
        <div class="settings-section-title">
          <i data-lucide="users" style="width:18px;height:18px;color:var(--accent-primary);"></i>
          People
        </div>
        <div class="form-group">
          <label class="form-label" for="person1-name">Person 1 Name</label>
          <input
            type="text"
            id="person1-name"
            class="form-input"
            value="${settings.person1Name}"
            placeholder="Person 1"
          />
        </div>
        <div class="form-group" style="margin-bottom: var(--space-sm);">
          <label class="form-label" for="person2-name">Person 2 Name</label>
          <input
            type="text"
            id="person2-name"
            class="form-input"
            value="${settings.person2Name}"
            placeholder="Person 2"
          />
        </div>
        <button class="btn-secondary" id="save-names">Save Names</button>
      </div>

      <!-- Budget Limits -->
      <div class="card settings-section">
        <div class="settings-section-title">
          <i data-lucide="target" style="width:18px;height:18px;color:var(--accent-primary);"></i>
          Monthly Budget Limits
        </div>
        <p class="settings-note" style="margin-bottom: var(--space-md);">
          Set your monthly spending limit for each category. The dashboard will show green/yellow/red progress bars based on these limits.
        </p>
        <div id="budget-limits-list">
          ${CATEGORIES.map(cat => `
            <div class="budget-edit-row">
              <div class="budget-edit-label">
                <span class="budget-dot" style="background:${cat.color}"></span>
                <span>${cat.icon} ${cat.label}</span>
              </div>
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="color:var(--text-muted);font-size:0.9rem;">$</span>
                <input
                  type="number"
                  class="budget-edit-input"
                  data-category="${cat.id}"
                  value="${settings.budgets[cat.id] || 0}"
                  min="0"
                  step="10"
                />
              </div>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:var(--space-md);">
          <span id="total-budget-label" style="font-size:0.85rem;color:var(--text-secondary);">
            Total monthly budget: <strong style="color:var(--text-primary);">${formatCurrency(Object.values(settings.budgets).reduce((a, b) => a + b, 0))}</strong>
          </span>
          <button class="btn-primary" id="save-budgets" style="width:auto;padding:var(--space-sm) var(--space-lg);">
            Save Budgets
          </button>
        </div>
      </div>

      <!-- Instructions -->
      <div class="card settings-section">
        <div class="settings-section-title">
          <i data-lucide="book-open" style="width:18px;height:18px;color:var(--accent-primary);"></i>
          Setup Guide
        </div>
        <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.8;">
          <p><strong style="color:var(--text-primary);">Step 1:</strong> Create a new Google Sheet</p>
          <p><strong style="color:var(--text-primary);">Step 2:</strong> Add a "Transactions" tab with columns: Date | Person | Category | Description | Amount</p>
          <p><strong style="color:var(--text-primary);">Step 3:</strong> Go to Extensions → Apps Script</p>
          <p><strong style="color:var(--text-primary);">Step 4:</strong> Paste the provided Apps Script code</p>
          <p><strong style="color:var(--text-primary);">Step 5:</strong> Deploy → New deployment → Web app → Execute as "Me" → Anyone can access</p>
          <p><strong style="color:var(--text-primary);">Step 6:</strong> Copy the Web App URL and paste it above</p>
          <p><strong style="color:var(--text-primary);">Step 7:</strong> Share the Google Sheet with your partner</p>
          <p style="margin-top:var(--space-md);color:var(--text-muted);">
            Both of you can now add expenses through this dashboard or directly in the Google Sheet!
          </p>
        </div>
      </div>
    </div>
  `;

  // Save API URL
  $('#save-api-url', container).addEventListener('click', () => {
    const url = $('#api-url', container).value.trim();
    const current = loadSettings();
    current.apiUrl = url;
    saveSettings(current);

    const statusEl = $('#api-status', container);
    if (url) {
      statusEl.innerHTML = '<span style="color:var(--success);">✓ Saved — connected to Google Sheets</span>';
    } else {
      statusEl.innerHTML = '<span style="color:var(--warning);">⚠ Demo mode — using sample data</span>';
    }
    showToast(url ? 'Connected to Google Sheets!' : 'Using demo mode', 'success');
  });

  // Save names
  $('#save-names', container).addEventListener('click', () => {
    const current = loadSettings();
    current.person1Name = $('#person1-name', container).value.trim() || 'Person 1';
    current.person2Name = $('#person2-name', container).value.trim() || 'Person 2';
    saveSettings(current);
    showToast('Names updated!', 'success');
  });

  // Update total budget on input change
  const budgetInputs = $$('.budget-edit-input', container);
  budgetInputs.forEach(input => {
    input.addEventListener('input', () => {
      const total = budgetInputs.reduce((sum, inp) => sum + (parseFloat(inp.value) || 0), 0);
      const label = $('#total-budget-label', container);
      if (label) {
        label.innerHTML = `Total monthly budget: <strong style="color:var(--text-primary);">${formatCurrency(total)}</strong>`;
      }
    });
  });

  // Save budgets
  $('#save-budgets', container).addEventListener('click', () => {
    const current = loadSettings();
    budgetInputs.forEach(input => {
      const catId = input.dataset.category;
      current.budgets[catId] = parseFloat(input.value) || 0;
    });
    saveSettings(current);
    showToast('Budget limits saved!', 'success');
  });
}
