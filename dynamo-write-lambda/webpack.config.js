module.exports = {
  entry: [
    'babel-polyfill',
    './dynamo-write-lambda/index.js',
  ],
  target: 'node',
  externals: {
    'aws-sdk': 'aws-sdk',
  },
  output: {
    libraryTarget: 'commonjs2',
    path: `${__dirname}/../out`,
    filename: 'dynamo-write-lambda.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },
};
