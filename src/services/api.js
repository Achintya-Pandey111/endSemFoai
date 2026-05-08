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
