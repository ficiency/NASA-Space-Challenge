import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Coordenadas de Monterrey
const MONTERREY_CENTER: [number, number] = [25.6866, -100.3161]

// Zonas de Monterrey con coordenadas realistas basadas en puntos geográficos
const ZONAS_MONTERREY = [
  {
    id: 'noroeste',
    name: 'Noroeste',
    center: [25.7600, -100.3800] as [number, number],
    color: '#ff6b6b',
    bloomLevel: 82,
    description: 'Cerro de las Mitras - Zona montañosa con especies adaptadas',
    emoji: '🏔️',
    species: ['Pine', 'Oak', 'Cedar', 'Agave'],
    riskLevel: 'Low',
    temperature: '21°C',
    humidity: '58%',
    windSpeed: '12 km/h',
    lastUpdate: '3 hours ago',
    alerts: ['Mountain species blooming']
  },
  {
    id: 'noreste',
    name: 'Noreste',
    center: [25.7800, -100.2200] as [number, number],
    color: '#4ecdc4',
    bloomLevel: 89,
    description: 'Cerro del Topo Chico - Alta diversidad floral urbana',
    emoji: '🌸',
    species: ['Jacaranda', 'Flamboyant', 'Bougainvillea', 'Tabebuia'],
    riskLevel: 'High',
    temperature: '25°C',
    humidity: '72%',
    windSpeed: '6 km/h',
    lastUpdate: '1 hour ago',
    alerts: ['Peak urban bloom', 'High pollen activity']
  },
  {
    id: 'centro',
    name: 'Centro',
    center: [25.6700, -100.3100] as [number, number],
    color: '#9b59b6',
    bloomLevel: 95,
    description: 'Centro Histórico - Máxima concentración floral urbana',
    emoji: '🌺',
    species: ['Jacaranda', 'Plumeria', 'Bougainvillea', 'Royal Poinciana'],
    riskLevel: 'High',
    temperature: '27°C',
    humidity: '75%',
    windSpeed: '4 km/h',
    lastUpdate: '30 min ago',
    alerts: ['Peak bloom period', 'Urban heat island effect']
  },
  {
    id: 'suroeste',
    name: 'Suroeste',
    center: [25.6200, -100.3800] as [number, number],
    color: '#e67e22',
    bloomLevel: 76,
    description: 'Cerro del Mirador - Zona residencial con jardines',
    emoji: '🌻',
    species: ['Rose', 'Gardenia', 'Hibiscus', 'Marigold'],
    riskLevel: 'Low',
    temperature: '23°C',
    humidity: '62%',
    windSpeed: '10 km/h',
    lastUpdate: '4 hours ago',
    alerts: ['Residential gardens blooming']
  },
  {
    id: 'sureste',
    name: 'Sureste',
    center: [25.6200, -100.2200] as [number, number],
    color: '#ff8e53',
    bloomLevel: 87,
    description: 'Cerro de la Silla - Zona emblemática con flora nativa',
    emoji: '🌷',
    species: ['Mexican Sunflower', 'Cosmos', 'Wild Lupine', 'Desert Marigold'],
    riskLevel: 'Medium',
    temperature: '24°C',
    humidity: '68%',
    windSpeed: '8 km/h',
    lastUpdate: '2 hours ago',
    alerts: ['Native species peak', 'Cerro de la Silla blooming']
  },
  {
    id: 'norte',
    name: 'Norte',
    center: [25.7500, -100.3100] as [number, number],
    color: '#3498db',
    bloomLevel: 84,
    description: 'Zona Norte - Área residencial con parques urbanos',
    emoji: '🌳',
    species: ['Jacaranda', 'Oak', 'Eucalyptus', 'Bougainvillea'],
    riskLevel: 'Medium',
    temperature: '23°C',
    humidity: '64%',
    windSpeed: '9 km/h',
    lastUpdate: '2 hours ago',
    alerts: ['Urban parks blooming']
  },
  {
    id: 'sur',
    name: 'Sur',
    center: [25.5800, -100.3100] as [number, number],
    color: '#27ae60',
    bloomLevel: 79,
    description: 'Zona Sur - Área residencial con jardines privados',
    emoji: '🌿',
    species: ['Rose', 'Gardenia', 'Hibiscus', 'Lavender'],
    riskLevel: 'Low',
    temperature: '22°C',
    humidity: '61%',
    windSpeed: '11 km/h',
    lastUpdate: '3 hours ago',
    alerts: ['Private gardens active']
  },
  {
    id: 'este',
    name: 'Este',
    center: [25.6700, -100.1800] as [number, number],
    color: '#8e44ad',
    bloomLevel: 86,
    description: 'Zona Este - Área industrial con espacios verdes',
    emoji: '🏭',
    species: ['Mexican Sunflower', 'Marigold', 'Zinnia', 'Cosmos'],
    riskLevel: 'Medium',
    temperature: '24°C',
    humidity: '66%',
    windSpeed: '7 km/h',
    lastUpdate: '2 hours ago',
    alerts: ['Industrial green spaces blooming']
  },
  {
    id: 'oeste',
    name: 'Oeste',
    center: [25.6700, -100.4400] as [number, number],
    color: '#95a5a6',
    bloomLevel: 73,
    description: 'Zona Oeste - Área montañosa con especies nativas',
    emoji: '⛰️',
    species: ['Cactus Flower', 'Agave', 'Desert Marigold', 'Yucca'],
    riskLevel: 'Low',
    temperature: '20°C',
    humidity: '52%',
    windSpeed: '14 km/h',
    lastUpdate: '4 hours ago',
    alerts: ['Desert species blooming']
  }
]

