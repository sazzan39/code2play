import React from 'react';
import ReactDOM from 'react-dom/client'; // This is what your error was missing
import './index.css';
import App from './App.jsx'; // Make sure it points to the .jsx version

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

