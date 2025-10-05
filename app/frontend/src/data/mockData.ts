export interface FlowerData {
  id: string;
  name: string;
  scientificName: string;
  bloomingSeason: string;
  imageUrl: string;
  isCurrentlyBlooming: boolean;
  description: string;
}

export interface HealthImpact {
  id: string;
  condition: string;
  severity: 'Low' | 'Medium' | 'High';
  affectedPopulation: string;
  description: string;
  tips: string[];
}

export interface RegionData {
  id: string;
  name: string;
  bloomingIntensity: number; // 0-100
  dominantFlowers: string[];
  latitude: number;
  longitude: number;
}

export const currentFlowers: FlowerData[] = [
  {
    id: '1',
    name: 'Jacaranda',
    scientificName: 'Jacaranda mimosifolia',
    bloomingSeason: 'Spring (March-May)',
    imageUrl: 'https://images.unsplash.com/photo-1649151928783-1aca5062d116?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vbWluZyUyMGZsb3dlcnMlMjBuYXR1cmV8ZW58MXx8fHwxNzU5NjI1MzU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isCurrentlyBlooming: true,
    description: 'Beautiful purple-blue flowers creating stunning natural canopies across Mexican cities.'
  },
  {
    id: '2',
    name: 'Flamboyant',
    scientificName: 'Delonix regia',
    bloomingSeason: 'Spring-Summer (April-July)',
    imageUrl: 'https://images.unsplash.com/photo-1649786529039-8c87e837b340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG93ZXJpbmclMjB0cmVlcyUyMG5hdHVyZXxlbnwxfHx8fDE3NTk2MjUzNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isCurrentlyBlooming: true,
    description: 'Vibrant red-orange blooms that transform landscapes with their fiery display.'
  },
  {
    id: '3',
    name: 'Wild Lupine',
    scientificName: 'Lupinus texensis',
    bloomingSeason: 'Spring (March-May)',
    imageUrl: 'https://images.unsplash.com/photo-1686333330383-be7ba34e9fb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkZmxvd2VycyUyMG1lYWRvd3xlbnwxfHx8fDE3NTk1OTY2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isCurrentlyBlooming: true,
    description: 'Native wildflowers creating colorful carpets across Mexican meadows and roadsides.'
  }
];

export const healthImpacts: HealthImpact[] = [
  {
    id: '1',
    condition: 'Seasonal Allergies',
    severity: 'High',
    affectedPopulation: '25% of population',
    description: 'Tree pollen from Jacaranda and other blooming trees can trigger severe allergic reactions.',
    tips: [
      'Keep windows closed during peak bloom times',
      'Use air purifiers indoors',
      'Take antihistamines as prescribed',
      'Limit outdoor activities during morning hours'
    ]
  },
  {
    id: '2',
    condition: 'Asthma Exacerbation',
    severity: 'Medium',
    affectedPopulation: '8% of population',
    description: 'Increased pollen levels can worsen asthma symptoms and trigger breathing difficulties.',
    tips: [
      'Carry rescue inhalers at all times',
      'Monitor local pollen forecasts',
      'Wear masks when outdoors',
      'Consider increasing controller medications'
    ]
  },
  {
    id: '3',
    condition: 'Hay Fever',
    severity: 'Medium',
    affectedPopulation: '15% of population',
    description: 'Grass and flower pollen contribute to classic hay fever symptoms.',
    tips: [
      'Shower after outdoor activities',
      'Change clothes when returning indoors',
      'Use saline nasal rinses',
      'Keep humidity levels optimal (30-50%)'
    ]
  }
];

export interface YearlyData {
  year: number;
  regions: RegionData[];
}

