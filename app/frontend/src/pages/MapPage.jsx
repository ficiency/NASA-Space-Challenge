import React from 'react'

export default function MapPage() {
  return (
    <div>
      <h2>Map</h2>
      <p>En esta página insertaremos un mapa. Por ahora se reserva un contenedor.</p>
      <div
        id="map-container"
        style={{ width: '100%', height: 400, background: '#e6eef8', border: '1px solid #c7d2fe' }}
      >
        <p style={{ padding: 16 }}>Contenedor de mapa (placeholder)</p>
      </div>
    </div>
  )
}
