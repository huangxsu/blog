---
title: Grid Layout
date: 2018-05-02 17:46:36
tags:
- CSS3
- Grid
- Layout
---
本文通过阅读文献，总结 `grid layout` 基本语法与实践应用。

Grid布局，是一个二维系统，可以同时对行和列进行设置，值得我们去学习。

<!-- more -->

# 基础和浏览器支持
需要给容器元素设置`display: grid`来创建一个网格布局，使用`grid-template-columns` 和 `grid-template-rows`属性为网格添加行和列，使用`grid-column`和`grid-row`属性将子元素放置到网格布局的某个或某些格子里。

根据**[Caniuse](https://caniuse.com/#feat=css-grid)**的数据，Chrome、火狐、Safari、Opera都已经支持CSS3 Grid布局，IE支持带有`-ms-`前缀的语法。

# 重要的术语
## Grid Container 容器
被设置`display:grid`的元素，如下，`.container`就是grid容器。
```html
<div class="container">
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
</div>
```
## Grid Item 项目
Grid容器的直系子元素，如下，`.item`是grid项目，`sub-item`就不是了。
```html
<div class="container">
    <div class="item">
        <div class="sub-item"></div>
    </div>
    <div class="item"></div>
    <div class="item"></div>
</div>
```
## Grid Line 线
一条条横竖相交的分界线构成网格，如下，黄色的线是网格中一条竖线。

{% asset_img slug grid-line.png grid-line %}

## Grid Track 轨道
轨道是什么？在现实生活中，轨道可以是两条平行的铁轨，而在grid布局中，轨道指的是两条相邻的网格线，比如行或列。如下，黄色区域（第二行）是第二、三条横线组成的轨道。

{% asset_img slug grid-track.png grid-track %}

## Grid Cell 格
网格中的格子。两条相邻行和两条相邻列之间区域。

{% asset_img slug grid-cell.png grid-cell %}

## Grid Area 区域
由四条网格线（两条横线、两条竖线）环绕形成的区域，可能会包含多个网格。

## Grid Gutters 栏距
网格线的大小，也可以理解为行与行或列与列之间的距离。`grid-row-gap`和`grid-column-gap`，简写：`grid-gap`。

{% asset_img slug grid-area.png grid-area %}

# CSS Grid Layout
## 定义一个网格布局  
HTML结构：
```html
<div class="wrapper">
    <div class="box a">A</div>
    <div class="box b">B</div>
    <div class="box c">C</div>
    <div class="box d">D</div>
    <div class="box e">E</div>
    <div class="box f">F</div>
</div>
```
第一步，为容器元素`.wrapper`声明grid布局：
```css
.wrapper{
    display: grid;
}
```
第二步，为网格设置行和列：
```css
.wrapper{
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: auto auto;
    grid-gap: 10px;
}
```
以上，我们创建了一个2行3列、栏距为10px的网格。**[点击看效果](https://codepen.io/pennySU/pen/rvYaLG)**

第三步，将`.a`元素放置到网格的最后个格子中：
```css
.a{
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 2;
    grid-row-end: 3;
}
```
我们可以用`gird-column`和`grid-row`对上面的写法进行简写，第一个值代表`start`，第二代表`end`：
```css
.a{
    grid-column: 3 / 4;
    grid-row: 2 / 3;
}
```
上面的写法还可以继续简写：`grid-area: grid-row-start grid-column-start grid-row-end grid-column-end`, “上左下右”：
```css
.a{
    grid-area: 2 / 3 / 3 / 4;
}
```
这种简写方式没有`gird-column`和`grid-row`易懂。
第四步，在第一步中，我们创建了6个100px宽的格子，现在将`.f`的放置到第一个网格（**[点击看效果](https://codepen.io/pennySU/pen/zjPxRa)**）：
```css
.a {
    grid-column: 3 / 4;
    grid-row: 2 / 3;
}
.f {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
}
```
在网格布局中，子元素的顺序不会有影响。

## span关键字
`span`可以代替结束网格线, `span <number>|<name>`表示跨越 `number` 个网格线或者延展到名字为 `name`的网格线处。  **[点击看效果](https://codepen.io/pennySU/pen/GdOZMW)**
```css
.a{
    grid-column: 1 / span 2;
    grid-row: 1;
}
.b{
    grid-column: 3;
    grid-row: 1 / span 2;
}
.c{
    grid-column: 1;
    grid-row: 2;
}
.d{
    grid-column: 2;
    grid-row: 2;
}
```
我们省略了 `.c` 行和列的结束网格线，当元素只占据一个网格时，可以省略。`span 1` 是默认值。

## fr单位
fr单位是grid布局中出现的新的单位，使用fr，可以创建弹性网格，并且不需要我们手动计算宽度，fr代表了平分可用空间的一份 `fraction`。更多关于 `fr` 的介绍可**[学习](https://css-tricks.com/introduction-fr-css-unit/)**。
```css
.wrapper{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 10px;
}
```
**[点击看效果](https://codepen.io/pennySU/pen/ZovzyM)**

## repeat方法
repeat()是 `grid-template-columns` 和 `grid-template-rows`的一个属性，上面的例子中 `grid-template-columns` 有3个 `1fr` 值，可以通过repeat语法重新声明：
```css
.wrapper{
    grid-template-columns: repeat(3, [col-start] 1fr [col-end]);
}
```

# 在网格上放置内容
## 有名字的网格线
继续以上面的例子为例：
```css
.wrapper{
    display: grid;
    grid-template-columns: [col1-start] 100px [col1-end col2-start] 100px [col2-end col3-start] 100px [col3-end];
    grid-template-rows: [row1-start] auto [row1-end];
    grid-gap: 10px;
}
```
在`grid-template-columns`的定义中，我们先命名了第一条线`col1-start`，然后定义`100px`的网格轨道`grid track`，第二条线有两个名字`col1-end`和`col2-start`。
使用命名网格线的方式将`.a`和`.f`的位置互换：
```css
.a{
    grid-column: col3-start;
    grid-row: row2-start
}
.f{
    grid-column: col1-start;
    grid-row: row1-start;
}
```
命名网格线的好处是不用刻意去考虑线条的数字位置，例如，可以定义`side-bar-start`和`side-bar-end`，位于这两条线之间的为侧边栏区域。

## Grid Template Area
HTML结构：
```html
<div class="wrapper">
    <div class="box header">Header</div>
    <div class="box sidebar">Sidebar</div>
    <div class="box content">Content</div>
    <div class="box footer">Footer</div>
</div>
```
定义命名区域：
```css
.wrapper{
    display: grid;
    grid-template-columns: 200px 200px 200px;
    grid-template-rows: auto;
    grid-gap: 0  10px;
    grid-template-areas: 
        "header header header"
        "sidebar content content"
        "footer footer footer";
}
```
`.`代表一个空的格子。
`grid-area`属性可以引用被定义的区域：
```css
.header{ grid-area: header; }
.sidebar{ grid-area: sidebar; }
.content{ grid-area: content; }
.footer{ grid-area: footer; }
```
**[点击看效果](https://codepen.io/pennySU/pen/odozRr)**
## 使用grid-template-area实现三栏布局
实现效果如图：
{% asset_img slug grid-nested.png grid-nested %}
HTML结构：
```html
<div class="wrapper">
    <header class="mainheader">
        <h1>Excerpts from the book <em>The Bristol Royal Mail</em></h1>
    </header>
    <article class="content">
        <h1>...</h1>
        <div class="primary"><p>....</p></div>
        <aside><p>...</p></aside>
    </article>
    <footer class="mainfooter"><p>...</p></footer>
</div>
```
一个容器 `div.wrapper` 包含一个 `header` ，一个`article` ，一个`footer`元素。 `article`元素包含一个 `h1` `div` `aside`。
```css
.wrapper {
    display: grid;
    width: 90%;
    margin: 0 auto 0 auto;
    grid-template-columns: 9fr 40px 3fr;
    grid-template-rows: auto;
    grid-template-areas:
        "header header header"
        "content . sidebar"
        "footer footer footer";
 }
```
我的网格有三列：一个占9单位的列、一个40px的栏距列、一个占3单位的列。
```css
.mainheader { grid-area: header; }
.content { grid-area: content; }
.sidebar { grid-area: sidebar; }
.mainfooter { grid-area: footer; }
```
用同样的方法， 设置`article`元素为三列网格布局:
```css
.content {
    display: grid;
    grid-template-columns: 9fr 40px 3fr;
    grid-template-rows: auto;
    grid-template-areas:
        "chapterhead . ." 
        "article-primary . article-secondary"; 
}
.content .primary { grid-area: article-primary; }
.content aside { grid-area: article-secondary; }
.content > h1 { grid-area: chapterhead; }
```
从这个例子看，嵌套grid完全独立于外部的grid布局。`.content`位于`.wrapper`布局中，但是其子元素的grid布局受`.content`直接影响。**[点击看效果](https://codepen.io/pennySU/pen/rvYmqE)**

# 控制格子的大小
## minmax方法
`minmax` 方法可以定义格子的最小值和最大值。**[点击看效果](https://codepen.io/pennySU/pen/YLYzKN)**
```css
.wrapper{
    display: grid;
    grid-template-columns: minmax(200px,250px) 1fr 1fr;
    grid-auto-rows: minmax(60px, auto);
    grid-gap: 10px;
}
```
## auto-fill和auto-fit关键字
`auto-fill` 和 `auto-fit` 是 `repeat` 方法的两个属性，可以使用这两个属性自动填充网格的列。更多关于 `auto-fill` 和 `auto-fit` 的介绍可**[学习](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/)**。
```css
.grid-container--fill {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.grid-container--fit {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```
{% asset_img slug auto-fill&auto-fit.png auto-fill&auto-fit %}
从图中可以看出， 当视口的宽度可以容纳多余的列时，`auto-fill` 和 `auto-fit`的区别是：

`auto-fill` 会尽可能多的创建列去填充一整行，所以可能会创建出多余的空列，即隐式的列。

`auto-fit`  将现有的列延展使它们可以填充满一整行。

其他情况，二者几乎无差别。**[点击看效果](https://codepen.io/pennySU/pen/deJPKw)**

## min-content/max-content关键字和fit-content方法
```css
.min-content {
  grid-template-columns: min-content 100px 100px;
}
.max-content {
  grid-template-columns: max-content 100px 100px;
}
.fit-content {
  grid-template-columns: fit-content(10em) 100px 100px;
}
```
`min-content` ： 代表格子内容可以占据的最小空间

`max-content` ： 代表格子内容可以占据的最大空间

`fit-content` ： 返回公式`min(max-content, max(auto, argument))` 的值，其中 `auto`代表 `auto`最小值。目前还处于实验阶段。**[点击看效果](https://codepen.io/pennySU/pen/jxYbGR)**

# Grid布局与响应式
继续以上面提到的三列布局的例子为例，通过媒体查询重新定义 `grid-template-area`，内容的布局展示通过引用 `grid-area` 实现。
```css
.mainheader { grid-area: header; }
.content { grid-area: content; }
.sidebar { grid-area: sidebar; }
.mainfooter { grid-area: footer; }
.content .primary { grid-area: article-primary; }
.content aside { grid-area: article-secondary; }
.content > h1 { grid-area: chapterhead; }
```
在断点460px时，定义网格布局，为1栏布局：
```css
@media only screen and (min-width: 460px) {
  .wrapper {
    display: grid;
    width: 90%;
    margin: 0 auto;
    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-template-areas:
      "header"
      "sidebar"
      "content"
      "footer";
  }
  .content {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-template-areas:
      "chapterhead"
      "article-primary"
      "article-secondary";
  }
  article aside {
    font-size: 0.75em;
  }
}
```
在断点700px时，定义 `.wrapper`容器为两栏布局， `.content`依然为一栏布局不变：
```css
@media only screen and (min-width: 700px) {
  .wrapper {
    grid-template-columns: 9fr 3fr;
    grid-template-rows: auto;
    grid-template-areas:
      "header header"
      "content sidebar"
      "footer footer";
    grid-gap: 0 40px;
  }
}
```
在断点980px是，定义 `.content` 为两栏布局：
```css
@media only screen and (min-width: 980px) {
  .content {
    grid-template-columns: 9fr 3fr;
    grid-template-rows: auto;
    grid-template-areas:
      "chapterhead ."
      "article-primary article-secondary";
    grid-gap: 0 40px;
  }
  article aside {
    font-size: 100%;
  }
}
```
实现响应式布局变得轻松起来！**[点击看效果](https://codepen.io/pennySU/pen/rvYmqE)**

# Gird & Flex
面对 `grid` 和 `flex`，该如何选择，让我们看看一下 Tab Atkins 的精彩回答：
>Flexbox is for one-dimensional layouts—anything that needs to be laid out in a straight line (or in a broken line, which would be a single straight line if they were joined back together). 
>Grid is for two-dimensional layouts. It can be used as a low-powered flexbox substitute (we’re trying to make sure that a single-column/row grid acts very similar to a flexbox), but that’s not using its full power.
>Flexbox is appropriate for many layouts, and a lot of “page component” elements, as most of them are fundamentally linear. Grid is appropriate for overall page layout, and for complicated page components which aren't linear in their design.
>The two can be composed arbitrarily, so once they're both widely supported, I believe most pages will be composed of an outer grid for the overall layout, a mix of nested flexboxes and grid for the components of the page, and finally block/inline/table layout at the “leaves” of the page, where the text and content live.

*From* Tab Atkins, May 6, 2013 

`Flex` 属于一维布局，适用于许多布局，以及线性的页面组件。 `Grid` 属于二维布局，主要用于整个页面布局，以及非线性的复杂的页面组件。

让我们来实现一个 `Grid` 和 `Flex` 结合使用的网页布局，**[点击看效果](https://codepen.io/pennySU/pen/odpLqw)**，效果如图：
{% asset_img slug grid&flex.png grid&flex %}
这个布局共有五个部分组成：头、左侧大图、右侧简介、图片列表、尾部组成。整体布局以及响应式布局变化可以使用 `Grid`布局；头、图片列表属于线性布局，可以使用 `Flex`布局轻松实现。
部分代码片段：
```css
    .mainheader{
      grid-area: header;
      margin-bottom: 20px;
    }
    .feature-pull{grid-area: featurepull;}
    .feature{grid-area: feature;}
    .gallery{grid-area: secondary;}
    .mainfooter{grid-area: footer;}
    
    .wrapper{
      display: grid;
      width: 90%;
      margin: 0 auto;
      grid-template-columns: auto;
      grid-template-rows: auto;
      grid-template-areas:"header" "feature" "featurepull" "secondary" "footer"
    }
    .mainheader ul{
      display: flex;
    }
    .mainheader li{
      margin-right: 10px;
    }
    .gallery{
      display: flex;
      margin: 20px 0;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .gallery li{
      width: 45%;
      margin-bottom: 20px;
    }
```
# Grid 属性目录表
| Grid Container | Grid Items |
| -------------- | ---------- |
| display       | grid-column-start       |
| grid-template-columns   | grid-column-end        |
| grid-template-rows   | grid-row-start        |
| grid-template-areas   | grid-row-end        |
| grid-template   | grid-column        |
| grid-column-gap   | grid-row        |
| grid-row-gap   | grid-area        |
| grid-gap   | justify-self        |
| justify-items   | align-self        |
| align-items   | place-self        |
| justify-content   |   ---      |
| align-content   |      ---   |
| grid-auto-columns   |   ---      |
| grid-auto-rows   |    ---     |
| grid-auto-flow   |     ---    |
| grid   |     ---     |
# 参考文献
1. **[A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid)**
2. **[An Introduction to the \`fr\` CSS unit](https://css-tricks.com/introduction-fr-css-unit/)**
3. **[Auto-Sizing Columns in CSS Grid: \`auto-fill\` vs \`auto-fit\`](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/)**
4. **[Grid repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/repeat)**
5. A great grid learning website **[Grid by Example](https://gridbyexample.com/learn/)**
6. Rachel Andrew's awesome book **[ Get Ready for CSS Grid Layout](https://abookapart.com/products/get-ready-for-css-grid-layout)**