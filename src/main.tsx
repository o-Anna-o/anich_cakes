import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/variables.css';
import './styles/style.css';
import './styles/detail.css';
import './styles/typography.css';
import './styles/thematical.css';
import './styles/vegan.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
