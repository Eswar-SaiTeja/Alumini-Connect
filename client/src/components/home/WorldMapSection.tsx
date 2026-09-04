import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../../services/api';
import { Globe2, MapPin, Users, Building, Flag } from 'lucide-react';
import { Badge } from '../common/Badge';

// Fix leaflet icon default issues
const customIcon = new L.DivIcon({
  className: 'custom-map-pin',
  html: `<div style="background-color: #0a2540; width: 26px; height: 26px; border-radius: 50%; border: 3px solid #c89116; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">🎓</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

interface GeoData {
  total: number;
  countries: { name: string; count: number }[];
  cities: { name: string; count: number }[];
}

const GLOBAL_HUBS = [
  { city: 'Rajahmundry & Godavari', country: 'India', lat: 17.0005, lng: 81.804, alumni: '28,000+', desc: 'Alma Mater & Regional Headquarters' },
  { city: 'Hyderabad', country: 'India', lat: 17.385, lng: 78.4867, alumni: '8,500+', desc: 'Telangana Capital Alumni Chapter' },
  { city: 'Bengaluru', country: 'India', lat: 12.9716, lng: 77.5946, alumni: '6,200+', desc: 'IT & Aerospace Hub Chapter' },
  { city: 'Visakhapatnam', country: 'India', lat: 17.6868, lng: 83.2185, alumni: '4,100+', desc: 'Coastline Chapter' },
  { city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, alumni: '2,400+', desc: 'Tamil Nadu Regional Chapter' },
  { city: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, alumni: '1,900+', desc: 'Finance & Industry Chapter' },
  { city: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.209, alumni: '1,500+', desc: 'Civil Services & Northern Chapter' },
  { city: 'Seattle & Redmond', country: 'United States', lat: 47.6062, lng: -122.3321, alumni: '850+', desc: 'Pacific Northwest Big Tech Chapter' },
  { city: 'San Jose & Silicon Valley', country: 'United States', lat: 37.3382, lng: -121.8863, alumni: '1,100+', desc: 'Silicon Valley Innovation Chapter' },
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, alumni: '620+', desc: 'UK & Europe Alumni Chapter' },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, alumni: '480+', desc: 'ASEAN Financial Hub Chapter' },
  { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, alumni: '590+', desc: 'Middle East Regional Chapter' },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, alumni: '340+', desc: 'Oceania Alumni Chapter' },
  { city: 'Munich & Frankfurt', country: 'Germany', lat: 48.1351, lng: 11.582, alumni: '260+', desc: 'Central Europe Science & Engineering' },
];

export const WorldMapSection: React.FC = () => {
  const [geoData, setGeoData] = useState<GeoData | null>(null);

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await api.get('/alumni/geo');
        setGeoData(res.data);
      } catch (error) {
        // Ignore
      }
    };
    fetchGeo();
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="fluid-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-college-navy-50 border border-college-navy-200 text-college-navy-800 text-xs font-bold mb-3">
            <Globe2 className="w-3.5 h-3.5 text-college-gold fill-college-gold" /> Global Presence
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-college-navy font-display tracking-tight">
            Alumni Around the World
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Spanning 42 countries, 18 global alumni chapters, and thousands of enterprises, our
            graduates carry the spirit of Government College Rajahmundry worldwide.
          </p>
        </div>

        {/* Map & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Leaflet Map */}
          <div className="lg:col-span-8 bg-white p-3 rounded-3xl border border-slate-200 shadow-card flex flex-col">
            <div className="h-[420px] sm:h-[480px] rounded-2xl overflow-hidden relative z-0">
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={3}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {GLOBAL_HUBS.map((hub, i) => (
                  <Marker key={i} position={[hub.lat, hub.lng]} icon={customIcon}>
                    <Popup>
                      <div className="text-left p-1">
                        <p className="font-bold text-xs text-slate-900 font-display">
                          {hub.city}, {hub.country}
                        </p>
                        <p className="text-[11px] text-college-navy font-semibold mt-0.5">
                          {hub.alumni} Alumni
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{hub.desc}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="p-3 text-xs text-slate-500 flex items-center justify-between">
              <span>📍 Click on markers to inspect regional chapter details</span>
              <span className="font-semibold text-college-navy">18 Global Chapters Active</span>
            </div>
          </div>

          {/* Regional Chapters Breakdown Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex flex-col justify-between text-left">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
                <Building className="w-4 h-4 text-college-navy" /> Top Alumni Hubs
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Distribution across major geographical chapters
              </p>

              <div className="space-y-3">
                {GLOBAL_HUBS.slice(0, 7).map((hub, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-college-navy-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-college-navy">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{hub.city}</p>
                        <p className="text-[10px] text-slate-500">{hub.country}</p>
                      </div>
                    </div>
                    <Badge variant="primary" size="sm">
                      {hub.alumni}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                🌐 Living abroad? Join your city's local alumni chapter through your dashboard.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
