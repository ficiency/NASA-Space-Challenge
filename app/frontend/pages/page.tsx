'use client'

import { 
  Flower2, 
  AlertTriangle, 
  Heart,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'

export default function BloomDashboard() {
  const [selectedYear, setSelectedYear] = useState<string>('2024')
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i)
  const metrics = [
    {
      title: 'Active Blooms',
      value: '3',
      description: 'Currently flowering species',
      icon: Flower2,
      color: 'text-bloom-green'
    },
    {
      title: 'Pollen Level',
      value: '75%',
      description: 'High - Take precautions',
      icon: AlertTriangle,
      color: 'text-bloom-orange',
      progress: 75
    },
    {
      title: 'Health Alerts',
      value: '3',
      description: 'Active health advisories',
      icon: Heart,
      color: 'text-bloom-red'
    }
  ]

  const bloomingFlowers = [
    {
      name: 'Flamboyant',
      scientificName: 'Delonix regia',
      description: 'Vibrant red-orange blooms that transform landscapes with their fiery display.',
      image: '/api/placeholder/300/200',
      season: 'Spring (March-May)',
      isBlooming: true
    },
    {
      name: 'Wild Lupine',
      scientificName: 'Lupinus texensis',
      description: 'Native wildflowers creating colorful carpets across Mexican meadows and roadsides.',
      image: '/api/placeholder/300/200',
      season: 'Spring (March-May)',
      isBlooming: true
    },
    {
      name: 'Jacaranda',
      scientificName: 'Jacaranda mimosifolia',
      description: 'Beautiful purple blooms that create stunning urban canopies.',
      image: '/api/placeholder/300/200',
      season: 'Spring (March-May)',
      isBlooming: true
    }
  ]

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
  ]

  return (
      <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bloom Dashboard</h1>
        <p className="text-gray-600">Track blooming seasons and their health impacts across Mexico</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Year Selector (first card) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-gray-100`}>
              {/* Simple calendar glyph replacement using Flower2 for consistency */}
              <Flower2 className={`w-6 h-6 text-bloom-green`} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Year</h3>
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
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gray-100`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                {metric.progress && (
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-bloom-orange h-2 rounded-full" 
                      style={{ width: `${metric.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.description}</p>
            </div>
          )
        })}
      </div>

      {/* Health Alerts - placed under first row of info squares */}
      <div className="space-y-6 mb-8">
        {alerts.map((alert) => (
          <div key={alert.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 ${alert.borderColor} border-l-4`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-gray-800" />
                  <h2 className="text-xl font-bold text-gray-900">{alert.title}</h2>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${alert.riskColor}`}>
                    {alert.riskLevel}
                  </span>
                  <span className="text-sm text-gray-600">{alert.populationAffected}</span>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{alert.description}</p>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommended Precautions:</h3>
                <ul className="space-y-2">
                  {alert.precautions.map((precaution, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                      <span className="text-bloom-green mt-1">•</span>
                      <span>{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Currently Blooming Flowers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Currently Blooming Flowers</h2>
          <p className="text-gray-600">Beautiful flowers creating natural displays across Mexico this season.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bloomingFlowers.map((flower, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <Flower2 className="w-16 h-16 text-bloom-green" />
                </div>
                {flower.isBlooming && (
                  <div className="absolute top-3 right-3 bg-bloom-green text-white px-2 py-1 rounded text-xs font-medium">
                    Blooming Now
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{flower.name}</h3>
                <p className="text-sm text-gray-500 italic mb-3">{flower.scientificName}</p>
                <p className="text-sm text-gray-600 mb-3">{flower.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {flower.season}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
  )
}