import path from 'node:path'

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { Configuration, DefinePlugin, webpack, ProvidePlugin} from 'webpack'

enum Mode {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development'
}
const mode = process.env.NODE_ENV !== Mode.DEVELOPMENT
  ? Mode.PRODUCTION
  : Mode.DEVELOPMENT
const testToken = 'globalThis._RUNME_TEST_TOKEN'

const baseConfig: Partial<Configuration> = {
  mode,
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.join(__dirname, 'tsconfig.json'),
      }
    })
  ],
  infrastructureLogging: {
    level: 'log', // enables logging required for problem matchers
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }
    ],
  }
}

const rendererConfig: Configuration = {
  ...baseConfig,
  entry: path.resolve('src', 'client', 'index.ts'),
  experiments: { outputModule: true },
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'client.js',
    libraryTarget: 'module',
    chunkFormat: 'module'
  },
  target: 'web'
}

const extensionConfig: Configuration = {
  ...baseConfig,
  target: 'node',
  entry: {
    extension: path.resolve(__dirname, 'src', 'extension', 'index.ts'),
  },
  externals: ['vscode'],
  output: {
    path: path.resolve(__dirname, 'out'),
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  plugins: [
    new DefinePlugin({
      INSTRUMENTATION_KEY: JSON.stringify(process.env.INSTRUMENTATION_KEY || 'invalid'),
      [testToken]: mode === Mode.DEVELOPMENT
        ? testToken
        : 'false'
    })
  ]
}

// TODO(jeremy): This is an attempt to create a webpack configuration
// to compile RunMe to work in vscode for web.
// It is based on https://github.com/aeschli/vscode-css-formatter/blob/73cda04a9d9bfd2195d899d5e6d69484b4402345/webpack.config.js#L4
const webConfig: Configuration = {
  ...baseConfig,
  // Name for this configuration so we can invoke it with `webpack --config-name web`
  name : 'web',
  target: 'webworker', // web extensions run in a webworker context
  entry: {
    // TODO(jeremy): We're starting by trying to reuse the same main file as the node extension
    // We'll see if that works or we need to change things.
    'extension-web': path.resolve(__dirname, 'src', 'extension', 'index.ts'), // source of the web extension main file
    //'test/suite/index-web': './src/test/suite/index-web.ts', // source of the web extension test runner
  },
  // N.B. This resolve section was just copied from
  // https://github.com/aeschli/vscode-css-formatter/blob/73cda04a9d9bfd2195d899d5e6d69484b4402345/webpack.config.js#L4
  resolve: {
    mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
    extensions: ['.ts', '.js'], // support ts-files and js-files
    alias: {
      // provides alternate implementation for node module and source files
    },
    fallback: {
      // Webpack 5 no longer polyfills Node.js core modules automatically.
      // see https://webpack.js.org/configuration/resolve/#resolvefallback
      // for the list of Node.js core module polyfills.
      assert: require.resolve('assert'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new ProvidePlugin({
      process: 'process/browser', // provide a shim for the global `process` variable
    }),
  ],
  externals: {
    vscode: 'commonjs vscode', // ignored because it doesn't exist
  },
  performance: {
    hints: false,
  },
  devtool: 'nosources-source-map', // create a source map that points to the original source file
}
export default [extensionConfig, rendererConfig, webConfig]
