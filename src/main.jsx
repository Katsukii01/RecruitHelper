import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AuthProvider from './store/AuthContext';

import './index.css';
import App from './App.jsx';

import * as Sentry from '@sentry/react';
import './i18n'; 

Sentry.init({
  dsn: 'https://36fe5b7cac04aaa988c3975d118a23bc@o4508839674707969.ingest.de.sentry.io/4508839675101264',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Opakowanie App w Sentry.withProfiler dla śledzenia wydajności
const SentryApp = Sentry.withProfiler(App);

const root = createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <StrictMode>
      <SentryApp />
    </StrictMode>
  </AuthProvider>
);
