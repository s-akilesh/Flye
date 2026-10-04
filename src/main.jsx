import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './shared/styles/globals.css';

const container = document.getElementById('root');

if (container.hasChildNodes()) {
  try {
    ReactDOM.hydrateRoot(
      container,
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.warn('[Hydration Warning] Falling back to standard client render:', err);
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
} else {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
