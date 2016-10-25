import path from 'path';

const config = {
  entry: path.join(__dirname, 'src', 'entry.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;