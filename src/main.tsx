
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced redirect handling from 404.html with detailed logging
const logPrefix = "[Main]";
console.log(`${logPrefix} Application starting...`);
console.log(`${logPrefix} Current URL path: ${window.location.pathname}`);
console.log(`${logPrefix} Current URL search: ${window.location.search}`);
console.log(`${logPrefix} Full URL: ${window.location.href}`);

// Check for redirect information
const redirectPath = sessionStorage.getItem('redirectPath');
const redirectTimestamp = sessionStorage.getItem('redirectTimestamp');
const redirectId = sessionStorage.getItem('redirectId');
const redirectLanguage = sessionStorage.getItem('redirectLanguage');

if (redirectPath) {
  console.log(`${logPrefix} Found redirectPath in sessionStorage: ${redirectPath}`);
  console.log(`${logPrefix} Redirect timestamp: ${redirectTimestamp}`);
  console.log(`${logPrefix} Redirect ID: ${redirectId}`);
  console.log(`${logPrefix} Redirect language: ${redirectLanguage}`);
} else {
  console.log(`${logPrefix} No redirect path found in sessionStorage`);
}

// Always check for Arabic routes, regardless of redirects
const currentPath = window.location.pathname;
const isArabicRoute = currentPath.indexOf('/ar/') === 0 || currentPath === '/ar';

// Log language detection
console.log(`${logPrefix} Current path: ${currentPath}`);
console.log(`${logPrefix} Is Arabic route: ${isArabicRoute}`);
console.log(`${logPrefix} Current document direction: ${document.documentElement.dir}`);
console.log(`${logPrefix} Current document language: ${document.documentElement.lang}`);

// Set language direction directly based on current path (this ensures it's set even if the early detection script didn't run)
if (isArabicRoute) {
  document.documentElement.dir = 'rtl';
  document.documentElement.lang = 'ar';
  console.log(`${logPrefix} Set document direction to RTL for Arabic route`);
} else {
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = 'en';
  console.log(`${logPrefix} Set document direction to LTR for non-Arabic route`);
}

// Only process redirects that are recent (less than 10 seconds old)
const isRecentRedirect = redirectTimestamp && 
  (Date.now() - parseInt(redirectTimestamp, 10)) < 10000;

if (redirectPath && isRecentRedirect) {
  console.log(`${logPrefix} Processing recent redirect to: ${redirectPath}`);
  
  // Set language direction based on redirect language
  if (redirectLanguage === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    console.log(`${logPrefix} Set document direction to RTL for Arabic`);
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    console.log(`${logPrefix} Set document direction to LTR for English`);
  }
  
  // Clean up storage
  sessionStorage.removeItem('redirectPath');
  sessionStorage.removeItem('redirectTimestamp');
  sessionStorage.removeItem('redirectId');
  sessionStorage.removeItem('redirectLanguage');
  
  // Use history API to avoid full page reload
  setTimeout(() => {
    // Extra validation for Arabic routes
    if (redirectPath.startsWith('/ar/')) {
      console.log(`${logPrefix} Confirmed Arabic route: ${redirectPath}`);
    }
    
    // Check if path is valid before redirecting
    if (redirectPath.match(/^\/(ar|en)\/(speed|offer|budget)/)) {
      console.log(`${logPrefix} Valid route detected: ${redirectPath}, applying redirect`);
      window.history.replaceState(null, '', redirectPath);
      console.log(`${logPrefix} Redirect completed. New path: ${window.location.pathname}`);
    } else {
      console.log(`${logPrefix} Invalid route format: ${redirectPath}, redirecting to default`);
      // Use the language from the redirect if available
      const defaultPath = redirectLanguage === 'ar' ? '/ar/speed' : '/en/speed';
      window.history.replaceState(null, '', defaultPath);
      console.log(`${logPrefix} Redirected to default. New path: ${window.location.pathname}`);
    }
    
    // Force a re-render by triggering a small state change event
    window.dispatchEvent(new Event('popstate'));
    console.log(`${logPrefix} Dispatched popstate event to trigger re-render`);
  }, 100);
}

// Initialize React application
console.log(`${logPrefix} Rendering React application...`);
createRoot(document.getElementById("root")!).render(<App />);
console.log(`${logPrefix} React application rendered`);
