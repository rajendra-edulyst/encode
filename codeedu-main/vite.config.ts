import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dynamicImport(),
    {
      name: 'payu-callback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST' && req.url?.startsWith('/payu-callback')) {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                // Convert form-urlencoded POST body from PayU to query string
                const params = new URLSearchParams(body);
                const queryString = params.toString();
                const redirectPath = req.url!.split('?')[0] + (queryString ? `?${queryString}&payment=success` : '?payment=success');

                console.log('Intercepted PayU POST, redirecting to GET:', redirectPath);

                res.statusCode = 303;
                res.setHeader('Location', redirectPath);
                res.end();
              } catch {
                next();
              }
            });
            return;
          }
          next();
        });
      }
    }
  ],
  assetsInclude: ['**/*.md'],
  resolve: {
    // Prevent multiple React instances (fixes "Cannot read properties of undefined (reading 'createContext')")
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.join(__dirname, 'src'),
      '@calendar': path.join(__dirname, './src/views/app/learner/features/calendar'),
      '@components': path.join(__dirname, './src/components'),
      '@constants': path.join(__dirname, './src/constants'),
      '@configs': path.join(__dirname, './src/configs'),
      '@hooks': path.join(__dirname, './src/hooks'),
      '@store': path.join(__dirname, './src/store'),
      '@services': path.join(__dirname, './src/services'),
      '@utils': path.join(__dirname, './src/utils'),
      '@views': path.join(__dirname, './src/views'),
      '@assets': path.join(__dirname, './src/assets'),
      '@faculty': path.join(__dirname, './src/views/faculty'),
      '@learner': path.join(__dirname, './src/views/learner'),
      '@types': path.join(__dirname, './src/@types'),
      '@community': path.join(__dirname, './src/views/common/community'),
      '@industry': path.join(__dirname, './src/views/industry'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://encodeapi.codeedu.co',
        changeOrigin: true,
        secure: true
      },
      '/persona-api': {
        target: 'https://personaapi.edulystventures.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/persona-api/, '')
      }
    }
  },
  build: {
    outDir: 'build',
    // Avoid custom manualChunks: it can create circular chunk dependencies
    // (e.g. react-vendor importing charts) that crash in production/preview.
  },
})



// server: {
//   allowedHosts: true
// }
