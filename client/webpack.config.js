const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

console.log({
  NODE_ENV: process.env.NODE_ENV,
  INTERNAL_BACKEND_WS_PORT: process.env.INTERNAL_BACKEND_WS_PORT,
  WEBPACK_DEV_SERVER_HOST: process.env.WEBPACK_DEV_SERVER_HOST,
  WEBPACK_DEV_SERVER_PORT: process.env.WEBPACK_DEV_SERVER_PORT,
})

module.exports = env => {
  return ({
    mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
    entry: './src/index.ts',
    devServer: {
      host: '0.0.0.0',
      port: process.env.WEBPACK_DEV_SERVER_PORT,
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
            'style-loader',
            'css-loader',
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
      new webpack.EnvironmentPlugin(['INTERNAL_BACKEND_WS_PORT', 'WEBPACK_DEV_SERVER_HOST']),
    ],
  })
}