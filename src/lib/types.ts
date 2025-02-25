export interface AirQualityData {
  idx: number
  aqi: number
  time: {
    s: string
    tz: string
  }
  city: {
    name: string
    url: string
    geo: [number, number]
  }
  iaqi: {
    pm25?: { v: number }
    pm10?: { v: number }
    o3?: { v: number }
    no2?: { v: number }
    so2?: { v: number }
    co?: { v: number }
    [key: string]: { v: number } | undefined
  }
} 