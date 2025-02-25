export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString()
}

export function getAqiLevel(aqi: number) {
  if (aqi <= 100) return 'Good'
  if (aqi <= 150) return 'So-so'
  return 'Bad'
} 