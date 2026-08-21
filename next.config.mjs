/** @type {import('next').NextConfig} */
const apiUrl = process.env.ECOMMERCE_API_URL || "http://localhost:3100/api";
const backendOrigin = apiUrl.replace(/\/?api\/?$/, "");

const nextConfig = {
  async rewrites() {
    return [{ source: "/uploads/:path*", destination: `${backendOrigin}/uploads/:path*` }];
  },
};

export default nextConfig;
