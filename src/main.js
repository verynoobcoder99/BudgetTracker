// ========================================================================
// MAIN — Application entry point
// ========================================================================

import { Router } from './router.js';
import { renderDashboard } from './dashboard.js';
import { renderExpenseForm } from './expense-form.js';
import { renderTransactions } from './transactions.js';
import { renderSettings } from './settings.js';
import { $, $$, loadSettings } from './utils.js';

// ---------- Initialize App ----------
function init() {
  const router = new Router();
  const mainContent = $('#main-content');

  // Register routes
  router.register('dashboard', renderDashboard);
  router.register('add-expense', renderExpenseForm);
  router.register('transactions', renderTransactions);
  router.register('settings', renderSettings);

  // Nav link clicks
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      router.navigate(page);

      // Close mobile sidebar
      closeMobileSidebar();
    });
  });

  // Mobile sidebar toggle
  const mobileMenuBtn = $('#mobile-menu-btn');
  const sidebar = $('#sidebar');
  const overlay = $('#sidebar-overlay');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileSidebar);
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }

  // Update sync status
  updateSyncStatus();

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Start the router
  router.init(mainContent);
}

function updateSyncStatus() {
  const settings = loadSettings();
  const syncStatus = $('#sync-status');
  const mobileSyncStatus = $('#mobile-sync-status');

  if (settings.apiUrl) {
    if (syncStatus) {
      syncStatus.classList.add('connected');
      syncStatus.classList.remove('disconnected');
      const text = syncStatus.querySelector('.sync-text');
      if (text) text.textContent = 'Connected';
    }
  } else {
    if (syncStatus) {
      syncStatus.classList.remove('connected');
      syncStatus.classList.add('disconnected');
      const text = syncStatus.querySelector('.sync-text');
      if (text) text.textContent = 'Demo Mode';
    }
  }
}

// ---------- Boot ----------
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
