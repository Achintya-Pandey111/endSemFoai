import axios from 'axios';

const ASTROS_URL = 'http://api.open-notify.org/astros.json';

const api = axios.create({
  timeout: 10000, // 10 second timeout
});

const ISS_SOURCES = [
  'https://api.wheretheiss.at/v1/satellites/25544',
  'http://api.open-notify.org/iss-now.json'
];

export const fetchISSLocation = async () => {
  // Try Source 1: WhereTheISSAt (HTTPS, Velocity)
  try {
    const response = await api.get(ISS_SOURCES[0]);
    return {
      iss_position: {
        latitude: response.data.latitude,
        longitude: response.data.longitude
      },
      timestamp: response.data.timestamp,
      velocity: response.data.velocity
    };
  } catch (e1) {
    console.warn('Source 1 (WhereTheISSAt) failed, trying Source 2...');
    // Try Source 2: OpenNotify (HTTP, no velocity)
    try {
      const response = await api.get(ISS_SOURCES[1]);
      return {
        iss_position: {
          latitude: parseFloat(response.data.iss_position.latitude),
          longitude: parseFloat(response.data.iss_position.longitude)
        },
        timestamp: response.data.timestamp,
        velocity: null // OpenNotify doesn't provide this
      };
    } catch (e2) {
      console.error('All ISS sources failed:', e2.message);
      throw new Error('Satellite connection lost');
    }
  }
};

export const fetchPeopleInSpace = async () => {
  try {
    const response = await api.get(ASTROS_URL);
    return response.data;
  } catch (error) {
    console.error('People in space service unavailable:', error.message);
    return { people: [] };
  }
};

export const fetchReverseGeocode = async (lat, lon) => {
  try {
    const response = await api.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'OrbitScope-Dashboard/1.0',
        },
      }
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const fetchNews = async (category, apiKey) => {
  if (!apiKey || apiKey.includes('http')) return []; 
  
  try {
    // newsapi.org endpoint
    const response = await api.get(
      `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=10&apiKey=${apiKey}`
    );
    
    if (!response.data || !response.data.articles) {
      console.warn(`No articles found in NewsAPI response for category: ${category}`);
      return [];
    }

    return response.data.articles
      .filter(article => article.title !== '[Removed]') // NewsAPI sometimes returns [Removed]
      .map(article => ({
        ...article,
        urlToImage: article.urlToImage || '', 
        author: article.author || article.source?.name || 'Global News',
        category: category 
      }));
  } catch (error) {
    console.error(`NewsAPI Error (${category}):`, error.response?.data?.message || error.message);
    return [];
  }
};

export const fetchChatResponse = async (messages, token) => {
  if (!token) throw new Error('AI token is missing');

  try {
    // Switching to DeepSeek-V4-Pro via HF OpenAI-compatible Router
    const response = await api.post(
      'https://router.huggingface.co/v1/chat/completions',
      {
        model: 'deepseek-ai/DeepSeek-V4-Pro:novita',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI Router Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please check your HF_TOKEN');
    }
    throw error;
  }
};
