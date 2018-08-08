let webpack = require("webpack");
let path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
let CleanWebpackPlugin = require("clean-webpack-plugin");
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const entry = {};

const devServer = {
    contentBase: './dist',
    historyApiFallback: {
        rewrites: []
    }
};

const
    plugins = [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks (module) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, './node_modules')
                    ) === 0
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),
        new CleanWebpackPlugin(["js", "css", "img","font"], {
            root: __dirname + "/dist/",
            verbose: true,
            dry: false
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("produce")
            }
        }),
        new ExtractTextPlugin({
            filename: (getPath) => {
                // return getPath('css/[name].min.css').replace('\\js', '').replace('\\', '');
                return getPath('css/[name].css').replace('\\js', '').replace('\\', '');
            },
            allChunks: true
        })
    ];

function getEntry(globPath, pathDir) {
    let files = glob.sync(globPath);
    let entries = {},
        entry, dirname, basename, pathname, extname;

    for (let i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.join(dirname, basename);
        pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir), '') : pathname;
        entries[pathname] = ['./' + entry];
    }
    return entries;
}

let pages = Object.keys(getEntry('./src/*/*.html', 'src'));

pages.forEach(function (pathname) {
    // MacOS系统下pathname.split('/')[1];
    const fileName = pathname.split('\\')[1];
    const conf = {
        filename: fileName + '.html',
        template: 'src' + pathname + '.html',
        inject: 'body',
        chunks: ['vendor', 'manifest', fileName]
    };
    plugins.push(new HtmlWebpackPlugin(conf));
    entry[fileName] = ['babel-polyfill',`./src/${pathname}.js`];
    devServer.historyApiFallback.rewrites.push(
        {from: `${fileName}`, to: `/dist/${fileName}.html`}
    )
});

let config = {
    target: "web",
    cache: true,
    entry: entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "js/[name].bundle.js",
        chunkFilename: "js/[name].chunk.js",
        publicPath: "/dist/"
    },
    module: {
        rules: [{
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: 'jQuery'
            },{
                loader: 'expose-loader',
                options: '$'
            }]
        }, {
            test: /(\.jsx|\.js)$/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: [
                        "env"
                    ],
                    plugins: ["transform-runtime", "syntax-dynamic-import"]
                }
            },
            exclude: /node_modules/
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        outputPath: "img/",
                    }
                }
            ]
        }, {
            test: /\.(svg|eot|ttf)$/,
            use:{
                loader: 'file-loader',
                options: {
                    outputPath: "font/",
                }
            },
            exclude: /node_modules/
        }, {
            test: /(\.css)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{ loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
            })
        }, {
            test: /(\.scss)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{ loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader','sass-loader'
                ]
            })
        }]
    },
    plugins: plugins,
    resolve: {
        enforceExtension: false,
        extensions: [
            ".js", ".json", ".jsx"
        ],
        modules: ["node_modules"]
    },
    devtool: 'inline-source-map',
    devServer: devServer
};

module.exports = config;