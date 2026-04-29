
let inventoryData = [];
let filteredData = [];

async function loadInventory() {
  try {
    inventoryData = await Api.get('/api/inventory');
    filteredData = [...inventoryData];
    applyFilters();
    updateSummaryStats();
  } catch (err) {
    Toast.error('Unable to load inventory from backend');
    console.error(err);
  }
}
let editingId = null;
let currentPage = 1;
const pageSize = 8;

// ── STATUS BADGE ──
function statusBadge(status) {
  const map = {
    'In Stock':     'badge-teal',
    'Low Stock':    'badge-amber',
    'Out of Stock': 'badge-red'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

// ── STOCK LEVEL INDICATOR ──
function stockLevel(qty, reorder) {
  if (qty === 0) return '<span style="color:var(--red);font-weight:700">0</span>';
  if (qty < reorder) return `<span style="color:var(--amber);font-weight:700">${qty}</span>`;
  return `<span style="color:var(--accent)">${qty}</span>`;
}

// ── RENDER TABLE ──
function renderTable() {
  const tbody = document.getElementById('inventory-tbody');
  if (!tbody) return;

  const start = (currentPage - 1) * pageSize;
  const page  = filteredData.slice(start, start + pageSize);

  if (page.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="10" style="text-align:center;padding:60px 20px">
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <div class="empty-title">No items found</div>
          <div class="empty-desc">Try adjusting your search or filters</div>
        </div>
      </td></tr>
    `;
    updatePagination();
    return;
  }

  tbody.innerHTML = page.map(item => `
    <tr data-id="${item.id}">
      <td><input type="checkbox" data-check="${item.id}" style="accent-color:var(--accent);cursor:pointer"></td>
      <td class="td-mono" style="color:var(--accent);font-size:11px">${item.id}</td>
      <td>
        <div class="td-primary">${item.name}</div>
        <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);margin-top:2px">${item.sku}</div>
      </td>
      <td><span class="badge badge-blue" style="font-size:9px">${item.category}</span></td>
      <td class="td-mono">${stockLevel(item.quantity, item.reorder)} / ${item.reorder}</td>
      <td style="color:var(--text-muted);font-size:12px">${item.unit}</td>
      <td class="td-mono">₹${item.cost.toLocaleString()}</td>
      <td class="td-mono" style="color:var(--accent)">₹${item.price.toLocaleString()}</td>
      <td>${statusBadge(item.status)}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm btn-icon" onclick="openEditModal('${item.id}')" title="Edit">✏️</button>
          <button class="btn btn-secondary btn-sm btn-icon" onclick="openStockModal('${item.id}')" title="Adjust Stock">📦</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteItem('${item.id}')" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Checkbox all
  document.getElementById('check-all')?.addEventListener('change', function() {
    document.querySelectorAll('[data-check]').forEach(cb => cb.checked = this.checked);
  });

  updatePagination();
}

// ── PAGINATION ──
function updatePagination() {
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const info = document.getElementById('pagination-info');
  const controls = document.getElementById('pagination-controls');

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, filteredData.length);

  if (info) {
    info.textContent = filteredData.length === 0
      ? 'No items'
      : `Showing ${start}–${end} of ${filteredData.length} items`;
  }

  if (controls) {
    controls.innerHTML = `
      <button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>
      ${Array.from({length: totalPages}, (_, i) => `
        <button class="page-btn ${i + 1 === currentPage ? 'active' : ''}" onclick="changePage(${i+1})">${i+1}</button>
      `).join('')}
      <button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>›</button>
    `;
  }
}

function changePage(page) {
  const totalPages = Math.ceil(filteredData.length / pageSize);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable();
}

// ── SEARCH & FILTER ──
function applyFilters() {
  const query    = document.getElementById('inv-search')?.value.toLowerCase() || '';
  const category = document.getElementById('inv-category')?.value || '';
  const status   = document.getElementById('inv-status')?.value || '';
  const sort     = document.getElementById('inv-sort')?.value || '';

  filteredData = inventoryData.filter(item => {
    const matchQ = !query || item.name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
    const matchC = !category || item.category === category;
    const matchS = !status || item.status === status;
    return matchQ && matchC && matchS;
  });

  if (sort === 'qty-asc')     filteredData.sort((a,b) => a.quantity - b.quantity);
  if (sort === 'qty-desc')    filteredData.sort((a,b) => b.quantity - a.quantity);
  if (sort === 'name-asc')    filteredData.sort((a,b) => a.name.localeCompare(b.name));
  if (sort === 'price-desc')  filteredData.sort((a,b) => b.price - a.price);

  currentPage = 1;
  renderTable();
  updateSummaryStats();
}

// ── SUMMARY STATS ──
function updateSummaryStats() {
  const total     = inventoryData.length;
  const inStock   = inventoryData.filter(i => i.status === 'In Stock').length;
  const lowStock  = inventoryData.filter(i => i.status === 'Low Stock').length;
  const outStock  = inventoryData.filter(i => i.status === 'Out of Stock').length;
  const totalVal  = inventoryData.reduce((sum, i) => sum + i.quantity * i.cost, 0);

  document.getElementById('stat-total')?.setAttribute('data-count', total);
  const tvEl = document.getElementById('stat-total-val');
  if (tvEl) tvEl.textContent = Format.currency(totalVal);

  const lsBadge = document.getElementById('lowstock-badge');
  if (lsBadge) lsBadge.textContent = lowStock;

  const osBadge = document.getElementById('outstock-badge');
  if (osBadge) osBadge.textContent = outStock;
}

// ── ADD / EDIT MODAL ──
function openAddModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Add New Item';
  document.getElementById('item-form').reset();
  document.getElementById('item-id').value = 'ITM-' + String(inventoryData.length + 1).padStart(3, '0');
  Modal.open('item-modal');
}

