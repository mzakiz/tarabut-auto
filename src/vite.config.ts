
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import https from 'https';

// Lokalise webhook configuration
const LOKALISE_WEBHOOK_URL = 'https://api.lokalise.com/upload/github/107536486808e5f83bde70.86171737/633240_1745424990217';
const LOKALISE_SECRET = '9e3252e351d40c28a5be6ed3ae7cb874';

// Function to send translations to Lokalise
const sendToLokalise = async () => {
  try {
    // Read translation files
    const enContent = fs.readFileSync('./src/locales/en.json', 'utf8');
    const arContent = fs.readFileSync('./src/locales/ar.json', 'utf8');
    
    // Create form data
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substring(2);
    
    // Build the multipart/form-data body
    let body = '';
    
    // Add secret
    body += `--${boundary}\r\n`;
    body += 'Content-Disposition: form-data; name="secret"\r\n\r\n';
    body += `${LOKALISE_SECRET}\r\n`;
    
    // Add English file
    body += `--${boundary}\r\n`;
    body += 'Content-Disposition: form-data; name="en"; filename="en.json"\r\n';
    body += 'Content-Type: application/json\r\n\r\n';
    body += `${enContent}\r\n`;
    
    // Add Arabic file
    body += `--${boundary}\r\n`;
    body += 'Content-Disposition: form-data; name="ar"; filename="ar.json"\r\n';
    body += 'Content-Type: application/json\r\n\r\n';
    body += `${arContent}\r\n`;
    
    // Close the form data
    body += `--${boundary}--\r\n`;
    
    // Parse the URL to get hostname and path
    const url = new URL(LOKALISE_WEBHOOK_URL);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    
    const req = https.request(options, (res) => {
      console.log(`Lokalise upload status code: ${res.statusCode}`);
      
      res.on('data', (chunk) => {
        console.log(`Lokalise response: ${chunk}`);
      });
    });
    
    req.on('error', (error) => {
      console.error('Error sending translations to Lokalise:', error);
    });
    
    // Send the request
    req.write(body);
    req.end();
    
    console.log('Translations sent to Lokalise');
  } catch (error) {
    console.error('Error in sendToLokalise function:', error);
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  plugins: [
    react(),
    // Only use componentTagger in development
    mode === 'development' && componentTagger(),
    {
      name: 'watch-translations',
      configureServer(server) {
        // Watch for changes in translation files
        server.watcher.add('./src/locales/**/*.json');
        server.watcher.on('change', (path) => {
          if (path.includes('/locales/') && path.endsWith('.json')) {
            console.log('Translation file changed, sending to Lokalise...');
            sendToLokalise();
          }
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
