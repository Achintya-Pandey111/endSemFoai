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
  html: `<div class="bg-foreground p-2 text-background border border-background shadow-2xl animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10V4L7 9h10l-5-5v6"/><path d="M7 9H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2"/><path d="M17 9h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/><path d="M12 15v5l5-5H7l5 5v-5"/><circle cx="12" cy="12" r="2"/></svg>
         </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
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
    <div className="w-full h-full flex items-center justify-center bg-foreground/[0.03] border border-foreground/10">
      <div className="text-center">
        <Orbit size={32} className="mx-auto mb-6 animate-spin text-foreground/20" />
        <span className="t11-label animate-pulse">Establishing Satellite Connection...</span>
      </div>
    </div>
  );

  const position = [location.lat, location.lng];
  const pathPositions = history.map(h => [h.lat, h.lng]);

  const tileLayer = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  return (
    <div className="w-full h-full relative group bg-background">
      <MapContainer 
        center={position} 
        zoom={3} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <ChangeView center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url={tileLayer}
        />
        
        {/* Trajectory path */}
        <Polyline 
          positions={pathPositions} 
          color="#00ffff" 
          weight={3} 
          opacity={0.8}
          dashArray="10, 10"
          noClip={true}
        />

        <Marker position={position} icon={issIcon}>
          <Popup>
            <div className="p-4 bg-background">
              <span className="t11-label !mb-2">Telemetry Report</span>
              <h4 className="text-lg font-black uppercase tracking-tighter mb-4">ISS Live Feed</h4>
              <div className="text-[10px] font-bold uppercase tracking-widest space-y-2 text-muted-foreground">
                <p>LATITUDE: {location.lat.toFixed(4)}</p>
                <p>LONGITUDE: {location.lng.toFixed(4)}</p>
                <p>VELOCITY: {speed.toFixed(0)} KM/H</p>
                <p className="border-t border-foreground/10 mt-4 pt-4 leading-relaxed">
                  SECTOR: {address}
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-0 border border-foreground/10 bg-background opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-6 flex items-center gap-8">
          <div className="flex flex-col">
            <span className="t11-label !mb-1 opacity-50">Altitude</span>
            <span className="text-sm font-black uppercase tracking-tighter">~420 KM</span>
          </div>
          <div className="w-px h-8 bg-foreground/10" />
          <div className="flex flex-col">
            <span className="t11-label !mb-1 opacity-50">Velocity</span>
            <span className="text-sm font-black uppercase tracking-tighter">{speed.toFixed(0)} KM/H</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISSMap;
