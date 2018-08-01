## 使用说明

这是一个使用`webpack`配置多页应用的简易`demo`。

多页面依据`/src`中的目录动态生成。

如本例中`/src`文件夹下有`/a`,`/b`,`/c`三个页面，打包后将自动生成`a.html`,`b.html`,`c.html`。三个文件都具有自己独立的依赖，都可独立使用。

`/factory`是UMD模式webpack的打包

`/layer`引入了jquery和layer的两个依赖的写法

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
