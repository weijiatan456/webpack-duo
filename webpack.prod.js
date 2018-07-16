const webpack = require("webpack");
// 打包后详细分布查看
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;  
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const entry = {};

const plugins = [
    new webpack
        .optimize
        .CommonsChunkPlugin({
            name: 'vendors',
            filename: "js/[name]-[chunkhash].js"
        }),
    new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
        minChunks: Infinity
    }),
    new webpack.ProvidePlugin({
        Promise: "exports-loader?global.Promise!es6-promise",
        fetch: "exports-loader?self.fetch!whatwg-fetch"
    }),
    new CleanWebpackPlugin(["js", "css", "img"], {
        root: __dirname + "/dist/",
        verbose: true,
        dry: false
    }),
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }),
    new ExtractTextPlugin({
        filename: (getPath) => {
            // return getPath('css/[name].min.css').replace('\\js', '').replace('\\', '');
            return getPath('css/[name].[contenthash].css').replace('\\js', '').replace('\\', '');
        },
        allChunks: true
    }),
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }),
    new UglifyJSPlugin({
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false,
        compress: {
            // 在UglifyJs删除没有用到的代码时不输出警告
            warnings: false,
            // 删除所有的 `console` 语句 还可以兼容ie浏览器
            drop_console: false,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true
        }
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCssAssetsPlugin({
        // cssProcessor: require('cssnano'),
        cssProcessorOptions: {
            discardComments: { removeAll: true },
            safe: true,
            //所以这里选择关闭，使用postcss的autoprefixer功能，否则压缩前缀会被去除
            autoprefixer: false
        },
        canPrint: true
    }),
    new webpack.BannerPlugin('©')
    // new BundleAnalyzerPlugin({
    //     analyzerMode: 'static'
    // })
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
        chunks: ['vendors', 'manifest', fileName]
    };
    plugins.push(new HtmlWebpackPlugin(conf));
    entry[fileName] = `./src/${pathname}.js`;
});

let config = {
    target: "web",
    cache: true,
    entry: entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "js/[name]-[chunkhash].bundle.js",  //注意hash和chunkhash的区别
        chunkFilename: "js/[name]-[chunkhash].chunk.js",
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
            test: /(\.js)$/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: [
                        "env"
                    ],
                    plugins: ["transform-runtime", "syntax-dynamic-import"]
                }
            },
            // exclude: /node_modules/
            // 只编译src目录下的文件
            include:path.resolve(__dirname, 'src')
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        outputPath: "img/",
                    }
                }
            ]
        }, {
            test: /(\.css)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{ loader: 'css-loader', options: { importLoaders: 1 } },  // importLoaders：通过import引入的css文件也自动添加前缀
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
            ".js", ".json"
        ],
        modules: ["node_modules"]
    },
    devtool: "null"
};

module.exports = config;