// Polígonos realistas de las zonas de Monterrey
const ZONA_POLYGONS = [
  {
    id: 'noroeste',
    coordinates: [
      [25.8000, -100.4500],
      [25.8000, -100.3100],
      [25.7200, -100.3100],
      [25.7200, -100.4500]
    ] as [number, number][]
  },
  {
    id: 'noreste',
    coordinates: [
      [25.8000, -100.3100],
      [25.8000, -100.1300],
      [25.7200, -100.1300],
      [25.7200, -100.3100]
    ] as [number, number][]
  },
  {
    id: 'centro',
    coordinates: [
      [25.7200, -100.3800],
      [25.7200, -100.2400],
      [25.6200, -100.2400],
      [25.6200, -100.3800]
    ] as [number, number][]
  },
  {
    id: 'suroeste',
    coordinates: [
      [25.6200, -100.4500],
      [25.6200, -100.3100],
      [25.5400, -100.3100],
      [25.5400, -100.4500]
    ] as [number, number][]
  },
  {
    id: 'sureste',
    coordinates: [
      [25.6200, -100.3100],
      [25.6200, -100.1300],
      [25.5400, -100.1300],
      [25.5400, -100.3100]
    ] as [number, number][]
  },
  {
    id: 'norte',
    coordinates: [
      [25.7800, -100.3800],
      [25.7800, -100.2400],
      [25.7200, -100.2400],
      [25.7200, -100.3800]
    ] as [number, number][]
  },
  {
    id: 'sur',
    coordinates: [
      [25.6200, -100.3800],
      [25.6200, -100.2400],
      [25.5400, -100.2400],
      [25.5400, -100.3800]
    ] as [number, number][]
  },
  {
    id: 'este',
    coordinates: [
      [25.7200, -100.2400],
      [25.7200, -100.1200],
      [25.6200, -100.1200],
      [25.6200, -100.2400]
    ] as [number, number][]
  },
  {
    id: 'oeste',
    coordinates: [
      [25.7200, -100.4800],
      [25.7200, -100.3800],
      [25.6200, -100.3800],
      [25.6200, -100.4800]
    ] as [number, number][]
  }
]

