import path from "path";

/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    connect-src 'self' https://*.google-analytics.com;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    quietDeps: true,
    silenceDeprecations: ["legacy-js-api", "import"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      process.on("SIGTERM", () => {
        console.log("SIGTERM received, starting graceful shutdown");
        setTimeout(() => {
          console.log("Graceful shutdown complete");
          process.exit(0);
        }, 5000);
      });
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(process.cwd(), "./"),
    };

    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
