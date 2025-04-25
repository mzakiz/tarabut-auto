
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced redirect handling from 404.html
const redirectPath = sessionStorage.getItem('redirectPath');
const redirectTimestamp = sessionStorage.getItem('redirectTimestamp');

// Only process redirects that are recent (less than 10 seconds old)
const isRecentRedirect = redirectTimestamp && 
  (Date.now() - parseInt(redirectTimestamp, 10)) < 10000;

if (redirectPath && isRecentRedirect) {
  console.log(`Handling redirect to: ${redirectPath}`);
  sessionStorage.removeItem('redirectPath');
  sessionStorage.removeItem('redirectTimestamp');
  
  // Use history API to avoid full page reload
  setTimeout(() => {
    // Check if path is valid before redirecting
    if (redirectPath.match(/^\/(ar|en)\/(speed|offer|budget)/)) {
      console.log(`Valid route detected: ${redirectPath}, applying redirect`);
      window.history.replaceState(null, '', redirectPath);
    } else {
      console.log(`Invalid route format: ${redirectPath}, redirecting to default`);
      window.history.replaceState(null, '', '/en/speed');
    }
  }, 100);
}

// Custom debugging for route issues
if (window.location.pathname.includes('/ar/')) {
  console.log(`Arabic route detected in main.tsx: ${window.location.pathname}`);
}

createRoot(document.getElementById("root")!).render(<App />);
