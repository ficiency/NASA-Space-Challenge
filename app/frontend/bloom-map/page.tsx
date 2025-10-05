'use client'

import Layout from '@/components/Layout'
import { MapPin, Calendar, Filter, Info, ChevronDown, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export default function BloomMap() {
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('2024')
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [showYearDropdown, setShowYearDropdown] = useState(false)

  const regions = [
    'Monterrey Norte',
    'Monterrey Noreste', 
    'Monterrey Noroeste',
    'Monterrey Este',
    'Monterrey Oeste',
    'Monterrey Sur',
    'Monterrey Sureste',
    'Monterrey Suroeste'
  ]

  // Generate years from 2020 to 2030
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i)

  const isFutureYear = parseInt(selectedYear) > currentYear

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

          {/* Selection Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Region and Year</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Region Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Region</label>
                <div className="relative">
                  <button
                    onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-bloom-green transition-colors"
                  >
                    <span className={selectedRegion ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedRegion || 'Choose a region...'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showRegionDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {regions.map((region) => (
                        <button
                          key={region}
                          onClick={() => {
                            setSelectedRegion(region)
                            setShowRegionDropdown(false)
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Year Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Year</label>
                <div className="relative">
                  <button
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-bloom-green transition-colors"
                  >
                    <span className="text-gray-900">{selectedYear}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showYearDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            setSelectedYear(year.toString())
                            setShowYearDropdown(false)
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors flex items-center justify-between"
                        >
                          <span>{year}</span>
                          {year > currentYear && (
                            <span className="text-xs text-orange-600 font-medium">Prediction</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Future Year Warning */}
            {isFutureYear && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-orange-900 mb-1">Prediction Data</h3>
                    <p className="text-sm text-orange-800">
                      The data for {selectedYear} represents predictions based on historical patterns and climate models. 
                      These are estimates and may not reflect actual future conditions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Visualization */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {selectedRegion ? `${selectedRegion} - ${selectedYear}` : 'Monterrey Zone Blooming Activity'}
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedRegion 
                ? `Viewing data for ${selectedRegion} in ${selectedYear}${isFutureYear ? ' (Prediction)' : ''}`
                : 'Select a region and year to view detailed blooming information'
              }
            </p>

            {/* Map Placeholder */}
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Interactive Map</h3>
                <p className="text-gray-500">
                  {selectedRegion 
                    ? `Map visualization for ${selectedRegion} will be displayed here`
                    : 'Map will be displayed here once a region is selected'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          {/* Selection Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">How to Use</h3>
                <p className="text-sm text-blue-800">
                  Select a region and year from the dropdowns above to view detailed blooming information, 
                  dominant flower species, and intensity levels for that specific area and time period.
                </p>
              </div>
            </div>
          </div>

          {/* Selected Information */}
          {selectedRegion && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-bloom-green" />
                <h3 className="font-semibold text-gray-900">Selected Region</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-bloom-green bg-opacity-10 border border-bloom-green rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{selectedRegion}</span>
                    <span className="text-sm text-bloom-green font-medium">{selectedYear}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {isFutureYear ? 'Prediction data will be displayed here' : 'Historical data will be displayed here'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
