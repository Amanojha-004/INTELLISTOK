
let suppliersData = [];
let filteredSuppliers = [];

async function loadSuppliers() {
  try {
    suppliersData = await Api.get('/api/suppliers');
    filteredSuppliers = [...suppliersData];
    renderSuppliers();
    updateSupplierStats();
  } catch (err) {
    Toast.error('Unable to load suppliers from backend');
    console.error(err);
  }
}

function updateSupplierStats() {
  const total = suppliersData.length;
  const active = suppliersData.filter(s => s.status === 'Active').length;
  const spend = suppliersData.reduce((sum, s) => sum + s.spend, 0);
  const avgRating = total ? (suppliersData.reduce((sum, s) => sum + s.rating, 0) / total).toFixed(1) : '0.0';

  document.getElementById('stat-total-sups')?.textContent = total;
  document.getElementById('stat-active-sups')?.textContent = active;
  document.getElementById('stat-total-spend')?.textContent = Format.currency(spend);
  document.querySelector('#suppliers-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function statusBadge(status) {
  const map = { 'Active': 'badge-teal', 'Inactive': 'badge-red', 'Pending': 'badge-amber' };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function renderSuppliers() {
  const grid = document.getElementById('suppliers-grid');
  if (!grid) return;

  if (filteredSuppliers.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🏭</div>
        <div class="empty-title">No suppliers found</div>
        <div class="empty-desc">Try adjusting your search</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredSuppliers.map(s => `
    <div class="supplier-card ${s.color}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
        <div class="supplier-logo" style="background:var(--${s.color === 'teal' ? 'accent' : s.color}-dim);color:var(--${s.color === 'teal' ? 'accent' : s.color})">
          ${s.initials}
        </div>
        ${statusBadge(s.status)}
      </div>
      <div class="supplier-name">${s.name}</div>
      <div class="supplier-category">${s.category} · ${s.city}</div>
      <div class="supplier-meta">
        <div class="supplier-meta-row">
          <span>👤</span> <span>${s.contact}</span>
        </div>
        <div class="supplier-meta-row">
          <span>✉️</span> <span style="font-size:11px">${s.email}</span>
        </div>
        <div class="supplier-meta-row">
          <span>📞</span> <span>${s.phone}</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
        <div style="background:var(--bg-deep);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--font-mono);font-size:16px;font-weight:700;color:var(--text-primary)">${s.orders}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:2px">Orders</div>
        </div>
        <div style="background:var(--bg-deep);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:var(--accent)">${Format.currency(s.spend)}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:2px">Total Spend</div>
        </div>
        <div style="background:var(--bg-deep);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--font-mono);font-size:16px;font-weight:700;color:${s.onTime >= 90 ? 'var(--accent)' : s.onTime >= 80 ? 'var(--amber)' : 'var(--red)'}">${s.onTime}%</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:2px">On-Time</div>
        </div>
      </div>
      <div class="supplier-footer">
        <div>
          <div style="color:var(--amber);font-size:14px;letter-spacing:1px">${renderStars(s.rating)}</div>
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);margin-top:2px">${s.rating} / 5.0</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" onclick="viewSupplier('${s.id}')">View</button>
          <button class="btn btn-primary btn-sm" onclick="contactSupplier('${s.id}')">Contact</button>
        </div>
      </div>
    </div>
  `).join('');
}

function applySupplierFilters() {
  const query    = document.getElementById('sup-search')?.value.toLowerCase() || '';
  const category = document.getElementById('sup-category')?.value || '';
  const status   = document.getElementById('sup-status')?.value || '';
  const sort     = document.getElementById('sup-sort')?.value || '';

  filteredSuppliers = suppliersData.filter(s => {
    const matchQ = !query || s.name.toLowerCase().includes(query) || s.contact.toLowerCase().includes(query) || s.city.toLowerCase().includes(query);
    const matchC = !category || s.category === category;
    const matchS = !status || s.status === status;
    return matchQ && matchC && matchS;
  });

  if (sort === 'rating')   filteredSuppliers.sort((a,b) => b.rating - a.rating);
  if (sort === 'spend')    filteredSuppliers.sort((a,b) => b.spend - a.spend);
  if (sort === 'orders')   filteredSuppliers.sort((a,b) => b.orders - a.orders);
  if (sort === 'name')     filteredSuppliers.sort((a,b) => a.name.localeCompare(b.name));
  if (sort === 'ontime')   filteredSuppliers.sort((a,b) => b.onTime - a.onTime);

  renderSuppliers();
}

function viewSupplier(id) {
  const s = suppliersData.find(x => x.id === id);
  if (!s) return;

  document.getElementById('sup-modal-name').textContent    = s.name;
  document.getElementById('sup-modal-id').textContent      = s.id;
  document.getElementById('sup-modal-cat').textContent     = s.category;
  document.getElementById('sup-modal-city').textContent    = s.city;
  document.getElementById('sup-modal-contact').textContent = s.contact;
  document.getElementById('sup-modal-email').textContent   = s.email;
  document.getElementById('sup-modal-phone').textContent   = s.phone;
  document.getElementById('sup-modal-rating').textContent  = s.rating + ' / 5.0 — ' + renderStars(s.rating);
  document.getElementById('sup-modal-orders').textContent  = s.orders;
  document.getElementById('sup-modal-spend').textContent   = '₹' + s.spend.toLocaleString();
  document.getElementById('sup-modal-ontime').textContent  = s.onTime + '%';
  document.getElementById('sup-modal-status').innerHTML    = statusBadge(s.status);

  Modal.open('view-supplier-modal');
}

function contactSupplier(id) {
  const s = suppliersData.find(x => x.id === id);
  if (!s) return;
  Toast.success(`Opening contact form for ${s.name}`);
  setTimeout(() => Toast.show(`Email drafted to: ${s.email}`, 'success'), 800);
}

function openAddSupplierModal() {
  document.getElementById('add-sup-form')?.reset();
  Modal.open('add-supplier-modal');
}

function addSupplier() {
  const name     = document.getElementById('new-sup-name').value.trim();
  const category = document.getElementById('new-sup-category').value;
  const contact  = document.getElementById('new-sup-contact').value.trim();
  const email    = document.getElementById('new-sup-email').value.trim();
  const phone    = document.getElementById('new-sup-phone').value.trim();
  const city     = document.getElementById('new-sup-city').value.trim();

  if (!name || !category || !contact || !email) {
    Toast.error('Please fill in all required fields');
    return;
  }

  const payload = { name, category, contact, email, phone, city };

  Api.post('/api/suppliers', payload)
    .then(() => {
      Toast.success(`Supplier "${name}" added successfully`);
      Modal.close('add-supplier-modal');
      loadSuppliers();
    })
    .catch(err => {
      Toast.error('Failed to add supplier');
      console.error(err);
    });
}

// Update summary stats
function updateSupplierStats() {
  const activeEl = document.getElementById('stat-active-sups');
  const totalEl  = document.getElementById('stat-total-sups');
  const spendEl  = document.getElementById('stat-total-spend');

  if (activeEl) activeEl.textContent = suppliersData.filter(s => s.status === 'Active').length;
  if (totalEl)  totalEl.textContent  = suppliersData.length;
  if (spendEl)  spendEl.textContent  = Format.currency(suppliersData.reduce((s,x) => s + x.spend, 0));
}

document.addEventListener('DOMContentLoaded', () => {
  loadSuppliers();

  ['sup-search','sup-category','sup-status','sup-sort'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', applySupplierFilters);
    document.getElementById(id)?.addEventListener('change', applySupplierFilters);
  });

  document.getElementById('btn-add-supplier')?.addEventListener('click', openAddSupplierModal);
  document.getElementById('btn-save-supplier')?.addEventListener('click', addSupplier);

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => Modal.closeAll());
  });
});

