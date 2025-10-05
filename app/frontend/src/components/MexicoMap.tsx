import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Flower, TrendingUp, Info, Filter, Calendar } from 'lucide-react';
import { monterreyZonesData, availableYears, availableZones, type RegionData } from '../data/mockData';

export function MexicoMap() {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);
  const [selectedZone, setSelectedZone] = useState<string>('All');

  // Get current year data and filter by zone
  const currentYearData = monterreyZonesData.find(data => data.year === selectedYear);
  
  const filteredRegions = useMemo(() => {
    if (!currentYearData) return [];
    if (selectedZone === 'All') return currentYearData.regions;
    return currentYearData.regions.filter(region => 
      region.name.toLowerCase().includes(selectedZone.toLowerCase())
    );
  }, [currentYearData, selectedZone]);

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return 'bg-red-500';
    if (intensity >= 60) return 'bg-orange-500';
    if (intensity >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 80) return 'Very High';
    if (intensity >= 60) return 'High';
    if (intensity >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Monterrey Bloom Map
          </h1>
          <p className="text-muted-foreground">
            Interactive map showing blooming intensity across Monterrey, Nuevo León zones
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                {availableZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedZone !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filteredRegions.length} zone{filteredRegions.length !== 1 ? 's' : ''} shown
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Monterrey Zone Blooming Activity - {selectedYear}</CardTitle>
              <CardDescription>
                Click on a zone to view detailed blooming information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Monterrey City Map */}
              <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 h-96 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    viewBox="0 0 400 400" 
                    className="w-full h-full max-w-lg"
                  >
                    {/* Monterrey city outline (simplified circular zones) */}
                    <circle
                      cx="200"
                      cy="200"
                      r="150"
                      fill="#f3f4f6"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    
                    {/* Zone markers positioned in 8 directions */}
                    {filteredRegions.map((region) => {
                      let x, y;
                      // Position zones in 8 directions around center
                      switch(region.id) {
                        case 'north':
                          x = 200; y = 100;
                          break;
                        case 'northeast':
                          x = 270; y = 130;
                          break;
                        case 'east':
                          x = 300; y = 200;
                          break;
                        case 'southeast':
                          x = 270; y = 270;
                          break;
                        case 'south':
                          x = 200; y = 300;
                          break;
                        case 'southwest':
                          x = 130; y = 270;
                          break;
                        case 'west':
                          x = 100; y = 200;
                          break;
                        case 'northwest':
                          x = 130; y = 130;
                          break;
                        default:
                          x = 200; y = 200;
                      }
                      
                      return (
                        <g key={region.id}>
                          <circle
                            cx={x}
                            cy={y}
                            r="25"
                            className={`cursor-pointer transition-all hover:scale-110 ${
                              selectedRegion?.id === region.id 
                                ? 'stroke-4 stroke-blue-600' 
                                : 'stroke-2 stroke-gray-400'
                            } ${getIntensityColor(region.bloomingIntensity)}`}
                            onClick={() => setSelectedRegion(region)}
                          />
                          <text
                            x={x}
                            y={y + 5}
                            textAnchor="middle"
                            className="text-xs fill-white font-medium cursor-pointer"
                            onClick={() => setSelectedRegion(region)}
                          >
                            {region.bloomingIntensity}%
                          </text>
                          <text
                            x={x}
                            y={y + 40}
                            textAnchor="middle"
                            className="text-xs fill-gray-700 font-medium"
                          >
                            {region.id.charAt(0).toUpperCase() + region.id.slice(1)}
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Center point (Monterrey center) */}
                    <circle
                      cx="200"
                      cy="200"
                      r="8"
                      fill="#059669"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x="200"
                      y="190"
                      textAnchor="middle"
                      className="text-xs fill-gray-700 font-medium"
                    >
                      Centro
                    </text>
                  </svg>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-lg">
                  <h4 className="text-sm mb-2">Blooming Intensity</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs">Very High (80%+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-xs">High (60-79%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs">Medium (40-59%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Low (0-39%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Region Details */}
        <div className="space-y-4">
          {selectedRegion ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flower className="w-5 h-5 text-green-600" />
                  {selectedRegion.name}
                </CardTitle>
                <CardDescription>
                  Detailed blooming information for this region
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Blooming Intensity</span>
                    <Badge className={getIntensityColor(selectedRegion.bloomingIntensity).replace('bg-', 'bg-') + ' text-white'}>
                      {getIntensityLabel(selectedRegion.bloomingIntensity)}
                    </Badge>
                  </div>
                  <Progress value={selectedRegion.bloomingIntensity} className="mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {selectedRegion.bloomingIntensity}% of peak bloom
                  </span>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Dominant Flowers</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRegion.dominantFlowers.map((flower, index) => (
                      <Badge key={index} variant="outline">
                        {flower}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Latitude</span>
                    <div>{selectedRegion.latitude}°</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Longitude</span>
                    <div>{selectedRegion.longitude}°</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Select a Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click on any region marker on the map to view detailed blooming information, 
                  dominant flower species, and current intensity levels.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Zone Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Zone Overview - {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredRegions.map((region) => (
                  <Button
                    key={region.id}
                    variant={selectedRegion?.id === region.id ? "default" : "ghost"}
                    className="w-full justify-between h-auto p-3"
                    onClick={() => setSelectedRegion(region)}
                  >
                    <div className="text-left">
                      <div className="text-sm">{region.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {region.dominantFlowers.slice(0, 2).join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getIntensityColor(region.bloomingIntensity)}`}></div>
                      <span className="text-xs">{region.bloomingIntensity}%</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Historical Comparison */}
          {selectedRegion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Historical Data
                </CardTitle>
                <CardDescription>
                  {selectedRegion.name} blooming trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monterreyZonesData.map((yearData) => {
                    const regionInYear = yearData.regions.find(r => r.id === selectedRegion.id);
                    if (!regionInYear) return null;
                    
                    return (
                      <div key={yearData.year} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Badge variant={yearData.year === selectedYear ? "default" : "outline"}>
                            {yearData.year}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getIntensityColor(regionInYear.bloomingIntensity)}`}></div>
                            <span className="text-sm">{regionInYear.bloomingIntensity}%</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getIntensityLabel(regionInYear.bloomingIntensity)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}