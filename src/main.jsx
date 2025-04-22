import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AuthProvider from './store/AuthContext';

import './index.css';
import App from './App.jsx';

import './i18n'; 
import { AccessibilityProvider } from './store/AccessibilityContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <AccessibilityProvider>
    <AuthProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AuthProvider>
  </AccessibilityProvider>
);
