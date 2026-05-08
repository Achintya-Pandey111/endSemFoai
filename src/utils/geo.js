/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculates the speed between two points given the time difference.
 * @param {number} distance - Distance in km
 * @param {number} timeSeconds - Time difference in seconds
 * @returns {number} - Speed in km/h
 */
export const calculateSpeed = (distance, timeSeconds) => {
  if (timeSeconds <= 0) return 0;
  const timeHours = timeSeconds / 3600;
  return distance / timeHours;
};

/**
 * Formats coordinates for display.
 */
export const formatCoords = (val) => Number(val).toFixed(4);
