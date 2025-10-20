import path from 'path';
import { fileURLToPath } from 'url';

// Simular __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(
  "🔑 Clerk key length:",
  process.env.CLERK_SECRET_KEY ? process.env.CLERK_SECRET_KEY.length : "MISSING"
);



/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 ignora ESLint en build
  },
  webpack: (config) => {
    // Alias @ -> src
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/default",
        permanent: false,
      },
    ];
  },
}

export default nextConfig
