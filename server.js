const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const DATA_FILE = path.join(__dirname, 'data.json');

// ── DATA PERSISTENCE ──
async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // Return default data if file doesn't exist
    return {
      suppliers: [
        {
          id: 'SUP-001', name: 'TechCore Supplies', category: 'Electronics', contact: 'Rahul Sharma',
          email: 'rahul@techcore.in', phone: '+91 98765 43210', city: 'Mumbai', rating: 4.8,
          orders: 124, spend: 1840000, onTime: 96, status: 'Active', color: 'teal', initials: 'TC'
        },
        {
          id: 'SUP-002', name: 'Nordic Components', category: 'Electronics', contact: 'Priya Singh',
          email: 'priya@nordic.in', phone: '+91 87654 32109', city: 'Bengaluru', rating: 4.5,
          orders: 87, spend: 1260000, onTime: 92, status: 'Active', color: 'blue', initials: 'NC'
        },
        {
          id: 'SUP-003', name: 'ErgoFurns Co', category: 'Furniture', contact: 'Anjali Mehta',
          email: 'anjali@ergofurns.in', phone: '+91 76543 21098', city: 'Pune', rating: 4.2,
          orders: 42, spend: 940000, onTime: 88, status: 'Active', color: 'amber', initials: 'EF'
        },
        {
          id: 'SUP-004', name: 'BrightTech Ltd', category: 'Electronics', contact: 'Vikram Nair',
          email: 'vikram@brighttech.in', phone: '+91 65432 10987', city: 'Chennai', rating: 4.6,
          orders: 65, spend: 720000, onTime: 94, status: 'Active', color: 'purple', initials: 'BT'
        },
        {
          id: 'SUP-005', name: 'AudioPlus India', category: 'Electronics', contact: 'Sneha Patel',
          email: 'sneha@audioplus.in', phone: '+91 54321 09876', city: 'Ahmedabad', rating: 4.3,
          orders: 31, spend: 560000, onTime: 90, status: 'Active', color: 'teal', initials: 'AP'
        },
        {
          id: 'SUP-006', name: 'Office Essentials', category: 'Stationery', contact: 'Karan Gupta',
          email: 'karan@offess.in', phone: '+91 43210 98765', city: 'Delhi', rating: 4.0,
          orders: 58, spend: 285000, onTime: 85, status: 'Active', color: 'blue', initials: 'OE'
        },
        {
          id: 'SUP-007', name: 'PaperCo India', category: 'Stationery', contact: 'Meena Roy',
          email: 'meena@paperco.in', phone: '+91 32109 87654', city: 'Kolkata', rating: 3.8,
          orders: 44, spend: 148000, onTime: 82, status: 'Inactive', color: 'amber', initials: 'PC'
        },
        {
          id: 'SUP-008', name: 'GreenSpace Decor', category: 'Furniture', contact: 'Arjun Kumar',
          email: 'arjun@greenspace.in', phone: '+91 21098 76543', city: 'Hyderabad', rating: 4.1,
          orders: 19, spend: 380000, onTime: 89, status: 'Pending', color: 'purple', initials: 'GS'
        }
      ],
      inventory: [
        { id: 'ITM-001', name: 'Laptop Stand Pro',        sku: 'LS-PRO-01',   category: 'Electronics',   quantity: 124, reorder: 20,  unit: 'pcs', cost: 1850,  price: 2499,  supplier: 'TechCore Supplies',   status: 'In Stock',   location: 'A-01' },
        { id: 'ITM-002', name: 'Wireless Keyboard BT',    sku: 'WK-BT-05',    category: 'Electronics',   quantity: 8,   reorder: 25,  unit: 'pcs', cost: 1200,  price: 1999,  supplier: 'Nordic Components',   status: 'Low Stock',  location: 'A-02' },
        { id: 'ITM-003', name: 'USB-C Hub 7-Port',        sku: 'USB-HUB-7',   category: 'Electronics',   quantity: 0,   reorder: 30,  unit: 'pcs', cost: 1500,  price: 2100,  supplier: 'TechCore Supplies',   status: 'Out of Stock', location: 'A-03' },
        { id: 'ITM-004', name: 'Ergonomic Mouse',         sku: 'EM-PRO-22',   category: 'Electronics',   quantity: 67,  reorder: 15,  unit: 'pcs', cost: 950,   price: 1299,  supplier: 'Nordic Components',   status: 'In Stock',   location: 'A-04' },
        { id: 'ITM-005', name: 'Monitor Light Bar',       sku: 'MLB-01',      category: 'Electronics',   quantity: 31,  reorder: 10,  unit: 'pcs', cost: 1750,  price: 2299,  supplier: 'BrightTech Ltd',      status: 'In Stock',   location: 'B-01' },
        { id: 'ITM-006', name: 'Office Chair Pro',        sku: 'OC-PRO-44',   category: 'Furniture',     quantity: 12,  reorder: 5,   unit: 'pcs', cost: 8500,  price: 12999, supplier: 'ErgoFurns Co',        status: 'In Stock',   location: 'C-01' },
        { id: 'ITM-007', name: 'Standing Desk Frame',     sku: 'SD-FRM-01',   category: 'Furniture',     quantity: 0,   reorder: 3,   unit: 'pcs', cost: 15000, price: 22999, supplier: 'ErgoFurns Co',        status: 'Out of Stock', location: 'C-02' },
        { id: 'ITM-008', name: 'Cable Management Kit',    sku: 'CMK-PRO',     category: 'Accessories',   quantity: 210, reorder: 50,  unit: 'sets',cost: 299,   price: 499,   supplier: 'TechCore Supplies',   status: 'In Stock',   location: 'B-02' },
        { id: 'ITM-009', name: 'Desk Organizer Set',      sku: 'DO-SET-05',   category: 'Accessories',   quantity: 85,  reorder: 20,  unit: 'sets',cost: 450,   price: 699,   supplier: 'Office Essentials',   status: 'In Stock',   location: 'B-03' },
        { id: 'ITM-010', name: 'Noise Cancel Headphones', sku: 'NCH-PRO-01',  category: 'Electronics',   quantity: 7,   reorder: 15,  unit: 'pcs', cost: 5500,  price: 7499,  supplier: 'AudioPlus India',     status: 'Low Stock',  location: 'A-05' },
        { id: 'ITM-011', name: 'Laptop Cooling Pad',      sku: 'LCP-01',      category: 'Electronics',   quantity: 44,  reorder: 12,  unit: 'pcs', cost: 750,   price: 1099,  supplier: 'TechCore Supplies',   status: 'In Stock',   location: 'A-06' },
        { id: 'ITM-012', name: 'Whiteboard 4x3 ft',       sku: 'WB-4X3',      category: 'Furniture',     quantity: 18,  reorder: 5,   unit: 'pcs', cost: 2200,  price: 3299,  supplier: 'Office Essentials',   status: 'In Stock',   location: 'C-03' },
        { id: 'ITM-013', name: 'Premium Paper A4 (Ream)', sku: 'PA4-80G',     category: 'Stationery',    quantity: 320, reorder: 100, unit: 'ream',cost: 220,   price: 320,   supplier: 'PaperCo India',       status: 'In Stock',   location: 'D-01' },
        { id: 'ITM-014', name: 'Ballpoint Pen Set 50pcs', sku: 'BPS-50',      category: 'Stationery',    quantity: 15,  reorder: 30,  unit: 'boxes',cost: 150,  price: 249,   supplier: 'PaperCo India',       status: 'Low Stock',  location: 'D-02' },
        { id: 'ITM-015', name: 'Webcam HD 1080p',         sku: 'WC-HD-01',    category: 'Electronics',   quantity: 52,  reorder: 10,  unit: 'pcs', cost: 2800,  price: 3999,  supplier: 'Nordic Components',   status: 'In Stock',   location: 'A-07' }
      ],
      orders: [
        { id:'PO-2849', type:'Purchase', supplier:'TechCore Supplies',   date:'2025-11-01', expected:'2025-11-08', items:5,  qty:120, amount:148500,  status:'Pending',    priority:'High'   },
        { id:'PO-2848', type:'Purchase', supplier:'Nordic Components',   date:'2025-10-29', expected:'2025-11-05', items:3,  qty:75,  amount:89250,   status:'Confirmed',  priority:'Medium' },
        { id:'PO-2847', type:'Purchase', supplier:'BrightTech Ltd',      date:'2025-10-25', expected:'2025-11-01', items:2,  qty:40,  amount:46000,   status:'Delivered',  priority:'Low'    },
        { id:'PO-2846', type:'Purchase', supplier:'ErgoFurns Co',        date:'2025-10-22', expected:'2025-10-30', items:4,  qty:30,  amount:215000,  status:'In Transit', priority:'High'   },
        { id:'SO-1098', type:'Sale',     supplier:'Retail Partner A',    date:'2025-11-01', expected:'2025-11-03', items:8,  qty:45,  amount:98500,   status:'Processing', priority:'High'   },
        { id:'SO-1097', type:'Sale',     supplier:'Wholesale Client B',  date:'2025-10-31', expected:'2025-11-02', items:12, qty:230, amount:284000,  status:'Shipped',    priority:'Medium' },
        { id:'SO-1096', type:'Sale',     supplier:'Direct Customer C',   date:'2025-10-30', expected:'2025-11-01', items:2,  qty:5,   amount:12499,   status:'Delivered',  priority:'Low'    },
        { id:'PO-2845', type:'Purchase', supplier:'AudioPlus India',     date:'2025-10-20', expected:'2025-10-27', items:1,  qty:50,  amount:275000,  status:'Delivered',  priority:'Medium' },
        { id:'PO-2844', type:'Purchase', supplier:'Office Essentials',   date:'2025-10-18', expected:'2025-10-24', items:6,  qty:200, amount:68000,   status:'Cancelled',  priority:'Low'    },
        { id:'SO-1095', type:'Sale',     supplier:'Retail Partner D',    date:'2025-10-17', expected:'2025-10-20', items:4,  qty:20,  amount:45800,   status:'Delivered',  priority:'Medium' },
        { id:'PO-2843', type:'Purchase', supplier:'PaperCo India',       date:'2025-10-15', expected:'2025-10-19', items:3,  qty:500, amount:32500,   status:'Delivered',  priority:'Low'    },
        { id:'SO-1094', type:'Sale',     supplier:'B2B Client E',        date:'2025-10-14', expected:'2025-10-17', items:7,  qty:80,  amount:178000,  status:'Delivered',  priority:'High'   }
      ],
      users: [
        { id: 1, username: 'admin', password: 'admin123', name: 'Aryan Kumar', role: 'Admin', email: 'admin@intellistok.com' }
      ],
      settings: {
        companyName: 'IntelliStok',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        notifications: {
          lowStock: true,
          orderUpdates: true,
          supplierAlerts: false
        },
        theme: 'dark'
      }
    };
  }
}

