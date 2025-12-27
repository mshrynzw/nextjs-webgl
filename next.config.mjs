/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack設定を追加
  turbopack: {
    rules: {
      "*.glsl": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  // 後方互換性のため、webpack設定も残す（--webpackフラグ使用時用）
  webpack: (config) => {
    config.module.rules.push({
      test: /\.glsl$/,
      use: "raw-loader",
    })
    return config
  },
}

export default nextConfig