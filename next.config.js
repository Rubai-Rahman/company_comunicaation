/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    hasuraSecret: process.env.HASURA_ADMIN_SECRET,
    hasuraEndPoint: process.env.HASURA_PROJECT_ENDPOINT,
  },
};

module.exports = nextConfig;
