import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import type { Configuration as WebpackConfiguration } from "webpack";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import CopyWebpackPlugin from "copy-webpack-plugin";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  entry: "./src/ts/main.ts", // entry point
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // enables importing CSS
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "img/[name][ext]",
        },
      },
      {
        test: /\.json$/,
        type: "json",
      },
    ],
  },
  plugins: [
    // Main index page
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    // Menu page
    new HtmlWebpackPlugin({
      template: "./src/menu.html",
      filename: "menu.html",
    }),
    // Cart Page
    new HtmlWebpackPlugin({
      template: "./src/cart.html",
      filename: "cart.html",
    }),
    // login page
    new HtmlWebpackPlugin({
      template: "./src/signin.html",
      filename: "signin.html",
    }),
    // Registration Page
    new HtmlWebpackPlugin({
      template: "./src/register.html",
      filename: "register.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/img", to: "img" },
        { from: "src/components", to: "components" },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    open: true,
    port: 3000,
  },
  mode: "development",
};

export default config;
