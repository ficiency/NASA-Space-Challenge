import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { useState } from 'react';
import { AlertTriangle, Flower2, Heart, Info } from 'lucide-react';

// Year selector component (simple UI placeholder for future AI integration)
function YearSelector() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear + 1);
  const years = Array.from({ length: 10 }, (_, i) => currentYear + 1 + i);

  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-1">Select Year</label>
      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="w-full rounded-md border px-2 py-1"
        aria-label="Select prediction year"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
import { currentFlowers, healthImpacts } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Dashboard() {
  const currentlyBloomingFlowers = currentFlowers.filter(flower => flower.isCurrentlyBlooming);
  const pollenLevel = 75; // Mock current pollen level
  const temperatureAvg = 24; // Mock temperature

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="flex items-center gap-2">
          <Flower2 className="w-6 h-6 text-green-600" />
          Bloom Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track blooming seasons and their health impacts across Mexico
        </p>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Year selection card (for future prediction input) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Predict Year</CardTitle>
            <Info className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
              <YearSelector />
            <p className="text-xs text-muted-foreground mt-2">
              Choose a future year to run bloom predictions (AI integration coming soon)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Blooms</CardTitle>
            <Flower2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{currentlyBloomingFlowers.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently flowering species
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Pollen Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{pollenLevel}%</div>
            <Progress value={pollenLevel} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              High - Take precautions
            </p>
          </CardContent>
        </Card>

        

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Health Alerts</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{healthImpacts.length}</div>
            <p className="text-xs text-muted-foreground">
              Active health advisories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Currently Blooming Flowers */}
      <Card>
        <CardHeader>
          <CardTitle>Currently Blooming Flowers</CardTitle>
          <CardDescription>
            Beautiful flowers creating natural displays across Mexico this season
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentlyBloomingFlowers.map((flower) => (
              <Card key={flower.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={flower.imageUrl}
                    alt={flower.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                    Blooming Now
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3>{flower.name}</h3>
                  <p className="text-sm text-muted-foreground italic mb-2">
                    {flower.scientificName}
                  </p>
                  <p className="text-sm mb-2">
                    {flower.description}
                  </p>
                  <Badge variant="outline">
                    {flower.bloomingSeason}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Impact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Health Impact Alerts</CardTitle>
          <CardDescription>
            How current blooming seasons may affect health conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {healthImpacts.map((impact) => (
            <Alert key={impact.id} className={`border-l-4 ${
              impact.severity === 'High' ? 'border-l-red-500' :
              impact.severity === 'Medium' ? 'border-l-orange-500' :
              'border-l-yellow-500'
            }`}>
              <AlertTriangle className={`h-4 w-4 ${
                impact.severity === 'High' ? 'text-red-600' :
                impact.severity === 'Medium' ? 'text-orange-600' :
                'text-yellow-600'
              }`} />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4>{impact.condition}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        impact.severity === 'High' ? 'destructive' :
                        impact.severity === 'Medium' ? 'default' :
                        'secondary'
                      }>
                        {impact.severity} Risk
                      </Badge>
                      <Badge variant="outline">
                        {impact.affectedPopulation}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm">{impact.description}</p>
                  <div className="space-y-1">
                    <p className="text-sm">Recommended precautions:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {impact.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-current rounded-full mt-2 shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Additional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Seasonal Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4>Peak Bloom Period</h4>
              <p className="text-sm text-muted-foreground">
                March through May is traditionally the most active blooming period across Mexico, 
                with Jacarandas and other native species creating spectacular natural displays.
              </p>
            </div>
            <div className="space-y-2">
              <h4>Regional Variations</h4>
              <p className="text-sm text-muted-foreground">
                Coastal regions tend to have extended blooming seasons due to moderate temperatures, 
                while mountainous areas experience more concentrated spring blooms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}