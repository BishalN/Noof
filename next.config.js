const withPWA = require("@imbios/next-pwa")({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA(nextConfig);
