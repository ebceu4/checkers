const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

console.log({
  NODE_ENV: process.env.NODE_ENV,
})

module.exports = () => {
  return ({
    mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
    entry: './src/index.ts',
    target: 'node',
    stats: 'errors-only',
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: { allowTsInNodeModules: true },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
    },
    externals: nodeExternals({ allowlist: ['@checkers/generic'] }),
  })
}