/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 180,
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.aigeneratedit.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
