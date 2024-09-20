/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  //   distDir: "build",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ignore the backend folder and Python files
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    config.externals.push({
      backend: "commonjs backend",
    });

    // Add rule to ignore .py files
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    config.module.rules.push({
      test: /\.py$/,
      use: "ignore-loader",
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    config.module.rules.push({
      test: /\.js$/,
      include: path.resolve(__dirname, "backend"),
      use: "ignore-loader",
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
  // Explicitly tell Next.js which directories to ignore
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default config;
