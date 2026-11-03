/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output is for the Docker image; Vercel builds its own bundle.
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
