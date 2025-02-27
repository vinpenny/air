# Global Air Quality Monitor

A real-time air quality monitoring application that provides comprehensive air quality data visualization and personalized recommendations for both outdoor and indoor air quality management.

## Features

### Air Quality Data Display
- Real-time Air Quality Index (AQI) monitoring for locations worldwide
- Detailed pollutant measurements including PM2.5, PM10, O3, NO2, SO2, and CO
- Color-coded status indicators for quick assessment
- Sortable and filterable data table
- Search functionality for finding specific locations

### Interactive Right Pane
- Detailed station information
- Location details with Google Maps integration
- Real-time air quality status with color-coded indicators
- Comprehensive pollutant breakdown
- Last updated timestamp
- Direct link to WAQI for more details

### Smart Recommendations
- Outdoor Air Quality Recommendations based on AQI levels:
  - Good (0-50): Enjoy outdoors and fresh air
  - Moderate (51-100): Limited outdoor activity recommendations
  - Unhealthy for Sensitive Groups (101-150): Precautions for sensitive individuals
  - Unhealthy (151-200): General public health warnings
  - Very Unhealthy (201-300): Strong activity restrictions
  - Hazardous (301-500): Emergency conditions

### Indoor Air Quality Comparison
- Input fields for indoor air measurements:
  - CO2 (ppm)
  - PM2.5 (μg/m³)
  - VOC Index
- Personalized recommendations based on both indoor and outdoor conditions
- Comparative analysis of indoor vs outdoor air quality
- Actionable advice for improving air quality

## Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS for responsive design
- **Data Fetching**: Real-time API integration with WAQI
- **UI Components**: Custom React components with TypeScript
- **State Management**: React hooks for local state management

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── api/                  # API routes
├── components/
│   ├── FilterDropdown.tsx    # Location filtering component
│   └── IndoorAirQualityComparison.tsx  # Indoor air quality component
└── lib/
    ├── types.ts              # TypeScript type definitions
    └── utils.ts              # Utility functions
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/air-quality-monitor.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_WAQI_TOKEN=your_token_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```



Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
