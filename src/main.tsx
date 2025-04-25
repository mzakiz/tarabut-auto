
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced redirect handling from 404.html with detailed logging
const logPrefix = "[Main]";
console.log(`${logPrefix} Application starting...`);
console.log(`${logPrefix} Current URL path: ${window.location.pathname}`);

const redirectPath = sessionStorage.getItem('redirectPath');
const redirectTimestamp = sessionStorage.getItem('redirectTimestamp');
const redirectId = sessionStorage.getItem('redirectId');

if (redirectPath) {
  console.log(`${logPrefix} Found redirectPath in sessionStorage: ${redirectPath}`);
  console.log(`${logPrefix} Redirect timestamp: ${redirectTimestamp}`);
  console.log(`${logPrefix} Redirect ID: ${redirectId}`);
} else {
  console.log(`${logPrefix} No redirect path found in sessionStorage`);
}

// Only process redirects that are recent (less than 10 seconds old)
const isRecentRedirect = redirectTimestamp && 
  (Date.now() - parseInt(redirectTimestamp, 10)) < 10000;

if (redirectPath && isRecentRedirect) {
  console.log(`${logPrefix} Processing recent redirect to: ${redirectPath}`);
  
  // Clean up storage
  sessionStorage.removeItem('redirectPath');
  sessionStorage.removeItem('redirectTimestamp');
  sessionStorage.removeItem('redirectId');
  
  // Use history API to avoid full page reload
  setTimeout(() => {
    // Check if path is valid before redirecting
    if (redirectPath.match(/^\/(ar|en)\/(speed|offer|budget)/)) {
      console.log(`${logPrefix} Valid route detected: ${redirectPath}, applying redirect`);
      window.history.replaceState(null, '', redirectPath);
      console.log(`${logPrefix} Redirect completed. New path: ${window.location.pathname}`);
    } else {
      console.log(`${logPrefix} Invalid route format: ${redirectPath}, redirecting to default`);
      window.history.replaceState(null, '', '/en/speed');
      console.log(`${logPrefix} Redirected to default. New path: ${window.location.pathname}`);
    }
    
    // Force a re-render by triggering a small state change event
    window.dispatchEvent(new Event('popstate'));
    console.log(`${logPrefix} Dispatched popstate event to trigger re-render`);
  }, 100);
}

// Additional logging for Arabic routes
if (window.location.pathname.includes('/ar/')) {
  console.log(`${logPrefix} Arabic route detected: ${window.location.pathname}`);
  console.log(`${logPrefix} Document direction: ${document.documentElement.dir}`);
  console.log(`${logPrefix} Document language: ${document.documentElement.lang}`);
}

// Initialize React application
console.log(`${logPrefix} Rendering React application...`);
createRoot(document.getElementById("root")!).render(<App />);
console.log(`${logPrefix} React application rendered`);