// ================================================
// INTELLISTOK — SETTINGS.JS
// ================================================

function initSettings() {
  // Panel switching
  document.querySelectorAll('.settings-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const panel = document.getElementById('panel-' + item.dataset.panel);
      if (panel) panel.classList.add('active');
    });
  });

  // Save settings
  document.getElementById('btn-save-settings')?.addEventListener('click', () => {
    Toast.success('Settings saved successfully');
  });

  // Reset settings
  document.getElementById('btn-reset-settings')?.addEventListener('click', () => {
    if (confirm('Reset all settings to defaults?')) {
      Toast.warning('Settings reset to defaults');
    }
  });

  // Theme toggle
  document.getElementById('theme-select')?.addEventListener('change', function() {
    Toast.success('Theme changed to: ' + this.options[this.selectedIndex].text);
  });

  // Password change
  document.getElementById('btn-change-password')?.addEventListener('click', () => {
    const curr = document.getElementById('current-password')?.value;
    const newP = document.getElementById('new-password')?.value;
    const conf = document.getElementById('confirm-password')?.value;

    if (!curr || !newP || !conf) { Toast.error('Please fill in all password fields'); return; }
    if (newP !== conf) { Toast.error('New passwords do not match'); return; }
    if (newP.length < 8) { Toast.error('Password must be at least 8 characters'); return; }

    Toast.success('Password updated successfully');
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
  });

  // Notification toggles
  document.querySelectorAll('.toggle input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const label = this.closest('.settings-row')?.querySelector('.settings-row-label')?.textContent;
      Toast.show(`${label}: ${this.checked ? 'Enabled' : 'Disabled'}`, 'success', 2000);
    });
  });

  // Export data
  document.getElementById('btn-export-data')?.addEventListener('click', () => {
    Toast.success('Preparing full data export...');
    setTimeout(() => Toast.success('Export ready! Downloading...'), 2000);
  });

  // Backup
  document.getElementById('btn-backup')?.addEventListener('click', () => {
    Toast.success('Creating system backup...');
    setTimeout(() => Toast.success('Backup completed successfully'), 2500);
  });
}

if (document.getElementById('settings-page')) {
  document.addEventListener('DOMContentLoaded', initSettings);
}
