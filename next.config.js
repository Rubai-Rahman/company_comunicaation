/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    hasuraSecret: process.env.HASURA_ADMIN_SECRET,
    hasuraEndPoint: process.env.HASURA_PROJECT_ENDPOINT,
    nextauthUrl: process.env.NEXT_AUTH_URL,
    nextauthSecret:process.env.NEXT_AUTH_SECRET
  },
};

module.exports = nextConfig;