function openEditModal(id) {
  editingId = id;
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  document.getElementById('modal-title').textContent = 'Edit Item';
  document.getElementById('item-id').value       = item.id;
  document.getElementById('item-name').value     = item.name;
  document.getElementById('item-sku').value      = item.sku;
  document.getElementById('item-category').value = item.category;
  document.getElementById('item-quantity').value = item.quantity;
  document.getElementById('item-reorder').value  = item.reorder;
  document.getElementById('item-unit').value     = item.unit;
  document.getElementById('item-cost').value     = item.cost;
  document.getElementById('item-price').value    = item.price;
  document.getElementById('item-supplier').value = item.supplier;
  document.getElementById('item-location').value = item.location;

  Modal.open('item-modal');
}

function saveItem() {
  const name     = document.getElementById('item-name').value.trim();
  const sku      = document.getElementById('item-sku').value.trim();
  const category = document.getElementById('item-category').value;
  const quantity = parseInt(document.getElementById('item-quantity').value) || 0;
  const reorder  = parseInt(document.getElementById('item-reorder').value) || 0;
  const unit     = document.getElementById('item-unit').value;
  const cost     = parseFloat(document.getElementById('item-cost').value) || 0;
  const price    = parseFloat(document.getElementById('item-price').value) || 0;
  const supplier = document.getElementById('item-supplier').value.trim();
  const location = document.getElementById('item-location').value.trim();

  if (!name || !sku || !category) {
    Toast.error('Please fill in all required fields');
    return;
  }

  const status = quantity === 0 ? 'Out of Stock' : quantity < reorder ? 'Low Stock' : 'In Stock';

  const payload = { name, sku, category, quantity, reorder, unit, cost, price, supplier, location, status };

  const request = editingId
    ? Api.put(`/api/inventory/${editingId}`, payload)
    : Api.post('/api/inventory', payload);

  request
    .then(() => {
      Toast.success(`Item "${name}" saved successfully`);
      Modal.close('item-modal');
      loadInventory();
    })
    .catch(err => {
      Toast.error('Unable to save item');
      console.error(err);
    });
}

// ── STOCK ADJUSTMENT MODAL ──
function openStockModal(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  document.getElementById('adj-item-name').textContent = item.name;
  document.getElementById('adj-current-qty').textContent = item.quantity + ' ' + item.unit;
  document.getElementById('adj-item-id').value = id;
  document.getElementById('adj-qty').value = '';
  document.getElementById('adj-type').value = 'add';
  document.getElementById('adj-reason').value = '';

  Modal.open('stock-modal');
}

