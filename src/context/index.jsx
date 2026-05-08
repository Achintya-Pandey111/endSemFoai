import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { ISSProvider } from './ISSContext';
import { NewsProvider } from './NewsContext';
import { ChatProvider } from './ChatContext';

export const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <ISSProvider>
        <NewsProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </NewsProvider>
      </ISSProvider>
    </ThemeProvider>
  );
};
