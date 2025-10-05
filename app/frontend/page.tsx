'use client'

import Layout from '@/components/Layout'
import { 
  Flower2, 
  AlertTriangle, 
  Thermometer, 
  Heart,
  TrendingUp
} from 'lucide-react'

export default function BloomDashboard() {
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
      title: 'Temperature',
      value: '24°C',
      description: 'Average today',
      icon: Thermometer,
      color: 'text-bloom-blue'
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

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bloom Dashboard</h1>
          <p className="text-gray-600">Track blooming seasons and their health impacts across Mexico</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
    </Layout>
  )
}
