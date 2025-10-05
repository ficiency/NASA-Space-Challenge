
export default function BloomingFlowers() {
  const bloomingFlowers = [
    {
      name: 'Cupressaceae',
      scientificName: 'Cupressaceae family',
      description: 'Evergreen coniferous trees with distinctive foliage and aromatic wood.',
      season: 'Year-round',
      isBlooming: true,
      image: '/images/flowers/cupressaceae.jpg'
    },
    {
      name: 'Fresnus',
      scientificName: 'Fraxinus species',
      description: 'Deciduous trees known for their compound leaves and winged seeds.',
      season: 'Spring-Fall (March-November)',
      isBlooming: true,
      image: '/images/flowers/fresnus.jpg'
    },
    {
      name: 'Poaceae',
      scientificName: 'Poaceae family',
      description: 'Grass family including many flowering plants and cereal crops.',
      season: 'Spring-Summer (March-August)',
      isBlooming: true,
      image: '/images/flowers/poaceae.jpg'
    }
  ]

  return (
    <div className="bg-white rounded-2xl mb-8 shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
      <div className="mb-6">
        <h1 className="font-bold text-gray-900 mb-1">Currently Blooming Flowers</h1>
        <p className="text-gray-600">Beautiful flowers creating natural displays across Mexico this season.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bloomingFlowers.map((flower, index) => (
          <div key={index} className="bg-white border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="relative">
              <div className="w-full h-48 relative overflow-hidden">
                <img 
                  src={flower.image} 
                  alt={flower.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{flower.name}</h3>
              <p className="text-sm text-gray-500 italic mb-3">{flower.scientificName}</p>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{flower.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-2 rounded-full font-medium">
                  {flower.season}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}