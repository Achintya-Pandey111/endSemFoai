/**
 * Storage utility with optional expiry
 */
export const storage = {
  set: (key, value, ttlMinutes = null) => {
    const item = {
      value,
      timestamp: Date.now(),
    };
    if (ttlMinutes) {
      item.expiry = Date.now() + ttlMinutes * 60 * 1000;
    }
    localStorage.setItem(key, JSON.stringify(item));
  },

  get: (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (e) {
      return null;
    }
  },

  remove: (key) => localStorage.removeItem(key),

  clear: () => localStorage.clear(),
};
