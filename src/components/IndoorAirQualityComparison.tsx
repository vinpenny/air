import { useState } from 'react'

interface IndoorMeasurements {
  co2: number
  pm25: number
  voc: number
}

interface Props {
  outdoorAqi: number
}

type AirQualityCategory = 'Good' | 'So-so' | 'Bad'
type OutdoorCategory = 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous'

const IndoorAirQualityComparison: React.FC<Props> = ({ outdoorAqi }) => {
  const [measurements, setMeasurements] = useState<IndoorMeasurements>({
    co2: 0,
    pm25: 0,
    voc: 0
  })
  const [showResults, setShowResults] = useState(false)

  const getOutdoorOnlyRecommendation = (aqi: number): { category: string; recommendations: string[] } => {
    if (aqi <= 50) {
      return {
        category: 'Good (0-50)',
        recommendations: [
          '🏃‍♂️ Enjoy the outdoors',
          '🪟 Open windows for fresh air'
        ]
      }
    } else if (aqi <= 100) {
      return {
        category: 'Moderate (51-100)',
        recommendations: [
          '🪟 Still ok to let some fresh air in'
        ]
      }
    } else if (aqi <= 150) {
      return {
        category: 'Unhealthy if Sensitive (101-150)',
        recommendations: [
          '👀 Check to see if air gets worse',
          '😷 Kids, elderly or folks with breathing issues - mask up',
          '⏰ Limit outdoor time, especially intense exercise',
          '🚪 Close windows + doors'
        ]
      }
    } else if (aqi <= 200) {
      return {
        category: 'Unhealthy (151-200)',
        recommendations: [
          '😷 Time to mask up outside',
          '⛔ Don\'t exercise or play outside',
          '🏠 Stay inside',
          '💨 Use air purifiers'
        ]
      }
    } else if (aqi <= 300) {
      return {
        category: 'Very Unhealthy (201-300)',
        recommendations: [
          '😷 Mask up outside',
          '⚠️ 🏠 Stay indoors, close windows + doors',
          '💨 Use air purifiers'
        ]
      }
    } else {
      return {
        category: 'Hazardous (301-500)',
        recommendations: [
          '😷❗ Mask up outside',
          '⚠️ 🏠 Stay indoors, close windows + doors',
          '💨 Use air purifiers',
          '🚑 Sensitive folks may temporarily relocate per local guidance'
        ]
      }
    }
  }

  const getIndoorCategory = (measurements: IndoorMeasurements): AirQualityCategory => {
    const { co2, pm25, voc } = measurements
    
    if (co2 < 800 && pm25 < 12 && voc < 150) {
      return 'Good'
    } else if ((co2 >= 800 && co2 < 1000) || (pm25 >= 12 && pm25 < 35) || (voc >= 150 && voc <= 350)) {
      return 'So-so'
    } else {
      return 'Bad'
    }
  }

  const getOutdoorCategory = (aqi: number): OutdoorCategory => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy for Sensitive'
    if (aqi <= 200) return 'Unhealthy'
    if (aqi <= 300) return 'Very Unhealthy'
    return 'Hazardous'
  }

  const getRecommendation = (outdoor: OutdoorCategory, indoor: AirQualityCategory): string => {
    const recommendations: Record<OutdoorCategory, Record<AirQualityCategory, string>> = {
      'Good': {
        'Good': '🌎 Go anywhere, do anything',
        'So-so': '🌳 Air is better outdoors\n🪟 Open windows + doors for fresh air\n🏃‍♂️ Healthier to exercise outside',
        'Bad': '🏕️ Go outside, air is way better there\n🪟 Open as many windows + doors as you can, ventilate the space\n🏃‍♂️ Healthier to exercise outside'
      },
      'Moderate': {
        'Good': '🚪 Close windows + doors, air is better inside than it is out there\n🏃‍♂️ Healthier to exercise indoors',
        'So-so': '🪟 You can still let some fresh air in but your air is not awesome anywhere',
        'Bad': '🌳 Air is better outdoors\n🪟 Open windows + doors, ventilate the space\n🏃‍♂️ Healthier to exercise outdoors'
      },
      'Unhealthy for Sensitive': {
        'Good': '🏠 Stay indoors, your air is better inside\n🚪 Close windows + doors and keep it that way\n👶 🧓 Kids, elderly or folks with breathing issues - mask up if you go outside',
        'So-so': '🤷‍♀️ You can still let a bit of fresh air in but your air is so-so everywhere\n👶 Kids, elderly or folks with breathing issues - mask up',
        'Bad': '🤷‍♀️ You can still let some fresh air in but your air is not so good outside either\n💨 Use air purifiers'
      },
      'Unhealthy': {
        'Good': '🏠 Stay indoors, your air is better inside\n🚪 Close windows + doors and keep it that way\n😷 Time to mask up outside\n⛔ Don\'t exercise or play outside',
        'So-so': '🏠 Stay indoors, ain\'t great inside, but it\'s unhealthy outside\n💨 Use air purifiers\n🚪 Close windows + doors\n😷 Time to mask up outside\n⛔ Don\'t exercise or play outside',
        'Bad': '🙁 Air is unhealthy everywhere\n💨 Use air purifiers, try to improve your indoor air quality\n😷 Time to mask up'
      },
      'Very Unhealthy': {
        'Good': '⚠️ 🏠 Stay indoors, air is way better inside\n🚪 Keep windows + doors closed\n🚫 Avoid outdoor activities\n😷 Mask up outside',
        'So-so': '🏠 Stay indoors, air is better inside\n💨 Use air purifiers\n🚪 Close windows + doors\n😷 Time to mask up outside\n⛔ Don\'t exercise or play outside',
        'Bad': '⛔ Air is bad everywhere\n💨 Use air purifiers and try to improve indoor air\n😷 Mask up\n✈️ Go somewhere else if you can\'t clean the indoor air'
      },
      'Hazardous': {
        'Good': '⚠️ 🏠 Stay indoors, air is way better inside\n🚪 Keep windows + doors closed\n😷❗ Mask up outside',
        'So-so': '🏠 Stay indoors, air is better inside\n💨 Use air purifiers\n🚪 Close windows + doors\n😷 Time to mask up outside',
        'Bad': '⛔ Air is bad everywhere\n💨 Use air purifiers and try to improve indoor air\n😷 Mask up\n✈️ Go somewhere else 🚑 Especially sensitive folks may temporarily relocate per local guidance'
      }
    }

    return recommendations[outdoor][indoor]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMeasurements(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  const handleCompare = () => {
    setShowResults(true)
  }

  const getCategoryEmoji = (category: AirQualityCategory | OutdoorCategory) => {
    switch (category) {
      case 'Good':
        return '🙂'
      case 'So-so':
      case 'Moderate':
      case 'Unhealthy for Sensitive':
        return '😐'
      default:
        return '🙁'
    }
  }

  const indoorCategory = getIndoorCategory(measurements)
  const outdoorCategory = getOutdoorCategory(outdoorAqi)

  return (
    <div className="mt-6 space-y-6">
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-black">Air Quality Recommendations</h3>
        
        {!showResults && (
          <div className="mb-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Current Outdoor Air Quality:</div>
              {(() => {
                const { category, recommendations } = getOutdoorOnlyRecommendation(outdoorAqi)
                return (
                  <div>
                    <div className="font-medium text-black mb-2">{category}</div>
                    <ul className="space-y-2">
                      {recommendations.map((rec, index) => (
                        <li key={index} className="text-black">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )
              })()}
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-2">
                Compare with your indoor air quality
              </div>
              <p className="text-sm text-blue-600">
                Input your indoor air measurements below to get personalized recommendations for managing your indoor air quality.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">CO2 (ppm)</label>
            <input
              type="number"
              name="co2"
              value={measurements.co2 || ''}
              onChange={handleInputChange}
              placeholder="Enter CO2 level"
              className="w-full px-3 py-2 border rounded-md text-black"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">PM2.5 (μg/m³)</label>
            <input
              type="number"
              name="pm25"
              value={measurements.pm25 || ''}
              onChange={handleInputChange}
              placeholder="Enter PM2.5 level"
              className="w-full px-3 py-2 border rounded-md text-black"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">VOC Index</label>
            <input
              type="number"
              name="voc"
              value={measurements.voc || ''}
              onChange={handleInputChange}
              placeholder="Enter VOC Index"
              className="w-full px-3 py-2 border rounded-md text-black"
              min="0"
            />
          </div>

          <button
            onClick={handleCompare}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Compare
          </button>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="mb-2">
                <span className="text-sm text-gray-600">Indoor Air Quality:</span>
                <span className="ml-2 font-medium text-black">
                  {indoorCategory} {getCategoryEmoji(indoorCategory)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Outdoor Air Quality:</span>
                <span className="ml-2 font-medium text-black">
                  {outdoorCategory} {getCategoryEmoji(outdoorCategory)}
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Recommendation:</div>
              <div className="text-black whitespace-pre-line">
                {getRecommendation(outdoorCategory, indoorCategory)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IndoorAirQualityComparison 