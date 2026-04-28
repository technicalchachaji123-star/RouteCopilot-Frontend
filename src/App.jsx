// RouteCopilot AI - Main App Component
import React, { useState, useEffect } from 'react';
import apiClient from './api/client';
import { io } from 'socket.io-client';

const socket = io('https://routecopilot-backend.onrender.com');
// Mock Data
const mockRoutes = [
  {
    id: 1,
    name: 'Route A - via NH48',
    distance: '342 km',
    eta: '6h 20min',
    risk: 22,
    rating: 4.2,
    badges: ['Toll-Free', 'Clear Weather'],
    tags: ['Fastest', 'Cheapest'],
    riskBreakdown: {
      weather: 'Low Risk',
      accidentZones: ['Gurugram Bypass', 'Manesar Chowk'],
      roadQuality: 'Good',
      politicalUnrest: 'None',
      nightSafety: 'Good',
      floodRisk: 'Low Risk',
      construction: ['Jaipur Ring Road Section']
    },
    fuelStations: [
      'HP Petrol Pump - Manesar',
      'Indian Oil - Neemrana',
      'Bharat Petroleum - Behror',
      'Reliance Petrol - Shahpura'
    ],
    restStops: [
      'Highway Dhaba - Manesar',
      'Hotel Green Leaf - Neemrana',
      'Rajasthan Rest Area - Behror',
      'Dhaba King - Kotputli',
      'Comfort Inn - Shahpura',
      'Jaipur Highway Resort'
    ]
  },
  {
    id: 2,
    name: 'Route B - via Yamuna Expressway',
    distance: '328 km',
    eta: '6h 45min',
    risk: 35,
    rating: 4.5,
    badges: ['Low Traffic', 'Smooth Roads'],
    tags: ['Safest', 'Night Recommended'],
    riskBreakdown: {
      weather: 'Moderate Risk',
      accidentZones: ['Noida Toll Plaza', 'Mathura Exit'],
      roadQuality: 'Excellent',
      politicalUnrest: 'None',
      nightSafety: 'Excellent',
      floodRisk: 'None',
      construction: ['Agra Ring Road Connect']
    },
    fuelStations: [
      'Indian Oil - Yamuna Expressway',
      'HP Petrol - Dankaur',
      'Bharat Petroleum - Tappal',
      'Reliance Petrol - Mathura',
      'Indian Oil - Agra Bypass'
    ],
    restStops: [
      'Expressway Food Court - Dankaur',
      'Hotel Grand - Tappal',
      'Mathura Highway Resort',
      'Agra Rest Area',
      'Taj Gateway Hotel',
      'Agra Bypass Dhaba',
      'Luxury Rest Stop - Etmadpur',
      'Highway King - Fatehpur Sikri'
    ]
  },
  {
    id: 3,
    name: 'Route C - via NH58',
    distance: '365 km',
    eta: '7h 10min',
    risk: 45,
    rating: 3.9,
    badges: ['Fuel Saver - Save ₹240'],
    tags: ['Eco-Friendly'],
    riskBreakdown: {
      weather: 'High Risk',
      accidentZones: ['Ghaziabad Chowk', 'Meerut Bypass', 'Muzaffarnagar Highway'],
      roadQuality: 'Moderate',
      politicalUnrest: 'None',
      nightSafety: 'Moderate',
      floodRisk: 'Moderate Risk',
      construction: ['Roorkee Bypass Widening']
    },
    fuelStations: [
      'HP Petrol - Ghaziabad',
      'Indian Oil - Meerut',
      'Bharat Petroleum - Muzaffarnagar',
      'Reliance Petrol - Roorkee',
      'Indian Oil - Haridwar',
      'HP Petrol - Rishikesh'
    ],
    restStops: [
      'Ghaziabad Highway Dhaba',
      'Meerut Comfort Inn',
      'Muzaffarnagar Rest Area',
      'Roorkee Food Court',
      'Haridwar Gateway Hotel',
      'Rishikesh Resort',
      'Shivpuri Rest Stop',
      'Devprayag Highway Dhaba',
      'Srinagar Garhwal Hotel',
      'Rudraprayag Rest Area'
    ]
  }
];

const mockAlerts = [
  { id: 1, icon: '>', text: 'Next Fuel Stop: 12 km - HP Petrol Pump' },
  { id: 2, icon: '🛣️', text: 'Next Toll Plaza: 3 km - ₹85 charged' },
  { id: 3, icon: '⚠️', text: 'Road Construction ahead at km 47 - Slow zone' },
  { id: 4, icon: '☀️', text: 'Heavy rain forecast in 2 hrs - Reduce speed' },
  { id: 5, icon: '🔄', text: 'AI Rerouting suggested: Save 18 mins via NH58 detour' },
  { id: 6, icon: 'Y', text: 'Rest Stop recommended: Dhaba in 8 km - Good ratings' }
];

const mockTolls = [
  { name: 'KMP Toll', distance: '45 km', amount: 85, status: 'Passed' },
  { name: 'Faridabad Toll', distance: '120 km', amount: 150, status: 'Passed' },
  { name: 'Mathura Toll', distance: '210 km', amount: 120, status: 'Upcoming' },
  { name: 'Agra Toll', distance: '280 km', amount: 105, status: 'Upcoming' }
];

const mockRestStops = [
  { name: 'Highway Dhaba', type: 'Dhaba', distance: '12 km', rating: 3.5, amenities: ['🍲', '🚽'] },
  { name: 'Hotel Comfort Inn', type: 'Hotel', distance: '45 km', rating: 4.2, amenities: ['🏨', '🅿️', 'Y'] },
  { name: 'Rajasthan Rest Area', type: 'Rest Area', distance: '78 km', rating: 3.8, amenities: ['🚽', 'Y', '>'] }
];

const mockCostEntries = [
  { category: 'Fuel', amount: 2500, note: 'HP Petrol Pump - Full tank' },
  { category: 'Toll', amount: 460, note: 'KMP + Faridabad tolls' },
  { category: 'Food', amount: 380, note: 'Highway Dhaba' }
];

const mockTrips = [
  { date: 'Apr 25, 2026', route: 'Delhi to Jaipur', score: 82, filters: ['Avoid Tolls', 'Least Traffic'] },
  { date: 'Apr 22, 2026', route: 'Jaipur to Ahmedabad', score: 75, filters: ['Fastest', 'Low Traffic'] },
  { date: 'Apr 18, 2026', route: 'Ahmedabad to Mumbai', score: 88, filters: ['Night Safe', 'Eco-Friendly'] }
];

// Filter Chips Data
const filterChips = [
  { id: 'avoidTolls', label: '🛡️ Avoid Tolls', badge: 'Toll-Free' },
  { id: 'leastTraffic', label: '🚗 Least Traffic', badge: 'Low Traffic' },
  { id: 'noRain', label: '☀️ No Rain Zone', badge: 'Clear Weather' },
  { id: 'nightSafe', label: '🌙 Night-Safe Route', badge: 'Night Safe' },
  { id: 'bestRoad', label: '🛣️ Best Road Quality', badge: 'Smooth Roads' },
  { id: 'fuelEfficient', label: '⛽ Fuel-Efficient Route', badge: 'Fuel Saver' },
  { id: 'maxRest', label: '🍴 Max Rest Stops', badge: 'Rest-Friendly' },
  { id: 'avoidAccident', label: '⚠️ Avoid Accident Zones', badge: 'Safe Corridor' },
  { id: 'noConstruction', label: '🚧 No Construction Zones', badge: 'Construction-Free' },
  { id: 'fastest', label: '⚡ Fastest Route', badge: 'Fastest' },
  { id: 'ecoFriendly', label: '🌱 Eco-Friendly', badge: 'Eco Route' },
  { id: 'avoidFlood', label: '🌊 Avoid Flood-Prone Roads', badge: 'Flood-Safe' }
];

