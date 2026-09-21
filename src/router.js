// ========================================================================
// ROUTER — Simple hash-based SPA routing
// ========================================================================

export class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
    this.contentEl = null;
    this.onNavigate = null;

    window.addEventListener('hashchange', () => this._handleRoute());
  }

  init(contentEl) {
    this.contentEl = contentEl;
    this._handleRoute();
  }

  register(name, renderFn) {
    this.routes[name] = renderFn;
  }

  navigate(page) {
    window.location.hash = `#${page}`;
  }

  _handleRoute() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const renderFn = this.routes[hash];

    if (!renderFn) {
      window.location.hash = '#dashboard';
      return;
    }

    this.currentPage = hash;
    this.contentEl.innerHTML = '';
    renderFn(this.contentEl);

    // Reinitialize Lucide icons for the new content
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === hash);
    });

    if (this.onNavigate) this.onNavigate(hash);
  }

  getCurrentPage() {
    return this.currentPage;
  }
}
