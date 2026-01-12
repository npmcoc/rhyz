/** Next.js configuration for server-side rendering and environment handling */
module.exports = {
  reactStrictMode: true,
  env: {
    // Keep token usage on server only; do NOT expose token to client.
    // Set COC_TOKEN in your deployment or local .env.local file.
  }
};
