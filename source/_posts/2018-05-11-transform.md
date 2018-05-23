---
title: CSS3 Transform 
date: 2018-05-11 15:10:20
tags:
- CSS3
- Transform
---

这篇文章不会详细介绍每个属性，它将作为一部快速指南，主要想介绍这些很棒的属性是如何帮我们呈现更面向用户的内容，如何帮我们省去抠图的。

<!--more-->

# 2D Transform

`transform`形变属性，它可以对元素同时进行倾斜（skew）、旋转（rotate）、位移（translate）、缩放（scale）操作。

## skew

`skew(<angle> [, <angle> ]?)`、 `skewX()` 、`skewY()`。**[点击看效果](https://codepen.io/pennySU/pen/jxxEqX)**

```css
.item {
  transform: skewX(25deg);
}
```

{% asset_img skew.png skew %}
**[点击看效果](https://codepen.io/pennySU/pen/jxxEqX)**
{% asset_img skewY.png skewY %}
**[点击看效果](https://codepen.io/pennySU/pen/qYgxJG)**

## rotate

`rotate(<angle>)`。**[点击看效果](https://codepen.io/pennySU/pen/NMMPZZ)**

```css
.item {
  transform: rotate(25deg);
}
```

{% asset_img rotate.png 500 rotate %}

## translate

`translate(x, y)` 、`translateX()` 、`translateY()` 。

```css
.item {
  transform: translate(-50%, -50%);
}
```

1.  **[居中](https://codepen.io/pennySU/pen/yjjJLP)**
2.  **[hover 效果](https://codepen.io/pennySU/pen/JvvYox)**

{% asset_img translate.png 500 hover 时卡片向上移动 %}

## scale

`scale(<number> [, <number> ]?)` 、`scaleX()` `、scaleY()`。

```css
.item {
  transform: scale(1.2);
}
```

{% asset_img scale.png scale %}
**[点击看效果](https://codepen.io/pennySU/pen/QrYrEX)**

## matrix

`matrix`方法可以将多个形变转换为一个，有点像 `transform` 的缩写。有很多工具可以进行`matrix`转换，比如：**[The Matrix Resolutions](https://meyerweb.com/eric/tools/matrix/)**

```css
rotate(45deg) translate(24px,25px)
```

上述代码可以被写为：

```css
matrix(0.7071067811865475, 0.7071067811865476, -0.7071067811865476, 0.7071067811865475, -0.7071067811865497, 34.648232278140824)
```

# 3D Transform

{% asset_img transform3d.png transform3d %}
**[点击看效果](https://codepen.io/pennySU/pen/yjEZMy)**

## translate3d

`translate3d(x,y,z)`、`translateZ(z)`。`translate3d`比`translate`快，会开启硬件加速，阅读**[translate3d vs translate performance
](https://stackoverflow.com/questions/22111256/translate3d-vs-translate-performance?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa)**。

## scale3d

`scale3d(sx,sy,sz)` `scaleZ(sz)`。

## rotate3d

`rotate3d(x,y,z)` `rotateX()` `rotateY()` `rotateZ()`。

## matrix3d

## perspective

要激活 3D 空间，元素需要透视`perspective`。有两种方式：

```css
.panel--red {
  transform: perspective(400px) rotateY(45deg);
}
```

```css
.scene--blue {
  perspective: 400px;
}
.panel--blue {
  transform: rotateY(45deg);
}
```

**[点击看效果](https://codepen.io/pennySU/pen/rvKoqB)**
两者的区别是： `perspective()`方法作用于单个元素，`perspective`属性对声明元素的所有直系子元素产生作用。

`perspective`的值决定了 3D 效果的强度。可以把值当做观察者到物体之间的距离。值越大，距离越大，视觉效果越不明显。

## perspective-origin

3D 视角的透视点默认是中心点，通过`perspective-origin`可以更改透视点的位置。

```css
.item {
  perspective-origin: 25% 75%;
}
```

# 卡片翻转效果

{% asset_img card-flip.gif card flip %}

HTML 结构：

```html
<div class="scene">
  <div class="card">
    <div class="card__face card__face--front">front</div>
    <div class="card__face card__face--back">back</div>
  </div>
</div>
```

`.scene`是 3D 空间的容器，`.card`作为 3D 对象，两个`.card-face`元素是卡片的两个面。首先，激活 3D 视角:

```css
.scene {
  width: 200px;
  height: 260px;
  perspective: 600px;
}
```

`perspective`只为直系子元素提供 3D 视角，即`.card`元素，为了让`.card`的子元素处于同样的 3D 视角中，可设置`transform-style: preserve-3d`使得子元素继承父元素的视角：

```css
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 1s;
  transform-style: preserve-3d;
}
```

定位两个面，通过设置`backface-visibility: hidden`，当面对观察者时，可将背面隐藏：

```css
.card__face {
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
}
```

将`.card__face--back`元素放置到背后：

```css
.card__face--front {
  background: red;
}

.card__face--back {
  background: blue;
  transform: rotateY(180deg);
}
```

最后，使 3D 对象`.card`翻转：

```scss
.card {
  &:hover {
    transform: rotateY(180deg);
  }
}
```

以上，我们实现了一个以中心点进行翻转的效果。如果想实现从右侧进行滑动翻转的效果改怎么实现呢？

```css
.card {
  transform-origin: center right;
}
.card:hover {
  transform: translateX(-100%) rotateY(-180deg);
}
```

通过`transform-origin`更改变化的原点，`translateX`进行移动来实现。**[点击看效果](https://codepen.io/pennySU/pen/GdGeOg)**

## transform-origin

设置元素在形变时的基点，比如旋转时的选择中心。水平和垂直方向的偏移量以形变元素的左上角为基点。

```css
transform-origin: bottom right 60px; // x y z
```

## transform-style

设置元素的子元素是位于 3D 空间还是位于 2D 平面空间被扁平化，有三种取值：

1.  flat
2.  preserve-3d
3.  inherit

## will-change

在卡片翻转效果的例子中，动画有时会出现卡顿的现象。可以使用`will-change`进行优化。`will-change`为 web 开发者提供了一种告知浏览器该元素会有哪些变化的方法，这样浏览器可以在元素属性真正发生变化之前提前做好对应的优化准备工作，有四种取值：

1.  auto
2.  scroll-position
3.  contents
4.  <custom-ident\>， 如：`transform` ,`opacity`等

```scss
.scene:hover .card {
  will-change: transform;
}
.card {
  transform-origin: center right;
  &:hover {
    transform: translate3d(-100%, 0, 0) rotateY(-180deg);
  }
}
```

**[点击看效果](https://codepen.io/pennySU/pen/rvKgZj)**

过渡使用`will-change`会消耗很多机器资源，可能导致页面响应缓慢。所以我们在鼠标进入`.scene`时再给`.card`设置`will-change: transform`，减少浏览器资源消耗。同时使用`translate3d`代替`translateX`。

## backface-visibility

在上面的例子中，我们为`.card__face`卡片元素添加了`backface-visibility: hidden`属性，顾名思义，“背面可见性”。默认情况下，元素的背面也是可以看到的，当翻卡片时，背面隐藏，才更符合我们想要实现的效果。

```css
backface-visibility: visible
backface-visibility: hidden
```

# 立方体

{% asset_img cube.gif cube %}

HTML 结构：

```html
<div class="scene">
  <div class="cube">
    <div class="cube__face cube__face--front">front</div>
    <div class="cube__face cube__face--back">back</div>
    <div class="cube__face cube__face--right">right</div>
    <div class="cube__face cube__face--left">left</div>
    <div class="cube__face cube__face--top">top</div>
    <div class="cube__face cube__face--bottom">bottom</div>
  </div>
</div>
```

设置立方体的 6 个面`.cube__face`，3D 对象`.cube`，3D 场景`.scene`：

```css
.scene {
  width: 200px;
  height: 200px;
  perspective: 600px;
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.cube__face {
  position: absolute;
  width: 200px;
  height: 200px;
}
```

{% asset_img cube-1.png cube-1 %}

现在，因为绝对定位，所有的面重叠在一起，我们通过`rotate`将每个面旋转到对应的位置：

```css
.cube__face--front {
  transform: rotateY(0deg);
}
.cube__face--right {
  transform: rotateY(90deg);
}
.cube__face--back {
  transform: rotateY(180deg);
}
.cube__face--left {
  transform: rotateY(-90deg);
}
.cube__face--top {
  transform: rotateX(90deg);
}
.cube__face--bottom {
  transform: rotateX(-90deg);
}
```

{% asset_img cube-2.png cube-2 %}

旋转完成后，`front`和`back`面可见，其余面由于垂直于观察者，在屏幕上呈现出两条相互垂直的线，下面的动图可以展示翻转的过程：

{% asset_img cube-2.gif cube-2 %}

需要注意的是，立方体的每个面旋转后，其坐标系跟着一起旋转，即坐标系旋转。

现在把每个面从中心位置，向外移动`100px`（立方体边长`200px`，旋转后每个面位于中心位置，距离立方体边`100px`）。

```css
.cube__face--front {
  transform: rotateY(0deg) translateZ(100px);
}
.cube__face--right {
  transform: rotateY(90deg) translateZ(100px);
}
.cube__face--back {
  transform: rotateY(180deg) translateZ(100px);
}
.cube__face--left {
  transform: rotateY(-90deg) translateZ(100px);
}
.cube__face--top {
  transform: rotateX(90deg) translateZ(100px);
}
.cube__face--bottom {
  transform: rotateX(-90deg) translateZ(100px);
}
```

注意，这里需要先旋转，后平移，因为旋转改变坐标系，每个面沿着单独的方向平移。

目前为止，看一下我们的立方体的`front`面：

{% asset_img cube-3.png cube-3 %}

发现`front`文字变模糊了，3D 变换会影响文本渲染。我们可将 3D 对象`.cube`推回去`100px`，使得`front`面回到 Z 轴原点，来解决这个问题：

```css
.cube {
  transform: translateZ(-100px);
}
```

接下来，通过为`.cube`添加不同的类来旋转我们的立方体：

```css
.cube.show-front {
  transform: translateZ(-100px) rotateY(0deg);
}
.cube.show-right {
  transform: translateZ(-100px) rotateY(-90deg);
}
.cube.show-back {
  transform: translateZ(-100px) rotateY(-180deg);
}
.cube.show-left {
  transform: translateZ(-100px) rotateY(90deg);
}
.cube.show-top {
  transform: translateZ(-100px) rotateX(-90deg);
}
.cube.show-bottom {
  transform: translateZ(-100px) rotateX(90deg);
}
```

注意这里的`translateZ(-100px)`是为了解决文字模糊的问题。**[点击看效果](https://codepen.io/pennySU/pen/WJyVNZ)**

# 长方体

下面实现一个长`300px`，宽`100px`，高`200px`的长方体。

{% asset_img box.png box %}

HTML 结构：

```html
<div class="scene">
  <div class="box">
    <div class="box__face box__face--front">front</div>
    <div class="box__face box__face--back">back</div>
    <div class="box__face box__face--right">right</div>
    <div class="box__face box__face--left">left</div>
    <div class="box__face box__face--top">top</div>
    <div class="box__face box__face--bottom">bottom</div>
  </div>
</div>
```

定义长方体的长、高以及六个面的宽高：

```css
.scene {
  width: 300px;
  height: 200px;
  perspective: 500px;
}

.box {
  width: 300px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
  transform: translateZ(-50px);
}

.box__face--front,
.box__face--back {
  width: 300px;
  height: 200px;
}

.box__face--right,
.box__face--left {
  width: 100px;
  height: 200px;
}

.box__face--top,
.box__face--bottom {
  width: 300px;
  height: 100px;
}
```

用`position: absolute`绝对定位`.box__face`元素后，每个面重叠于左上角。

{% asset_img box-1.png box-1 %}

为了可以在透视原点`perspective-origin`翻转每个面，我们需要将左面右面、上面下面移动到透视原点：

```css
.box__face--right,
.box__face--left {
  left: 100px;
}

.box__face--top,
.box__face--bottom {
  top: 50px;
}
```

{% asset_img box-2.png box-2 %}

和立方体一样，现在可以`rotate`了，但是对于长方体而言，平移`translateZ`的距离是不相同的，上面和下面平移的距离是高的一半`100px`，左面和右面的平移距离是长的一半`150px`，前面和后面的平移距离是宽的一半`50px`：

```css
.box.show-front {
  transform: translateZ(-50px) rotateY(0deg);
}
.box.show-back {
  transform: translateZ(-50px) rotateY(-180deg);
}
.box.show-right {
  transform: translateZ(-150px) rotateY(-90deg);
}
.box.show-left {
  transform: translateZ(-150px) rotateY(90deg);
}
.box.show-top {
  transform: translateZ(-100px) rotateX(-90deg);
}
.box.show-bottom {
  transform: translateZ(-100px) rotateX(90deg);
}
```

观察者面对的面是长方体的正面，正面平移了`50px`，所以 3D 对象`.box`将向后平移`50px`解决上面提到的文字模糊问题。**[点击看效果](https://codepen.io/pennySU/pen/GdXgbE)**

# 旋转木马效果

{% asset_img carousel.png carousel %}

HTML 结构：

```html
<div class="scene">
  <div class="carousel">
    <div class="carousel__cell">1</div>
    <div class="carousel__cell">2</div>
    <div class="carousel__cell">3</div>
    <div class="carousel__cell">4</div>
    <div class="carousel__cell">5</div>
    <div class="carousel__cell">6</div>
    <div class="carousel__cell">7</div>
    <div class="carousel__cell">8</div>
    <div class="carousel__cell">9</div>
  </div>
</div>
```

场景`.scene`宽高设置为`201 * 140`，每个面的宽高设置为`190 * 120`，同时为每个面设置`top: 10px; left: 10px`使其在场景中居中：

```css
.scene {
  width: 210px;
  height: 140px;
  position: relative;
  perspective: 1000px;
}

.carousel {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
}

.carousel__cell {
  position: absolute;
  width: 190px;
  height: 120px;
  left: 10px;
  top: 10px;
}
```

接下来，准备旋转 9 个面，每个面应以 40°（360° / 9）为间隔进行旋转：

```css
.carousel__cell:nth-child(1) {
  transform: rotateY(0deg);
}
.carousel__cell:nth-child(2) {
  transform: rotateY(40deg);
}
.carousel__cell:nth-child(3) {
  transform: rotateY(80deg);
}
.carousel__cell:nth-child(4) {
  transform: rotateY(120deg);
}
.carousel__cell:nth-child(5) {
  transform: rotateY(160deg);
}
.carousel__cell:nth-child(6) {
  transform: rotateY(200deg);
}
.carousel__cell:nth-child(7) {
  transform: rotateY(240deg);
}
.carousel__cell:nth-child(8) {
  transform: rotateY(280deg);
}
.carousel__cell:nth-child(9) {
  transform: rotateY(320deg);
}
```

{% asset_img carousel-1.png carousel-1 %}

旋转完的效果如上图，接下来要做的与立方体、长方体时的步骤一致，对每个面进行平移`translate`，上面两个例子的平移量很容易计算，不是宽的一半，就是高的一半或者是长的一半，那么旋转木马的平移量又该怎么计算呢？

先看一看旋转木马的俯视图：

{% asset_img carousel-2.png carousel-2 %}

旋转木马的俯视图是一个 9 边形，边长等于场景`.scene`的宽`210px`，`r`是中点到边长的距离，即我们要平移的距离，根据三角函数计算可得：

{% asset_img carousel-3.png carousel-3 %}

`r`的值应为`288px`。

```css
.carousel__cell:nth-child(1) {
  transform: rotateY(0deg) translateZ(288px);
}
.carousel__cell:nth-child(2) {
  transform: rotateY(40deg) translateZ(288px);
}
.carousel__cell:nth-child(3) {
  transform: rotateY(80deg) translateZ(288px);
}
.carousel__cell:nth-child(4) {
  transform: rotateY(120deg) translateZ(288px);
}
.carousel__cell:nth-child(5) {
  transform: rotateY(160deg) translateZ(288px);
}
.carousel__cell:nth-child(6) {
  transform: rotateY(200deg) translateZ(288px);
}
.carousel__cell:nth-child(7) {
  transform: rotateY(240deg) translateZ(288px);
}
.carousel__cell:nth-child(8) {
  transform: rotateY(280deg) translateZ(288px);
}
.carousel__cell:nth-child(9) {
  transform: rotateY(320deg) translateZ(288px);
}
```

当我们想改变旋转木马每个面的宽度或者面的个数时，可以使用下面的`JS`公式结算平移的距离：

```js
var r = Math.round((cellSize / 2) / Math.tan(((Math.PI * 2) / numberOfCells )/2)
// 约分
var r = Math.round((cellSize / 2) / Math.tan (Math.PI / numberOfCells )
```

最后，通过为 3D 对象`.carousel`设置`rotateY`的值，就可以使“木马”旋转起来了。**[点击看效果](https://codepen.io/pennySU/pen/RyYXow)**

# 参考文献

1.  **[CSS-TRICKS transform](https://css-tricks.com/almanac/properties/t/transform/)**
2.  **[MDN transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)**
3.  **[Intro to CSS 3D transforms](https://3dtransforms.desandro.com/)**
4.  **[MDN will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)**
5.  **[CSS-TRICKS will-change](https://css-tricks.com/almanac/properties/w/will-change/)**
6.  **[MDN backface-visibility](https://developer.mozilla.org/zh-CN/docs/Web/CSS/backface-visibility)**
7.  **[CSS3 的 3D 立方体旋转动画](https://www.jianshu.com/p/92c1ae12c158)**
8.  **[MDN transform-origin](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-origin)**
9.  **[Typography Effects with CSS3 and jQuery](https://tympanus.net/codrops/2011/11/28/typography-effects-with-css3-and-jquery/)**
