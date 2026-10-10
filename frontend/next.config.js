/** @type {import('next').NextConfig} */

// Configuration pour l'analyse des bundles
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@fortawesome/free-solid-svg-icons', 
      '@fortawesome/free-brands-svg-icons',
      'framer-motion', 
      'aos'
    ],
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    // Optimisation pour le bfcache
    appDocumentPreloading: true,
    // Optimisation CSS (désactivée pour éviter l'erreur critters)
    // optimizeCss: true,
  },
  // Configuration Turbopack (stable)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimisations SWC (déplacées hors experimental)
  // swcMinify: true, // Activé par défaut dans Next.js 15
  serverExternalPackages: [],
  modularizeImports: {
    '@fortawesome/free-solid-svg-icons': {
      transform: '@fortawesome/free-solid-svg-icons/{{member}}',
    },
    '@fortawesome/free-brands-svg-icons': {
      transform: '@fortawesome/free-brands-svg-icons/{{member}}',
    },
    // 'framer-motion': {
    //   transform: 'framer-motion/dist/es/{{member}}',
    // }, // Désactivé car cause des erreurs de résolution
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'managetransport.fr',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // Optimisations SWC (plus rapide que Babel)
    styledComponents: false,
    // emotion: false, // Commenté pour éviter les conflits
  },
  async rewrites() {
    const apiOrigin = process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/api/:path*`,
      },
      {
        source: '/',
        destination: '/fr',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Optimisation pour le bfcache
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Pages statiques optimisées pour le bfcache
      {
        source: '/fr',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/en',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  // Configuration Webpack supprimée car Turbopack gère l'optimisation automatiquement
  // Turbopack offre de meilleures performances sans configuration manuelle
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Optimisation drastique des chunks
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
                                  minSize: 20000,
            maxSize: 50000,
            cacheGroups: {
              // React + React-DOM ensemble (critique)
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react',
                chunks: 'all',
                priority: 20,
                enforce: true,
              },
              // Next.js framework
              next: {
                test: /[\\/]node_modules[\\/]next[\\/]/,
                name: 'next',
                chunks: 'all',
                priority: 15,
                enforce: true,
              },
              // Animations (AOS + Framer Motion) - lazy
              animations: {
                test: /[\\/]node_modules[\\/](aos|framer-motion)[\\/]/,
                name: 'animations',
                chunks: 'async',
                priority: 10,
                enforce: true,
              },
              // FontAwesome - lazy
              fontawesome: {
                test: /[\\/]node_modules[\\/]@fortawesome[\\/]/,
                name: 'fontawesome',
                chunks: 'async',
                priority: 10,
                enforce: true,
              },
              // Vendor restant (optimisé)
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 5,
                enforce: true,
              },
            },
        },
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig); 