---
title: Flexbox Layout
date: 2018-05-08 20:24:09
tags:
- CSS3
- Flexbox
- Layout
---

`Flexbox Layout`致力于解决，子元素如何有效便捷的排列、对齐和分配容器内的空间。

<!--more-->

# 背景
弹性盒子布局的主要思路是，使容器具有改变其子元素宽度（高度/顺序）的能力，使其更完美的填充容器内的可用空间（主要用于适配各种类型的设备和屏幕尺寸）。弹性容器可以扩大子元素填充剩余空间，也可以缩小它们防止溢出。

与常规布局（块级垂直，行内水平）相比，弹性盒子布局的方向可以是垂直或水平，方向无关，这个特点非常重要。在横竖屏切换、放大、缩小、调整窗口大小的时候，常规布局可能无法灵活的变化方向。

根据**[Caniuse](https://caniuse.com/#search=flexbox)**的数据，Chrome、火狐、Safari、Opera都已经支持CSS3 Grid布局，IE支持带有`-ms-`前缀的语法。

**注：** `Flexbox Layout`适用于组件和小型布局，**[Grid](/2018/05/02/grid-layout/)**适用于大型布局。

# 术语
弹性盒子是一个系统，包含一整套属性，有些用于设置容器 `flex container`，有些用于子元素 `flex items`。

如果常规布局基于块级和行内方向布局，那么弹性盒子基于“弹性”方向布局。下面是一张来自弹性盒子规范的示意图：

{% asset_img flex_img flexbox.png flex box %}

通常，`items`将沿着主轴 `main axis` 或 纵轴 `cross axis` 方向布局。

- **主轴** `flex items`排列的方向，排列方向不一定是水平的，由 `flex-direction` 决定。
- **主轴起点、主轴终点** `flex item`在容器内沿着主轴方向从主轴起点被放置直到主轴终点。
- **主轴尺寸** 一个 `flex item` 在主轴区域所占的大小，由于主轴方向的不同，值可能为其宽或高。
- **侧轴** 与主轴相垂直的轴，其方向由主轴方向决定。
- **侧轴起点、侧轴终点** 
- **侧轴尺寸**
 
# 弹性容器属性
## display
定义一个弹性容器，是容器内的直系子元素获得弹性布局的能力。
```css
.container{
    display: flex; /* or inline-flex */
}
```
## flex-direction
确定主轴的方向，默认值 `row`。
```css
.container{
    flex-direction: row | row-reverse | column | column-reverse;
}
```
{% asset_img flex_img flex-direction.svg 300 flex box %}

## flex-wrap
默认情况下`flex items`将在一行排列，通过此属性可允许它们超出一行时换行，默认值 `nowrap`
```css
.container{
    flex-wrap: nowrap | wrap | wrap-reverse;
}
```
{% asset_img flex_img flex-wrap.svg 300 flex box %}
`wrap-reverse`：
{% asset_img flex_img wrap-reverse.jpg 300 wrap-reverse %}


## flew-flow
`flex-direction` 和 `flex-wrap`的缩写，默认值： `row nowrap`。
```css
.container{
    flex-flow: <flex-direction> <flex-wrap>;
}
```

## justify-content
定义项目在主轴方向上的排列方式。该属性可以解决如何对剩余空间排列的问题。默认值： `flex-start` 。
```css
.container{
    justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
```
{% asset_img flex_img justify-content.svg 300 justify-content %}

`flex-start` `flex-end` `center` 这三个值很好理解，剩下三个值，它们都代表平均分布在主轴线，下面了解一下三者的区别：
- `space-between` 第一项和最后一项距离主轴的起点和终点的距离为0。
- `space-around` 第一项和最后一项距离主轴的起点和终点的距离是距离相邻项的距离的1/2。
- `space-evenly` 第一项和最后一项距离主轴的起点和终点的距离与距离相邻项的距离相等。

## align-items
定义项目在侧轴方向的对齐方式。默认值： `stretch`。
```css
.container{
    align-items: flex-start | flex-end | center | baseline | stretch;
}
```
{% asset_img flex_img align-items.svg 300 align-items %}


- `stretch` 拉伸至充满容器（`min-width/max-width`不受响应）。

## align-content
当弹性容器有多行，且侧轴有剩余空间时，该属性定义了容器中行与行在侧轴方向的排列方式。默认值：`stretch`。
```css
.container{
    align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```
{% asset_img flex_img align-content.svg 300 align-content %}

# 弹性项目属性
## order
弹性项目默认按文档顺序排队，设置该属性可控制项目在容器展示的顺序。默认值： `0`。
```css
.item{
    order: <interger>;
}
```
{% asset_img flex_img order.svg 300 order %}
从图中可以看出，值越小的排在越前面。

## flex-grow
该属性使弹性项目具有扩大的能力，是项目的放大比例。默认值： `0`。负值无效。
```css
.item{
    flex-grow: <interger>;
}
```
{% asset_img flex_img flex-grow.svg 300 flex-grow %}

## flex-shrink
该属性使弹性项目具有缩小的能力，是项目的缩小比例。默认值： `1`。负值无效。
```css
.item{
    flex-shrink: <interger>;
}
```
{% asset_img flex_img flex-shrink.jpg flex-shrink %}

如图， `flex-shrink: 0`使得该项目在空间不足时不缩小。

## flex-basis
在剩余空间被分配之前，定义项目的尺寸。其值可以为长度（25%，5rem）或者auto。默认值：`auto`。
```css
.item{
    flex-basis: <length> | auto;
}
```
当值为 `0` 时，所有的空间按照 `flex-grow` 所设置的比例在项目之间进行分配，如果项目内容所占的空间大于其应占的比例空间，则额外空间不会分配给该项目**[点击看效果](https://codepen.io/pennySU/pen/gzvwEN)**。当值为 `auto` 时，项目内容以外的空间将按照 `flex-grow` 的值在所有项目之间进行分配，如图所示：
{% asset_img flex_img rel-vs-abs-flex.svg flex-basis %}

## flex
是 `flex-grow` `flex-shrink` `flex-basis`的缩写。默认值： `0 1 auto` 。
```css
.item{
    flex: auto | none;
}
```
## align-self
该属性可以覆盖 `align-items` 的值，使单个项目用于自己的侧轴对齐方式。
```css
.item {
    align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```
{% asset_img flex_img align-self.svg 500 align-self %}

# 应用
## 垂直水平居中
有了 `flex` 实现居中很轻松！
```css
.parent{
  display: flex;
  border: 1px solid #999;
  height: 300px;
}
.child{
  width: 100px;
  height: 100px;
  border: 1px solid #f60;
  margin: auto;
}
```
**[点击看效果](https://codepen.io/pennySU/pen/ELQZdV)**

## 固定底栏
实现方式有很多种，我们这里介绍`Flex` 和 `Grid` 布局是如何实现的，更多内容可**[学习](https://css-tricks.com/couple-takes-sticky-footer/)**。
使用 `Flex` 方式：
```html
<body class="Site">
  <header>...</header>
  <main class="Site-content">...</main>
  <footer>...</footer>
</body>
```
```css
.Site {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.Site-content {
  flex: 1;
}
```
使用 `Grid` 方式：
```html
<body>
  <div class="content">
    content
  </div>
  <footer class="footer">footer</footer>
</body>
```
```css
html {
  height: 100%;
}
body {
  min-height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
}
.footer {
  grid-row: 2;
  padding: 20px;
}
```
## 圣杯布局
实现圣杯布局，并实现响应式布局，**[点击看效果](https://codepen.io/pennySU/pen/qYxrxp)**
```html
<div class="wrapper">
    <header></header>
    <article></article>
    <aside class="aside-1"></aside>
    <aside class="aside-2"></aside>
    <footer></footer>
</div>
```
```css
.wrapper{
    display: flex;
    flex-flow: row wrap;
}
.wrapper > * {
    flex: 1 100%;
}
@media all and (min-width: 600px) {
    aside{
        flex: 1 auto;
    }
}
@media all and (min-width: 800px) {
    article{
        flex: 3 0px;
        order: 2
    }
    .aside-1{
        order: 1;
    }
    .aside-2{
        order: 3;
    }
    footer  { order: 4; }
}
```

# 参考文献
1. **[A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)**
2. **[使用弹性盒子进行高级布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Mixins)**
3. 阮一峰**[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)**
4. 阮一峰**[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)**
5. **[Sticky Footer, Five Ways](https://css-tricks.com/couple-takes-sticky-footer/)**