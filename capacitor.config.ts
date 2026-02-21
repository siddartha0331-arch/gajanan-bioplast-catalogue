import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gajananbioplast.app',
  appName: 'Gajanan Bioplast',
  webDir: 'dist',
  server: {
    url: 'https://gajananbags.netlify.app/', // Replace with your actual Netlify URL
    cleartext: true
  }
};

export default config;
