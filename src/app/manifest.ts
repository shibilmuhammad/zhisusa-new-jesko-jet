import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zhisusa',
    short_name: 'Zhisusa',
    description: 'Premium Nature Retreats & Immersive Workations',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F4EE',
    theme_color: '#F7F4EE',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
