// ================================================
// INTELLISTOK — MAIN.JS  (Shared Utilities)
// ================================================

// ── SIDEBAR NAVIGATION ──
const SidebarManager = {
  init() {
    this.setActiveLink();
    this.initMobileToggle();
  },

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPage) {
        item.classList.add('active');
      }
    });
  },

  initMobileToggle() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      });
    }
  }
};

// ── TOAST NOTIFICATIONS ──
const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'success', duration = 3500) {
    const icons = { success: '✓', error: '✕', warning: '⚠' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span style="font-size:16px">${icons[type] || '•'}</span>
      <span style="flex:1">${message}</span>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;padding:0 0 0 8px">×</button>
    `;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg)   { this.show(msg, 'error'); },
  warning(msg) { this.show(msg, 'warning'); }
};

// ── MODAL MANAGER ──
const Modal = {
  open(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  close(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  closeAll() {
    document.querySelectorAll('.modal-overlay').forEach(el => {
      el.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
};

// Close modal when clicking overlay
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    Modal.closeAll();
  }
});

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') Modal.closeAll();
});

// ── ANIMATED COUNTER ──
const AnimCounter = {
  animate(el, target, duration = 1200, prefix = '', suffix = '') {
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);

      el.textContent = prefix + value.toLocaleString() + suffix;

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    };

    requestAnimationFrame(update);
  },

  initAll() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = parseInt(el.dataset.duration) || 1200;

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(el, target, duration, prefix, suffix);
            observer.unobserve(el);
          }
        });
      });

      observer.observe(el);
    });
  }
};

// ── DROPDOWN MANAGER ──
const Dropdown = {
  init() {
    document.querySelectorAll('[data-dropdown-trigger]').forEach(trigger => {
      trigger.addEventListener('click', e => {
        e.stopPropagation();
        const targetId = trigger.dataset.dropdownTrigger;
        const menu = document.getElementById(targetId);
        if (menu) {
          document.querySelectorAll('.dropdown-menu.open').forEach(m => {
            if (m !== menu) m.classList.remove('open');
          });
          menu.classList.toggle('open');
        }
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
    });
  }
};

// ── SEARCH TABLE ──
const TableSearch = {
  init(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);

    if (!input || !table) return;

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      const rows = table.querySelectorAll('tbody tr');

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }
};

// ── CHART DEFAULTS ──
const ChartDefaults = {
  apply() {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.color = '#8899bb';
    Chart.defaults.font.family = "'IBM Plex Mono', monospace";
    Chart.defaults.font.size = 11;

    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 20;
    Chart.defaults.plugins.legend.labels.color = '#8899bb';

    Chart.defaults.plugins.tooltip.backgroundColor = '#162040';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(0,212,170,0.3)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.titleColor = '#e8f0fe';
    Chart.defaults.plugins.tooltip.bodyColor = '#8899bb';
    Chart.defaults.plugins.tooltip.titleFont = { family: "'Syne', sans-serif", size: 13, weight: 'bold' };
  }
};

// ── STAGGER ANIMATION ──
const Stagger = {
  animate(selector, delay = 80) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.animationDelay = `${i * delay}ms`;
      el.style.animationFillMode = 'both';
    });
  }
};

// ── FORMAT HELPERS ──
const Format = {
  currency(value, symbol = '₹') {
    if (value >= 10000000) return symbol + (value / 10000000).toFixed(1) + 'Cr';
    if (value >= 100000)   return symbol + (value / 100000).toFixed(1) + 'L';
    if (value >= 1000)     return symbol + (value / 1000).toFixed(1) + 'K';
    return symbol + value.toLocaleString();
  },

  number(val) {
    return val.toLocaleString();
  },

  date(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  relativeTime(dateStr) {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60)    return 'just now';
    if (diff < 3600)  return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }
};

const Api = {
  request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    return fetch(path, { ...options, headers })
      .then(async res => {
        const content = await res.text();
        if (!res.ok) throw new Error(content || res.statusText);
        return content ? JSON.parse(content) : {};
      });
  },

  get(path) {
    return this.request(path);
  },

  post(path, data) {
    return this.request(path, { method: 'POST', body: JSON.stringify(data) });
  },

  put(path, data) {
    return this.request(path, { method: 'PUT', body: JSON.stringify(data) });
  },

  patch(path, data) {
    return this.request(path, { method: 'PATCH', body: JSON.stringify(data) });
  },

  del(path) {
    return this.request(path, { method: 'DELETE' });
  }
};

// ── LOCAL STORAGE HELPER ──
const Store = {
  get(key, defaultVal = null) {
    try {
      const val = localStorage.getItem('intellistok_' + key);
      return val ? JSON.parse(val) : defaultVal;
    } catch { return defaultVal; }
  },

  set(key, value) {
    try {
      localStorage.setItem('intellistok_' + key, JSON.stringify(value));
    } catch {}
  },

  remove(key) {
    localStorage.removeItem('intellistok_' + key);
  }
};

// ── NOTIFICATION SYSTEM ──
const Notifications = {
  data: [
    { id: 1, type: 'warning', message: 'Stock alert: Wireless Headphones below reorder level', time: '5m ago', read: false },
    { id: 2, type: 'success', message: 'Purchase Order #PO-2847 has been delivered', time: '1h ago', read: false },
    { id: 3, type: 'error', message: 'Supplier TechCore has 3 overdue invoices', time: '3h ago', read: false },
    { id: 4, type: 'info', message: 'Monthly inventory report is ready for review', time: '1d ago', read: true }
  ],

  getUnread() { return this.data.filter(n => !n.read); },

  renderDropdown(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div style="padding:12px 16px;border-bottom:1px solid var(--border-muted);display:flex;align-items:center;justify-content:space-between">
        <span style="font-family:var(--font-display);font-weight:700;font-size:15px">Notifications</span>
        <span style="font-family:var(--font-mono);font-size:10px;color:var(--accent)">${this.getUnread().length} unread</span>
      </div>
      ${this.data.map(n => `
        <div class="dropdown-item" style="${!n.read ? 'border-left:2px solid var(--accent);' : ''}">
          <div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:14px;margin-top:1px">${n.type === 'warning' ? '⚠️' : n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : 'ℹ️'}</span>
            <div style="flex:1">
              <div style="font-size:12px;color:var(--text-secondary);margin-bottom:3px">${n.message}</div>
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted)">${n.time}</div>
            </div>
            ${!n.read ? '<div style="width:7px;height:7px;background:var(--accent);border-radius:50%;flex-shrink:0;margin-top:4px"></div>' : ''}
          </div>
        </div>
      `).join('')}
      <div style="padding:10px;text-align:center">
        <button class="btn btn-secondary btn-sm" style="width:100%;justify-content:center" onclick="Notifications.markAllRead()">Mark all as read</button>
      </div>
    `;
  },

  markAllRead() {
    this.data.forEach(n => n.read = true);
    document.querySelectorAll('.notif-dot').forEach(d => d.style.display = 'none');
    Toast.success('All notifications marked as read');
    this.renderDropdown('notif-dropdown');
  }
};

// ── INIT ON DOM READY ──
document.addEventListener('DOMContentLoaded', () => {
  SidebarManager.init();
  Toast.init();
  Dropdown.init();
  AnimCounter.initAll();
  ChartDefaults.apply();
  Stagger.animate('.stat-card', 80);

  // Render notifications dropdown if it exists
  Notifications.renderDropdown('notif-dropdown');

  // Topbar search (global)
  const globalSearch = document.getElementById('global-search');
  if (globalSearch) {
    globalSearch.addEventListener('keydown', e => {
      if (e.key === 'Enter' && globalSearch.value.trim()) {
        Toast.show('Searching for: ' + globalSearch.value.trim(), 'success');
      }
    });
  }
});