async function saveData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

let dataStore;

// ── AUTHENTICATION MIDDLEWARE ──
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.substring(7);
  // Simple token validation (in production, use JWT)
  if (token !== 'demo-token') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  next();
}

// ── INITIALIZE SERVER ──
async function startServer() {
  dataStore = await loadData();

// ── AUTH ENDPOINTS ──
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = dataStore.users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({
    token: 'demo-token',
    user: { id: user.id, username: user.username, name: user.name, role: user.role, email: user.email }
  });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  // For demo, return the first user
  const user = dataStore.users[0];
  res.json({ id: user.id, username: user.username, name: user.name, role: user.role, email: user.email });
});

} // End of startServer function

function getDashboardData() {
  const revenue = [42, 55, 38, 73, 60, 85, 78, 92, 68, 110, 95, 128];
  const ordersChart = [18, 24, 15, 32, 27, 35, 29, 42, 31, 48, 40, 55];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return {
    stats: {
      totalSuppliers: dataStore.suppliers.length,
      activeSuppliers: dataStore.suppliers.filter(s => s.status === 'Active').length,
      avgSupplierRating: dataStore.suppliers.length ? (dataStore.suppliers.reduce((sum,s) => sum + s.rating, 0) / dataStore.suppliers.length).toFixed(1) : '0.0',
      totalSpend: dataStore.suppliers.reduce((sum,s) => sum + s.spend, 0),
      totalItems: dataStore.inventory.length,
      inStock: dataStore.inventory.filter(i => i.status === 'In Stock').length,
      lowStock: dataStore.inventory.filter(i => i.status === 'Low Stock').length,
      outOfStock: dataStore.inventory.filter(i => i.status === 'Out of Stock').length,
      totalInventoryValue: dataStore.inventory.reduce((sum, i) => sum + i.quantity * i.cost, 0),
      totalOrders: dataStore.orders.length,
      pendingOrders: dataStore.orders.filter(o => ['Pending','Confirmed','Processing'].includes(o.status)).length,
      transitOrders: dataStore.orders.filter(o => ['In Transit','Shipped'].includes(o.status)).length,
      deliveredOrders: dataStore.orders.filter(o => o.status === 'Delivered').length,
      orderValue: dataStore.orders.reduce((sum,o) => sum + o.amount, 0)
    },
    revenue,
    orders: ordersChart,
    months
  };
}

