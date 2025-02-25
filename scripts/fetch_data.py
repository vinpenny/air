import requests
import json
from datetime import datetime
import os
import time

API_TOKEN = os.getenv('WAQI_API_TOKEN')

def fetch_air_quality():
    # Get all stations from multiple regions to ensure good coverage
    regions = [
        (-90, -180, 90, 180),  # Worldwide
    ]
    
    all_stations = set()  # Use set to avoid duplicates
    detailed_data = []
    
    try:
        # First, get the list of all stations
        print("Fetching list of all stations...")
        url = f'https://api.waqi.info/v2/map/bounds?token={API_TOKEN}&latlng=-90,-180,90,180'
        response = requests.get(url)
        
        if response.status_code == 200:
            result = response.json()
            if result['status'] == 'ok':
                stations = result['data']
                total_stations = len(stations)
                print(f"Found {total_stations} stations")

                for idx, station in enumerate(stations, 1):
                    if station['uid'] not in all_stations:
                        all_stations.add(station['uid'])
                        try:
                            # Add small delay to avoid rate limiting
                            time.sleep(0.1)  # 100ms delay between requests
                            detail_url = f'https://api.waqi.info/feed/@{station["uid"]}/?token={API_TOKEN}'
                            detail_response = requests.get(detail_url)
                            
                            if detail_response.status_code == 200:
                                detail_result = detail_response.json()
                                if detail_result['status'] == 'ok':
                                    detailed_data.append(detail_result['data'])
                                    print(f"Fetched data for station {station['uid']} - {idx}/{total_stations} ({len(detailed_data)} valid)")
                            else:
                                print(f"Failed to fetch station {station['uid']}: HTTP {detail_response.status_code}")
                        except Exception as e:
                            print(f"Error fetching details for station {station['uid']}: {e}")
                            continue

                print(f"\nWriting data for {len(detailed_data)} stations to file...")
                with open('public/api/air-quality-data.json', 'w') as f:
                    json.dump(detailed_data, f)
                print("Data write complete!")
            else:
                print(f"API returned error status: {result.get('data')}")
        else:
            print(f"Failed to fetch station list: HTTP {response.status_code}")
            
    except Exception as e:
        print(f"Fatal error in fetch_air_quality: {e}")
        raise

if __name__ == '__main__':
    fetch_air_quality() 