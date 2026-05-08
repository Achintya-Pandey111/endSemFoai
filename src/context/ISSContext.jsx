import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchISSLocation, fetchPeopleInSpace, fetchReverseGeocode } from '../services/api';
import { calculateDistance, calculateSpeed } from '../utils/geo';
import { storage } from '../utils/storage';
import toast from 'react-hot-toast';

const ISSContext = createContext();

export const ISSProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [history, setHistory] = useState(() => storage.get('iss_history') || []);
  const [speed, setSpeed] = useState(0);
  const [address, setAddress] = useState('Tracking...');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const lastFetchTime = useRef(null);

  const updateISS = useCallback(async () => {
    try {
      const data = await fetchISSLocation();
      const { latitude, longitude } = data.iss_position;
      const timestamp = data.timestamp;
      const realVelocity = data.velocity;
      
      const newPos = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        timestamp,
      };

      // Use real velocity if available, otherwise fallback to calculation
      if (realVelocity) {
        setSpeed(realVelocity);
      } else if (history.length > 0) {
        const lastPos = history[history.length - 1];
        const dist = calculateDistance(lastPos.lat, lastPos.lng, newPos.lat, newPos.lng);
        const timeDiff = timestamp - lastPos.timestamp;
        setSpeed(calculateSpeed(dist, timeDiff));
      }

      setLocation(newPos);
      
      const updatedHistory = [...history, newPos].slice(-30);
      setHistory(updatedHistory);
      storage.set('iss_history', updatedHistory);

      // Reverse geocode every few updates or if manual
      const geoData = await fetchReverseGeocode(newPos.lat, newPos.lng);
      if (geoData) {
        const addr = geoData.display_name || 'Over Ocean';
        setAddress(addr);
      } else {
        setAddress('Over Ocean / Unknown');
      }

      setError(null);
    } catch (err) {
      console.error('ISS update error:', err);
      setError('Failed to fetch ISS location');
      toast.error('Connection error: ISS tracker failed');
    } finally {
      setLoading(false);
    }
  }, [history]);

  const fetchPeople = useCallback(async () => {
    try {
      const data = await fetchPeopleInSpace();
      setPeople(data.people || []);
    } catch (err) {
      console.error('People in space fetch error:', err);
    }
  }, []);

  useEffect(() => {
    updateISS();
    fetchPeople();
    
    const interval = setInterval(updateISS, 15000);
    return () => clearInterval(interval);
  }, [updateISS, fetchPeople]);

  return (
    <ISSContext.Provider value={{ 
      location, 
      history, 
      speed, 
      address, 
      people, 
      loading, 
      error, 
      refresh: updateISS 
    }}>
      {children}
    </ISSContext.Provider>
  );
};

export const useISS = () => useContext(ISSContext);
