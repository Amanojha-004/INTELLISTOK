// ================================================
// INTELLISTOK — ORDERS.JS
// ================================================

let ordersData = [];
let filteredOrders = [];

async function loadOrders() {
  try {
    ordersData = await Api.get('/api/orders');
    filteredOrders = [...ordersData];
    applyOrderFilters();
  } catch (err) {
    Toast.error('Unable to load orders from backend');
    console.error(err);
  }
}
let currentPage = 1;
const pageSize = 8;

// ── STATUS BADGE ──
function statusBadge(status) {
  const map = {
    'Pending':    'badge-amber',
    'Confirmed':  'badge-blue',
    'Processing': 'badge-blue',
    'In Transit': 'badge-purple',
    'Shipped':    'badge-purple',
    'Delivered':  'badge-teal',
    'Cancelled':  'badge-red'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function priorityBadge(priority) {
  const map = { 'High': 'badge-red', 'Medium': 'badge-amber', 'Low': 'badge-teal' };
  return `<span class="badge ${map[priority] || 'badge-gray'}" style="font-size:9px">${priority}</span>`;
}

function typeBadge(type) {
  return `<span class="badge ${type === 'Purchase' ? 'badge-blue' : 'badge-purple'}" style="font-size:9px">${type}</span>`;
}

// ── RENDER TABLE ──
function renderOrders() {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;

  const start = (currentPage - 1) * pageSize;
  const page  = filteredOrders.slice(start, start + pageSize);

  if (page.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="10" style="text-align:center;padding:60px">
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <div class="empty-title">No orders found</div>
          <div class="empty-desc">Try adjusting your filters</div>
        </div>
      </td></tr>
    `;
  } else {
    tbody.innerHTML = page.map(o => `
      <tr>
        <td><input type="checkbox" data-check="${o.id}" style="accent-color:var(--accent);cursor:pointer"></td>
        <td class="td-mono" style="color:var(--accent)">${o.id}</td>
        <td>${typeBadge(o.type)}</td>
        <td class="td-primary">${o.supplier}</td>
        <td class="td-mono" style="font-size:11px">${Format.date(o.date)}</td>
        <td class="td-mono" style="font-size:11px;color:var(--text-muted)">${Format.date(o.expected)}</td>
        <td class="td-mono">${o.items} items / ${o.qty} units</td>
        <td class="td-mono" style="color:var(--accent)">₹${o.amount.toLocaleString()}</td>
        <td>${statusBadge(o.status)} ${priorityBadge(o.priority)}</td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-secondary btn-sm" onclick="viewOrder('${o.id}')">View</button>
            <button class="btn btn-secondary btn-sm btn-icon" onclick="openStatusModal('${o.id}')" title="Update Status">⚡</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  updateOrderPagination();
  updateOrderStats();
}

// ── PAGINATION ──
function updateOrderPagination() {
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const info = document.getElementById('order-pagination-info');
  const controls = document.getElementById('order-pagination-controls');

  const start = Math.min((currentPage - 1) * pageSize + 1, filteredOrders.length);
  const end   = Math.min(currentPage * pageSize, filteredOrders.length);

  if (info) info.textContent = filteredOrders.length === 0 ? 'No orders' : `Showing ${start}–${end} of ${filteredOrders.length} orders`;

  if (controls && totalPages > 0) {
    controls.innerHTML = `
      <button class="page-btn" onclick="changeOrderPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>
      ${Array.from({length: totalPages}, (_, i) => `
        <button class="page-btn ${i+1 === currentPage ? 'active' : ''}" onclick="changeOrderPage(${i+1})">${i+1}</button>
      `).join('')}
      <button class="page-btn" onclick="changeOrderPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>›</button>
    `;
  }
}

function changeOrderPage(page) {
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderOrders();
}

// ── STATS ──
function updateOrderStats() {
  const total     = ordersData.length;
  const pending   = ordersData.filter(o => ['Pending','Confirmed','Processing'].includes(o.status)).length;
  const transit   = ordersData.filter(o => ['In Transit','Shipped'].includes(o.status)).length;
  const delivered = ordersData.filter(o => o.status === 'Delivered').length;
  const totalVal  = ordersData.reduce((s,o) => s + o.amount, 0);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('stat-total-orders', total);
  set('stat-pending', pending);
  set('stat-transit', transit);
  set('stat-delivered', delivered);
  set('stat-order-val', Format.currency(totalVal));
}

// ── FILTERS ──
function applyOrderFilters() {
  const query  = document.getElementById('order-search')?.value.toLowerCase() || '';
  const type   = document.getElementById('order-type')?.value || '';
  const status = document.getElementById('order-status')?.value || '';
  const sort   = document.getElementById('order-sort')?.value || '';

  filteredOrders = ordersData.filter(o => {
    const matchQ = !query || o.id.toLowerCase().includes(query) || o.supplier.toLowerCase().includes(query);
    const matchT = !type   || o.type === type;
    const matchS = !status || o.status === status;
    return matchQ && matchT && matchS;
  });

  if (sort === 'date-desc')   filteredOrders.sort((a,b) => new Date(b.date) - new Date(a.date));
  if (sort === 'date-asc')    filteredOrders.sort((a,b) => new Date(a.date) - new Date(b.date));
  if (sort === 'amount-desc') filteredOrders.sort((a,b) => b.amount - a.amount);
  if (sort === 'amount-asc')  filteredOrders.sort((a,b) => a.amount - b.amount);

  currentPage = 1;
  renderOrders();
}

// ── VIEW ORDER MODAL ──
function viewOrder(id) {
  const order = ordersData.find(o => o.id === id);
  if (!order) return;

  document.getElementById('view-order-id').textContent    = order.id;
  document.getElementById('view-order-type').innerHTML    = typeBadge(order.type);
  document.getElementById('view-order-status').innerHTML  = statusBadge(order.status);
  document.getElementById('view-supplier').textContent    = order.supplier;
  document.getElementById('view-date').textContent        = Format.date(order.date);
  document.getElementById('view-expected').textContent    = Format.date(order.expected);
  document.getElementById('view-items').textContent       = order.items + ' items (' + order.qty + ' units)';
  document.getElementById('view-amount').textContent      = '₹' + order.amount.toLocaleString();
  document.getElementById('view-priority').innerHTML      = priorityBadge(order.priority);

  // Mock timeline
  const timeline = document.getElementById('order-timeline');
  if (timeline) {
    const steps = ['Order Placed', 'Confirmed', 'Processing', 'In Transit', 'Delivered'];
    const statusIdx = {
      'Pending': 0, 'Confirmed': 1, 'Processing': 2,
      'In Transit': 3, 'Shipped': 3, 'Delivered': 4, 'Cancelled': -1
    };
    const current = statusIdx[order.status] ?? 0;

    timeline.innerHTML = steps.map((step, i) => `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:${i < steps.length-1 ? '6px' : '0'}">
        <div style="width:20px;height:20px;border-radius:50%;background:${i <= current ? 'var(--accent)' : 'var(--bg-surface)'};border:2px solid ${i <= current ? 'var(--accent)' : 'var(--border-muted)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          ${i <= current ? '<span style="font-size:10px;color:var(--bg-deep)">✓</span>' : ''}
        </div>
        <span style="font-size:13px;color:${i <= current ? 'var(--text-primary)' : 'var(--text-muted)'}">${step}</span>
        ${i === current ? '<span class="badge badge-teal" style="font-size:9px;margin-left:auto">Current</span>' : ''}
      </div>
      ${i < steps.length-1 ? '<div style="width:2px;height:12px;background:' + (i < current ? 'var(--accent)' : 'var(--border-muted)') + ';margin-left:9px;margin-bottom:6px"></div>' : ''}
    `).join('');
  }

  Modal.open('view-order-modal');
}

// ── STATUS UPDATE MODAL ──
function openStatusModal(id) {
  const order = ordersData.find(o => o.id === id);
  if (!order) return;

  document.getElementById('upd-order-id').value = id;
  document.getElementById('upd-status').value = order.status;
  document.getElementById('upd-order-label').textContent = `Update status for ${id}`;

  Modal.open('update-status-modal');
}

function updateOrderStatus() {
  const id     = document.getElementById('upd-order-id').value;
  const status = document.getElementById('upd-status').value;
  const note   = document.getElementById('upd-note').value;

  Api.patch(`/api/orders/${id}/status`, { status, note })
    .then(() => {
      Toast.success(`Order ${id} status updated to "${status}"`);
      Modal.close('update-status-modal');
      loadOrders();
    })
    .catch(err => {
      Toast.error('Unable to update order status');
      console.error(err);
    });
}

// ── CREATE NEW ORDER MODAL ──
function openCreateOrderModal() {
  document.getElementById('new-order-form').reset();
  const nextNumber = ordersData.length ? parseInt(ordersData[0].id.split('-')[1]) + 1 : 2850;
  const newId = 'PO-' + String(nextNumber).padStart(4, '0');
  document.getElementById('new-order-id').value = newId;
  Modal.open('create-order-modal');
}

function createOrder() {
  const id       = document.getElementById('new-order-id').value;
  const type     = document.getElementById('new-order-type').value;
  const supplier = document.getElementById('new-supplier').value.trim();
  const items    = parseInt(document.getElementById('new-items').value) || 0;
  const qty      = parseInt(document.getElementById('new-qty').value) || 0;
  const amount   = parseFloat(document.getElementById('new-amount').value) || 0;
  const expected = document.getElementById('new-expected').value;
  const priority = document.getElementById('new-priority').value;

  if (!supplier || !expected || !amount) {
    Toast.error('Please fill in all required fields');
    return;
  }

  const today = new Date().toISOString().slice(0,10);
  const payload = { id, type, supplier, expected, items, qty, amount, priority, date: today };

  Api.post('/api/orders', payload)
    .then(() => {
      Toast.success(`Order ${id} created successfully`);
      Modal.close('create-order-modal');
      loadOrders();
    })
    .catch(err => {
      Toast.error('Unable to create order');
      console.error(err);
    });
}

// ── EXPORT ──
function exportOrders() {
  const headers = ['ID','Type','Supplier','Date','Expected','Items','Quantity','Amount','Status','Priority'];
  const rows = ordersData.map(o =>
    [o.id, o.type, o.supplier, o.date, o.expected, o.items, o.qty, o.amount, o.status, o.priority].join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'intellistok_orders_' + new Date().toISOString().slice(0,10) + '.csv';
  link.click();
  Toast.success('Orders exported to CSV');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  loadOrders();

  ['order-search','order-type','order-status','order-sort'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', applyOrderFilters);
    document.getElementById(id)?.addEventListener('change', applyOrderFilters);
  });

  document.getElementById('btn-create-order')?.addEventListener('click', openCreateOrderModal);
  document.getElementById('btn-save-order')?.addEventListener('click', createOrder);
  document.getElementById('btn-update-status')?.addEventListener('click', updateOrderStatus);
  document.getElementById('btn-export-orders')?.addEventListener('click', exportOrders);

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => Modal.closeAll());
  });
});
