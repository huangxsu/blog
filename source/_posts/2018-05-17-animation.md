---
title: Transition and Animation
date: 2018-05-17 11:53:24
tags:
- CSS3
- transition
- animation
---

本文主要介绍`transition`与`animation`的应用。

<!--more-->

# Transition

## 语法

```css
.example {
  transition-property: all | none | <custom-ident>;
  transition-duration: 0s;
  transition-timing-function: ease | ease-in | ease-out | ease-in-out |
    cubic-bezier(<number>, <number>, <number>, <number>);
  transition-delay: 0s;
}
```

简写：

```css
.example {
  transition: [transition-property] [transition-duration]
    [transition-timing-function] [transition-delay];
}
```

多个过渡效果：

```css
.example {
  transition: width 2s linear, opacity 2s linear, color 2s linear;
}
```

## transition-property

值必须是具有**[动画性](https://www.w3.org/TR/css-transitions-1/#animatable-properties)**的属性。

## transition-duration

值可以为`s`或者`ms`。

```css
transition-duration: 10s, 230ms;
```

## transition-timing-function

1.  `linear`：匀速
2.  `ease`：先加速后减速，速度变化大
3.  `ease-in`：加速
4.  `ease-out`：减速
5.  `ease-in-out`：先加速后减速，但是速度变化小
6.  `cubic-bezier(n,n,n,n)`：三次贝塞尔曲线可以实现更复杂的渡效果的速度变化。可以使用**[cubic-bezier 工具](http://cubic-bezier.com/#.72,.26,.65,.86)**得出想要的效果
7.  `step-start`：直接跳到最终状态
8.  `step-end`：保持初始状态，到达持续时间时，立刻变成最终状态
9.  `step(number,start)`：分几步完成过渡，变化发生在间隔开始时
10. `step(number,end)`：变化发生在间隔结束时

**[点击看效果](https://codepen.io/pennySU/pen/XqxvgE)**

## transition-delay

在过渡效果开始作用之前需要等待的时间，值可以为`s`或者`ms`。

```css
transition-delay: 2s, 4ms;
```

## 触发过渡效果

仅定义过渡的规则，但是没有明确什么时候、如何触发过渡，将不会产生任何效果。

`:hover` `:active` `:focus` `:checked`这四个伪类元素都可以触发：

```css
.example {
  background-color: green;
  transition: background-color 2s ease-in 1s;
}
.example:hover {
  background-color: blue;
}
```

媒体查询`media`：

```css
.example {
  width: 200px;
  height: 200px;
  transition: width 2s ease, height 2s ease;
}
@media only screen and (max-width: 960px) {
  .example {
    width: 100px;
    height: 100px;
  }
}
```

Javascript:

```js
$(function() {
  $('#button').click(function() {
    $('.box').toggleClass('style-change')
  })
})
```

```css
.box {
  width: 200px;
  height: 200px;
  transition: width 2s ease, height 2s ease-in;
}
.style-change {
  width: 300px;
  height: 300px;
}
```

## Hover on 和 Hover off 的 Transition

```css
.example {
  background-color: #ff9ebb;
  transform: rotate(720deg);
  transition: all 2s ease-out;
}
.example:hover {
  background-color: #ed2d50;
  transform: rotate(0deg);
}
```

一般我们不会在`:hover`时设置`transition`，这时，鼠标移动进入元素，元素按照`:hover`里定义的样式发生形变，鼠标移除元素时，元素的样式会过渡变回初始状态，如图：

{% asset_img hover-on.gif hover-on %}

让我们在`:hover`里也设置`transition`试一试：

```css
.example {
  background-color: #ff9ebb;
  transform: rotate(720deg);
  transition: all 2s ease-out;
}
.example:hover {
  background-color: #ed2d50;
  transform: rotate(0deg);
  transition: background-color 2s linear 0.5s;
}
```

当`:hover`时，后定义的`transition`会覆盖先定义的值，所以，鼠标移入元素时，只有`background-color`会发生变化，当鼠标移出元素时，先定义的`transition: all 2s ease-out`生效，`backgound-color`和`transform`都发生的变化。

综上所述，在`:hover`处定义的`transition`影响鼠标移入时的过渡效果，在元素内定义的`transition`起到的作用就如开始时提到，使元素的样式从`:hover`时的状态恢复的初始状态，表现为影响鼠标移出时的过滤效果：
{% asset_img hover-on&off.gif hover-on&off %}

**[点击看效果](https://codepen.io/pennySU/pen/WJYKXW)**

## cubic-bezier 函数实现弹跳效果

我们将实现一个小风扇弹跳展开的效果：

{% asset_img cubic-bezier.gif cubic-bezier %}

**[点击看效果](https://codepen.io/pennySU/pen/GdwzBW)**

HTML 结构：

```html
<div class="fan">
  <input type="checkbox" id="checkbox">
  <div class="leaf"></div>
  <div class="leaf"></div>
  <div class="leaf"></div>
  <div class="leaf"></div>
  <div class="leaf"></div>
  <div class="center"></div>
</div>
```

小风扇有 5 个扇叶，一个中心花蕊开关，一个`checkbox`，我们将`checkbox`定位在中心花蕊后面，通过`checkbox`勾选与取消勾选操作控制小风扇的打开与收起：

```css
.fan {
  width: 60px;
  height: 120px;
  position: relative;
}
#checkbox {
  position: absolute;
  width: 40px;
  height: 50px;
  cursor: pointer;
}
.center {
  position: absolute;
  width: 45px;
  height: 50px;
  background-color: #fff;
  border-radius: 50%;
  pointer-events: none;
}
```

扇叶的形状可以通过`border-radius`绘制出来。可以看出扇叶是左右对称的，说明`border-radius`的水平半径是`50%`，其次扇叶上短下长，说明垂直半径上方少，下方长，即可设`border-radius: 50% / 30% 30% 70% 70%`:

```css
border-radius: htl htr hbr hbl / vtl vtr vbr vbl;
```

从效果图中可以看出，扇叶的旋转中心并不是`center center`，而是扇叶上方的中心，已知扇叶宽`60px`，可得旋转中心坐标应为`tranform-origin: 30px 30px`:

```css
.leaf {
  width: 60px;
  height: 120px;
  position: absolute;
  border-radius: 50% / 30% 30% 70% 70%;
  pointer-events: none;
  transform-origin: 30px 30px;
  transition: transform 1s;
}
```

下面设置扇叶旋转的位置，假设第三片扇叶旋转 180° 垂直向上，剩下四片扇叶依次间隔`(360-60)/4=75px`，别忘了这个例子触发过渡效果的方法是`:checked`：

```css
#checkbox:checked ~ .leaf:nth-of-type(5) {
  transform: rotate(35deg);
}

#checkbox:checked ~ .leaf:nth-of-type(4) {
  transform: rotate(105deg);
}

#checkbox:checked ~ .leaf:nth-of-type(3) {
  transform: rotate(180deg);
}

#checkbox:checked ~ .leaf:nth-of-type(2) {
  transform: rotate(255deg);
}

#checkbox:checked ~ .leaf:nth-of-type(1) {
  transform: rotate(325deg);
}
```

到这里，小风扇已经可以旋转了：

{% asset_img fan-rotate.gif fan-rotate %}

现在，只要改变`transition`的`transition-timing-function`就是可以实现弹跳的效果了，在这之前，先了解一下`cubic-bezier`函数：

```css
cubic-bezier(t1, d1, t2, d2)
```

`t`代表时间`time`，`d`代表距离`distance`。

假设由一个盒子要用 6s 的时间，从 A 点移动到 B 点，设`t1=0, d1=1`：

```css
cubic-bezier(0, 1, 0, 0)
```

{% asset_img cubic-bezier-1.gif cubic-bezier-1 %}

从图中可以看出，盒子几乎没有花费任何时间从 A 点到达中点，然后匀速从中点向 B 点移动。

再设`t1=1, d1=0`：

```css
cubic-bezier(1, 0, 0, 0)
```

{% asset_img cubic-bezier-2.gif cubic-bezier-2 %}

从图中可以看出，前 3s 盒子保持不动，然后几乎没有花费任何时间从 A 点到达中点，然后匀速从中点向 B 点移动。

再设`t1=1, d1=1, t2=0, d1=1`：

```css
cubic-bezier(1,1,0,1)
```

{% asset_img cubic-bezier-3.gif cubic-bezier-3 %}

从图中可以看出，盒子用了 3s 的时间从 A 点移动到中点，然后几乎没用任何时间从中点移动到了 B 点。

从上面的例子中可以看出，`t1` `d1`控制 A 点到中点的时间和距离，`t2` `d2`控制中点到 B 点的时间和距离。

弹跳函数`cubic-bezier`的实现：

```css
cubic-bezier(.8,-.5,.2,1.4)
```

{% asset_img cubic-bezier-4.gif cubic-bezier-4 %}

细心的观察，小风扇打开和收起时的弹跳效果并不完全一样，这里需要用到上一节说到的`on and off transition`：

```css
.leaf {
  transition: transform 1s cubic-bezier(0.8, 0.5, 0.2, 1.4);
}
#checkbox:checked ~ .leaf {
  transition: transform 1s cubic-bezier(0.8, -0.5, 0.2, 1.4);
}
```

为小风扇设置两个`transition`，打开的时候先收缩一下。

# Animation

# 参考文献

1.  **[USING CSS3 TRANSITIONS: A COMPREHENSIVE GUIDE](https://www.adobe.com/devnet/archive/html5/articles/using-css3-transitions-a-comprehensive-guide.html)**
2.  **[All you need to know about CSS Transitions](https://blog.alexmaccaw.com/css-transitions)**
3.  **[MDN CSS Transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Transitions)**
4.  **[CSS TRICKS transition-timing-function](https://css-tricks.com/almanac/properties/t/transition-timing-function/)**
5.  **[Maintaining CSS Style States using “Infinite” Transition Delays](http://joelb.me/blog/2012/maintaining-css-style-states-using-infinite-transition-delays/)**
6.  **[CSS3 Animation – Creating a Fan-Out With Bounce Effect Using Bezier Curve](https://www.hongkiat.com/blog/css3-fan-out-bounce-effect-animation/)**
