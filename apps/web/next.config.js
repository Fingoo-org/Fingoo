/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false, // This is to use react-finanical-chart
  experimental: {
    serverActions: {
      // https://github.com/vercel/next.js/issues/58295
      allowedOrigins: [
        'localhost:3000',
        'supreme-space-yodel-wgw5pxjj6j535vw5-3000.app.github.dev',
        'fingoo-web-beta.vercel.app',
        'redesigned-enigma-j97vjxgqv9fjg7r-3000.app.github.dev',
        'super-disco-ppxw49qqxvj25xx-3000.app.github.dev',
      ],
    },
  },
};

module.exports = nextConfig;