app.get('/api/suppliers', requireAuth, (req, res) => res.json(dataStore.suppliers));
app.post('/api/suppliers', requireAuth, (req, res) => {
  const { name, category, contact, email, phone, city } = req.body;
  if (!name || !category || !contact || !email) {
    return res.status(400).json({ error: 'Missing required supplier fields' });
  }

  const id = 'SUP-' + String(dataStore.suppliers.length + 1).padStart(3, '0');
  const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  const colors = ['teal', 'blue', 'amber', 'purple'];
  const newSupplier = {
    id,
    name,
    category,
    contact,
    email,
    phone: phone || '',
    city: city || '',
    rating: 0,
    orders: 0,
    spend: 0,
    onTime: 0,
    status: 'Pending',
    color: colors[dataStore.suppliers.length % colors.length],
    initials
  };

  dataStore.suppliers.push(newSupplier);
  saveData(dataStore);
  res.status(201).json(newSupplier);
});

app.get('/api/inventory', requireAuth, (req, res) => res.json(dataStore.inventory));
app.post('/api/inventory', requireAuth, (req, res) => {
  const item = req.body;
  if (!item.name || !item.sku || !item.category) {
    return res.status(400).json({ error: 'Missing required inventory fields' });
  }

  const newId = 'ITM-' + String(dataStore.inventory.length + 1).padStart(3, '0');
  const status = item.quantity === 0 ? 'Out of Stock' : item.quantity < item.reorder ? 'Low Stock' : 'In Stock';
  const created = { ...item, id: newId, status };
  dataStore.inventory.push(created);
  saveData(dataStore);
  res.status(201).json(created);
});
app.put('/api/inventory/:id', requireAuth, (req, res) => {
  const itemId = req.params.id;
  const idx = dataStore.inventory.findIndex(i => i.id === itemId);
  if (idx === -1) return res.status(404).json({ error: 'Inventory item not found' });

  const item = req.body;
  item.status = item.quantity === 0 ? 'Out of Stock' : item.quantity < item.reorder ? 'Low Stock' : 'In Stock';
  dataStore.inventory[idx] = { ...dataStore.inventory[idx], ...item, id: itemId };
  saveData(dataStore);
  res.json(dataStore.inventory[idx]);
});
app.delete('/api/inventory/:id', requireAuth, (req, res) => {
  const itemId = req.params.id;
  const before = dataStore.inventory.length;
  dataStore.inventory = dataStore.inventory.filter(i => i.id !== itemId);
  if (dataStore.inventory.length === before) return res.status(404).json({ error: 'Inventory item not found' });
  saveData(dataStore);
  res.status(204).end();
});

