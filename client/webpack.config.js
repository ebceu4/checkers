const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const dotenv = () => require('dotenv').config({ path: path.join(__dirname, '../.env') })

module.exports = env => {
  return ({
    entry: './src/index.ts',
    devServer: {
      host: process.env.FRONTEND_HOST, // process.env.IS_DOCKER ? '0.0.0.0' : process.env.FRONTEND_HOST || dotenv().parsed.FRONTEND_HOST,
      port: process.env.FRONTEND_PORT, // || dotenv().parsed.FRONTEND_PORT,
      disableHostCheck: true,
    },
    stats: 'errors-only',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: { allowTsInNodeModules: true },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new webpack.EnvironmentPlugin(['SERVER_URL']),
    ],
  })
}