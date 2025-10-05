import { Info } from 'lucide-react'

export default function SeasonalInsights() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
      <div className="mb-6">
        <div className="flex items-center mb-1">
          <Info className="w-4 h-4 text-blue-600 mr-2" />
          <h1 className="font-bold text-gray-900">Seasonal Insights</h1>
        </div>
        <p className="text-gray-600">Key insights about blooming patterns and seasonal variations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Peak Bloom Period */}
        <div>
          <h3 className="text-sm font-normal text-gray-900 mb-3">Peak Bloom Period</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            March through May is traditionally the most active blooming period across Mexico, 
            with Jacarandas and other native species creating spectacular natural displays.
          </p>
        </div>

        {/* Regional Variations */}
        <div>
          <h3 className="text-sm font-normal text-gray-900 mb-3">Regional Variations</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Coastal regions tend to have extended blooming seasons due to moderate temperatures, 
            while mountainous areas experience more concentrated spring blooms.
          </p>
        </div>
      </div>
    </div>
  )
}