app.get('/api/orders', requireAuth, (req, res) => res.json(dataStore.orders));
app.post('/api/orders', requireAuth, (req, res) => {
  const order = req.body;
  if (!order.id || !order.type || !order.supplier || !order.expected || !order.amount) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  dataStore.orders.unshift({ ...order, date: new Date().toISOString().slice(0,10), status: 'Pending' });
  saveData(dataStore);
  res.status(201).json(dataStore.orders[0]);
});
app.patch('/api/orders/:id/status', requireAuth, (req, res) => {
  const id = req.params.id;
  const order = dataStore.orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  order.status = status;
  saveData(dataStore);
  res.json(order);
});

// ── ANALYTICS API ──
app.get('/api/analytics/revenue', requireAuth, (req, res) => {
  const { period = 'monthly' } = req.query;
  // Mock revenue data by period
  const data = {
    monthly: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      values: [420000, 550000, 380000, 730000, 600000, 850000, 780000, 920000, 680000, 1100000, 950000, 1280000]
    },
    weekly: {
      labels: ['Week 1','Week 2','Week 3','Week 4'],
      values: [150000, 180000, 165000, 200000]
    }
  };
  res.json(data[period] || data.monthly);
});

app.get('/api/analytics/categories', requireAuth, (req, res) => {
  const categorySales = dataStore.inventory.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) acc[category] = 0;
    acc[category] += item.quantity * item.price;
    return acc;
  }, {});

  const labels = Object.keys(categorySales);
  const values = Object.values(categorySales);
  res.json({ labels, values });
});

app.get('/api/analytics/top-products', requireAuth, (req, res) => {
  const topProducts = dataStore.inventory
    .map(item => ({
      name: item.name,
      sku: item.sku,
      sold: Math.floor(Math.random() * 500) + 100, // Mock sales data
      stock: item.quantity,
      revenue: item.quantity * item.price,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    }))
    .sort((a,b) => b.revenue - a.revenue)
    .slice(0, 5);
  res.json(topProducts);
});

// ── SETTINGS API ──
app.get('/api/settings', requireAuth, (req, res) => res.json(dataStore.settings));
app.put('/api/settings', requireAuth, (req, res) => {
  dataStore.settings = { ...dataStore.settings, ...req.body };
  saveData(dataStore);
  res.json(dataStore.settings);
});

// ── DASHBOARD API ──
app.get('/api/dashboard', requireAuth, (req, res) => res.json(getDashboardData()));

// ── ERROR HANDLING ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ── 404 HANDLER ──
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const port = process.env.PORT || 3000;
startServer().then(() => {
  app.listen(port, () => {
    console.log(`IntelliStok backend running at http://localhost:${port}`);
  });
});
