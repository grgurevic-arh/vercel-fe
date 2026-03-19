import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const defaultStrapiBaseUrl = "http://localhost:1337/api";
const strapiBaseUrl = process.env.STRAPI_BASE_URL ?? defaultStrapiBaseUrl;

let remotePatterns: RemotePattern[] = [];
let disableImageOptimization = false;

try {
  const strapiUrl = new URL(strapiBaseUrl);
  const hostname = strapiUrl.hostname;
  const normalizedHostname = hostname.toLowerCase();
  const isLocalHost =
    normalizedHostname === "localhost" ||
    normalizedHostname === "::1" ||
    normalizedHostname === "0.0.0.0" ||
    normalizedHostname.startsWith("127.");

  const normalizedProtocol = strapiUrl.protocol.replace(":", "");
  const protocol =
    normalizedProtocol === "http" || normalizedProtocol === "https"
      ? normalizedProtocol
      : undefined;

  remotePatterns = [
    {
      protocol,
      hostname,
      port: strapiUrl.port || undefined,
      pathname: "/uploads/**",
    },
    {
      protocol: "https",
      hostname: "*.media.strapiapp.com",
    },
  ];

  disableImageOptimization = isLocalHost;
} catch {
  // Ignore invalid URLs and fall back to Next.js defaults.
}

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    unoptimized: disableImageOptimization,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
