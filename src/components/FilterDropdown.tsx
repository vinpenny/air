import { useState, useEffect } from 'react'

interface FilterDropdownProps {
  data: any[]
  onFilterChange: (filters: { country: string; state: string }) => void
}

export default function FilterDropdown({ data, onFilterChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [countrySearch, setCountrySearch] = useState('')
  const [stateSearch, setStateSearch] = useState('')

  // Extract unique countries and states from data
  const countries = Array.from(new Set(
    data.map(item => {
      const parts = item.city.name.split(',')
      return parts[parts.length - 1]?.trim() || ''
    }).filter(Boolean)
  )).sort()

  const states = selectedCountry 
    ? Array.from(new Set(
        data
          .filter(item => item.city.name.includes(selectedCountry))
          .map(item => {
            const parts = item.city.name.split(',')
            return parts.length > 2 ? parts[1]?.trim() : ''
          })
          .filter(Boolean)
      )).sort()
    : []

  // Filter countries and states based on search
  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const filteredStates = states.filter(state => 
    state.toLowerCase().includes(stateSearch.toLowerCase())
  )

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country)
    setSelectedState('')
    setStateSearch('')
    onFilterChange({ country, state: '' })
  }

  const handleStateSelect = (state: string) => {
    setSelectedState(state)
    onFilterChange({ country: selectedCountry, state })
  }

  const clearFilters = () => {
    setSelectedCountry('')
    setSelectedState('')
    setCountrySearch('')
    setStateSearch('')
    onFilterChange({ country: '', state: '' })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
      >
        <span>Filter</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {(selectedCountry || selectedState) && (
        <div className="flex items-center gap-2 mt-2">
          {selectedCountry && (
            <span className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
              {selectedCountry}
              <svg
                className="w-4 h-4 cursor-pointer hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => handleCountrySelect('')}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          )}
          {selectedState && (
            <span className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
              {selectedState}
              <svg
                className="w-4 h-4 cursor-pointer hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => handleStateSelect('')}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          )}
          {(selectedCountry || selectedState) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-10 w-64 mt-2 bg-white border rounded-lg shadow-lg">
          <div className="p-2">
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Country</h3>
              <input
                type="text"
                placeholder="Search country..."
                className="w-full px-3 py-2 mb-2 text-sm border rounded text-black placeholder-gray-500"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
              />
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.map(country => (
                  <button
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100 
                      ${selectedCountry === country ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                  >
                    {country}
                  </button>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No countries found
                  </div>
                )}
              </div>
            </div>

            {selectedCountry && states.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">State/Region</h3>
                <input
                  type="text"
                  placeholder="Search state..."
                  className="w-full px-3 py-2 mb-2 text-sm border rounded text-black placeholder-gray-500"
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                />
                <div className="max-h-48 overflow-y-auto">
                  {filteredStates.map(state => (
                    <button
                      key={state}
                      onClick={() => handleStateSelect(state)}
                      className={`w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100 
                        ${selectedState === state ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    >
                      {state}
                    </button>
                  ))}
                  {filteredStates.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No states found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 