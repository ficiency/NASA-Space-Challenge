import { AlertTriangle } from 'lucide-react'

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
      riskColor: 'bg-gradient-to-r from-red-500 to-rose-500'
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
      riskColor: 'bg-gradient-to-r from-orange-500 to-amber-500'
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
      riskColor: 'bg-gradient-to-r from-orange-500 to-amber-500'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8">
      <div className="mb-6">
        <h1 className="font-bold text-gray-900 mb-1">Health Impact Alerts</h1>
        <p className="text-gray-600">How current blooming seasons may affect health conditions</p>
      </div>
      
      <div className="space-y-6">
        {alerts.map((alert) => (
        <div key={alert.id} className={`bg-white rounded-2xl shadow-sm border border-gray-200/50 ${alert.borderColor} border-l-4 hover:shadow-md transition-all duration-200`}>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-white/70">
                  <AlertTriangle className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-sm text-gray-900">{alert.title}</h3>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-2 rounded-full text-white text-xs font-medium shadow-sm ${alert.riskColor}`}>
                  {alert.riskLevel}
                </span>
                <span className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full">{alert.populationAffected}</span>
              </div>
            </div>

            <p className="text-gray-700 text-sm">{alert.description}</p>

            <div className="bg-white/50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Recommended Precautions:</h4>
              <ul className="space-y-2">
                {alert.precautions.map((precaution, index) => (
                  <li key={index} className="flex items-start space-x-3 text-sm text-gray-700">
                    <span className="text-emerald-500 mt-1 font-bold">•</span>
                    <span>{precaution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  )
}