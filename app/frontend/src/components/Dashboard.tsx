import { 
  Flower2, 
  AlertTriangle, 
  Heart,
  Thermometer
} from 'lucide-react'
import HealthAlerts from './HealthAlerts'
import BloomingFlowers from './BloomingFlowers'
import SeasonalInsights from './SeasonalInsights'

export default function Dashboard() {
  const metrics = [
    {
      title: 'Active Blooms',
      value: '3',
      description: 'Currently flowering species',
      icon: Flower2,
      color: 'text-emerald-600',
      iconBg: 'bg-emerald-100'
    },
    {
      title: 'Pollen Level',
      value: '75%',
      description: 'High - Take precautions',
      icon: AlertTriangle,
      color: 'text-orange-600',
      iconBg: 'bg-orange-100',
      progress: 75
    },
    {
      title: 'Temperature',
      value: '24°C',
      description: 'Average today',
      icon: Thermometer,
      color: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Health Alerts',
      value: '3',
      description: 'Active health advisories',
      icon: Heart,
      color: 'text-rose-600',
      iconBg: 'bg-rose-100'
    }
  ]

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-gray-900 mb-1">Bloom Dashboard</h1>
        <p className="text-gray-600">Track blooming seasons and their health impacts across Mexico</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
             <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
               <div className="absolute top-4 right-4">
                 <Icon className={`w-5 h-5 ${metric.color}`} />
               </div>
               
               <div className="mb-4">
                 <h3 className="text-xs font-normal text-gray-900 mb-2">{metric.title}</h3>
                 <p className="text-2xl font-normal text-gray-900 mb-2">{metric.value}</p>
                 {metric.progress && (
                   <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                     <div 
                       className="bg-gray-800 h-2 rounded-full" 
                       style={{ width: `${metric.progress}%` }}
                     ></div>
                   </div>
                 )}
                 <p className="text-sm text-gray-500">{metric.description}</p>
               </div>
             </div>
          )
        })}
      </div>
      {/* Currently Blooming Flowers */}
      <BloomingFlowers />
      
      {/* Health Alerts */}
      <HealthAlerts />

      {/* Seasonal Insights */}
      <SeasonalInsights />
    </div>
  )
}