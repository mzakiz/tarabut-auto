
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced redirect handling from 404.html
const redirectPath = sessionStorage.getItem('redirectPath');
if (redirectPath) {
  console.log(`Handling redirect to: ${redirectPath}`);
  sessionStorage.removeItem('redirectPath');
  
  // Wait for the router to initialize before redirecting
  setTimeout(() => {
    // Use history API to avoid full page reload
    window.history.replaceState(null, '', redirectPath);
  }, 200);
}

createRoot(document.getElementById("root")!).render(<App />);