// Monterrey zones with historical data
export const monterreyZonesData: YearlyData[] = [
  {
    year: 2024,
    regions: [
      {
        id: 'north',
        name: 'North Monterrey',
        bloomingIntensity: 78,
        dominantFlowers: ['Jacaranda', 'Orange Blossom'],
        latitude: 25.7617,
        longitude: -100.2722
      },
      {
        id: 'northeast',
        name: 'Northeast Monterrey',
        bloomingIntensity: 85,
        dominantFlowers: ['Bougainvillea', 'Hibiscus'],
        latitude: 25.7500,
        longitude: -100.2500
      },
      {
        id: 'northwest',
        name: 'Northwest Monterrey',
        bloomingIntensity: 72,
        dominantFlowers: ['Desert Marigold', 'Palo Verde'],
        latitude: 25.7500,
        longitude: -100.3500
      },
      {
        id: 'south',
        name: 'South Monterrey',
        bloomingIntensity: 92,
        dominantFlowers: ['Flamboyant', 'Royal Poinciana'],
        latitude: 25.6000,
        longitude: -100.2722
      },
      {
        id: 'southeast',
        name: 'Southeast Monterrey',
        bloomingIntensity: 88,
        dominantFlowers: ['Wild Lupine', 'Mexican Buckeye'],
        latitude: 25.6200,
        longitude: -100.2200
      },
      {
        id: 'southwest',
        name: 'Southwest Monterrey',
        bloomingIntensity: 65,
        dominantFlowers: ['Cenizo', 'Retama'],
        latitude: 25.6200,
        longitude: -100.3200
      },
      {
        id: 'east',
        name: 'East Monterrey',
        bloomingIntensity: 80,
        dominantFlowers: ['Esperanza', 'Mexican Honeysuckle'],
        latitude: 25.6722,
        longitude: -100.2000
      },
      {
        id: 'west',
        name: 'West Monterrey',
        bloomingIntensity: 75,
        dominantFlowers: ['Texas Sage', 'Desert Willow'],
        latitude: 25.6722,
        longitude: -100.3500
      }
    ]
  },
  {
    year: 2023,
    regions: [
      {
        id: 'north',
        name: 'North Monterrey',
        bloomingIntensity: 82,
        dominantFlowers: ['Jacaranda', 'Orange Blossom'],
        latitude: 25.7617,
        longitude: -100.2722
      },
      {
        id: 'northeast',
        name: 'Northeast Monterrey',
        bloomingIntensity: 79,
        dominantFlowers: ['Bougainvillea', 'Hibiscus'],
        latitude: 25.7500,
        longitude: -100.2500
      },
      {
        id: 'northwest',
        name: 'Northwest Monterrey',
        bloomingIntensity: 68,
        dominantFlowers: ['Desert Marigold', 'Palo Verde'],
        latitude: 25.7500,
        longitude: -100.3500
      },
      {
        id: 'south',
        name: 'South Monterrey',
        bloomingIntensity: 95,
        dominantFlowers: ['Flamboyant', 'Royal Poinciana'],
        latitude: 25.6000,
        longitude: -100.2722
      },
      {
        id: 'southeast',
        name: 'Southeast Monterrey',
        bloomingIntensity: 85,
        dominantFlowers: ['Wild Lupine', 'Mexican Buckeye'],
        latitude: 25.6200,
        longitude: -100.2200
      },
      {
        id: 'southwest',
        name: 'Southwest Monterrey',
        bloomingIntensity: 62,
        dominantFlowers: ['Cenizo', 'Retama'],
        latitude: 25.6200,
        longitude: -100.3200
      },
      {
        id: 'east',
        name: 'East Monterrey',
        bloomingIntensity: 77,
        dominantFlowers: ['Esperanza', 'Mexican Honeysuckle'],
        latitude: 25.6722,
        longitude: -100.2000
      },
      {
        id: 'west',
        name: 'West Monterrey',
        bloomingIntensity: 71,
        dominantFlowers: ['Texas Sage', 'Desert Willow'],
        latitude: 25.6722,
        longitude: -100.3500
      }
    ]
  },
  {
    year: 2022,
    regions: [
      {
        id: 'north',
        name: 'North Monterrey',
        bloomingIntensity: 75,
        dominantFlowers: ['Jacaranda', 'Orange Blossom'],
        latitude: 25.7617,
        longitude: -100.2722
      },
      {
        id: 'northeast',
        name: 'Northeast Monterrey',
        bloomingIntensity: 73,
        dominantFlowers: ['Bougainvillea', 'Hibiscus'],
        latitude: 25.7500,
        longitude: -100.2500
      },
      {
        id: 'northwest',
        name: 'Northwest Monterrey',
        bloomingIntensity: 65,
        dominantFlowers: ['Desert Marigold', 'Palo Verde'],
        latitude: 25.7500,
        longitude: -100.3500
      },
      {
        id: 'south',
        name: 'South Monterrey',
        bloomingIntensity: 89,
        dominantFlowers: ['Flamboyant', 'Royal Poinciana'],
        latitude: 25.6000,
        longitude: -100.2722
      },
      {
        id: 'southeast',
        name: 'Southeast Monterrey',
        bloomingIntensity: 81,
        dominantFlowers: ['Wild Lupine', 'Mexican Buckeye'],
        latitude: 25.6200,
        longitude: -100.2200
      },
      {
        id: 'southwest',
        name: 'Southwest Monterrey',
        bloomingIntensity: 58,
        dominantFlowers: ['Cenizo', 'Retama'],
        latitude: 25.6200,
        longitude: -100.3200
      },
      {
        id: 'east',
        name: 'East Monterrey',
        bloomingIntensity: 74,
        dominantFlowers: ['Esperanza', 'Mexican Honeysuckle'],
        latitude: 25.6722,
        longitude: -100.2000
      },
      {
        id: 'west',
        name: 'West Monterrey',
        bloomingIntensity: 68,
        dominantFlowers: ['Texas Sage', 'Desert Willow'],
        latitude: 25.6722,
        longitude: -100.3500
      }
    ]
  }
];

export const availableYears = monterreyZonesData.map(data => data.year);
export const availableZones = ['All', 'North', 'Northeast', 'Northwest', 'South', 'Southeast', 'Southwest', 'East', 'West'];