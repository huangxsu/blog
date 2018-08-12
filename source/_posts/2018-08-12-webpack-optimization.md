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

我们的目标：在保证构建**结果正确（构建结果与优化前基本一致或更优）的前提**下，减少构建时间

## 主要手段
- 精确范围
- 代码分割
- Devtool
- 使用缓存
- 多线程
- 区别开发环境和生产环境

## 精确范围
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
    symlinks: false,//不使用npm link的情况下
    cacheWithContext: false//使用自定义解析 plugins ，并且没有指定 context 信息的情况下
  }
};
```
## 代码分割
1. 减少编译的整体大小，以提高构建性能。尽量保持 chunks 小巧。
- 使用 更少/更小 的库。
- 在多页面应用程序中使用`CommonsChunkPlugin`。
- 在多页面应用程序中以`async`模式使用`CommonsChunkPlugin`。
- 移除不使用的代码。
- 只编译你当前正在开发部分的代码。
2. DllPlugin
## Devtool
## 使用缓存
## 多线程
## 区别开发环境和生产环境

# 构建结果优化
## 主要手段
- 代码分析

1、CommonsChunkPlugin的使用
功能：
- 从不同的打包文件中抽离出相同的模块，然后将这些模块加到公共打包文件中。
- 如果公共打包文件不存在，则新增一个。
- 将运行时（runtime）转移到公共chunk打包文件中。
通常步骤：
通过webpack-bundle-analyzer分析目前构建的包


webpack里, chunk有三种类型:
- entry chunk：含有webpack runtime代码的模块代码集合。
- normal chunk：不含runtime代码的模块集合。
- initial chunk：原本是entry chunk，被抽走了runtime代码
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
第一次抽取：从所有entry chunk（index）的直接子chunk（一般是router中异步加载的chunk）中提取出公共模块放入懒加载chunk async-vendor中。

第二次抽取：从所有entry chunk（index）中提取出node_modules里的模块放入chunk vendor中。index此时变为normal chunk。

第三次抽取：从所有entry chunk（vendor）中提取出路径含有react的模块，放入chunk lib。

第四次抽取：新建一个manifest chunk，不放入任何模块（minChunks:infinity）。由于manifest是此时唯一的entry chunk，则runtime代码放入manifest。

vendor+lib 10529kb
vendor+lib+async 11324kb
2、treeshaking
需要结合UglifyJsPlugin
3、polyfills
babel优化：比如用babel-preset-env
IE下使用条件注释加载

## 最后思考一个问题：不同entry模块或按需加载的异步模块需不需要提取通用模块？

这个需要看场景了，比如模块都是在线加载的，如果通用模块提取粒度过小，会导致首页首屏需要的文件变多，很多可能是首屏用不到的，导致首屏过慢，二级或三级页面加载会大幅提升。所以这个就需要根据业务场景做权衡，控制通用模块提取的粒度。百度外卖的移动端应用场景是这样的，我们所有的移动端页面都做了离线化的处理。离线之后，加载本地的js文件，与网络无关，基本上可以忽略文件大小，所以更关注整个离线包的大小。离线包越小，耗费用户的流量就越小，用户体验更好，所以离线化的场景是非常适合最小粒提取通用模块的，即将所有entry模块和异步加载模块的引用大于2的模块都提取，这样能获得最小的输出文件，最小的离线包。