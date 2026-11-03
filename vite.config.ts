import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Identificador único de cada build/publicação. Usado para detectar versões novas online.
const APP_VERSION = String(Date.now());

// Gera /version.json no build, para o app comparar a versão aberta com a publicada.
const versionFilePlugin = (): Plugin => ({
  name: 'modbox-version-file',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'version.json',
      source: JSON.stringify({ version: APP_VERSION })
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), versionFilePlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION)
  },
  server: {
    port: 3000,
    open: false
  }
});
