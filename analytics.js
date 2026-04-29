// ================================================
// INTELLISTOK — ANALYTICS.JS
// ================================================

const analyticsData = {
  months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],

  revenueVsCost: {
    revenue: [42, 55, 38, 73, 60, 85, 78, 92, 68, 110, 95, 128],
    cost:    [28, 36, 25, 48, 40, 54, 51, 60, 45, 72,  62,  84],
  },

  categoryRevenue: {
    labels: ['Electronics', 'Furniture', 'Accessories', 'Stationery', 'Others'],
    q1: [38, 12, 8, 5, 3],
    q2: [42, 15, 10, 6, 4],
    q3: [45, 13, 11, 7, 5],
    q4: [52, 18, 13, 9, 6],
  },

  stockMovement: {
    labels: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8'],
    inbound:  [320, 280, 450, 310, 390, 420, 350, 480],
    outbound: [270, 310, 380, 290, 360, 390, 320, 440],
  },

  turnoverRate: {
    labels: ['Electronics', 'Furniture', 'Accessories', 'Stationery'],
    values: [8.4, 3.2, 5.1, 12.7],
    colors: ['#00d4aa', '#3b82f6', '#f59e0b', '#8b5cf6']
  },

  topPerformers: [
    { name: 'Laptop Stand Pro',      revenue: 854250,  growth: 24.3, category: 'Electronics' },
    { name: 'Wireless Keyboard BT',  revenue: 718000,  growth: 18.7, category: 'Electronics' },
    { name: 'USB-C Hub 7-Port',      revenue: 537500,  growth: -5.2, category: 'Electronics' },
    { name: 'Ergonomic Mouse',       revenue: 495000,  growth: 31.1, category: 'Electronics' },
    { name: 'Monitor Light Bar',     revenue: 440000,  growth: 12.8, category: 'Electronics' },
    { name: 'Office Chair Pro',      revenue: 376200,  growth: 8.4,  category: 'Furniture'   },
    { name: 'Webcam HD 1080p',       revenue: 299800,  growth: 45.2, category: 'Electronics' },
    { name: 'Cable Management Kit',  revenue: 119400,  growth: 2.1,  category: 'Accessories' },
  ]
};

// ── REVENUE vs COST CHART ──
function initRevenueVsCost() {
  const ctx = document.getElementById('revCostChart');
  if (!ctx) return;

  const g1 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 280);
  g1.addColorStop(0, 'rgba(0,212,170,0.25)');
  g1.addColorStop(1, 'rgba(0,212,170,0)');

  const g2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 280);
  g2.addColorStop(0, 'rgba(239,68,68,0.2)');
  g2.addColorStop(1, 'rgba(239,68,68,0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: analyticsData.months,
      datasets: [
        {
          label: 'Revenue',
          data: analyticsData.revenueVsCost.revenue,
          borderColor: '#00d4aa',
          backgroundColor: g1,
          fill: true, tension: 0.4,
          borderWidth: 2.5,
          pointBackgroundColor: '#00d4aa',
          pointRadius: 4, pointHoverRadius: 7,
          pointBorderColor: '#070c18', pointBorderWidth: 2
        },
        {
          label: 'Cost',
          data: analyticsData.revenueVsCost.cost,
          borderColor: '#ef4444',
          backgroundColor: g2,
          fill: true, tension: 0.4,
          borderWidth: 2.5,
          pointBackgroundColor: '#ef4444',
          pointRadius: 4, pointHoverRadius: 7,
          pointBorderColor: '#070c18', pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'top', align: 'end' } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4d6080' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4d6080', callback: v => '₹' + v + 'L' } }
      }
    }
  });
}

// ── CATEGORY GROUPED BAR ──
function initCategoryBar() {
  const ctx = document.getElementById('categoryBarChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: analyticsData.categoryRevenue.labels,
      datasets: [
        { label: 'Q1', data: analyticsData.categoryRevenue.q1, backgroundColor: 'rgba(0,212,170,0.7)', borderRadius: 4 },
        { label: 'Q2', data: analyticsData.categoryRevenue.q2, backgroundColor: 'rgba(59,130,246,0.7)',  borderRadius: 4 },
        { label: 'Q3', data: analyticsData.categoryRevenue.q3, backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 4 },
        { label: 'Q4', data: analyticsData.categoryRevenue.q4, backgroundColor: 'rgba(139,92,246,0.7)', borderRadius: 4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', align: 'end' } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#4d6080' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4d6080', callback: v => '₹' + v + 'L' } }
      }
    }
  });
}