function adjustStock() {
  const id     = document.getElementById('adj-item-id').value;
  const qty    = parseInt(document.getElementById('adj-qty').value) || 0;
  const type   = document.getElementById('adj-type').value;
  const reason = document.getElementById('adj-reason').value;

  if (qty <= 0) {
    Toast.error('Please enter a valid quantity');
    return;
  }

  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  if (type === 'add') {
    item.quantity += qty;
    Toast.success(`Added ${qty} units to ${item.name}`);
  } else if (type === 'remove') {
    if (qty > item.quantity) {
      Toast.error('Cannot remove more than available stock');
      return;
    }
    item.quantity -= qty;
    Toast.success(`Removed ${qty} units from ${item.name}`);
  } else {
    item.quantity = qty;
    Toast.success(`Stock for ${item.name} set to ${qty}`);
  }

  item.status = item.quantity === 0 ? 'Out of Stock' : item.quantity < item.reorder ? 'Low Stock' : 'In Stock';

  Api.put(`/api/inventory/${id}`, item)
    .then(() => {
      filteredData = [...inventoryData];
      applyFilters();
      Modal.close('stock-modal');
    })
    .catch(err => {
      Toast.error('Unable to update stock');
      console.error(err);
    });
}

// ── DELETE ITEM ──
function deleteItem(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  if (confirm(`Delete "${item.name}"? This cannot be undone.`)) {
    Api.del(`/api/inventory/${id}`)
      .then(() => {
        Toast.success(`Item "${item.name}" deleted`);
        loadInventory();
      })
      .catch(err => {
        Toast.error('Unable to delete item');
        console.error(err);
      });
  }
}

// ── BULK ACTIONS ──
function getSelectedIds() {
  return [...document.querySelectorAll('[data-check]:checked')].map(cb => cb.dataset.check);
}

function bulkDelete() {
  const ids = getSelectedIds();
  if (!ids.length) { Toast.warning('No items selected'); return; }

  if (confirm(`Delete ${ids.length} selected item(s)?`)) {
    Promise.all(ids.map(id => Api.del(`/api/inventory/${id}`)))
      .then(() => {
        Toast.success(`${ids.length} item(s) deleted`);
        loadInventory();
      })
      .catch(err => {
        Toast.error('Unable to delete selected items');
        console.error(err);
      });
  }
}

function exportCSV() {
  const headers = ['ID', 'Name', 'SKU', 'Category', 'Quantity', 'Reorder Level', 'Unit', 'Cost (₹)', 'Price (₹)', 'Supplier', 'Status', 'Location'];
  const rows = inventoryData.map(i =>
    [i.id, i.name, i.sku, i.category, i.quantity, i.reorder, i.unit, i.cost, i.price, i.supplier, i.status, i.location].join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'intellistok_inventory_' + new Date().toISOString().slice(0,10) + '.csv';
  link.click();

  Toast.success('Inventory exported to CSV');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  loadInventory();
  AnimCounter.initAll();

  // Filter listeners
  ['inv-search', 'inv-category', 'inv-status', 'inv-sort'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', applyFilters);
    document.getElementById(id)?.addEventListener('change', applyFilters);
  });

  // Button listeners
  document.getElementById('btn-add-item')?.addEventListener('click', openAddModal);
  document.getElementById('btn-save-item')?.addEventListener('click', saveItem);
  document.getElementById('btn-adjust-stock')?.addEventListener('click', adjustStock);
  document.getElementById('btn-bulk-delete')?.addEventListener('click', bulkDelete);
  document.getElementById('btn-export')?.addEventListener('click', exportCSV);
  document.getElementById('btn-cancel-adj')?.addEventListener('click', () => Modal.close('stock-modal'));
  document.getElementById('btn-cancel-item')?.addEventListener('click', () => Modal.close('item-modal'));

  // Close modal Xs
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => Modal.closeAll());
  });
});
