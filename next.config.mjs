/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'utfs.io',
            port: '',
            pathname: '/**',
          },
          {
            protocol:'https',
            hostname:'images.unsplash.com',
            port:'',
            pathname:'/**'
          },
          {
            protocol:'https',
            hostname:'assets.aceternity.com',
            port:'',
            pathname:'/**'
          }
        ],
      },
      //  webpack: (config) => {
      //      config.resolve.alias.canvas = false;
        
      //      return config;
      //    },
};

export default nextConfig;
