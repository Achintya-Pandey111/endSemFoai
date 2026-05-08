# OrbitScope — Real-Time ISS & News Dashboard

OrbitScope is a futuristic, full-stack frontend dashboard that tracks the International Space Station (ISS) in real-time, provides the latest science and technology news, and features an AI assistant restricted to dashboard data.

## 🚀 Features

- **Live ISS Tracker**: Real-time position, velocity calculation (Haversine), and trajectory path.
- **Geocoding**: Automatic reverse geocoding to show the nearest city or ocean.
- **People in Space**: Live list of astronauts currently aboard the ISS.
- **Intel Dashboard**: Latest Technology and Science news with search, filtering, and caching.
- **AI Assistant**: Context-aware chatbot powered by Mistral-7B via Hugging Face.
- **Analytics**: Real-time speed charts and news distribution data.
- **Premium UI**: Dark/Light modes, glassmorphism, and responsive design.

## 🛠️ Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS (v4) + Framer Motion
- **Maps**: Leaflet.js + React-Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: Axios + React Hot Toast
- **Persistence**: LocalStorage with TTL caching

## 📦 Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_NEWS_API_KEY=your_news_api_key
   VITE_AI_TOKEN=your_huggingface_token
   ```
4. **Run development server**:
   ```bash
   npm run dev
   ```

## 🔑 API Keys

- **NewsAPI**: Get a free key at [gnews.io](https://gnews.io/).
- **Hugging Face**: Get an inference token at [huggingface.co](https://huggingface.co/settings/tokens).
- **ISS Data**: Provided by [Where The ISS At?](https://wheretheiss.at/w/developer) (No key required).
- **Geocoding**: Provided by [Nominatim (OpenStreetMap)](https://nominatim.org/) (No key required for small usage).

## 🌍 Deployment

Ready for one-click deployment on **Vercel** or **Netlify**. Ensure environment variables are configured in the provider's dashboard.

---
Built with ❤️ for Space Enthusiasts.
# endSemFoai
