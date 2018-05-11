---
title: Transform & Transition & Animation & Web Animations Api
date: 2018-05-11 15:10:20
tags:
- CSS3
- Transform 
- Transition
- Animation
- Web Animations Api
---
这篇文章不会详细介绍每个属性，它将作为一部快速指南，主要想介绍这些很棒的属性是如何帮我们呈现更面向用户的内容，如何帮我们省去抠图的。
<!--more-->

# Transform
`transform`形变属性，它可以对元素同时进行倾斜（skew）、旋转（rotate）、位移（translate）、缩放（scale）操作。

## skew
`skew()`、 `skewX()` 、`skewY()`。**[点击看效果](https://codepen.io/pennySU/pen/jxxEqX)**
```css
.item{
    transform: skewX(25deg);
}
```
{% asset_img skew.png skew %}

## rotate
`rotate()`、 `rotateX()`、 `rotateY()`、 `rotateZ()`。**[点击看效果](https://codepen.io/pennySU/pen/NMMPZZ)**
```css
.item{
    transform: rotate(25deg);
}
```
{% asset_img rotate.png 500 rotate %}

## translate
`translate(x, y)` 、`translateX()` 、`translateY()` 、`translateZ()`。 
```css
.item{
    transform: translate(-50%, -50%);
}
```
1. **[居中](https://codepen.io/pennySU/pen/yjjJLP)**
2. **[hover效果](https://codepen.io/pennySU/pen/JvvYox)**

{% asset_img translate.png 500 hover时卡片向上移动 %}

## translate3d
`translate3d(x,y,z)`。


# Transition

# Animation

# Web Animations Api

# 参考文献
1. **[CSS-TRICKS transform](https://css-tricks.com/almanac/properties/t/transform/)**
2. **[MDN transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)**
