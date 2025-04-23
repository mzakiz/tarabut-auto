
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
  const enContent = fs.readFileSync('./src/locales/en.json', 'utf8');
  const arContent = fs.readFileSync('./src/locales/ar.json', 'utf8');

  const formData = new FormData();
  formData.append('secret', LOKALISE_SECRET);
  formData.append('en', new Blob([enContent], { type: 'application/json' }));
  formData.append('ar', new Blob([arContent], { type: 'application/json' }));

  const request = https.request(LOKALISE_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });

  request.on('error', (error) => {
    console.error('Error sending translations to Lokalise:', error);
  });

  request.end();
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