// Login Screen Component
function LoginScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    vehicleType: 'LCV',
    cargoType: 'General'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in email and password.');
      return;
    }
    if (!isLogin && !formData.name) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await apiClient.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        const { accessToken, user } = res.data.data;
        localStorage.setItem('rc_token', accessToken);
        localStorage.setItem('rc_user', JSON.stringify(user));
        localStorage.setItem('rc_is_logged_in', 'true');
        onLogin();
      } else {
        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || 'User'; // provide a default last name if missing

        const res = await apiClient.post('/auth/register', {
          email: formData.email,
          password: formData.password,
          firstName,
          lastName,
          // phone and vehicleType are not in backend schema yet, so keeping them just in case
        });
        localStorage.setItem('rc_is_logged_in', 'true');
        if (res.data?.data?.accessToken) {
          localStorage.setItem('rc_token', res.data.data.accessToken);
        }
        onLogin();
      }
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message || err.message || 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">🌿</div>
      <h1 className="login-title">RouteCopilot AI</h1>
      <p className="login-tagline">AI That Knows Every Road, Every Risk, Every Rupee.</p>
      
      {!isLogin && (
        <div className="login-form">
          <div className="input-group">
            <label className="input-label">Name</label>
            <input type="text" name="name" className="input-field" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input type="tel" name="phone" className="input-field" placeholder="Enter mobile number" value={formData.phone} onChange={handleChange} />
          </div>
        </div>
      )}

      <div className="login-form">
        <div className="input-group">
          <label className="input-label">Email Address</label>
          <input type="email" name="email" className="input-field" placeholder="name@company.com" value={formData.email} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input type="password" name="password" className="input-field" placeholder="••••••••" value={formData.password} onChange={handleChange} />
        </div>
        {!isLogin && (
          <div className="input-group">
            <label className="input-label">Vehicle Type</label>
            <select name="vehicleType" className="input-field" value={formData.vehicleType} onChange={handleChange}>
              <option value="LCV">LCV (Small delivery)</option>
              <option value="MCV">MCV (City-to-city)</option>
              <option value="HCV">HCV / Trailer (Highway bulk)</option>
              <option value="Container">Container / Reefer (Sensitive goods)</option>
              <option value="Tipper">Tipper (Construction)</option>
            </select>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '12px', fontWeight: 500, border: '1px solid rgba(239,68,68,0.2)' }}>
          ⚠️ {error}
        </div>
      )}
      
      <div className="login-buttons">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ Please wait...' : (isLogin ? 'Login' : 'Create Account')}
        </button>
      </div>
      
      <p className="login-toggle">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
      
      <p className="guest-link">
        <button onClick={onLogin}>Continue as Guest ➔</button>
      </p>
    </div>
  );
}

