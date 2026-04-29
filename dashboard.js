// ================================================
// INTELLISTOK — DASHBOARD.JS
// ================================================

// ── MOCK DATA ──
const dashboardData = {
  revenue: [42, 55, 38, 73, 60, 85, 78, 92, 68, 110, 95, 128],
  orders: [18, 24, 15, 32, 27, 35, 29, 42, 31, 48, 40, 55],
  months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],

  categoryData: {
    labels: ['Electronics', 'Clothing', 'Furniture', 'Food & Bev', 'Accessories'],
    values: [35, 25, 18, 12, 10],
    colors: ['#00d4aa', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444']
  },

  recentActivity: [
    { type: 'teal',  text: '<strong>Stock replenished</strong> — Laptop Stand Pro (×50 units)',        time: '2m ago' },
    { type: 'amber', text: '<strong>Low stock alert</strong> — Wireless Headphones (8 units left)',    time: '18m ago' },
    { type: 'blue',  text: '<strong>New order</strong> — PO-2849 from Tech Suppliers Ltd',             time: '45m ago' },
    { type: 'teal',  text: '<strong>Supplier approved</strong> — Nordic Components onboarded',         time: '2h ago' },
    { type: 'red',   text: '<strong>Out of stock</strong> — USB-C Hub 7-Port flagged for reorder',     time: '3h ago' },
    { type: 'blue',  text: '<strong>Sale recorded</strong> — Invoice INV-1093 processed (₹24,500)',    time: '4h ago' },
  ],

  topProducts: [
    { name: 'Laptop Stand Pro',      sku: 'LS-PRO-01',    sold: 342, stock: 124, revenue: 854250, trend: 'up'   },
    { name: 'Wireless Keyboard',     sku: 'WK-BT-05',     sold: 287, stock: 8,   revenue: 718000, trend: 'up'   },
    { name: 'USB-C Hub 7-Port',      sku: 'USB-HUB-7',    sold: 215, stock: 0,   revenue: 537500, trend: 'down' },
    { name: 'Ergonomic Mouse',       sku: 'EM-PRO-22',    sold: 198, stock: 67,  revenue: 495000, trend: 'up'   },
    { name: 'Monitor Light Bar',     sku: 'MLB-01',       sold: 176, stock: 31,  revenue: 440000, trend: 'up'   },
  ]
};

// ── CHARTS ──
let revenueChart, donutChart, miniBarChart;

function initRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(0, 212, 170, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 212, 170, 0)');

  const gradient2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradient2.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
  gradient2.addColorStop(1, 'rgba(59, 130, 246, 0)');

  revenueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dashboardData.months,
      datasets: [
        {
          label: 'Revenue (₹ Lakhs)',
          data: dashboardData.revenue,
          borderColor: '#00d4aa',
          backgroundColor: gradient,
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#00d4aa',
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBorderColor: '#070c18',
          pointBorderWidth: 2,
        },
        {
          label: 'Orders',
          data: dashboardData.orders,
          borderColor: '#3b82f6',
          backgroundColor: gradient2,
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBorderColor: '#070c18',
          pointBorderWidth: 2,
          yAxisID: 'y2'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', align: 'end' },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.datasetIndex === 0) return ' Revenue: ₹' + ctx.parsed.y + 'L';
              return ' Orders: ' + ctx.parsed.y;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#4d6080' }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#4d6080', callback: v => '₹' + v + 'L' }
        },
        y2: {
          position: 'right',
          grid: { display: false },
          ticks: { color: '#4d6080' }
        }
      }
    }
  });
}

function initDonutChart() {
  const ctx = document.getElementById('categoryChart');
  if (!ctx) return;

  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: dashboardData.categoryData.labels,
      datasets: [{
        data: dashboardData.categoryData.values,
        backgroundColor: dashboardData.categoryData.colors.map(c => c + 'cc'),
        borderColor: dashboardData.categoryData.colors,
        borderWidth: 2,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });

  // Render custom legend
  const legendEl = document.getElementById('donut-legend');
  if (legendEl) {
    legendEl.innerHTML = dashboardData.categoryData.labels.map((label, i) => `
      <div class="legend-item">
        <div class="legend-dot" style="background:${dashboardData.categoryData.colors[i]}"></div>
        <div class="legend-label">${label}</div>
        <div class="legend-value">${dashboardData.categoryData.values[i]}%</div>
      </div>
    `).join('');
  }
}

