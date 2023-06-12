const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  mode: 'development', entry: path.join(__dirname, "src", "index.js"), output: {
    path: path.resolve(__dirname, "dist"), filename: 'bundle.js', publicPath: '/'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'], alias: {
      react: path.resolve('./node_modules/react'),
    }
  }, devServer: {

    open: true, historyApiFallback: true, port: 3000,

  }, module: {
    rules: [{
      test: /\.jsx?$/, exclude: /node_modules/, use: {
        loader: "babel-loader", options: {

          presets: ['@babel/preset-env', ['@babel/preset-react', {runtime: "automatic"}]]
        },

      }
    },

      {test: /\.jsx$/, loader: 'jsx-loader'}, {test: /\.css$/, use: ['style-loader', 'css-loader']},]
  }, plugins: [new HtmlWebpackPlugin({
    template: path.join(__dirname, "src", "index.html"),
  }),]
}
