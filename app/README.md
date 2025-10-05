# BloomingHealth - Health & Bloom Tracker

A modern web application for tracking blooming seasons and their health impacts across Mexico.

## 🏗️ Project Structure

```
App/
├── frontend/           # Frontend (HTML/CSS/JS)
│   └── index.html     # Main application file
├── backend/           # Backend (Node.js/Express)
│   ├── server.js     # Express server
│   └── package.json  # Backend dependencies
├── package.json       # Root package with scripts
└── README.md         # This file
```

## 🚀 Quick Start

### Option 1: Simple Frontend Only
Just open `frontend/index.html` in your browser - no server needed!

### Option 2: Full Application with Backend
1. **Install dependencies:**
   ```bash
   cd App
   npm run install-backend
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Go to `http://localhost:5000`

## ✨ Features

- **Bloom Dashboard** - Real-time metrics and blooming flowers
- **Health Impact Alerts** - Health condition alerts with precautions
- **Monterrey Bloom Map** - Interactive map with blooming zones
- **Responsive Design** - Works on all devices
- **Navigation** - Easy page switching
- **API Ready** - Backend endpoints for future database integration

## 🔧 Development

### Frontend
- Pure HTML/CSS/JavaScript
- Tailwind CSS for styling
- No build process needed
- Easy to modify and extend

### Backend
- Node.js with Express
- RESTful API endpoints
- CORS enabled
- Ready for database integration

## 📡 API Endpoints

- `GET /api/health` - Health check
- `GET /api/metrics` - Dashboard metrics
- `GET /api/flowers` - Blooming flowers data
- `GET /api/health-alerts` - Health alerts data
- `GET /api/bloom-zones` - Map zones data

## 🎯 Easy to Extend

- Add new pages by creating new divs in `frontend/index.html`
- Add new API endpoints in `backend/server.js`
- Database integration ready
- Scalable architecture

## 📱 Usage

1. **Simple Mode**: Just open `frontend/index.html`
2. **Full Mode**: Run `npm run dev` and visit `http://localhost:5000`

Both modes give you the complete BloomingHealth experience!