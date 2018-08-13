---
title: webpack构建速度与结果优化
date: 2018-08-12 16:37:45
tags:
- webpack
- build performance
- CommonsChunkPlugin
---
# 前言
本篇介绍一些关于webpack构建优化的内容，当然，抛开实际使用场景来谈优化意义不大，某些方法还需要结合实际情况来使用。
# 构建速度
## 官方文档
官方文档关于构建速度的优化有**[如下建议](https://webpack.js.org/guides/build-performance/)**：

{% asset_img doc.png 官方文档 %}

我们的目标：在保证构建 **结果正确（构建结果与优化前基本一致或更优）的前提** 下，减少构建时间

## 主要手段
- 减少资源搜索时间
- 减少代码体积
- 使用缓存
- 多线程
- 其他

## 减少资源搜索时间
1.限制loader只处理特定的目录
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),//这样该loader只会处理src目录下的文件
        loader: 'babel-loader'
      }
    ]
  }
};
```
2.noParse（该模块中不应该含有import，require，define）
```js
module.exports = {
  module: {
    noParse: /jquery|lodash/,
    // 从 webpack 3.0.0 开始
    noParse: function(content) {
      return /jquery|lodash/.test(content);
    }
  }
};
```
3.加快解析(resolve)速度
```js
module.exports = {
  resolve: {
    //webpack2开始不需要加空字符串，extensions不要加太多，常出现的放在前面
    extensions: ['', '.js', '.jsx', '.less', '.scss', '.sass'],
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/')
    }
  }
};
```
## 减少代码体积
### 减少编译的整体大小，以提高构建性能。尽量保持 chunks 小巧。
1. 使用 更少/更小 的库。
2. 在多页面应用程序中使用`CommonsChunkPlugin`。
3. 在多页面应用程序中以`async`模式使用`CommonsChunkPlugin`。
4. 移除不使用的代码。
5. 只编译你当前正在开发部分的代码。

### 使用 DllPlugin/DllReferencePlugin **[文档](https://webpack.js.org/plugins/dll-plugin)**
1. 新建一个单独的 webpack 配置文件，比如 webpack.dll.config.js
2. 在这个配置文件中，使用 webpack DllPlugin 生成 manifest.json 文件和 Dll 模块文件。也可以引入诸如 uglifyPlugin 对第三方依赖进行压缩等处理。
```js
import path from 'path';
import webpack from 'webpack';
const config = {
    entry: {
         vendor: ['react','lodash']
    },
    output: {
         filename: 'dll.[name].js',
         path: path.resolve(__dirname, 'build', 'dll'),
         library: '[name]'
    },
    plugins: [
         new webpack.DllPlugin({
               context: __dirname,
               name: "[name]_[hash]",
               path: path.join(__dirname, "manifest.json"),
         }),
         new webpack.optimize.UglifyJsPlugin({
               sourceMap: true,
               minimize: true,
               cache: true,
               parallel: true
         }),
    ]
}
```
3. 在正常的 webpack 配置文件中，使用 webpack DllReferencePlugin 解析上一步生成的 manifest.json
```js
new webpack.DllReferencePlugin({
    context: path.join(__dirname),
    manifest: require('./manifest.json')
})
```
## 使用缓存
webpack 和一些 Plugin/Loader 都有 Cache 选项。开启 Cache 选项，有利用提高构建性能。
比如：使用 babel-loader 的时候开启 cacheDirectory 选项，会较为明显的提升构建速度
```js
module: {
    rules: [{
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory'],
        include: path.join(__dirname, 'app')
    }]
}
```
还可以使用 `cache-loader` 启用持久化缓存
## 多线程
### happypack
```js
var HappyPack = require('happypack'),
  os = require('os'),
  happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

modules: {
	loaders: [
	  {
        test: /\.js|jsx$/,
        loader: 'HappyPack/loader?id=jsHappy',
        exclude: /node_modules/
      }
	]
}

plugins: [
    new HappyPack({
      id: 'jsHappy',
      cache: true,
      threadPool: happyThreadPool,
      loaders: [{
        path: 'babel',
        query: {
          cacheDirectory: '.webpack_cache',
          presets: [
            'es2015',
            'react'
          ]
        }
      }]
    }),
    //如果有单独提取css文件的话
    new HappyPack({
      id: 'lessHappy',
      loaders: ['style','css','less']
    })
  ]