function initWeeklyBarChart() {
  const ctx = document.getElementById('weeklyChart');
  if (!ctx) return;

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const vals = [45, 62, 38, 78, 55, 30, 21];

  miniBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Orders',
        data: vals,
        backgroundColor: vals.map((v, i) =>
          i === vals.indexOf(Math.max(...vals))
            ? '#00d4aa'
            : 'rgba(0,212,170,0.2)'
        ),
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#4d6080' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4d6080' } }
      }
    }
  });
}

// ── RENDER TOP PRODUCTS ──
function renderTopProducts() {
  const tbody = document.getElementById('top-products-body');
  if (!tbody) return;

  tbody.innerHTML = dashboardData.topProducts.map(p => {
    const stockClass = p.stock === 0 ? 'badge-red' : p.stock < 15 ? 'badge-amber' : 'badge-teal';
    const stockText  = p.stock === 0 ? 'Out of Stock' : p.stock < 15 ? `Low (${p.stock})` : p.stock;

    return `
      <tr>
        <td>
          <div class="td-primary">${p.name}</div>
          <div class="td-mono" style="color:var(--text-muted);font-size:11px;margin-top:2px">${p.sku}</div>
        </td>
        <td class="td-mono">${Format.number(p.sold)}</td>
        <td><span class="badge ${stockClass}">${stockText}</span></td>
        <td class="td-mono" style="color:var(--accent)">${Format.currency(p.revenue)}</td>
        <td style="color:${p.trend==='up' ? 'var(--accent)' : 'var(--red)'};font-size:16px">${p.trend === 'up' ? '↑' : '↓'}</td>
      </tr>
    `;
  }).join('');
}

// ── RENDER ACTIVITY FEED ──
function renderActivity() {
  const list = document.getElementById('activity-list');
  if (!list) return;

  list.innerHTML = dashboardData.recentActivity.map(a => `
    <div class="activity-item">
      <div class="activity-dot ${a.type}"></div>
      <div style="flex:1">
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

// ── LIVE CLOCK ──
function updateClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;

  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ── SIMULATE REAL-TIME UPDATES ──
function startLiveUpdates() {
  setInterval(() => {
    // Randomly update one stat for demo effect
    const statsToUpdate = [
      { id: 'live-orders', base: 1284, variance: 5 },
      { id: 'live-visitors', base: 328, variance: 3 }
    ];

    statsToUpdate.forEach(({ id, base, variance }) => {
      const el = document.getElementById(id);
      if (el) {
        const current = parseInt(el.textContent.replace(/,/g, '')) || base;
        const delta = Math.floor(Math.random() * variance) - Math.floor(variance / 2);
        el.textContent = Format.number(current + delta);
      }
    });
  }, 4000);
}

// ── CHART PERIOD SWITCHER ──
function switchChartPeriod(period) {
  document.querySelectorAll('[data-period]').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-period="${period}"]`)?.classList.add('active');

  // Simulate updating chart with new data
  if (!revenueChart) return;
  const multipliers = { '7d': 0.25, '30d': 0.5, '3m': 0.75, '1y': 1 };
  const m = multipliers[period] || 1;

  revenueChart.data.datasets[0].data = dashboardData.revenue.map(v =>
    Math.round(v * m + (Math.random() * 10 - 5))
  );
  revenueChart.data.datasets[1].data = dashboardData.orders.map(v =>
    Math.round(v * m + (Math.random() * 5 - 2))
  );
  revenueChart.update('active');

  Toast.success(`Chart updated: ${period === '1y' ? '1 Year' : period === '3m' ? '3 Months' : period === '30d' ? '30 Days' : '7 Days'} view`);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initRevenueChart();
  initDonutChart();
  initWeeklyBarChart();
  renderTopProducts();
  renderActivity();

  // Live clock
  setInterval(updateClock, 1000);
  updateClock();

  // Real-time simulation
  startLiveUpdates();

  // Period switch buttons
  document.querySelectorAll('[data-period]').forEach(btn => {
    btn.addEventListener('click', () => switchChartPeriod(btn.dataset.period));
  });

  // Quick action buttons
  document.getElementById('quick-add-stock')?.addEventListener('click', () => {
    window.location.href = 'inventory.html';
  });

  document.getElementById('quick-new-order')?.addEventListener('click', () => {
    window.location.href = 'orders.html';
  });
});
