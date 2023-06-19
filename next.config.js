const production = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: production ? "/todo" : "",
};

module.exports = nextConfig;