// Plan Screen Component
function PlanScreen({ onPlanRoute, isDark }) {
  const [routeMode, setRouteMode] = useState('single');
  const [formData, setFormData] = useState({
    startPoint: '',
    endPoint: '',
    vehicleType: 'LCV',
    cargoTypes: ['General Cargo']
  });
  const [waypoints, setWaypoints] = useState([{ id: 1, value: '' }]);
  const [showMapPicker, setShowMapPicker] = useState(null);
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);
  const [pickerAddress, setPickerAddress] = useState('Move map to select location');
  const pickerAddressRef = React.useRef('Move map to select location');
  const mapContainerRef = React.useRef(null);

  React.useEffect(() => {
    if (showMapPicker && mapScriptLoaded && mapContainerRef.current && window.L) {
      setPickerAddress('Move map to select location');
      pickerAddressRef.current = 'Move map to select location';
      
      const map = window.L.map(mapContainerRef.current, { zoomControl: false }).setView([22.5937, 78.9629], 5);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap'
      }).addTo(map);

      let timeoutId = null;

      map.on('move', () => {
        setPickerAddress('Moving...');
      });

      map.on('moveend', async () => {
        const center = map.getCenter();
        setPickerAddress('Fetching address...');
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}`);
            const data = await res.json();
            const address = data.display_name?.split(',').slice(0, 3).join(',') || `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`;
            setPickerAddress(address);
            pickerAddressRef.current = address;
          } catch (err) {
            setPickerAddress('Failed to fetch address');
          }
        }, 600);
      });

      return () => {
        map.remove();
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [showMapPicker, mapScriptLoaded]);

  const confirmMapSelection = () => {
    const addr = pickerAddressRef.current;
    if (showMapPicker === 'start') {
      setFormData(prev => ({ ...prev, startPoint: addr }));
    } else if (showMapPicker === 'end') {
      setFormData(prev => ({ ...prev, endPoint: addr }));
    } else if (showMapPicker.startsWith('waypoint-')) {
      const wpId = parseInt(showMapPicker.split('-')[1]);
      setWaypoints(prev => prev.map(wp => wp.id === wpId ? { ...wp, value: addr } : wp));
    }
    setShowMapPicker(null);
  };

  React.useEffect(() => {
    // Load Free Leaflet Map Script
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.id = 'leaflet-script';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setMapScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapScriptLoaded(true);
    }
  }, []);

  const [searchResults, setSearchResults] = useState({ start: [], end: [] });

  const handleSearch = async (query, type) => {
    if (query.length < 3) {
      setSearchResults(prev => ({ ...prev, [type]: [] }));
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=in&limit=5`);
      const data = await res.json();
      setSearchResults(prev => ({ ...prev, [type]: data }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectLocation = (loc, type) => {
    const address = loc.display_name.split(',').slice(0, 3).join(',');
    if (type === 'start') {
      setFormData(prev => ({ ...prev, startPoint: address }));
    } else {
      setFormData(prev => ({ ...prev, endPoint: address }));
    }
    setSearchResults(prev => ({ ...prev, [type]: [] }));
  };

  const vehicleTypes = [
    { value: 'LCV', label: 'LCV (Small delivery)' },
    { value: 'MCV', label: 'MCV (City-to-city)' },
    { value: 'HCV', label: 'HCV / Trailer (Highway bulk)' },
    { value: 'Container', label: 'Container / Reefer (Sensitive goods)' },
    { value: 'Tipper', label: 'Tipper (Construction)' }
  ];

  const cargoTypes = [
    'General Cargo',
    'Bulk Cargo',
    'Break Bulk Cargo',
    'Containerized Cargo',
    'Perishable Cargo',
    'Hazardous Cargo',
    'Project Cargo',
    'Automobile Cargo',
    'Express / Parcel Cargo',
    'Live Cargo'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCargoToggle = (cargo) => {
    if (formData.cargoTypes.includes(cargo)) {
      setFormData({
        ...formData,
        cargoTypes: formData.cargoTypes.filter(c => c !== cargo)
      });
    } else {
      setFormData({
        ...formData,
        cargoTypes: [...formData.cargoTypes, cargo]
      });
    }
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, { id: Date.now(), value: '' }]);
  };

  const removeWaypoint = (id) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
  };

  const getCargoNote = () => {
    const notes = {
      'Perishable Cargo': 'AI will prioritize cold storage stops & minimal delay routes',
      'Hazardous Cargo': 'AI will route away from populated areas and check compliance',
      'Project Cargo': 'AI will optimize for ODC routes with clearances',
      'Automobile Cargo': 'AI will prioritize smooth roads to prevent vehicle damage',
      'Live Cargo': 'AI will prioritize routes with more rest stops for livestock',
      'Containerized Cargo': 'AI will optimize for speed and security',
      'Bulk Cargo': 'AI will optimize for weight balance and fuel efficiency',
      'Break Bulk Cargo': 'AI will prioritize careful handling routes',
      'Express / Parcel Cargo': 'AI will prioritize fastest routes with minimal stops',
      'General Cargo': 'AI will optimize for speed, cost and fuel efficiency'
    };
    
    // Get notes for all selected cargo types
    const selectedNotes = formData.cargoTypes
      .map(cargo => notes[cargo])
      .filter(Boolean);
    
    return selectedNotes.length > 0 ? selectedNotes[0] : notes['General Cargo'];
  };

  const sampleLocations = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462 }
  ];

  return (
    <div className="tab-content">
      <div className="toggle-container">
        <div className="toggle-pill">
          <button
            className={`toggle-option ${routeMode === 'single' ? 'active' : ''}`}
            onClick={() => setRouteMode('single')}
          >
            Single Route
          </button>
          <button
            className={`toggle-option ${routeMode === 'multi' ? 'active' : ''}`}
            onClick={() => setRouteMode('multi')}
          >
            Multi Route
          </button>
        </div>
      </div>

      <div className="card">
        <div className="input-group" style={{ position: 'relative' }}>
          <label className="input-label">Starting Point:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              name="startPoint"
              className="input-field"
              placeholder="Enter Starting Destination"
              value={formData.startPoint}
              onChange={(e) => { handleChange(e); handleSearch(e.target.value, 'start'); }}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-secondary"
              style={{ padding: '12px' }}
              onClick={async () => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    try {
                      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                      const data = await res.json();
                      const address = data.display_name.split(',').slice(0, 3).join(',');
                      setFormData(prev => ({ ...prev, startPoint: address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                    } catch (e) {
                      setFormData(prev => ({ ...prev, startPoint: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                    }
                  }, (err) => alert("Could not get location."));
                }
              }}
              title="Use current location"
            >
              <span>🧭</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '12px' }}
              onClick={() => setShowMapPicker('start')}
              title="Choose from map"
            >
              <span>📍</span>
            </button>
          </div>
          {searchResults.start.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: '40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 10, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {searchResults.start.map(res => (
                <div key={res.place_id} onClick={() => handleSelectLocation(res, 'start')} style={{ padding: '10px', borderBottom: '1px solid var(--border)', cursor: 'pointer', fontSize: '13px' }}>
                  {res.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="input-group" style={{ position: 'relative' }}>
          <label className="input-label">Final Destination:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              name="endPoint"
              className="input-field"
              placeholder="Enter Ending Destination"
              value={formData.endPoint}
              onChange={(e) => { handleChange(e); handleSearch(e.target.value, 'end'); }}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-secondary"
              style={{ padding: '12px' }}
              onClick={() => setShowMapPicker('end')}
              title="Choose from map"
            >
              <span>📍</span>
            </button>
          </div>
          {searchResults.end.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: '40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 10, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {searchResults.end.map(res => (
                <div key={res.place_id} onClick={() => handleSelectLocation(res, 'end')} style={{ padding: '10px', borderBottom: '1px solid var(--border)', cursor: 'pointer', fontSize: '13px' }}>
                  {res.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {routeMode === 'multi' && (
          <div className="waypoint-list">
            <label className="input-label">Passing Through / Delivery Stops:</label>
            {waypoints.map((wp, index) => (
              <div key={wp.id} className="waypoint-item">
                <span className="waypoint-number">{index + 2}</span>
                <input
                  type="text"
                  className="input-field"
                  placeholder={`Type stop address (e.g. Surat)`}
                  value={wp.value}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setWaypoints(waypoints.map(w => w.id === wp.id ? { ...w, value: newVal } : w));
                    handleSearch(newVal, `waypoint-${wp.id}`);
                  }}
                  style={{ flex: 1 }}
                />
                {searchResults[`waypoint-${wp.id}`] && searchResults[`waypoint-${wp.id}`].length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: '40px', right: '80px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 20, maxHeight: '150px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {searchResults[`waypoint-${wp.id}`].map(res => (
                      <div key={res.place_id} onClick={() => {
                        const address = res.display_name.split(',').slice(0, 3).join(',');
                        setWaypoints(waypoints.map(w => w.id === wp.id ? { ...w, value: address } : w));
                        setSearchResults(prev => ({ ...prev, [`waypoint-${wp.id}`]: [] }));
                      }} style={{ padding: '10px', borderBottom: '1px solid var(--border)', cursor: 'pointer', fontSize: '13px' }}>
                        {res.display_name}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="btn btn-secondary"
                  style={{ padding: '12px' }}
                  onClick={() => setShowMapPicker(`waypoint-${wp.id}`)}
                  title="Choose from map"
                >
                  <span>📍</span>
                </button>
                <button className="waypoint-remove" onClick={() => removeWaypoint(wp.id)}>-</button>
              </div>
            ))}
            <button className="add-stop-btn" onClick={addWaypoint}>
              + Add Stop
            </button>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label className="input-label">Type of Vehicle</label>
            <select
              name="vehicleType"
              className="input-field"
              value={formData.vehicleType}
              onChange={handleChange}
            >
              {vehicleTypes.map(vt => (
                <option key={vt.value} value={vt.value}>{vt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Type of Cargo (Select multiple)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
            {cargoTypes.map(cargo => (
              <label
                key={cargo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: formData.cargoTypes.includes(cargo) ? 'var(--primary)' : 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: formData.cargoTypes.includes(cargo) ? (isDark ? 'black' : 'white') : 'var(--text)',
                  fontSize: '13px',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.cargoTypes.includes(cargo)}
                  onChange={() => handleCargoToggle(cargo)}
                  style={{ display: 'none' }}
                />
                <span style={{
                  width: '18px',
                  height: '18px',
                  border: formData.cargoTypes.includes(cargo) ? 'none' : '2px solid var(--border)',
                  borderRadius: '4px',
                  background: formData.cargoTypes.includes(cargo) ? (isDark ? 'black' : 'white') : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  {formData.cargoTypes.includes(cargo) && 'o"'}
                </span>
                {cargo}
              </label>
            ))}
          </div>
        </div>

        <div className="ai-note">
          <span className="ai-note-icon">🧠</span>
          <span className="ai-note-text">{getCargoNote()}</span>
        </div>

        <button
          className="btn btn-primary mt-4"
          onClick={() => onPlanRoute({ ...formData, waypoints: waypoints.filter(wp => wp.value.trim()).map(wp => wp.value.trim()) })}
        >
          🚀 {routeMode === 'single' ? 'Find Best Route' : 'Plan Multi-Stop Route'}
        </button>
      </div>

      {/* Map Picker Modal */}
      {showMapPicker && (
        <div className="modal-overlay" onClick={() => setShowMapPicker(null)} style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 9999 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '100%', height: '100%', maxWidth: '600px', maxHeight: '80vh', padding: '0px', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ padding: '16px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '18px' }}>
                <span>📍</span> Pick Location
              </h3>
              <button onClick={() => setShowMapPicker(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-secondary)' }}>×</button>
            </div>
            
            <div style={{ position: 'relative', flex: 1, background: '#e5e5e5' }}>
              <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }}></div>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
                <div style={{ fontSize: '40px', paddingBottom: '40px', color: '#e0115f', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>📍</div>
              </div>
              <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '400px', pointerEvents: 'none', zIndex: 400 }}>
                <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', color: '#111', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                  {pickerAddress}
                </div>
              </div>
            </div>
            
            <div style={{ padding: '16px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', zIndex: 10 }}>
              <button className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '900', letterSpacing: '1px' }} onClick={confirmMapSelection}>
                CONFIRM LOCATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Polyline Decoder
function decodePolyline(str, precision) {
  var index = 0, lat = 0, lng = 0, coordinates = [], shift = 0, result = 0, byte = null, latitude_change, longitude_change, factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);
  while (index < str.length) {
    byte = null; shift = 0; result = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
    shift = result = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += latitude_change; lng += longitude_change;
    coordinates.push([lat / factor, lng / factor]);
  }
  return coordinates;
}

function InteractiveMap({ origin, dest, waypointCoords, routeGeometry, tolls, fuelStops, isDark }) {
  const mapRef = React.useRef(null);
  const mapInstance = React.useRef(null);

  useEffect(() => {
    if (!window.L || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = window.L.map(mapRef.current, { zoomControl: true }).setView([20.5937, 78.9629], 5);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapInstance.current);
      setTimeout(() => { mapInstance.current?.invalidateSize(); }, 100);
    }

    if (origin && dest) {
      const start = [origin.lat, origin.lon];
      const end = [dest.lat, dest.lon];

      mapInstance.current.eachLayer((layer) => {
        if (!(layer instanceof window.L.TileLayer)) {
          mapInstance.current.removeLayer(layer);
        }
      });

      // Markers
      window.L.marker(start, {
        icon: window.L.divIcon({ html: '<div style="font-size:24px;">📍</div>', className: 'custom-div-icon', iconSize: [24,24] })
      }).addTo(mapInstance.current).bindPopup('<b>Start</b>');

      window.L.marker(end, {
        icon: window.L.divIcon({ html: '<div style="font-size:24px;">🏁</div>', className: 'custom-div-icon', iconSize: [24,24] })
      }).addTo(mapInstance.current).bindPopup('<b>Destination</b>');

      // Waypoints
      if (waypointCoords && waypointCoords.length > 0) {
        waypointCoords.forEach((wp, idx) => {
          window.L.marker([wp.lat, wp.lon], {
            icon: window.L.divIcon({ 
              html: `<div style="font-size:18px;background:#10B981;border:2px solid white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.3);">${idx + 1}</div>`, 
              className: 'custom-div-icon', 
              iconSize: [20,20] 
            })
          }).addTo(mapInstance.current).bindPopup(`<b>Stop ${idx + 1}</b>`);
        });
      }

      // Polyline
      let bounds = window.L.latLngBounds([start, end]);
      if (routeGeometry) {
        const coords = decodePolyline(routeGeometry);
        if (coords.length > 0) {
          window.L.polyline(coords, { color: '#10B981', weight: 6, opacity: 0.9, dashArray: '1, 10', lineCap: 'square', lineJoin: 'round' }).addTo(mapInstance.current);
          bounds = window.L.latLngBounds(coords);
          
          // Render Tolls
          if (tolls && tolls.length > 0) {
             const step = Math.floor(coords.length / (tolls.length + 1));
             tolls.forEach((toll, idx) => {
               const pos = coords[step * (idx + 1)];
               if (pos) {
                 window.L.marker(pos, {
                   icon: window.L.divIcon({
                     html: `<div style="background:#F59E0B;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">₹</div>`,
                     className: 'custom-div-icon',
                     iconSize: [24, 24]
                   })
                 }).addTo(mapInstance.current).bindPopup(`<b>${toll.name}</b><br>Est. ₹${toll.cost}`);
               }
             });
          }
        }
      } else {
        window.L.polyline([start, end], { color: '#10B981', weight: 5, opacity: 0.8 }).addTo(mapInstance.current);
      }
      
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [origin, dest, waypointCoords, routeGeometry, tolls]);

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '16px' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
}

// Full Screen Navigation Map (Google Maps style)
function FullScreenNavMap({ route, isDark, onClose }) {
  const mapRef = React.useRef(null);
  const mapInstance = React.useRef(null);
  const [tripStarted, setTripStarted] = useState(false);
  const [navInstruction, setNavInstruction] = useState('Head towards route');
  const [navSubtext, setNavSubtext] = useState('CALCULATING LIVE TRAFFIC...');

  useEffect(() => {
    if (!window.L || !mapRef.current || !route) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = window.L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView([20.5937, 78.9629], 5);
    mapInstance.current = map;

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    if (route.originCoord && route.destCoord) {
      const start = [route.originCoord.lat, route.originCoord.lon];
      const end = [route.destCoord.lat, route.destCoord.lon];

      // Start marker (pink pin)
      window.L.marker(start, {
        icon: window.L.divIcon({ html: '<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">📍</div>', className: 'custom-div-icon', iconSize: [28,28] })
      }).addTo(map).bindPopup('<b>Start</b>');

      // End marker (checkered flag)
      window.L.marker(end, {
        icon: window.L.divIcon({ html: '<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">🏁</div>', className: 'custom-div-icon', iconSize: [28,28] })
      }).addTo(map).bindPopup('<b>Destination</b>');

      // Waypoints
      if (route.waypointCoords && route.waypointCoords.length > 0) {
        route.waypointCoords.forEach((wp, idx) => {
          window.L.marker([wp.lat, wp.lon], {
            icon: window.L.divIcon({ 
              html: `<div style="font-size:20px;background:#10B981;border:2px solid white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.4);">${idx + 1}</div>`, 
              className: 'custom-div-icon', 
              iconSize: [24,24] 
            })
          }).addTo(map).bindPopup(`<b>Stop ${idx + 1}</b>`);
        });
      }

      let bounds = window.L.latLngBounds([start, end]);

      if (route.routeGeometry) {
        const coords = decodePolyline(route.routeGeometry);
        if (coords.length > 0) {
          // Route line
          window.L.polyline(coords, { color: '#10B981', weight: 7, opacity: 0.95, dashArray: '1, 12', lineCap: 'round' }).addTo(map);
          bounds = window.L.latLngBounds(coords);

          // Toll markers
          if (route.tolls && route.tolls.length > 0) {
            const step = Math.floor(coords.length / (route.tolls.length + 1));
            route.tolls.forEach((toll, idx) => {
              const pos = coords[step * (idx + 1)];
              if (pos) {
                window.L.marker(pos, {
                  icon: window.L.divIcon({
                    html: `<div style="background:#F59E0B;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);">₹</div>`,
                    className: 'custom-div-icon', iconSize: [28, 28]
                  })
                }).addTo(map).bindPopup(`<b>${toll.name}</b><br>Est. ₹${toll.cost}`);
              }
            });
          }
        }
      } else {
        window.L.polyline([start, end], { color: '#10B981', weight: 6, opacity: 0.8 }).addTo(map);
      }

      map.fitBounds(bounds, { padding: [60, 60] });
    }

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [route]);

  useEffect(() => {
    if (tripStarted) {
      setNavInstruction('Head towards route');
      setNavSubtext('CALCULATING LIVE TRAFFIC...');
      
      // Zoom to user location
      if (navigator.geolocation && mapInstance.current) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          mapInstance.current.setView([latitude, longitude], 15);
          
          // Add user location marker
          window.L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#3B82F6',
            color: '#fff',
            weight: 3,
            fillOpacity: 1
          }).addTo(mapInstance.current).bindPopup('You are here');
        }, (err) => {
          console.error("Geolocation error:", err);
          alert("Please enable location permissions to zoom to your position.");
        });
      }

      const t1 = setTimeout(() => { 
        setNavInstruction(`Follow ${route?.name?.split('(')[0] || 'NH-48'}`); 
        setNavSubtext(`${route?.distance || '0 km'} remaining · ETA ${route?.eta || ''}`); 
      }, 2000);
      const t2 = setTimeout(() => { setNavSubtext('Avoiding closures · Live rerouting active'); }, 5000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [tripStarted, route]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', background: '#000' }}>
      {/* Navigation Header */}
      <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
          ⬆️
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'white', fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{navInstruction}</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{navSubtext}</div>
        </div>
        <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
      </div>

      {/* Full Map */}
      <div ref={mapRef} style={{ flex: 1, width: '100%' }}></div>

      {/* Bottom Panel */}
      <div style={{ background: isDark ? '#1E293B' : '#fff', padding: '12px 16px', boxShadow: '0 -4px 12px rgba(0,0,0,0.15)', zIndex: 10 }}>
        {route?.alerts && route.alerts.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', padding: '8px 12px', background: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2', borderRadius: '10px', fontSize: '13px', color: '#EF4444', fontWeight: 500 }}>
            <span>🔴</span>
            <span>{route.alerts[0]?.text || 'Avoiding closures'}</span>
          </div>
        )}
        <button
          onClick={() => setTripStarted(!tripStarted)}
          style={{
            width: '100%', padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 800, letterSpacing: '1px', fontFamily: 'var(--font-display)',
            background: tripStarted ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white', boxShadow: '0 4px 12px rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          {tripStarted ? '⏹ END TRIP' : '▶ START TRIP'}
        </button>
      </div>
    </div>
  );
}

// Home Screen Component
function HomeScreen({ isDark, telemetry, route, isCalculating, onShowFuel, onShowRest, reminders = [], onSetReminder }) {
  const riskScore = route ? route.risk : 0;
  const activeAlerts = route && route.alerts ? route.alerts : [];
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [showFullMap, setShowFullMap] = useState(false);

  if (isCalculating) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <div style={{ fontSize: '48px', animation: 'pulse 1.5s infinite' }}>🧠</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text)' }}>Calculating Best Routes...</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px' }}>AI is geocoding your locations and finding real driving routes via OSRM</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', padding: '24px' }}>
        <div style={{ fontSize: '64px' }}>🗺️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text)', textAlign: 'center' }}>No Route Planned Yet</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px' }}>Go to the Plan tab, select your Start and End locations, then tap "Find Best Route" to see your dashboard here.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Route Identity Card */}
      <div className="route-identity">
        <div className="route-identity-header">
          <span className="route-identity-name">{route ? route.name : 'via NH48'}</span>
          <span className="route-rating">★★★★★ ({route ? route.rating : '4.2'})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="risk-badge risk-low">Route Risk: {riskScore}% {riskScore < 30 ? '🟢' : riskScore < 50 ? '🟡' : '🔴'}</span>
          <div className="pulse-dot"></div>
        </div>
      </div>

      {/* AI Safety Speedometer */}
      {(() => {
        const safetyScore = 100 - riskScore;
        const angle = (safetyScore / 100) * 180;
        const color = safetyScore >= 70 ? '#10B981' : safetyScore >= 40 ? '#F59E0B' : '#EF4444';
        const label = safetyScore >= 70 ? 'Safe Route' : safetyScore >= 40 ? 'Moderate Risk' : 'High Risk';
        // Arc path for semicircle
        const r = 70;
        const cx = 100, cy = 90;
        const startAngle = Math.PI;
        const endAngle = Math.PI - (angle * Math.PI / 180);
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy - r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy - r * Math.sin(endAngle);
        const largeArc = angle > 180 ? 1 : 0;
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 8px', marginBottom: '8px' }}>
            <svg width="200" height="110" viewBox="0 0 200 110">
              {/* Background arc */}
              <path d={`M 30 90 A 70 70 0 0 1 170 90`} fill="none" stroke="var(--border)" strokeWidth="14" strokeLinecap="round" />
              {/* Value arc */}
              <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${color}66)` }} />
              {/* Score text */}
              <text x="100" y="78" textAnchor="middle" fontFamily="var(--font-display)" fontSize="32" fontWeight="800" fill="var(--text)">{safetyScore}</text>
              <text x="100" y="96" textAnchor="middle" fontFamily="var(--font-body)" fontSize="11" fontWeight="600" fill={color}>/ 100</text>
            </svg>
            <div style={{ fontSize: '14px', fontWeight: 700, color, fontFamily: 'var(--font-display)', marginTop: '-4px' }}>
              🧠 AI Rating: {label}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Based on weather, road quality, traffic & cargo analysis
            </div>
          </div>
        );
      })()}

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '16px' }}>
        <div className="stat-card">
          <div className="stat-value">{route ? route.distance : '0 km'}</div>
          <div className="stat-label">Total Distance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{route ? route.eta : '0h 0m'}</div>
          <div className="stat-label">ETA</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={onShowFuel}>
          <div className="stat-value">{route ? (route.fuelStations?.length || route.fuelStops) : '0'}</div>
          <div className="stat-label">Fuel Stops</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={onShowRest}>
          <div className="stat-value">{route ? (route.restStopsList?.length || route.restStops) : '0'}</div>
          <div className="stat-label">Rest Stops</div>
        </div>
      </div>

      {/* Interactive Map - clickable to open fullscreen */}
      <div onClick={() => setShowFullMap(true)} style={{ cursor: 'pointer', position: 'relative' }}>
        <InteractiveMap key={route?.id || 'none'} origin={route?.originCoord} dest={route?.destCoord} waypointCoords={route?.waypointCoords} routeGeometry={route?.routeGeometry} tolls={route?.tolls} isDark={isDark} />
        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, pointerEvents: 'none', backdropFilter: 'blur(4px)' }}>
          Tap to open full navigation →
        </div>
      </div>

      {/* Highway Overview Section */}
      <div className="card" style={{ margin: '16px 16px 0' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🛣️ Route Overview (Highways)
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
          {route.highwaySequence?.map((hw, idx) => (
            <React.Fragment key={idx}>
              <div style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '6px 12px', 
                borderRadius: '8px', 
                fontSize: '13px', 
                fontWeight: 700,
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {hw}
              </div>
              {idx < route.highwaySequence.length - 1 && (
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>➜</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Full Screen Navigation Map Modal */}
      {showFullMap && (
        <FullScreenNavMap route={route} isDark={isDark} onClose={() => setShowFullMap(false)} />
      )}

      {/* Alert Feed */}
      <div className="alert-feed">
        <h3 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-secondary)' }}>
          Live Driver Alerts
        </h3>
        {activeAlerts.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: '12px', fontSize: '13px' }}>
            No active alerts for this route. Safe travels!
          </div>
        ) : activeAlerts.map((alert, index) => (
          <div key={alert.id || index} className="alert-card" onClick={() => setSelectedAlert(alert)}>
            <div className="alert-icon">
              {alert.icon === 'fuel' ? '⛽' : 
               alert.icon === 'toll' ? '🛣️' : 
               alert.icon === 'construction' ? '🚧' : 
               alert.icon === 'weather' ? '☀️' : 
               alert.icon === 'reroute' ? '🔄' : 
               alert.icon === 'rest' ? '🍴' : '⚠️'}
            </div>
            <div className="alert-text">{alert.message || alert.text}</div>
            {reminders.some(r => r.id === alert.id) && (
              <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>🔔</span>
            )}
          </div>
        ))}
      </div>

      {/* Reminder Modal */}
      {selectedAlert && (
        <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '16px' }}>
                {selectedAlert.icon} {selectedAlert.text}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Would you like to set a reminder for this alert? You'll receive a notification when you're approaching this location.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedAlert(null)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={() => onSetReminder(selectedAlert)} style={{ flex: 1 }}>
                  🔔 Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Route Screen Component
function RouteScreen({ isDark, activeFilters, setActiveFilters, routes, setActiveRouteId, setCurrentScreen }) {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [whatIfRain, setWhatIfRain] = useState(0);
  const [showFuelStations, setShowFuelStations] = useState(false);
  const [showRestStops, setShowRestStops] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);

  const toggleFilter = (filterId) => {
    if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter(f => f !== filterId));
    } else {
      setActiveFilters([...activeFilters, filterId]);
    }
  };

  const filteredRoutes = routes.filter(route => {
    if (activeFilters.length === 0) return true;
    let pass = true;
    if (activeFilters.includes('avoidTolls') && route.tollCost > 0) pass = false;
    if (activeFilters.includes('leastTraffic') && route.riskBreakdown?.trafficCongestion?.label === 'Heavy') pass = false;
    if (activeFilters.includes('noRain') && route.riskBreakdown?.weatherRisk?.label === 'High') pass = false;
    if (activeFilters.includes('bestRoad') && route.riskBreakdown?.roadQuality?.label === 'Poor') pass = false;
    if (activeFilters.includes('fastest') && !route.tags?.includes('Fastest')) pass = false;
    if (activeFilters.includes('fuelEfficient') && !route.tags?.includes('Most Economical')) pass = false;
    return pass;
  });

  const getRiskClass = (risk) => {
    if (risk < 30) return 'risk-low';
    if (risk < 50) return 'risk-medium';
    return 'risk-high';
  };

  return (
    <div>
      {/* Filter Chips */}
      <div className="filter-chips">
        {filterChips.map(chip => (
          <button
            key={chip.id}
            className={`filter-chip ${activeFilters.includes(chip.id) ? 'active' : ''}`}
            onClick={() => toggleFilter(chip.id)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Active Filter Count */}
      {activeFilters.length > 0 && (
        <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {activeFilters.length} Filters Active
          </span>
          <button
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '13px' }}
            onClick={() => setActiveFilters([])}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Route Cards */}
      {routes.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '16px', padding: '24px' }}>
          <div style={{ fontSize: '64px' }}>🛣️</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text)', textAlign: 'center' }}>No Routes Calculated</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px' }}>Go to Plan tab first. Select your starting point and destination, then tap "Find Best Route".</p>
        </div>
      )}
      {routes.length > 0 && filteredRoutes.length === 0 && activeFilters.length > 0 && (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No routes match your filters. Try removing some filters.</p>
        </div>
      )}
      {filteredRoutes.map(route => (
        <div
          key={route.id}
          className="route-card"
          onClick={() => setSelectedRoute(route)}
        >
          <div className="route-header">
            <span className="route-name">{route.name}</span>
            <span className={`risk-badge ${getRiskClass(route.risk)}`}>
              {route.risk}% {route.risk < 30 ? '🟢' : route.risk < 50 ? '🟡' : '🔴'}
            </span>
          </div>
          <div className="route-meta">
            <span>🛣️ {route.distance}</span>
            <span>⏱️ {route.eta}</span>
            <span>⭐ {route.rating}</span>
          </div>
          <div className="route-badges">
            {route.badges.map((badge, i) => (
              <span key={i} className="badge badge-success">{badge}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            {route.tags.map((tag, i) => (
              <span key={i} className="badge" style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Modern Route Detail Modal */}
      {selectedRoute && (
        <div className="modal-overlay" onClick={() => setSelectedRoute(null)} style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '24px', overflow: 'hidden', padding: 0, animation: 'slideUp 0.3s ease-out', maxHeight: '90vh' }}>
            <div style={{ background: `linear-gradient(135deg, ${selectedRoute.risk < 30 ? '#10B981' : selectedRoute.risk < 50 ? '#F59E0B' : '#EF4444'} 0%, ${isDark ? '#1E293B' : '#fff'} 100%)`, padding: '24px 20px', position: 'relative' }}>
              <button onClick={() => setSelectedRoute(null)} style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '12px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {selectedRoute.name}
              </h2>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', fontSize: '14px', fontWeight: 500 }}>
                  <span>🛣️</span>
                  <span>{selectedRoute.distance}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', fontSize: '14px', fontWeight: 500 }}>
                  <span>⏱️</span>
                  <span>{selectedRoute.eta}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', fontSize: '14px', fontWeight: 500 }}>
                  <span>⭐</span>
                  <span>{selectedRoute.rating}</span>
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'inline-block', background: 'rgba(255,255,255,0.25)', padding: '8px 16px', borderRadius: '20px', color: 'white', fontWeight: 600, fontSize: '13px' }}>
                {selectedRoute.risk}% {selectedRoute.risk < 30 ? 'Low Risk 🟢' : selectedRoute.risk < 50 ? 'Medium Risk 🟡' : 'High Risk 🔴'}
              </div>
            </div>

            <div style={{ padding: '20px', maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>Route Highlights</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedRoute.badges.map((badge, i) => (
                    <span key={i} style={{ padding: '8px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 500, background: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: isDark ? '#06B6D4' : '#10B981', border: `1px solid ${isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(16, 185, 129, 0.2)'}` }}>
                      {badge}
                    </span>
                  ))}
                  {selectedRoute.tags.map((tag, i) => (
                    <span key={i} style={{ padding: '8px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 500, background: 'var(--border)', color: 'var(--text-secondary)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>AI Risk Breakdown</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {Object.entries(selectedRoute.riskBreakdown).filter(([k]) => k !== 'overallDisruptionRisk').map(([key, data]) => {
                    const title = key.replace(/([A-Z])/g, ' $1').trim();
                    const score = data.score || 0;
                    const isHigh = score > 50;
                    const isMedium = score > 20 && score <= 50;
                    const color = isHigh ? '#EF4444' : isMedium ? '#F59E0B' : '#10B981';
                    
                    return (
                      <div key={key} style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', textTransform: 'capitalize' }}>
                            {title}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color, padding: '2px 8px', borderRadius: '8px', background: `${color}20` }}>
                            {data.label || `${score}%`}
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                          <div style={{ width: `${Math.min(100, Math.max(0, score))}%`, height: '100%', background: color, borderRadius: '4px' }} />
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {data.details || (data.zones && data.zones.length > 0 ? `Zones: ${data.zones.join(', ')}` : 'Normal conditions.')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div 
                  onClick={() => setShowFuelStations(true)}
                  style={{ 
                    padding: '16px', 
                    background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', 
                    borderRadius: '16px', 
                    border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'}` ,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>⛽</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{selectedRoute.fuelStations?.length || selectedRoute.fuelStops}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fuel Stations</div>
                </div>
                <div 
                  onClick={() => setShowRestStops(true)}
                  style={{ 
                    padding: '16px', 
                    background: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.05)', 
                    borderRadius: '16px', 
                    border: `1px solid ${isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.1)'}` ,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>🍴</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{selectedRoute.restStopsList?.length || selectedRoute.restStops}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Rest Stops</div>
                </div>
              </div>

              <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🧪 What-If Simulation
                </h3>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text)' }}>Rain Intensity +{whatIfRain}%</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: selectedRoute.risk + Math.floor(whatIfRain / 10) > 50 ? '#EF4444' : selectedRoute.risk + Math.floor(whatIfRain / 10) > 30 ? '#F59E0B' : '#10B981' }}>
                      {Math.min(100, selectedRoute.risk + Math.floor(whatIfRain / 10))}% Risk
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={whatIfRain}
                    onChange={(e) => setWhatIfRain(e.target.value)}
                    style={{ width: '100%', height: '8px', borderRadius: '4px', WebkitAppearance: 'none', appearance: 'none', background: 'var(--border)', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '14px 20px', fontSize: '15px', fontWeight: 600, borderRadius: '16px' }}
                  onClick={() => {
                    setActiveRouteId(selectedRoute.id);
                    setCurrentScreen('home');
                    setSelectedRoute(null);
                  }}
                >
                  🏁 Start This Route
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '14px 20px', fontSize: '15px', fontWeight: 600, borderRadius: '16px' }}
                  onClick={() => setShowRouteMap(true)}
                >
                  🗺️ View Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fuel Stations Modal */}
      {showFuelStations && selectedRoute && (
        <div className="modal-overlay" onClick={() => setShowFuelStations(false)} style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '24px', overflow: 'hidden', padding: 0, animation: 'slideUp 0.3s ease-out', maxHeight: '90vh' }}>
            <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', padding: '24px 20px', position: 'relative' }}>
              <button onClick={() => setShowFuelStations(false)} style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                ⛽ Fuel Stations
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>
                {selectedRoute.fuelStations?.length || 0} stations on this route
              </p>
            </div>
            <div style={{ padding: '20px', maxHeight: 'calc(90vh - 150px)', overflowY: 'auto' }}>
              {selectedRoute.fuelStations?.map((station, i) => (
                <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '20px' }}>⛽</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{station.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                      <span>📍 {station.area}</span>
                      <span>📏 {station.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rest Stops Modal */}
      {showRestStops && selectedRoute && (
        <div className="modal-overlay" onClick={() => setShowRestStops(false)} style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '24px', overflow: 'hidden', padding: 0, animation: 'slideUp 0.3s ease-out', maxHeight: '90vh' }}>
            <div style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', padding: '24px 20px', position: 'relative' }}>
              <button onClick={() => setShowRestStops(false)} style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                🍴 Rest Stops
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>
                {selectedRoute.restStopsList?.length || 0} stops on this route
              </p>
            </div>
            <div style={{ padding: '20px', maxHeight: 'calc(90vh - 150px)', overflowY: 'auto' }}>
              {selectedRoute.restStopsList?.map((stop, i) => (
                <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '20px' }}>🍴</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{stop.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                      <span>📍 {stop.area}</span>
                      <span>📏 {stop.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Route Map Modal */}
      {showRouteMap && selectedRoute && (
        <div className="modal-overlay" onClick={() => setShowRouteMap(false)} style={{ background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(12px)', zIndex: 10000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '95%', maxWidth: '800px', height: '80vh', borderRadius: '24px', overflow: 'hidden', padding: 0 }}>
            <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
              <button onClick={() => setShowRouteMap(false)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white', cursor: 'pointer', fontSize: '24px' }}>×</button>
            </div>
            <InteractiveMap 
              origin={selectedRoute.originCoord} 
              dest={selectedRoute.destCoord} 
              waypointCoords={selectedRoute.waypointCoords}
              routeGeometry={selectedRoute.routeGeometry}
              tolls={selectedRoute.tolls}
              isDark={isDark} 
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '20px', color: 'white' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>{selectedRoute.name}</h3>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
                <span>🛣️ {selectedRoute.distance}</span>
                <span>⏱️ {selectedRoute.eta}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Cost Screen Component
function CostScreen({ isDark, route }) {
  const userStr = localStorage.getItem('rc_user');
  const user = userStr ? JSON.parse(userStr) : { userId: 'guest' };
  const storageKey = `rc_costs_${user.userId || 'guest'}`;

  const [costs, setCosts] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newCost, setNewCost] = useState({ category: 'Fuel', amount: '', note: '', date: new Date().toLocaleDateString() });

  const handleAddCost = () => {
    if (!newCost.amount) return;
    const entry = {
      ...newCost,
      amount: parseInt(newCost.amount),
      id: Date.now()
    };
    const updated = [...costs, entry];
    setCosts(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNewCost({ category: 'Fuel', amount: '', note: '', date: new Date().toLocaleDateString() });
  };

  const userTotal = costs.reduce((sum, c) => sum + c.amount, 0);
  const aiToll = route ? route.tollCost : 0;
  const aiFuel = route ? route.fuelCost : 0;

  if (!route) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', padding: '24px' }}>
        <div style={{ fontSize: '64px' }}>💰</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text)', textAlign: 'center' }}>No Route Selected</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px' }}>Plan a route first to see the AI cost estimation.</p>
      </div>
    );
  }

  return (
    <div className="tab-content" style={{ paddingBottom: '80px' }}>
      <div className="card" style={{ margin: '16px', background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Trip Total Logged</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{'\u20B9'}{userTotal.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Planned Savings</div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{'\u20B9'}1,200</div>
          </div>
        </div>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>AI Estimated Total Journey Cost</div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{'\u20B9'}{(aiToll + aiFuel).toLocaleString()}</div>
        </div>
      </div>

      <div className="card" style={{ margin: '0 16px 16px' }}>
        <h3 className="card-header">{'\u270f\ufe0f'} Log Your Expenses</h3>
        <div className="cost-form">
          <div className="input-group">
            <label className="input-label">Category</label>
            <select className="input-field" value={newCost.category} onChange={(e) => setNewCost({ ...newCost, category: e.target.value })}>
              <option value="Fuel">Fuel</option>
              <option value="Toll">Toll</option>
              <option value="Food">Food</option>
              <option value="Repair">Repair</option>
              <option value="Misc">Misc</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Amount ({'\u20B9'})</label>
            <input type="number" className="input-field" placeholder="Enter amount" value={newCost.amount} onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">Note (optional)</label>
            <input type="text" className="input-field" placeholder="Add a note" value={newCost.note} onChange={(e) => setNewCost({ ...newCost, note: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={handleAddCost}>+ Add Entry</button>
        </div>
        
        {costs.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Logged Expenses</div>
            {costs.map((c) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{c.category}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c.date} {c.note ? `• ${c.note}` : ''}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>₹{c.amount}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Offline Mode Screen Component
function OfflineScreen({ isDark, route }) {
  if (!route) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', padding: '24px' }}>
        <div style={{ fontSize: '64px' }}>{'\ud83d\udcf4'}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text)', textAlign: 'center' }}>No Route for Offline Mode</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px' }}>Plan a route first to see offline navigation data.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontFamily: 'var(--font-display)' }}>{'\ud83d\udcf4'} Offline Navigation</h2>
        <span className="status-online">Currently: Online {'\u2705'}</span>
      </div>

      <div className="card" style={{ margin: '0 16px 16px' }}>
        <h3 className="card-header">🗺️ Offline Route Map</h3>
        <InteractiveMap key={route.id} origin={route.originCoord} dest={route.destCoord} waypointCoords={route.waypointCoords} routeGeometry={route.routeGeometry} tolls={route.tolls} isDark={isDark} />
        <h3 className="card-header">{'\ud83d\uddfa\ufe0f'} Active Route</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Route</span>
            <span style={{ fontWeight: 600 }}>{route.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Distance</span>
            <span style={{ fontWeight: 600 }}>{route.distance}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>ETA</span>
            <span style={{ fontWeight: 600 }}>{route.eta}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Risk Level</span>
            <span style={{ fontWeight: 600 }}>{route.risk}% {route.risk < 30 ? '\ud83d\udfe2' : route.risk < 50 ? '\ud83d\udfe1' : '\ud83d\udd34'}</span>
          </div>
        </div>
      </div>

      <div className="ai-offline-note">
        <div className="ai-offline-note-title">🤖 AI Offline Mode</div>
        <div className="ai-offline-note-text">
          Route data for {route.name} has been cached. AI will use local predictions if you go offline.
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          ⚠️ Live traffic and rain data require internet. Offline AI uses cached route intelligence.
        </div>
      </div>

      <div style={{ padding: '0 16px', marginTop: '16px', marginBottom: '32px' }}>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold' }}
          onClick={() => {
            const htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <title>RouteCopilot Offline Map - ${route.name}</title>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <style>
                  body { font-family: sans-serif; margin: 0; padding: 20px; background: #f4f7f6; }
                  #map { height: 400px; width: 100%; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                  .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
                  h1 { color: #10B981; font-size: 24px; }
                  .meta { display: flex; gap: 20px; margin-bottom: 20px; color: #64748b; }
                  .risk-breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
                  .risk-item { padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
                  .risk-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; }
                  .risk-val { font-size: 14px; font-weight: 700; color: #1e293b; margin-top: 4px; }
                  .highway-list { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
                  .highway-chip { background: #10B981; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
                </style>
              </head>
              <body>
                <div class="card">
                  <h1>🗺️ Offline Map: ${route.name}</h1>
                  <div class="meta">
                    <span>Distance: ${route.distance}</span>
                    <span>ETA: ${route.eta}</span>
                    <span>Risk: ${route.risk}%</span>
                  </div>

                  <div class="highway-list">
                    ${(route.highwaySequence || []).map(h => `<span class="highway-chip">${h}</span>`).join(' ')}
                  </div>

                  <div id="map"></div>

                  <div class="risk-breakdown">
                    ${Object.entries(route.riskBreakdown || {}).filter(([k]) => k !== 'overallDisruptionRisk').map(([key, data]) => `
                      <div class="risk-item">
                        <div class="risk-label">${key.replace(/([A-Z])/g, ' $1')}</div>
                        <div class="risk-val">${data.label || data.score + '%'}</div>
                      </div>
                    `).join('')}
                  </div>

                  <h3>Route Alerts</h3>
                  <ul>
                    ${(route.alerts || []).map(a => `<li><strong>${a.icon}</strong> ${a.text}</li>`).join('')}
                  </ul>
                </div>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                <script>
                  // Polyline decoder
                  function decodePolyline(str, precision) {
                    var index = 0, lat = 0, lng = 0, coordinates = [], shift = 0, result = 0, byte = null, lat_change, lng_change, factor = Math.pow(10, precision || 5);
                    while (index < str.length) {
                      byte = null; shift = 0; result = 0;
                      do { byte = str.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
                      lat_change = ((result & 1) ? ~(result >> 1) : (result >> 1)); lat += lat_change;
                      byte = null; shift = 0; result = 0;
                      do { byte = str.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
                      lng_change = ((result & 1) ? ~(result >> 1) : (result >> 1)); lng += lng_change;
                      coordinates.push([lat / factor, lng / factor]);
                    }
                    return coordinates;
                  }

                  const map = L.map('map').setView([${route.originCoord?.lat || 0}, ${route.originCoord?.lon || 0}], 13);
                  L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                    subdomains: ['mt0','mt1','mt2','mt3']
                  }).addTo(map);
                  
                  const start = [${route.originCoord?.lat || 0}, ${route.originCoord?.lon || 0}];
                  const end = [${route.destCoord?.lat || 0}, ${route.destCoord?.lon || 0}];
                  L.marker(start).addTo(map).bindPopup('Origin');
                  L.marker(end).addTo(map).bindPopup('Destination');
                  
                  // Add Waypoints
                  const waypoints = ${JSON.stringify(route.waypointCoords || [])};
                  waypoints.forEach((wp, idx) => {
                    L.marker([wp.lat, wp.lon]).addTo(map).bindPopup('Stop ' + (idx + 1));
                  });
                  
                  // Add Fuel Stations
                  const fuels = ${JSON.stringify(route.fuelStations || [])};
                  fuels.forEach((f, i) => {
                    // Logic to approximate position if actual coords missing, 
                    // but for now just mark origin as sample if no coord data
                    L.marker(start).addTo(map).bindPopup('⛽ ' + f.name + ' (' + f.area + ')');
                  });

                  // Add Rest Stops
                  const rests = ${JSON.stringify(route.restStopsList || [])};
                  rests.forEach((r, i) => {
                    L.marker(end).addTo(map).bindPopup('🍴 ' + r.name + ' (' + r.area + ')');
                  });
                  
                  const geometry = ${JSON.stringify(route.routeGeometry || '')};
                  if (geometry && geometry.length > 0) {
                    const coords = decodePolyline(geometry);
                    const polyline = L.polyline(coords, {color: '#10B981', weight: 6, opacity: 0.8, lineJoin: 'round'}).addTo(map);
                    setTimeout(() => { map.fitBounds(polyline.getBounds(), { padding: [20, 20] }); }, 100);
                  } else {
                    const polyline = L.polyline([start, end], {color: '#10B981', weight: 5, dashArray: '5, 10'}).addTo(map);
                    map.fitBounds(polyline.getBounds());
                  }
                </script>
              </body>
              </html>
            `;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", url);
            dlAnchorElem.setAttribute("download", `map_snapshot_${route.id || 'offline'}.html`);
            dlAnchorElem.click();
          }}
        >
          🗺️ Download Offline Map Snapshot
        </button>
      </div>
    </div>
  );
}

// Profile Screen Component
function ProfileScreen({ isDark, setIsDark, onLogout }) {
  const [scores, setScores] = useState({ eco: 0, speed: 0, rest: 0 });
  const [rating, setRating] = useState("0.0");
  const [tripsCompleted, setTripsCompleted] = useState(0);

  useEffect(() => {
    apiClient.get('/users/performance').then(res => {
      if (res.data?.data) {
        setScores({
          eco: res.data.data.efficiencyScore || 0,
          speed: 0,
          rest: res.data.data.safetyScore || 0
        });
        setRating(res.data.data.rating || "0.0");
        setTripsCompleted(res.data.data.completedTrips || 0);
      }
    }).catch(console.error);
  }, []);

  const userStr = localStorage.getItem('rc_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user ? `${user.firstName} ${user.lastName}` : "Guest Driver";
  const initials = user ? `${user.firstName[0]}${(user.lastName || "U")[0]}`.toUpperCase() : "GD";
  const joinedDate = user ? "Joined Apr 2026" : "Joined Jan 2026";

  return (
    <div>
      {/* User Card */}
      <div className="card" style={{ margin: '16px', textAlign: 'center' }}>
        <div className="avatar" style={{ margin: '0 auto 12px' }}>{initials}</div>
        <h2 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{userName}</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{user?.vehicleType || 'Truck Driver'} • {joinedDate}</p>
        <div style={{ fontSize: '20px', color: '#F59E0B', fontWeight: '600' }}>
          ⭐ Driver Rating: {rating} / 5
        </div>
      </div>

      {/* AI Performance Analysis */}
      <div className="card" style={{ margin: '0 16px 16px' }}>
        <h3 className="card-header">AI Performance Analysis</h3>
        
        <div className="score-bar">
          <div className="score-header">
            <span className="score-label">Eco Driving Score</span>
            <span className="score-value">{scores.eco}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${scores.eco}%` }}></div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Smooth acceleration, good fuel efficiency
          </div>
        </div>

        <div className="score-bar">
          <div className="score-header">
            <span className="score-label">Speed Management</span>
            <span className="score-value">{scores.speed}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${scores.speed}%` }}></div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Slightly above recommended on highways
          </div>
        </div>

        <div className="score-bar">
          <div className="score-header">
            <span className="score-label">Rest Compliance</span>
            <span className="score-value">{scores.rest}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${scores.rest}%` }}></div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Regular stops, great fatigue management
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '12px', background: 'var(--border)', borderRadius: 'var(--radius-sm)' }}>
          🌱 Eco-Friendly Driver
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{user ? '0 km' : '0 km'}</div>
          <div className="stat-label">Total Distance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{user ? tripsCompleted : 0}</div>
          <div className="stat-label">Deliveries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹0</div>
          <div className="stat-label">Fuel Saved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0%</div>
          <div className="stat-label">Avg Risk</div>
        </div>
      </div>

      {/* Behavior Log */}
      <div className="card" style={{ margin: '16px' }}>
        <h3 className="card-header">Recent Trips</h3>
        
        {user ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            No recent trips found for this user.
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Please log in to see your trip history.
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="settings-list">
        <div className="settings-item">
          <span className="settings-label">Night Mode</span>
          <div
            className={`switch ${isDark ? 'active' : ''}`}
            onClick={() => setIsDark(!isDark)}
          ></div>
        </div>
        <div className="settings-item">
          <span className="settings-label">Notification Preferences</span>
          <span style={{ color: 'var(--text-secondary)' }}>➔</span>
        </div>
        <div className="settings-item">
          <span className="settings-label">Default Route Filters</span>
          <span style={{ color: 'var(--text-secondary)' }}>➔</span>
        </div>
        <div className="settings-item">
          <span className="settings-label">Download Offline Maps</span>
          <span style={{ color: 'var(--text-secondary)' }}>➔</span>
        </div>
        <div 
          className="settings-item" 
          style={{ borderColor: '#EF4444', cursor: 'pointer' }}
          onClick={onLogout}
        >
          <span style={{ color: '#EF4444' }}>Logout</span>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('plan');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [calculatedRoutes, setCalculatedRoutes] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [activeRouteId, setActiveRouteId] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [planOrigin, setPlanOrigin] = useState('');
  const [planDest, setPlanDest] = useState('');
  const [globalFuelModal, setGlobalFuelModal] = useState(false);
  const [globalRestModal, setGlobalRestModal] = useState(false);
  const [reminders, setReminders] = useState([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedRoutes = localStorage.getItem('rc_calculated_routes');
    const savedRouteId = localStorage.getItem('rc_active_route_id');
    const savedLoggedIn = localStorage.getItem('rc_is_logged_in');
    
    if (savedRoutes) setCalculatedRoutes(JSON.parse(savedRoutes));
    if (savedRouteId) setActiveRouteId(savedRouteId);
    if (savedLoggedIn === 'true') setIsLoggedIn(true);
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('rc_calculated_routes', JSON.stringify(calculatedRoutes));
  }, [calculatedRoutes]);

  useEffect(() => {
    if (activeRouteId) localStorage.setItem('rc_active_route_id', activeRouteId);
  }, [activeRouteId]);

  useEffect(() => {
    localStorage.setItem('rc_is_logged_in', isLoggedIn.toString());
  }, [isLoggedIn]);

  // Connect to Telemetry Websocket
  useEffect(() => {
    socket.emit('start_navigation', activeRouteId);
    
    socket.on('telemetry_update', (data) => {
      setTelemetry(data);
    });

    return () => {
      socket.emit('stop_navigation', activeRouteId);
      socket.off('telemetry_update');
    };
  }, [activeRouteId]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  // Auto-activate night-safe filter when night mode is on
  useEffect(() => {
    if (isDark && !activeFilters.includes('nightSafe')) {
      setActiveFilters([...activeFilters, 'nightSafe']);
    } else if (!isDark && activeFilters.includes('nightSafe')) {
      setActiveFilters(activeFilters.filter(f => f !== 'nightSafe'));
    }
  }, [isDark]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('plan');
  };

  const handlePlanRoute = async (formData) => {
    if (!formData.startPoint || !formData.endPoint) {
      alert("Please select both a Starting Point and Ending Point.");
      return;
    }

    setIsCalculating(true);
    setPlanOrigin(formData.startPoint.split(',')[0].trim());
    setPlanDest(formData.endPoint.split(',')[0].trim());
    
    // Clear old state to prevent 'flicker' with old data
    setCalculatedRoutes([]);
    setActiveRouteId(null);
    setCurrentScreen('home');

    try {
      const response = await apiClient.post('/routes/calculate', {
        origin: formData.startPoint,
        destination: formData.endPoint,
        waypoints: formData.waypoints || [],
        cargoTypes: formData.cargoTypes,
        truckType: formData.vehicleType,
        isNightTime: isDark,
      });

      const apiData = response.data?.data;
      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        const mappedRoutes = apiData.map((r) => {
          const distKm = r.distanceKm || 0;
          const durMins = r.durationMins || 0;
          const fuelStopCount = Math.max(1, Math.floor(distKm / 250)); 
          const restStopCount = Math.max(1, Math.floor(durMins / 180)); 
          
          return {
            id: r.id,
            name: r.name,
            distance: `${distKm} km`,
            eta: `${Math.floor(durMins / 60)}h ${durMins % 60}m`,
            risk: r.riskScore,
            rating: (5.0 - (r.riskScore / 100) * 2.0).toFixed(1),
            badges: r.badges || [],
            tags: [r.primaryAdvantage].filter(Boolean),
            riskBreakdown: r.riskBreakdown || {},
            tollCost: r.tollCostEst,
            fuelCost: r.fuelCostEst,
            fuelStops: fuelStopCount,
            restStops: restStopCount,
            originCoord: r.originCoord,
            destCoord: r.destCoord,
            waypointCoords: r.waypointCoords || [],
            routeGeometry: r.routeGeometry,
            tolls: r.tolls || [],
            alerts: r.alerts || [],
            highwaySequence: r.highwaySequence || [],
            fuelStations: (r.fuelStations || []).map((s, i) => {
              const count = r.fuelStations?.length || 1;
              return {
                name: s,
                distance: `${Math.round(distKm * ((i+1)/(count+1)))} km from start`,
                area: r.name.split(' ')[0] + ' Corridor'
              };
            }),
            restStopsList: (r.restStopsList || []).map((s, i) => {
              const count = r.restStopsList?.length || 1;
              return {
                name: s,
                distance: `${Math.round(distKm * ((i+1)/(count+1)))} km from start`,
                area: r.name.split('(')[0].trim()
              };
            })
          };
        });
        setCalculatedRoutes(mappedRoutes);
        if (mappedRoutes.length > 0) {
          setActiveRouteId(mappedRoutes[0].id);
        }
      }
    } catch (error) {
      console.error("AI Engine Error:", error);
      alert('AI Engine failed to geocode or calculate. Please try another destination.');
      setCurrentScreen('plan');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSetReminder = (alert) => {
    if (!reminders.some(r => r.id === alert.id)) {
      setReminders([...reminders, alert]);
      alert(`Reminder set for: ${alert.text || alert.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rc_is_logged_in');
    localStorage.removeItem('rc_token');
    localStorage.removeItem('rc_user');
    localStorage.removeItem('rc_calculated_routes');
    localStorage.removeItem('rc_active_route_id');
    setIsLoggedIn(false);
    setCalculatedRoutes([]);
    setActiveRouteId(null);
    setCurrentScreen('plan');
  };

  const navItems = [
    { id: 'plan', icon: '📝', label: 'Plan' },
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'route', icon: '🛣️', label: 'Route' },
    { id: 'cost', icon: '💰', label: 'Cost' },
    { id: 'offline', icon: '📲', label: 'Offline' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  if (!isLoggedIn) {
    return (
      <div className={`app-container ${isDark ? 'dark' : ''}`}>
        <header className="header">
          <div className="header-left">
            <div className="logo-icon">🌿</div>
            <span className="app-title">RouteCopilot AI</span>
          </div>
          <button
            className="night-toggle"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle night mode"
          ></button>
        </header>
        <main className="main-content">
          <LoginScreen onLogin={handleLogin} />
        </main>
      </div>
    );
  }

  const renderScreen = () => {
    const activeRoute = calculatedRoutes.find(r => r.id === activeRouteId) || calculatedRoutes[0] || null;
    switch (currentScreen) {
      case 'plan':
        return <PlanScreen onPlanRoute={handlePlanRoute} isDark={isDark} />;
      case 'home':
        return (
          <HomeScreen 
            isDark={isDark} 
            telemetry={telemetry} 
            route={activeRoute} 
            isCalculating={isCalculating} 
            reminders={reminders}
            onSetReminder={handleSetReminder}
            onShowFuel={() => setGlobalFuelModal(true)}
            onShowRest={() => setGlobalRestModal(true)}
          />
        );
      case 'route':
        return (
          <RouteScreen
            isDark={isDark}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            routes={calculatedRoutes}
            setActiveRouteId={setActiveRouteId}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case 'cost':
        return <CostScreen isDark={isDark} route={activeRoute} />;
      case 'offline':
        return <OfflineScreen isDark={isDark} route={activeRoute} />;
      case 'profile':
        return <ProfileScreen isDark={isDark} setIsDark={setIsDark} onLogout={handleLogout} />;
      default:
        return <PlanScreen onPlanRoute={handlePlanRoute} isDark={isDark} />;
    }
  };

  const activeRoute = calculatedRoutes.find(r => r.id === activeRouteId) || calculatedRoutes[0] || null;

  return (
    <div className={`app-container ${isDark ? 'dark' : ''}`}>
      <header className="header">
        <div className="header-left">
          <div className="logo-icon">🌿</div>
          <span className="app-title">RouteCopilot AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleLogout}
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--border)', 
              borderRadius: '12px', 
              padding: '6px 12px', 
              fontSize: '11px', 
              color: '#EF4444', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '500'
            }}
          >
            👤 Logout
          </button>
          {isDark && <span className="night-badge">🌙 Night</span>}
          <button
            className="night-toggle"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle night mode"
          ></button>
        </div>
      </header>

      <main className="main-content">
        {renderScreen()}
      </main>

      <nav className="bottom-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
            onClick={() => setCurrentScreen(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      {globalFuelModal && activeRoute && (
        <FuelStationsModal 
          selectedRoute={activeRoute} 
          onClose={() => setGlobalFuelModal(false)} 
        />
      )}
      {globalRestModal && activeRoute && (
        <RestStopsModal 
          selectedRoute={activeRoute} 
          onClose={() => setGlobalRestModal(false)} 
        />
      )}
    </div>
  );
}

function FuelStationsModal({ selectedRoute, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', zIndex: 20000 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '24px', overflow: 'hidden', padding: 0, animation: 'slideUp 0.3s ease-out', maxHeight: '90vh' }}>
        <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', padding: '24px 20px', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
            ⛽ Fuel Stations
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>
            {selectedRoute.fuelStations?.length || 0} stations on this route
          </p>
        </div>
        <div style={{ padding: '20px', maxHeight: 'calc(90vh - 150px)', overflowY: 'auto' }}>
          {selectedRoute.fuelStations?.map((station, i) => (
            <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '20px' }}>⛽</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{station.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                  <span>📍 {station.area}</span>
                  <span>📏 {station.distance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RestStopsModal({ selectedRoute, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', zIndex: 20000 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '24px', overflow: 'hidden', padding: 0, animation: 'slideUp 0.3s ease-out', maxHeight: '90vh' }}>
        <div style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', padding: '24px 20px', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
            🍴 Rest Stops
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>
            {selectedRoute.restStopsList?.length || 0} stops on this route
          </p>
        </div>
        <div style={{ padding: '20px', maxHeight: 'calc(90vh - 150px)', overflowY: 'auto' }}>
          {selectedRoute.restStopsList?.map((stop, i) => (
            <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '20px' }}>🍴</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{stop.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                  <span>📍 {stop.area}</span>
                  <span>📏 {stop.distance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
