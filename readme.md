## 使用说明

这是一个使用`webpack`配置多页应用的简易`demo`。

多页面依据`/src`中的目录动态生成。

如本例中`/src`文件夹下有`/a`,`/b`,`/c`三个页面，打包后将自动生成`a.html`,`b.html`,`c.html`。三个文件都具有自己独立的依赖，都可独立使用。


### 使用方法

1. 下载本目录；
2. 执行`npm i`,也可以使用`cnpm i`,`yarn add`安装依赖；
3. 执行`npm start`可打开本地服务器查看效果,默认为`localhost:8080`;
4. 执行`npm run dev`可打包生成开发环境文件；
5. 执行`npm run build`可打包生成生产环境文件；

部分配置参考:https://github.com/Val-Zhang/blogs/tree/master/sources/MultiPageWebpackDemos


### 问题归纳

在使用时，遇到网络问题，无法编译，比如scss无法编译，可尝试npm rebuild node-sass