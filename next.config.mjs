/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'renderings.evecp.bmw.cloud',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'www.bmw-m.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
