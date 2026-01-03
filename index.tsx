
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import { I18nProvider } from './contexts/I18nContext';
import { CommentProvider } from './contexts/CommentContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { ThemeProvider } from './contexts/ThemeContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <VideoProvider>
            <CommentProvider>
              <HistoryProvider>
                <App />
              </HistoryProvider>
            </CommentProvider>
          </VideoProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  </React.StrictMode>
);