function ZoneMarker({ zona, onMarkerClick }: { zona: any, onMarkerClick: (zona: any) => void }) {
  const svgString = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="20" cy="20" r="18" fill="${zona.color}" stroke="white" stroke-width="3" filter="url(#glow)" opacity="0.9"/>
    <text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${zona.emoji}</text>
    <text x="20" y="38" text-anchor="middle" fill="${zona.color}" font-size="8" font-weight="bold">${zona.bloomLevel}%</text>
  </svg>`
  
  const customIcon = new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })

  return (
    <Marker 
      position={zona.center} 
      icon={customIcon}
      eventHandlers={{
        click: () => onMarkerClick(zona)
      }}
    />
  )
}

export default function BloomMap() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>('2024')
  const [selectedMarker, setSelectedMarker] = useState<any>(null)

  const years = ['2022', '2023', '2024', '2025']

  const handleMarkerClick = (zona: any) => {
    setSelectedMarker(selectedMarker?.id === zona.id ? null : zona)
  }

  return (
    <div className="p-6 h-screen">

      {/* Map Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden relative w-full h-full">
        {/* Zone Info Popup - Top Right */}
        {selectedMarker && (
          <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-emerald-500/80 p-6 max-w-[400px] w-80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{selectedMarker.emoji}</span>
                <h3 className="font-bold text-gray-900">{selectedMarker.name}</h3>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{selectedMarker.description}</p>
            
            {/* Bloom Level & Risk */}
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg mb-3">
              <span className="text-sm font-medium text-gray-700">Bloom Level:</span>
              <span className="text-sm font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: selectedMarker.color }}>
                {selectedMarker.bloomLevel}%
              </span>
            </div>

            {/* Species */}
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Active Species:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedMarker.species.map((species: string, index: number) => (
                  <span key={index} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    {species}
                  </span>
                ))}
              </div>
            </div>

            {/* Weather Data */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <div className="text-xs text-blue-600 font-medium">Temperature</div>
                <div className="text-sm font-bold text-blue-800">{selectedMarker.temperature}</div>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <div className="text-xs text-green-600 font-medium">Humidity</div>
                <div className="text-sm font-bold text-green-800">{selectedMarker.humidity}</div>
              </div>
            </div>

            {/* Risk Level & Alerts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Health Risk:</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  selectedMarker.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                  selectedMarker.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedMarker.riskLevel}
                </span>
              </div>
              
              {selectedMarker.alerts.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">Alerts:</div>
                  {selectedMarker.alerts.map((alert: string, index: number) => (
                    <div key={index} className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mb-1">
                      ⚠️ {alert}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-gray-500 text-right">
                Updated {selectedMarker.lastUpdate}
              </div>
            </div>
          </div>
        )}

        {/* Zone & Year Selector Overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Controls:</label>
            
            {/* Zone Select */}
            <select
              value={selectedZone || ''}
              onChange={(e) => setSelectedZone(e.target.value || null)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-[160px]"
            >
              <option value="">All Zones</option>
              {ZONAS_MONTERREY.map((zona) => (
                <option key={zona.id} value={zona.id}>
                  {zona.emoji} {zona.name} ({zona.bloomLevel}%)
                </option>
              ))}
            </select>

            {/* Year Select */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-[100px]"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{ height: 'calc(100vh - 3rem)', width: '100%' }}>
          <MapContainer
            center={MONTERREY_CENTER}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            className="watercolor-map"
          >
            {/* CartoDB Voyager Tiles - Colorful and reliable */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
              maxZoom={20}
            />
            
            {/* Zone Polygons with Watercolor Style */}
            {ZONA_POLYGONS.map((polygon) => {
              const zona = ZONAS_MONTERREY.find(z => z.id === polygon.id)
              return (
                <Polygon
                  key={polygon.id}
                  positions={polygon.coordinates}
                  pathOptions={{
                    fillColor: zona?.color || '#ff6b6b',
                    fillOpacity: selectedZone === polygon.id ? 0.4 : 0.15,
                    color: zona?.color || '#ff6b6b',
                    weight: selectedZone === polygon.id ? 4 : 2,
                    opacity: selectedZone === polygon.id ? 0.8 : 0.5,
                    dashArray: selectedZone === polygon.id ? '10, 10' : '5, 5'
                  }}
                  eventHandlers={{
                    click: () => setSelectedZone(selectedZone === polygon.id ? null : polygon.id)
                  }}
                />
              )
            })}
            
            {/* Animated Zone Markers */}
            {ZONAS_MONTERREY.map((zona) => (
              <ZoneMarker key={zona.id} zona={zona} onMarkerClick={handleMarkerClick} />
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Custom CSS for watercolor styling */}
      <style>{`
        .watercolor-map {
          filter: saturate(1.2) contrast(1.1);
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .custom-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  )
}