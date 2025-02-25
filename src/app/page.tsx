'use client'

import { useState, useEffect } from 'react'
import { AirQualityData } from '@/lib/types'
import { formatDate, getAqiLevel } from '@/lib/utils'
import FilterDropdown from '@/components/FilterDropdown'
import IndoorAirQualityComparison from '@/components/IndoorAirQualityComparison'

export default function Home() {
  const [data, setData] = useState<AirQualityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStation, setSelectedStation] = useState<AirQualityData | null>(null)
  const [locationFilters, setLocationFilters] = useState({
    country: '',
    state: ''
  })
  const [sortConfig, setSortConfig] = useState({
    key: 'aqi',
    direction: 'asc'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/air-quality-data.json')
      if (!response.ok) throw new Error('Failed to fetch data')
      const jsonData = await response.json()
      console.log('Fetched data:', jsonData)
      setData(jsonData)
    } catch (err) {
      setError('Failed to load air quality data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-100 text-green-800'
    if (aqi <= 100) return 'bg-yellow-100 text-yellow-800'
    if (aqi <= 150) return 'bg-orange-100 text-orange-800'
    if (aqi <= 200) return 'bg-red-100 text-red-800'
    return 'bg-purple-100 text-purple-800'
  }

  const getPm25Color = (pm25: number) => {
    if (pm25 < 12) return 'bg-green-100 text-green-800'
    if (pm25 < 35) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const getStatusEmoji = (aqi: number) => {
    if (aqi <= 100) return '🙂'
    if (aqi <= 150) return '😐'
    return '🙁'
  }

  const getOverallStatus = (aqi: number, pm25?: number) => {
    // Get AQI status
    let aqiStatus = 'Good'
    if (aqi > 150) aqiStatus = 'Bad'
    else if (aqi > 100) aqiStatus = 'So-so'

    // Get PM2.5 status
    let pm25Status = 'Good'
    if (pm25) {
      if (pm25 >= 35) pm25Status = 'Bad'
      else if (pm25 >= 12) pm25Status = 'So-so'
    }

    // Return the worst status
    if (aqiStatus === 'Bad' || pm25Status === 'Bad') return 'Bad'
    if (aqiStatus === 'So-so' || pm25Status === 'So-so') return 'So-so'
    return 'Good'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return 'bg-green-100 text-green-800'
      case 'So-so':
        return 'bg-orange-100 text-orange-800'
      case 'Bad':
        return 'bg-red-100 text-red-800'
      default:
        return ''
    }
  }

  const getStatusEmojiForStatus = (status: string) => {
    switch (status) {
      case 'Good':
        return '😊'
      case 'So-so':
        return '😐'
      case 'Bad':
        return '😭'
      default:
        return ''
    }
  }

  const handleSort = (key: keyof AirQualityData | 'city.name' | 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Helper function to extract location parts
  const extractLocationParts = (stationName: string) => {
    const parts = stationName.split(',').map(part => part.trim())
    return {
      city: parts[0] || '',
      state: parts[1] || '',
      country: parts[parts.length - 1] || ''
    }
  }

  const filteredData = data.filter(item => {
    const matchesSearch = item.city.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = !locationFilters.country || 
      item.city.name.toLowerCase().includes(locationFilters.country.toLowerCase())
    const matchesState = !locationFilters.state || 
      item.city.name.toLowerCase().includes(locationFilters.state.toLowerCase())
    return matchesSearch && matchesCountry && matchesState
  })

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue: any
    let bValue: any

    // Handle special sorting cases
    if (sortConfig.key === 'city.name') {
      aValue = a.city.name
      bValue = b.city.name
    } else if (['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'].includes(sortConfig.key)) {
      // Handle pollutant sorting
      aValue = a.iaqi[sortConfig.key]?.v ?? -1
      bValue = b.iaqi[sortConfig.key]?.v ?? -1
    } else {
      aValue = a[sortConfig.key as keyof AirQualityData]
      bValue = b[sortConfig.key as keyof AirQualityData]
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    return sortConfig.direction === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number)
  })

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-pulse">Loading air quality data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        {error}
        <button 
          onClick={fetchData}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-black">Global Air Quality Index</h1>
      
      <div className="flex gap-4">
        <div className="flex-1">
          {/* Search and Filter UI */}
          <div className="mb-6">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search stations..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-black placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <FilterDropdown 
                data={data}
                onFilterChange={setLocationFilters}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="p-3 text-left cursor-pointer hover:bg-gray-100 text-black"
                    onClick={() => handleSort('city.name')}
                  >
                    Station {sortConfig.key === 'city.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-3 text-left cursor-pointer hover:bg-gray-100 text-black"
                    onClick={() => handleSort('aqi')}
                  >
                    AQI {sortConfig.key === 'aqi' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-3 text-left cursor-pointer hover:bg-gray-100 text-black"
                    onClick={() => handleSort('pm25')}
                  >
                    PM2.5 {sortConfig.key === 'pm25' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-3 text-left cursor-pointer hover:bg-gray-100 text-black"
                    onClick={() => handleSort('pm10')}
                  >
                    PM10 {sortConfig.key === 'pm10' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-3 text-left cursor-pointer hover:bg-gray-100 text-black"
                    onClick={() => handleSort('o3')}
                  >
                    O3 {sortConfig.key === 'o3' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-3 text-left cursor-pointer hover:bg-gray-100 text-black"
                    onClick={() => handleSort('no2')}
                  >
                    NO2 {sortConfig.key === 'no2' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-3 text-left cursor-pointer hover:bg-gray-100 text-black"
                    onClick={() => handleSort('so2')}
                  >
                    SO2 {sortConfig.key === 'so2' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-3 text-left cursor-pointer hover:bg-gray-100 text-black"
                    onClick={() => handleSort('co')}
                  >
                    CO {sortConfig.key === 'co' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-3 text-left text-black">Status</th>
                  <th className="p-3 text-left text-black">Last Updated</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((item) => {
                  const location = extractLocationParts(item.city.name)
                  return (
                    <tr 
                      key={item.idx} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedStation?.idx === item.idx ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedStation(item)}
                    >
                      <td className="p-3 text-black">
                        <div>{location.city}</div>
                        {location.state && (
                          <div className="text-sm text-gray-600">{location.state}</div>
                        )}
                        <div className="text-sm text-gray-600">{location.country}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded ${getAqiColor(item.aqi)}`}>
                          {item.aqi}
                        </span>
                      </td>
                      <td className="p-3">
                        {item.iaqi.pm25?.v ? (
                          <span className={`px-2 py-1 rounded ${getPm25Color(item.iaqi.pm25.v)}`}>
                            {item.iaqi.pm25.v}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-3 text-black">{item.iaqi.pm10?.v || '-'}</td>
                      <td className="p-3 text-black">{item.iaqi.o3?.v || '-'}</td>
                      <td className="p-3 text-black">{item.iaqi.no2?.v || '-'}</td>
                      <td className="p-3 text-black">{item.iaqi.so2?.v || '-'}</td>
                      <td className="p-3 text-black">{item.iaqi.co?.v || '-'}</td>
                      <td className="p-3">
                        {(() => {
                          const status = getOverallStatus(item.aqi, item.iaqi.pm25?.v)
                          return (
                            <span className={`px-2 py-1 rounded ${getStatusColor(status)}`}>
                              {status} {getStatusEmojiForStatus(status)}
                            </span>
                          )
                        })()}
                      </td>
                      <td className="p-3 text-black">{formatDate(item.time.s)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {!loading && sortedData.length === 0 && (
            <div className="text-center py-4 text-black">
              No results found for the current filters
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            Showing {sortedData.length} of {data.length} stations
          </div>
        </div>

        {/* Right Pane */}
        {selectedStation && (
          <div className="w-96 border rounded-lg p-4 bg-white shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-black">{extractLocationParts(selectedStation.city.name).city}</h2>
              <button 
                onClick={() => setSelectedStation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Location</div>
                <div className="text-black">
                  {selectedStation.city.name}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Coordinates</div>
                <div className="flex items-center gap-2">
                  <div className="text-black">
                    {selectedStation.city.geo[0].toFixed(4)}, {selectedStation.city.geo[1].toFixed(4)}
                  </div>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedStation.city.geo[0]},${selectedStation.city.geo[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    <svg 
                      className="w-4 h-4 mr-1" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    View on Maps
                  </a>
                </div>
              </div>

              <IndoorAirQualityComparison outdoorAqi={selectedStation.aqi} />
              
              <div>
                <div className="text-sm text-gray-600">Air Quality Index</div>
                <div className="space-y-2">
                  <div className={`inline-block px-3 py-1 rounded-full ${getAqiColor(selectedStation.aqi)}`}>
                    {selectedStation.aqi}
                  </div>
                  <div>
                    {(() => {
                      const status = getOverallStatus(selectedStation.aqi, selectedStation.iaqi.pm25?.v)
                      return (
                        <span className={`inline-block px-3 py-1 rounded ${getStatusColor(status)}`}>
                          {status} {getStatusEmojiForStatus(status)}
                        </span>
                      )
                    })()}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Pollutants</div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {Object.entries(selectedStation.iaqi).map(([key, value]) => (
                    value && (
                      <div key={key} className="bg-gray-50 p-2 rounded">
                        <div className="text-sm font-medium text-black">{key.toUpperCase()}</div>
                        <div className="text-lg text-black">{value.v}</div>
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Last Updated</div>
                <div className="text-black">
                  {formatDate(selectedStation.time.s)}
                </div>
              </div>

              <a 
                href={selectedStation.city.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                View Details on WAQI
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
