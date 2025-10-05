'use client'

import Layout from '@/components/Layout'
import { MapPin, Calendar, Filter, Info } from 'lucide-react'
import { useState } from 'react'

export default function BloomMap() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  const zones = [
    { name: 'North', percentage: 78, color: 'bg-orange-500', dominantFlowers: 'Jacaranda, Orange Blossom' },
    { name: 'Northeast', percentage: 85, color: 'bg-red-500', dominantFlowers: 'Bougainvillea, Hibiscus' },
    { name: 'East', percentage: 80, color: 'bg-red-500', dominantFlowers: 'Desert Marigold, Palo Verde' },
    { name: 'Southeast', percentage: 88, color: 'bg-red-500', dominantFlowers: 'Wild Lupine, Mexican Buckeye' },
    { name: 'South', percentage: 92, color: 'bg-red-500', dominantFlowers: 'Flamboyant, Royal Poinciana' },
    { name: 'Southwest', percentage: 65, color: 'bg-orange-500', dominantFlowers: 'Desert Marigold, Palo Verde' },
    { name: 'West', percentage: 75, color: 'bg-orange-500', dominantFlowers: 'Jacaranda, Orange Blossom' },
    { name: 'Northwest', percentage: 72, color: 'bg-orange-500', dominantFlowers: 'Desert Marigold, Palo Verde' }
  ]

  const intensityLegend = [
    { color: 'bg-red-500', label: 'Very High (80%+)' },
    { color: 'bg-orange-500', label: 'High (60-79%)' },
    { color: 'bg-yellow-500', label: 'Medium (40-59%)' },
    { color: 'bg-green-500', label: 'Low (0-39%)' }
  ]

  return (
    <Layout>
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-6 h-6 text-bloom-green" />
              <h1 className="text-3xl font-bold text-gray-900">Monterrey Bloom Map</h1>
            </div>
            <p className="text-gray-600">Interactive map showing blooming intensity across Monterrey, Nuevo León zones</p>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">2024</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">All</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Map Visualization */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Monterrey Zone Blooming Activity - 2024</h2>
            <p className="text-gray-600 mb-6">Click on a zone to view detailed blooming information</p>

            {/* Circular Map */}
            <div className="flex justify-center mb-8">
              <div className="relative w-96 h-96 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                {/* Center */}
                <div className="absolute w-4 h-4 bg-bloom-green rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">Centro</span>
                </div>

                {/* Zone markers */}
                {zones.map((zone, index) => {
                  const angle = (index * 45) * (Math.PI / 180)
                  const radius = 140
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius
                  
                  return (
                    <button
                      key={zone.name}
                      onClick={() => setSelectedZone(zone.name)}
                      className={`absolute w-8 h-8 ${zone.color} rounded-full flex items-center justify-center text-white text-xs font-medium hover:scale-110 transition-transform cursor-pointer`}
                      style={{
                        left: `calc(50% + ${x}px - 16px)`,
                        top: `calc(50% + ${y}px - 16px)`
                      }}
                      title={`${zone.name} - ${zone.percentage}%`}
                    >
                      {zone.percentage}%
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center space-x-6">
              {intensityLegend.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          {/* Select Region Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Select a Region</h3>
                <p className="text-sm text-blue-800">
                  Click on any region marker on the map to view detailed blooming information, 
                  dominant flower species, and current intensity levels.
                </p>
              </div>
            </div>
          </div>

          {/* Zone Overview */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="font-semibold text-gray-900">Zone Overview - 2024</h3>
            </div>

            <div className="space-y-3">
              {zones.map((zone, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedZone === zone.name 
                      ? 'bg-bloom-green bg-opacity-10 border-bloom-green' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedZone(zone.name)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{zone.name} Monterrey</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${zone.color} rounded-full`}></div>
                      <span className="text-sm font-medium text-gray-600">{zone.percentage}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{zone.dominantFlowers}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
