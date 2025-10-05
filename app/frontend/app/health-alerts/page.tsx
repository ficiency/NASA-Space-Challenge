'use client'

import Layout from '../Layout'
import { AlertTriangle, Info } from 'lucide-react'

export default function HealthAlerts() {
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
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Impact Alerts</h1>
          <p className="text-gray-600">How current blooming seasons may affect health conditions</p>
        </div>

        {/* Alert Cards */}
        <div className="space-y-6">
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

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Stay Informed</h3>
              <p className="text-blue-800">
                These alerts are based on current blooming data and historical health impact patterns. 
                Always consult with healthcare professionals for personalized medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