```
## 其他
### 区分开发环境和生产环境
在开发环境中关闭生产中才用得到的插件，比如
- UglifyJsPlugin
- ExtractTextPlugin
- [hash]/[chunkhash]
- AggressiveSplittingPlugin
- AggressiveMergingPlugin
- ModuleConcatenationPlugin

### devtool: 
不同的 devtool 的设置，会导致不同的性能差异。
`inline-source-map`会增加编译时间，带`eval`的设置（或者直接关闭）具有最好的性能，但并不能帮助你调试代码。
如果你能接受稍差一些的 mapping 质量，可以使用 cheap-source-map 选项来提高性能，使用 eval-source-map 配置进行增量编译。
在大多数情况下，cheap-module-eval-source-map 是最好的选择。

- eval： 使用eval包裹模块代码
- source-map： 产生.map文件
- cheap： 不包含列信息（关于列信息的解释下面会有详细介绍)也不包含loader的sourcemap
- module： 包含loader的sourcemap（比如jsx to js ，babel的sourcemap）
- inline： 将.map作为DataURI嵌入，不单独生成.map文件（这个配置项比较少见）

{% asset_img source-map source map %}
### css-loader 
使用0.15.0+ 会使webpack加载变得缓慢

# 构建结果优化
## 主要手段
- 代码分析

## CommonsChunkPlugin的使用
### chunk类型:

- entry chunk：含有webpack runtime代码的模块代码集合。
- normal chunk：不含runtime代码的模块集合。
- initial chunk：原本是entry chunk，被抽走了runtime代码

### 主要作用

> The CommonsChunkPlugin selects only entry chunks. After the CCP processed the modules it creates a new entry chunk (the commons chunk) and make the used chunks non-entries.
> So when using multiple CCPs they only extract modules from the last CCP.

- 从不同的打包文件中抽离出相同的模块，然后将这些模块加到公共打包文件中。
- 如果公共打包文件不存在，则新增一个。
- 将运行时（runtime）转移到公共chunk打包文件中。
- 处理过的chunk

### 通常步骤：
通过webpack-bundle-analyzer分析目前构建的包
{% asset_img vendor.png only vendor %}
参考配置
```js
new webpack.optimize.CommonsChunkPlugin({
    name: 'index',
    async: 'async-vendor',
    children: true,
    minChunks: 2
}),
new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks(module) {
        return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(
                path.join(__dirname, '../node_modules')
            ) === 0
        )
    }
}),
new webpack.optimize.CommonsChunkPlugin({
    name: 'lib',
    minChunks(module) {
        return /react/.test(module.context);
    }
}),
new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
})
```
1. 从所有entry chunk（index）的直接子chunk（一般是router中异步加载的chunk）中提取出公共模块放入懒加载chunk async-vendor中。
2. 从所有entry chunk（index）中提取出node_modules里的模块放入chunk vendor中。index此时变为normal chunk。
3. 从所有entry chunk（vendor）中提取出路径含有react的模块，放入chunk lib。
4. 新建一个manifest chunk，不放入任何模块（minChunks:infinity）。由于manifest是此时唯一的entry chunk，则runtime代码放入manifest。

## treeshaking
- 使用 ES2015 模块语法（即 `import` 和 `export`）
- 在项目 `package.json` 文件中，添加一个 "sideEffects" 属性。
- 引入一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 `UglifyJSPlugin`）。

## polyfills
1.babel优化：比如用babel-preset-env

```js
import 'babel-polyfill'
```
将转化为：
```js
import 'core-js/modules/es7.string.pad-start';
import 'core-js/modules/es7.string.pad-end';
import 'core-js/modules/web.timers';
import 'core-js/modules/web.immediate';
import 'core-js/modules/web.dom.iterable';
```
2.在特定条件下加载polyfill，比如IE下使用条件注释加载

```html
<!Doctype html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title><%= htmlWebpackPlugin.options.title %></title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <!--[if lte IE 9]>
    <script src="shim.js"></script>
  <![endif]-->
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

## 最后思考一个问题：不同entry模块或按需加载的异步模块需不需要提取通用模块？

vendor+lib 10529kb
{% asset_img vendor+lib.png vendor+lib %}
vendor+lib+async 11324kb
{% asset_img vendor+lib+async.png vendor+lib+async %}

需要分场景讨论：
- 在线加载：如果通用模块提取粒度过小，会导致首页首屏需要的文件变多，很多可能是首屏用不到的，导致首屏过慢，二级或三级页面加载会大幅提升。所以这个就需要根据业务场景做权衡，控制通用模块提取的粒度。
- 离线包：如果移动端页面都做了离线化的处理，离线之后，加载本地的js文件，与网络无关，基本上可以忽略文件大小，所以更关注整个离线包的大小。离线包越小，耗费用户的流量就越小，用户体验更好，所以离线化的场景是非常适合最小粒提取通用模块的，即将所有entry模块和异步加载模块的引用大于2的模块都提取，这样能获得最小的输出文件，最小的离线包。