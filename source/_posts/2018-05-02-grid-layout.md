---
title: Grid Layout
date: 2018-05-02 17:46:36
tags:
- CSS3
- grid layout
---
Grid布局，是一个二维系统，可以同时对行和列进行设置。

<!-- more -->

# 基础和浏览器支持
你需要给容器元素设置`display: grid`来创建一个网格布局，使用`grid-template-columns` 和 `grid-template-rows`属性为网格添加行和列，使用`grid-column`和`grid-row`属性将子元素放置到网格布局的某个或某些格子里。

根据**[Caniuse](https://caniuse.com/#feat=css-grid)**的数据，Chrome、火狐、Safari、Opera都已经支持CSS3 Grid布局，IE支持带有`-ms-`前缀的语法

# 重要的术语
## Grid 容器
被设置`display:grid`的元素，如下，`container`就是grid容器
```html
<div class="container">
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
</div>
```
## Grid 项目（条目）
Grid容器的直系子元素，如下，`item`是grid条目，`sub-item`就不是了。
```html
<div class="container">
    <div class="item">
        <div class="sub-item"></div>
    </div>
    <div class="item"></div>
    <div class="item"></div>
</div>
```
## Grid 线
一条条横竖相交的分界线构成网格