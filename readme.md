## 使用说明

这是一个使用`webpack`配置多页应用的简易`demo`。

多页面依据`/src`中的目录动态生成。

如本例中`/src`文件夹下有`/a`,`/b`,`/c`三个页面，打包后将自动生成`a.html`,`b.html`,`c.html`。三个文件都具有自己独立的依赖，都可独立使用。

`/factory`是UMD模式webpack的打包

`/layer`引入了jquery和layer的两个依赖的写法，此文件同时增加了jsonp和Promise的方法，再增加一个异步加载模块的功能，生成的规则是根据出口`chunkFilename`决定。

### 使用方法

1. 下载本目录；
2. 执行`npm i`,也可以使用`cnpm i`,`yarn add`安装依赖；
3. 执行`npm start`可打开本地服务器查看效果,默认为`localhost:8080`;
4. 执行`npm run dev`可打包生成开发环境文件；
5. 执行`npm run build`可打包生成生产环境文件；

部分配置参考:https://github.com/Val-Zhang/blogs/tree/master/sources/MultiPageWebpackDemos


### 问题归纳

1. 在使用时，遇到网络问题，无法编译，比如scss无法编译，可尝试npm rebuild node-sass
2. 我本地的node关键是8.11.3，但是在安装时提示image-webpack-loader需要小于<7的版本，即使这样，打包还是能正常压缩。


### jquery使用
传统js使用webpack打包，参考目录factory。（不用jquery，package.json中expose-loader和jquery可去除）
webpack.prod.js 引入如下loader，参见地址：https://webpack.docschina.org/loaders/expose-loader/
``` python
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
	}}
}
```

附：Markdown在线编辑地址：https://maxiang.io/


### CommonsChunkPlugin的注意事项

``` python
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
    chunks: chunksVal,
    minChunks:3
}),
```
或者

``` python
new webpack.optimize.CommonsChunkPlugin({
    name: "manifest",
    minChunks:3
}),
```
以上两者的区别是，有没有提取node_modules的组件，他们都能正常提取公用部分

minChunks一定要写明，否则部分的页面没有引用`public.scss`也是无法生成公用css的（重点）。

css的引用需要使用`require("./index.scss");` 这种方式，否则css也是无法生成公用的（重点）。

如果页面不提公用，使用`import '../utils/theme/default/layer.css';`这种方式也是可以的。