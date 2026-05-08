import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchChatResponse } from '../services/api';
import { storage } from '../utils/storage';
import { useISS } from './ISSContext';
import { useNews } from './NewsContext';
import toast from 'react-hot-toast';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => storage.get('chat_history') || []);
  const [loading, setLoading] = useState(false);
  
  const { location, speed, address, people } = useISS();
  const { articles } = useNews();

  const aiToken = import.meta.env.VITE_AI_TOKEN;

  useEffect(() => {
    storage.set('chat_history', messages.slice(-30));
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build context from dashboard data
      const issLat = location?.lat?.toFixed(2) || 'Unknown';
      const issLng = location?.lng?.toFixed(2) || 'Unknown';
      const issSpeed = typeof speed === 'number' ? speed.toFixed(2) : '0';
      const issAddr = address || 'Over Ocean';
      const crewCount = people?.length || 0;
      const crewNames = people?.length > 0 ? people.map(p => p.name).join(', ') : 'None';
      
      const newsCount = articles?.length || 0;
      const newsHeadlines = articles?.length > 0 
        ? articles.slice(0, 10).map(a => a.title).join(' | ') 
        : 'No news available';

      const issData = `ISS Position: Lat ${issLat}, Lng ${issLng}. Speed: ${issSpeed} km/h. Location: ${issAddr}. Crew: ${crewCount} astronauts (${crewNames}).`;
      const newsData = `News Status: ${newsCount} articles found. Headlines: ${newsHeadlines}.`;

      const systemPrompt = `You are OrbitScope AI, a professional dashboard assistant.
      
RULES:
1. ONLY use the provided Dashboard Data to answer.
2. If the info is NOT in the data, politely say you don't have that information.
3. Keep responses short (max 2 sentences).
4. Do not guess or use external knowledge.

DASHBOARD DATA:
${issData}
${newsData}`;

      const fullPrompt = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ];

      if (!aiToken) {
        // Mock response for testing if token is missing
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockText = `[DEMO MODE: Add VITE_AI_TOKEN to .env for real AI] Current dashboard status: ISS is at ${issLat}, ${issLng} moving at ${issSpeed} km/h. There are ${crewCount} astronauts in space.`;
        const aiMsg = { 
          id: Date.now() + 1, 
          role: 'assistant', 
          text: mockText, 
          timestamp: new Date().toISOString() 
        };
        setMessages(prev => [...prev, aiMsg]);
        setLoading(false);
        return;
      }

      const aiText = await fetchChatResponse(fullPrompt, aiToken);
      
      const aiMsg = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        text: aiText || "I couldn't process that. Please try again.", 
        timestamp: new Date().toISOString() 
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('AI assistant is offline');
      const errorMsg = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        text: "Sorry, I'm having trouble connecting to my brain. Please check the API token.", 
        timestamp: new Date().toISOString() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [location, speed, address, people, articles, aiToken]);

  const clearChat = () => setMessages([]);

  return (
    <ChatContext.Provider value={{ messages, loading, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
