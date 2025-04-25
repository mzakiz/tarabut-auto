
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check for redirect from 404.html
const redirectPath = sessionStorage.getItem('redirectPath');
if (redirectPath) {
  sessionStorage.removeItem('redirectPath');
  // Wait a bit for the router to initialize before redirecting
  setTimeout(() => {
    window.history.replaceState(null, '', redirectPath);
  }, 100);
}

createRoot(document.getElementById("root")!).render(<App />);
