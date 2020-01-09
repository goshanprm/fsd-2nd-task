import { join } from 'path';
import { readdirSync } from 'fs';
import merge from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import pug from './webpack/pug';
import lintJS from './webpack/js.lint';
import babel from './webpack/babel';
import fonts from './webpack/fonts';
import images from './webpack/images';
import sass from './webpack/sass';
import css from './webpack/css';
import devconfig from './webpack/dev.config';

const PATHS = {
  src: join(__dirname, './src'),
  dist: join(__dirname, './docs'),
  img: join(__dirname, './src/pug/includes/*'),
  assets: 'assets/',
};

const PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PAGES = readdirSync(PAGES_DIR).filter((fileName) => fileName.endsWith('.pug'));

const common = merge([
  {
    externals: {
      paths: PATHS,
    },
    entry: {
      app: PATHS.src,
    },
    output: {
      filename: `${PATHS.assets}js/[name].[hash].js`,
      path: PATHS.dist,
      publicPath: '/',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendors',
            test: /node_modules/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    resolve: {
      alias: {
        '~': PATHS.src,
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: `${PATHS.assets}css/[name].[hash].css`,
      }),
      new CopyWebpackPlugin([
        { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
        { from: `${PATHS.img}/*.{svg|jpg|png|gif}`, to: `${PATHS.assets}img/[name].[ext]` },
        { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
        { from: `${PATHS.src}/static`, to: '' },
      ]),
      ...PAGES.map((page) => new HtmlWebpackPlugin({
        template: `${PAGES_DIR}/${page}`,
        filename: `./${page.replace(/\.pug/, '.html')}`,
      })),
      new HtmlWebpackPlugin({
        template: `${PAGES_DIR}/page-template/page-template.pug`,
        filename: './page-template.html',
        inject: true,
      }),
    ],
  },
  pug(),
  lintJS({ paths: PATHS.src }),
  babel(),
  fonts(),
  images(),
  sass(),
  css(),
]);

export default (env) => {
  if (env === 'development') {
    return merge([
      common,
      devconfig(),
    ]);
  }
  return common;
};
