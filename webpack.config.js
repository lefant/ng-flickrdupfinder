const path = require('path')
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  node: {
    // fs: false,
  },
  devServer: {
    inline: false,
    contentBase: './dist',
  },
  resolve: {
    fallback: {
      http: require.resolve('stream-http'),
      // fs: false,
      // util: require.resolve("util/"),
      // path: require.resolve("path-browserify"),
      crypto: require.resolve('crypto-browserify'),
      // buffer: require.resolve("buffer/"),
      https: require.resolve('https-browserify'),
      stream: require.resolve('stream-browserify'),
      // os: require.resolve("os-browserify/browser"),
      // vm: require.resolve("vm-browserify"),
      // stream: require.resolve("stream-browserify"),
      // constants: require.resolve("constants-browserify"),
      // assert: require.resolve("assert/"),
    },
  },
}
