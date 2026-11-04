/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/images/cloudflare-loader.ts",
    unoptimized: !process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_ORIGIN,
    // All display images share one cached Cloudflare transformation.
    deviceSizes: [960],
    imageSizes: [],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.spotdiffs.com",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
