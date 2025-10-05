const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BloomingHealth API is running' });
});

// Dashboard metrics endpoint
app.get('/api/metrics', (req, res) => {
  const metrics = {
    activeBlooms: 3,
    pollenLevel: 75,
    temperature: 24,
    healthAlerts: 3,
    lastUpdated: new Date().toISOString()
  };
  res.json(metrics);
});

// Blooming flowers endpoint
app.get('/api/flowers', (req, res) => {
  const flowers = [
    {
      id: 1,
      name: 'Flamboyant',
      scientificName: 'Delonix regia',
      description: 'Vibrant red-orange blooms that transform landscapes with their fiery display.',
      season: 'Spring (March-May)',
      isBlooming: true,
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Wild Lupine',
      scientificName: 'Lupinus texensis',
      description: 'Native wildflowers creating colorful carpets across Mexican meadows and roadsides.',
      season: 'Spring (March-May)',
      isBlooming: true,
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: 3,
      name: 'Jacaranda',
      scientificName: 'Jacaranda mimosifolia',
      description: 'Beautiful purple blooms that create stunning urban canopies.',
      season: 'Spring (March-May)',
      isBlooming: true,
      imageUrl: '/api/placeholder/300/200'
    }
  ];
  res.json(flowers);
});

// Health alerts endpoint
app.get('/api/health-alerts', (req, res) => {
  const alerts = [
    {
      id: 1,
      title: 'Seasonal Allergies',
      riskLevel: 'High Risk',
      populationAffected: '25% of population',
      description: 'Tree pollen from Jacaranda and other blooming trees can trigger severe allergic reactions.',
      precautions: [
        'Keep windows closed during peak bloom times',
        'Use air purifiers indoors',
        'Take antihistamines as prescribed',
        'Limit outdoor activities during morning hours'
      ],
      borderColor: 'border-l-red-500',
      riskColor: 'bg-red-500'
    },
    {
      id: 2,
      title: 'Asthma Exacerbation',
      riskLevel: 'Medium Risk',
      populationAffected: '8% of population',
      description: 'Increased pollen levels can worsen asthma symptoms and trigger breathing difficulties.',
      precautions: [
        'Carry rescue inhalers at all times',
        'Monitor local pollen forecasts',
        'Wear masks when outdoors',
        'Consider increasing controller medications'
      ],
      borderColor: 'border-l-orange-500',
      riskColor: 'bg-gray-800'
    },
    {
      id: 3,
      title: 'Hay Fever',
      riskLevel: 'Medium Risk',
      populationAffected: '15% of population',
      description: 'Grass and flower pollen contribute to classic hay fever symptoms.',
      precautions: [
        'Shower after outdoor activities',
        'Change clothes when returning indoors',
        'Use saline nasal rinses',
        'Keep humidity levels optimal (30-50%)'
      ],
      borderColor: 'border-l-orange-500',
      riskColor: 'bg-gray-800'
    }
  ];
  res.json(alerts);
});

// Bloom map zones endpoint
app.get('/api/bloom-zones', (req, res) => {
  const zones = [
    { name: 'North', percentage: 78, color: 'bg-orange-500', dominantFlowers: 'Jacaranda, Orange Blossom' },
    { name: 'Northeast', percentage: 85, color: 'bg-red-500', dominantFlowers: 'Bougainvillea, Hibiscus' },
    { name: 'East', percentage: 80, color: 'bg-red-500', dominantFlowers: 'Desert Marigold, Palo Verde' },
    { name: 'Southeast', percentage: 88, color: 'bg-red-500', dominantFlowers: 'Wild Lupine, Mexican Buckeye' },
    { name: 'South', percentage: 92, color: 'bg-red-500', dominantFlowers: 'Flamboyant, Royal Poinciana' },
    { name: 'Southwest', percentage: 65, color: 'bg-orange-500', dominantFlowers: 'Desert Marigold, Palo Verde' },
    { name: 'West', percentage: 75, color: 'bg-orange-500', dominantFlowers: 'Jacaranda, Orange Blossom' },
    { name: 'Northwest', percentage: 72, color: 'bg-orange-500', dominantFlowers: 'Desert Marigold, Palo Verde' }
  ];
  res.json(zones);
});

// Placeholder image endpoint
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
        ${width}x${height}
      </text>
    </svg>
  `;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 BloomingHealth server running on port ${PORT}`);
  console.log(`📊 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/health`);
});