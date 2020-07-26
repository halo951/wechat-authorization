module.exports = {
  presets: [
    [
      "@babel/preset-env", // 浏览器环境适配
      {
        targets: {
          node: "current",
          // The % refers to the global coverage of users from browserslist
          browsers: [">0.25%"]
        }
      }
    ]
  ],
  plugins: []
};
