import axios from 'axios';

const ISS_BASE_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const ASTROS_URL = 'http://api.open-notify.org/astros.json';

const api = axios.create({
  timeout: 10000, // 10 second timeout
});

export const fetchISSLocation = async () => {
  const response = await api.get(ISS_BASE_URL);
  return {
    iss_position: {
      latitude: response.data.latitude,
      longitude: response.data.longitude
    },
    timestamp: response.data.timestamp,
    velocity: response.data.velocity
  };
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
    const response = await api.get(
      `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=5&apikey=${apiKey}`
    );
    
    return (response.data.articles || []).map(article => ({
      ...article,
      urlToImage: article.image,
      author: article.source.name,
    }));
  } catch (error) {
    console.error('GNews service error:', error.message);
    return [];
  }
};

export const fetchChatResponse = async (messages, token) => {
  if (!token) throw new Error('AI token is missing');

  try {
    const response = await api.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        inputs: messages,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error && response.data.error.includes('currently loading')) {
      return "I'm currently warming up my orbital processors. Please try again in 30 seconds!";
    }

    return response.data[0]?.generated_text || response.data.generated_text;
  } catch (error) {
    if (error.response?.status === 503) {
      return "My AI core is currently loading on the server. I'll be ready in a few moments!";
    }
    throw error;
  }
};
