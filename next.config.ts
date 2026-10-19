import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // This app does not use the generated agent-rules file.
  agentRules: false,
};

export default nextConfig;
