import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useISS } from '../context/ISSContext';
import { useTheme } from '../context/ThemeContext';
import { Orbit, Navigation } from 'lucide-react';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom ISS Icon
const issIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="bg-primary p-2 rounded-full shadow-lg shadow-primary/50 text-white animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10V4L7 9h10l-5-5v6"/><path d="M7 9H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2"/><path d="M17 9h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/><path d="M12 15v5l5-5H7l5 5v-5"/><circle cx="12" cy="12" r="2"/></svg>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// Component to handle auto-panning
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const ISSMap = () => {
  const { location, history, speed, address } = useISS();
  const { isDark } = useTheme();

  if (!location) return (
    <div className="w-full h-full flex items-center justify-center glass rounded-3xl bg-secondary/20">
      <div className="text-center">
        <Orbit size={48} className="mx-auto mb-4 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Establishing Satellite Connection...</p>
      </div>
    </div>
  );

  const position = [location.lat, location.lng];
  const pathPositions = history.map(h => [h.lat, h.lng]);

  const tileLayer = isDark 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  return (
    <div className="w-full h-full relative group">
      <MapContainer 
        center={position} 
        zoom={3} 
        scrollWheelZoom={true}
        className="w-full h-full rounded-3xl z-0"
      >
        <ChangeView center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileLayer}
        />
        
        {/* Trajectory path */}
        <Polyline 
          positions={pathPositions} 
          color="#3b82f6" 
          weight={3} 
          opacity={0.6}
          dashArray="10, 10"
        />

        <Marker position={position} icon={issIcon}>
          <Popup>
            <div className="p-1">
              <p className="font-bold text-primary mb-1">ISS Live Location</p>
              <div className="text-xs space-y-1">
                <p>Lat: {location.lat.toFixed(4)}</p>
                <p>Lng: {location.lng.toFixed(4)}</p>
                <p>Speed: {speed.toFixed(2)} km/h</p>
                <p className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2 text-slate-500 italic">
                  {address}
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="glass p-3 rounded-2xl flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Altitude</span>
            <span className="text-sm font-bold text-primary">~420 km</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Velocity</span>
            <span className="text-sm font-bold text-primary">{speed.toFixed(0)} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISSMap;
