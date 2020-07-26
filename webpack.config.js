const HtmlWebpackPlugin = require("html-webpack-plugin"); // html 打包
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // 压缩
const WebpackCopyPlugin = require("webpack-copy-plugin"); // 复制
const path = require("path");
/**
 * webpack 打包配置
 */
module.exports = {
  stats: "errors-only", // 统计信息  "errors-only" 只在发生错误时输出 "normal" 标准输出 "verbose" 全部输出
  devServer: {
    // webpack 调试服务器
    contentBase: path.join(__dirname, "dist"),
    compress: false,
    host: "littleprince.authorization.mqsocial.com",
    port: 80,
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: "/index.html" }, { stats: 404, to: "/index.html" }]
    }
  },
  entry: {
    main: "./src/main.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "assets/[name].[contenthash:5].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], //这里配置了babel就不需要。babelrc文件配置了
            exclude: /node_modules/
          }
        }
      }
    ] // babel
  },
  performance: {
    hints: "warning", // 性能检查
    maxEntrypointSize: 512 * 1024 // 阈值: 512 kb
  },
  plugins: [
    new UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./templates/template.html",
      minify: true,
      hash: true,
      chunks: ["main"], // 脚本入口文件
      templateParameters: {
        // 模板参数
        title: "获取微信授权",
        version: "1.0.1"
      }
    }),
    new WebpackCopyPlugin({
      dirs: [{ from: "public", to: "dist" }],
      options: {}
    })
  ]
};
