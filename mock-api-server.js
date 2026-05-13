const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;
const JWT_SECRET = 'FlowCore_JWT_Secret_Key_2026_Contractor_Management_System_Production_Grade';

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Mock user database
const users = {
  'admin': { id: 1, username: 'admin', password: 'admin123', role: 'ADMIN', userId: 1 },
  'supervisor': { id: 2, username: 'supervisor', password: 'supervisor123', role: 'SUPERVISOR', userId: 2 }
};

// Mock workers database
const workers = [
  { id: 1, name: 'John Doe', phone: '9876543210', skill: 'Electrician', dailyWage: 500, joiningDate: '2024-01-15', active: true },
  { id: 2, name: 'Jane Smith', phone: '9876543211', skill: 'Plumber', dailyWage: 450, joiningDate: '2024-02-20', active: true },
  { id: 3, name: 'Mike Johnson', phone: '9876543212', skill: 'Carpenter', dailyWage: 600, joiningDate: '2024-03-10', active: true }
];

// Mock sites database
const sites = [
  { id: 1, projectName: 'Metro Station Construction', location: 'Downtown', startDate: '2024-01-01', status: 'ACTIVE', clientName: 'City Corp', budget: 5000000, totalWorkers: 50 },
  { id: 2, projectName: 'Office Building Renovation', location: 'Business District', startDate: '2024-02-15', status: 'ACTIVE', clientName: 'Tech Solutions', budget: 2000000, totalWorkers: 20 }
];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }

  const token = jwt.sign(
    { userId: user.userId, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      userId: user.userId,
      username: user.username,
      role: user.role
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      success: true,
      data: decoded
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Worker endpoints
app.get('/api/workers', (req, res) => {
  res.json({
    success: true,
    data: workers
  });
});

app.get('/api/workers/:id', (req, res) => {
  const worker = workers.find(w => w.id === parseInt(req.params.id));
  if (!worker) {
    return res.status(404).json({ success: false, message: 'Worker not found' });
  }
  res.json({
    success: true,
    data: worker
  });
});

app.post('/api/workers', (req, res) => {
  const newWorker = {
    id: Math.max(...workers.map(w => w.id), 0) + 1,
    ...req.body
  };
  workers.push(newWorker);
  res.status(201).json({
    success: true,
    data: newWorker
  });
});

app.put('/api/workers/:id', (req, res) => {
  const index = workers.findIndex(w => w.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Worker not found' });
  }
  workers[index] = { ...workers[index], ...req.body };
  res.json({
    success: true,
    data: workers[index]
  });
});

app.delete('/api/workers/:id', (req, res) => {
  const index = workers.findIndex(w => w.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Worker not found' });
  }
  workers.splice(index, 1);
  res.json({
    success: true,
    message: 'Worker deleted successfully'
  });
});

// Site endpoints
app.get('/api/sites', (req, res) => {
  res.json({
    success: true,
    data: sites
  });
});

app.get('/api/sites/:id', (req, res) => {
  const site = sites.find(s => s.id === parseInt(req.params.id));
  if (!site) {
    return res.status(404).json({ success: false, message: 'Site not found' });
  }
  res.json({
    success: true,
    data: site
  });
});

app.post('/api/sites', (req, res) => {
  const newSite = {
    id: Math.max(...sites.map(s => s.id), 0) + 1,
    ...req.body
  };
  sites.push(newSite);
  res.status(201).json({
    success: true,
    data: newSite
  });
});

app.put('/api/sites/:id', (req, res) => {
  const index = sites.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Site not found' });
  }
  sites[index] = { ...sites[index], ...req.body };
  res.json({
    success: true,
    data: sites[index]
  });
});

app.delete('/api/sites/:id', (req, res) => {
  const index = sites.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Site not found' });
  }
  sites.splice(index, 1);
  res.json({
    success: true,
    message: 'Site deleted successfully'
  });
});

app.listen(PORT, () => {
  console.log(`Mock API Server running on http://localhost:${PORT}`);
});