// ── STOCK MOVEMENT ──
function initStockMovement() {
  const ctx = document.getElementById('stockMovChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: analyticsData.stockMovement.labels,
      datasets: [
        {
          label: 'Inbound',
          data: analyticsData.stockMovement.inbound,
          backgroundColor: 'rgba(0,212,170,0.75)',
          borderRadius: 5,
          borderSkipped: false
        },
        {
          label: 'Outbound',
          data: analyticsData.stockMovement.outbound,
          backgroundColor: 'rgba(239,68,68,0.65)',
          borderRadius: 5,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', align: 'end' } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#4d6080' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4d6080' } }
      }
    }
  });
}

// ── TURNOVER HORIZONTAL BAR ──
function initTurnoverChart() {
  const ctx = document.getElementById('turnoverChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: analyticsData.turnoverRate.labels,
      datasets: [{
        label: 'Turnover Rate (×)',
        data: analyticsData.turnoverRate.values,
        backgroundColor: analyticsData.turnoverRate.colors.map(c => c + 'cc'),
        borderColor:      analyticsData.turnoverRate.colors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4d6080', callback: v => v + '×' } },
        y: { grid: { display: false }, ticks: { color: '#8899bb' } }
      }
    }
  });
}

// ── RENDER TOP PERFORMERS TABLE ──
function renderPerformers() {
  const tbody = document.getElementById('performers-tbody');
  if (!tbody) return;

  tbody.innerHTML = analyticsData.topPerformers.map((p, i) => `
    <tr>
      <td class="td-mono" style="color:var(--text-muted)">#${i + 1}</td>
      <td class="td-primary">${p.name}</td>
      <td><span class="badge badge-blue" style="font-size:9px">${p.category}</span></td>
      <td class="td-mono" style="color:var(--accent)">₹${(p.revenue / 100000).toFixed(2)}L</td>
      <td>
        <span style="color:${p.growth >= 0 ? 'var(--accent)' : 'var(--red)'};font-weight:600;font-family:var(--font-mono);font-size:12px">
          ${p.growth >= 0 ? '↑' : '↓'} ${Math.abs(p.growth)}%
        </span>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="progress-bar" style="flex:1;max-width:120px">
            <div class="progress-fill ${p.growth >= 0 ? 'teal' : 'red'}" style="width:${Math.min(Math.abs(p.growth) * 2, 100)}%"></div>
          </div>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── GENERATE REPORT ──
function generateReport(type) {
  const names = { monthly: 'Monthly Summary', quarterly: 'Quarterly Analysis', annual: 'Annual Report' };
  Toast.success(`Generating ${names[type] || type} report...`);
  setTimeout(() => Toast.success('Report ready! Downloading PDF...'), 1800);
}

// ── DATE RANGE FILTER ──
function applyDateFilter() {
  const from = document.getElementById('date-from')?.value;
  const to   = document.getElementById('date-to')?.value;

  if (!from || !to) {
    Toast.warning('Please select both start and end dates');
    return;
  }

  if (new Date(from) > new Date(to)) {
    Toast.error('Start date must be before end date');
    return;
  }

  Toast.success(`Filtered: ${Format.date(from)} — ${Format.date(to)}`);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initRevenueVsCost();
  initCategoryBar();
  initStockMovement();
  initTurnoverChart();
  renderPerformers();

  // Report buttons
  document.querySelectorAll('[data-report]').forEach(btn => {
    btn.addEventListener('click', () => generateReport(btn.dataset.report));
  });

  // Date filter
  document.getElementById('btn-apply-filter')?.addEventListener('click', applyDateFilter);

  // KPI tab switch
  document.querySelectorAll('[data-kpi-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-kpi-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      Toast.success('Switched to ' + tab.textContent.trim() + ' view');
    });
  });

  // Set default date range
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const dateFrom = document.getElementById('date-from');
  const dateTo   = document.getElementById('date-to');

  if (dateFrom) dateFrom.value = firstDay.toISOString().slice(0,10);
  if (dateTo)   dateTo.value   = today.toISOString().slice(0,10);
});
