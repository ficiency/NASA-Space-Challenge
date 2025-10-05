import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import MapPage from './pages/MapPage'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
        <header style={{ marginBottom: 12 }}>
          <h1>NASA Simple Template</h1>
          <nav>
            <Link to="/" style={{ marginRight: 12 }}>Dashboard</Link>
            <Link to="/map">Map</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<MapPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
