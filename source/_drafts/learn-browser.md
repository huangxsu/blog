---
title: 浏览器的二三事儿
tags: Browser
---

互联网的诞生，给我们的生活带来了巨大的变化，主要的原因是：信息的流通。浏览器在这个过程中承担了重要的角色，因为它可以用来检索、展示文字、图片、影音等丰富的信息资源。今天，我们来了解一下浏览器是如何工作的。

<!--more-->

# 一道经典面试题

先来看一道很经典的面试题：“从输入 URL，到页面加载完成的过程中，都发生了什么？”。大家可能都知道这道题的答案，现在我们在脑海中思考几秒钟，然后一起看看如何作答... ...

经过刚才的思考，现在让我们一起看看网上的其中一种解答 **[从输入 URL 到页面加载完成的过程](https://yuchengkai.cn/docs/cs/#%E4%BB%8E%E8%BE%93%E5%85%A5-url-%E5%88%B0%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E5%AE%8C%E6%88%90%E7%9A%84%E8%BF%87%E7%A8%8B)** :

1. 首先做 DNS 查询，如果这一步做了智能 DNS 解析的话，会提供访问速度最快的 IP 地址回来 (?什么是智能 DNS 解析)
2. 接下来是 TCP 握手，应用层会下发数据给传输层，这里 TCP 协议会指明两端的端口号，然后下发给网络层。网络层中的 IP 协议会确定 IP 地址，并且指示了数据传输中如何跳转路由器。然后包会再被封装到数据链路层的数据帧结构中，最后就是物理层面的传输了 （？TCP 三次握手 四次挥手）
3. TCP 握手结束后会进行 TLS 握手，然后就开始正式的传输数据 （？TLS 和 SSL 的区别 https）
4. 数据在进入服务端之前，可能还会先经过负责负载均衡的服务器，它的作用就是将请求合理的分发到多台服务器上，这时假设服务端会响应一个 HTML 文件 （？负载均衡服务器）
5. 首先浏览器会判断状态码是什么，如果是 200 那就继续解析，如果 400 或 500 的话就会报错，如果 300 的话会进行重定向，这里会有个重定向计数器，避免过多次的重定向，超过次数也会报错 （？重定向次数 HTTP 状态码）
6. 浏览器开始解析文件，如果是 gzip 格式的话会先解压一下，然后通过文件的编码格式知道该如何去解码文件 (?HTTP 首部字段)
7. 文件解码成功后会正式开始渲染流程，先会根据 HTML 构建 DOM 树，有 CSS 的话会去构建 CSSOM 树。如果遇到 script 标签的话，会判断是否存在 async 或者 defer ，前者会并行进行下载并执行 JS，后者会先下载文件，然后等待 HTML 解析完成后顺序执行，如果以上都没有，就会阻塞住渲染流程直到 JS 执行完毕。遇到文件下载的会去下载文件，这里如果使用 HTTP 2.0 协议的话会极大的提高多图的下载效率。 （？http2.0 defer 和 async）
8. 初始的 HTML 被完全加载和解析后会触发 DOMContentLoaded 事件 （？DOMContentLoaded 和 onload）
9. CSSOM 树和 DOM 树构建完成后会开始生成 Render 树，这一步就是确定页面元素的布局、样式等等诸多方面的东西
10. 在生成 Render 树的过程中，浏览器就开始调用 GPU 绘制，合成图层，将内容显示在屏幕上了

这份解答中的第 7 点到最后一点覆盖了今天我们将了解的内容。

# 常用的浏览器

{% asset_img StatCounter-browser-ww-monthly-201712-201812.png 各个浏览器市场占有率 %}

> 图片来源于： **[http://gs.statcounter.com/browser-market-share](http://gs.statcounter.com/browser-market-share)**

上面图表中的数据，展示了在全世界范围，2017 年 12 月至 2018 年 12 月，各个浏览器，在各个平台（手机、PC、平板等）的总市场占有率，chrome 以超过 50%的占有率位居第一位，safari 排名第二，UC 浏览器排名第三。

我们来看看我国各浏览器的情况。

首先 PC 端：chrome 浏览器位居榜首，占比约 63%，其次是 QQ 浏览器，占比约 7.73%，IE 占比 7.16%，搜狗 6.61%，火狐 4.78%已经 Edge3.68%。

{% asset_img StatCounter-browser-CN-monthly-201712-201812.png 中国PC端浏览器市场占有率 %}

然后手机端：chrome 依然位居榜首，41.82%，UC 浏览器排名第二，21.81%，Safari 16.78%，QQ 浏览器 12.87%，Android 原生浏览器 5.35%。

{% asset_img StatCounter-browser-CN-monthly-201712-201812(1).png 中国手机端浏览器市场占有率 %}

最后是平板端：Safari 以 69.56%的高占有率位居第一，安卓原生浏览器 11.92%，UC 浏览器 10.14%，chrome 5.62%，QQ 浏览器 1.36%。

{% asset_img StatCounter-browser-CN-monthly-201712-201812(2).png 中国平板端浏览器市场占有率 %}

作为开发者，我们首选 chrome 浏览器，但是作为用户，浏览器的选择是一种很个性的行为。开发之余，我们还需要清楚，哪些浏览器，在哪里平台上的，是我们需要支持的，并且测试通过的。

国外常见浏览器内核与 JS 引擎：

1. Chrome (engine: Blink + V8)
2. Firefox (engine: Gecko + SpiderMonkey)
3. Internet Explorer (engine: Trident + Chakra)
4. Safari (engine: Webkit + SquirrelFish)

国内常见浏览器基本上是多核的，所以有两种模式切换：兼容模式和极速模式。

1. QQ 浏览器 Trident+Webkit (Blink)
2. UC 浏览器 Trident+Webkit (Blink)
3. 搜狗高速浏览器 Trident+Webkit (Blink)
4. 360 安全浏览器 Trident+Webkit (Blink)
5. 猎豹浏览器 Trident+Webkit (Blink)

WebKit 是 Apple 公司在 2005 年开源的一个内核，Apple 公司早期使用的引擎是 KHTML 在 KHTML 基础之上创建了 WebKit 内核。 在 2008 年，Google 发布 Chrome 浏览器，采用的也是 Webkit 内核，后基于 WebKit 开发了 Blink 内核，Blink 在 Webkit 的基础上加入多进程，沙箱等很多技术。

# 浏览器架构

在开始研究浏览器架构之前，我们先了解一下进程（Process）和线程（Thread）。进程可以被看做是一个应用的执行程序，线程存在于进程内部，可以执行任何分解的任务。

当我们启动一个应用时，会创建一个进程，是否创建线程来辅助工作是可选的。操作系统（Operating System）为进程提供一块内存，该应用的状态会被保存在这个专用内存空间中。当关闭应用程序时，进程也会消失，操作系统会释放内存。

进程可以请求操作系统再启动其他的进程去执行不同的任务，这时操作系统会为新的进程再分配一块内存。两个进程之间可以通过 **进程间通信** 技术，Inter-Process Communication ,简称 **[IPC](https://zh.wikipedia.org/wiki/%E8%A1%8C%E7%A8%8B%E9%96%93%E9%80%9A%E8%A8%8A)**,进行通信。

那么浏览器是由几个进程，哪些线程构建的呢？实际上是没有一个没明确的标准的。一个浏览器，可能由一个进程和多个线程构建，也可能由多个进程和几个线程构建。本文将以 chrome 浏览器为基础，学习浏览器的工作原理，我们先来看看 chrome 的基本架构，如下图所示：

{% asset_img browser-arch2.png chrome 多进程架构 %}

> 图片来源： **[https://developers.google.com/web/updates/2018/09/inside-browser-part1#browser-architecture](https://developers.google.com/web/updates/2018/09/inside-browser-part1#browser-architecture)**

chrome 是一个多进程架构浏览器，在资源允许时，它会为每一个 tab 页面创建独立的进程。我们看到上图中 Renderer Process 下面画了好多层，表示 chrome 为每个选项卡运行了多个 Renderer Processes。那么每个进程是控制什么的？下面的表格，说明了每个进程的作用：

| 进度              | 描述                                                           |
| ----------------- | -------------------------------------------------------------- |
| Browser（浏览器） | 控制浏览器的地址栏、书签、前进后退按钮，以及网络请求和文件访问 |
| Renderer（渲染）  | 控制用来展示网页的选项卡中的所有内容                           |
| Plugin （插件）   | 控制网站中使用的插件，如：Flash                                |
| GPU               | 处理 GPU 任务                                                  |

除了上面提到的这些，还有很多其他的进程，比如 扩展进程、实用进程等。我们可以通过点击浏览器右上角的三个垂直排列的黑点，选择 更多工具，再选择 任务管理器，快捷键 shift + ESC，浏览器会打开一个新的窗口，展示当前我们的浏览器所运行的所有进程，占用的 CPU/内存大小。

多进程的架构意味着，每个进程有自己独立的内存，无法像单进程多线程那样的架构一样，共享公共的部分，为了节省内存，chrome 对启用的进程数量是有限制的，这个限制取决于我们设备的内存和 CPU 功耗，当进程数达到限制时，chrome 便将来自同一个站点的多个选项卡，用一个进程运行。

目前，Chrome 正在进行体系结构的更改，将浏览器程序的每个部分作为独立一项服务运行，从而可以轻松拆分为不同的进程或汇总为一个进程。大概的思路是，当 Chrome 运行在非常强大的硬件上，它会把每个服务拆分成一个进程，以提供更稳定的服务，当运行在资源有限的设备上是，它会把所有的服务整合到一个进程中，以便节省内存占用。

{% asset_img servicfication.png %}

> 图片来源： **[https://developers.google.com/web/updates/2018/09/inside-browser-part1#browser-architecture](https://developers.google.com/web/updates/2018/09/inside-browser-part1#browser-architecture)**

还有一点值得注意的是，网站隔离，它是 Chrome 中最近推出的一项功能，可为每个跨网站 iframe 运行单独的渲染器进程。

{% asset_img isolation.png %}

# Browser 进程

Browser process。浏览器进程，拥有 UI 线程，负责绘制浏览器上的按钮和输入区域；network 线程，负责接收网络返回的数据；storage 线程，负责控制文件访问等。当我们在地址栏输入 URL 时，浏览器进程的 UI 线程负责处理我们的输入。

{% asset_img browserprocesses.png %}

当我们在地址栏输入内容，然后回车后，会发什么？

第一步：

当你在地址栏输入时，UI 线程会先判断你输入的是一个搜索查询还有一个 URL，然后决定是转到搜索引擎还是到你想要访问的网站。

{% asset_img input.png %}

第二步：
当你敲击回车时，UI 线程向 network 线程发起一个网络请求，选项卡上展示出 loading 图标，network 线程使用合适的协议为请求建立连接。

{% asset_img navstart.png %}

此时，network 线程可能接收到一个 301 状态的返回，这时 network 线程将通知 UI 线程服务器请求重定向，然后再重新发起另一个请求。

第三步：

一旦有响应数据回来，浏览器将触发安全检测，如果域和响应数据与已知的恶意站点匹配，network 线程会发出警告显示警告页面。如果检测通过，返回的是一个 html 文件，network 线程会通知 UI 线程，数据就绪，UI 线程会找一个 renderer 进程继续渲染页面。

有时网络请求会等待几百毫秒的时间得到响应，为了优化此过程，在 network 线程发起请求的同时，UI 线程已经开始寻找一个 renderer 进程，当响应回来时，renderer 进程已经准备就绪了。

{% asset_img commit.png %}

第四步：

renderer 进程继续接收 HTML 数据，开始文档加载阶段。此时地址栏更新，显示安全指示器；该选项卡的会话历史会被记录，当点击前进后退按钮时会展示该网站；为了便于在关闭选项卡或窗口时进行选项卡/会话还原，会话历史记录将存储在磁盘上。

第五步：

当 renderer 进程完成渲染，并且页面中所有的资源都加载完成后，会向 browser 进程发送一个 IPC，触发`onload`事件。

{% asset_img loaded.png %}

# Renderer 进程

{% asset_img renderer.png %}

Renderer 进程的主要工作是将 HTML,CSS 和 JavaScript 转换成用户可交互的页面。

{% asset_img browser-diagram-full-2.png 700 %}

> 图片来源： https://hacks.mozilla.org/2017/05/quantum-up-close-what-is-a-browser-engine/

## 解析 Parsing

创建 DOM

当 renderer 进程开始接收 HTML 数据时，renderer 进程中的主线程就开始将 html 解析成文档对象模型，DOM，解析由两个阶段组成：标记化和树构建。

{% asset_img dom.png %}

HTML 规范有容错机制，我们在浏览 HTML 网页时从来不会看到“语法无效”的错误。这是因为浏览器会纠正任何无效内容，然后继续工作。

一个网站通常包含 CSS、JS、图片等额外的资源，当主线程在解析 HTML 构建 DOM 时，遇到额外资源便会去请求，浏览器对加载这些额外资源进行了优化，在解析的同时，启动“预加载扫描器（preload scanner）”，预加载扫描器将查看 HTML 解析生成的标签，遇到`<img>`或者`<link>`等需要加载的子资源时，会提前发送请求去得到资源。

当 HTML 解析器解析到`<script>`标记时，它会暂停解析 HTML 文档，并且必须加载，解析和执行 JavaScript 代码。因为 JavaScript 可以使用像 document.write（）改变整个 DOM 结构。

有一些方式合理提示浏览器更合理的加载资源。如果你的 js 没有使用`document.write()`，可以在`<script>`标签上使用`defer`或者`async`属性。`<link rel="preload">`可以提醒浏览器尽可能早的的加载这个资源

{% asset_img legend.svg %}

`<script>`

{% asset_img script.svg %}

`<script async>`

{% asset_img script-async.svg %}

`<script defer>`

{% asset_img script-defer.svg %}

当 HTML 解析完毕时（子资源不一定加载完毕），会触发`DOMContentLoaded`事件。

## 计算样式 Style Calculation

主线程解析 CSS 文件，根据 css 选择器，自右向左，确定每个 DOM 节点的样式，如果没有 CSS，会使用浏览器默认样式。请见 **[为什么 CSS 选择器解析的时候是从右往左？](https://segmentfault.com/q/1010000000713509)**

{% asset_img computedstyle.png %}

由于 css 选择器自右向左解析，最右边的选择器应更具体一些，以提高浏览器解析 CSS 的效率。

## 布局 Layout

主线程遍历 DOM 和计算样式生成布局树，layout tree。布局树包含坐标信息和边界框大小。布局树和 DOM 树可能并不是一一对应的，`display:none`的元素不包含在布局树当中，伪元素会被包含在布局树种，但是不存在与 DOM 树。

{% asset_img layout.png %}

## 绘制 Paint

尽管我们已经有了 DOM、样式和布局信息，但是我们还是无法渲染出页面，因为我们还无法确定绘制的顺序：

{% asset_img drawgame.png %}

因此，主线程会遍历布局树生成绘制记录，绘制记录是对绘制过程的一种描述，如：“背景优先，然后是文本，然后是矩形”。

{% asset_img paint.png %}

在渲染过程中，每一步的结果，都是以上一步为基础得到的。如果布局树中的某些内容发生更改，则需要对变化的部分重新生成绘制记录。

## 合成 Compositing

现在浏览器知道文档的结构，每个元素的样式，页面的形状和绘制顺序，它是如何把页面画出来呢？将这些信息转换为屏幕上的像素称为栅格化（rasterizing）。

最容易想到的，绘制页面的方法是，先绘制部分在视口中的内容，当滚动页面时，再绘制剩余的部分。然而，现代浏览器使用了一种更为精细的方法，合成。

合成主要做的是，将页面分成不同的图层（layers），分别栅格化各个层，然后通过合成器线程（compositor thread）组合成一个页面。当滚动时，图层已经被栅格化了，只需合成即可。

主线程将遍历布局树，生成图层树（layer tree），以确定元素位于哪个图层。

{% asset_img layer.png %}

一旦创建了图层树，确定了绘制顺序，主线程就会将该信息提交给合成器线程。合成器线程开始栅格化每个图层。一个图层可能有整个页面长度一样大，因此合成器线程将它们分成小图块，然后将每个图块发送到光栅线程（raster threads）。栅格线程栅格化每个图块，并存储在 GPU 内存中。合成器线程会优先将视口中的内容栅格化。

分层会保存每个层的信息，占用更多的内存，那么为什么要分层，分层有什么意义？ 请见 **[坚持仅合成器的属性和管理层计数](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)**。

{% asset_img frame-no-layout-paint.jpg %}

我们知道，应该避免重排、重绘，因为会造成性能问题，尤其是在移动端，性能较差的情况。如果能不重排重绘，直接合成，是性能是最佳的。 使用`transform`或者`opacity`来改变动画就能避免重排和重绘，前提是属性所在的元素处在自身的一个层里。请见 **[What forces layout / reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)**

使用 `will-change` 或 `translateZ` 可以提升移动的元素，但是避免过度使用提升规则；各层都需要内存和管理开销。

可以创建新层的方法：

- Using 3D or perspective transforms properties
- Using animated 2D transforms or opacity properties
- An element is on top or a child of a compositing layer
- Using accelerated CSS filters
- Embedding `<video>`, `<canvas>`, plugins like Silverlight or Flash (in special cases)

# 用户输入事件处理 Input Events

从浏览器的角度来看，输入意味着来自用户的任何手势。鼠标滚轮滚动是输入事件，触摸或鼠标移动也是输入事件。

当你触摸屏幕时，浏览器进程是首先接收手势的进程。但是，浏览器进程只知道该手势发生的位置，因为选项卡内部的内容由呈现器进程处理。因此，浏览器进程将事件类型（如 touchstart）及其坐标发送到渲染器进程。

在呈现器进程中，由合成器线程负责接收事件和坐标，接收事件后，合成器线程拿着坐标位置，在之前生成的绘制记录里，寻找该坐标位置下是什么元素，也就是 event target，这个过程叫做：hit test。

找到 event target 之后，合成器线程将把事件发生给主线程，主线程执行事件监听函数。此时合成器线程必须等待函数执行，因为有些事件是可以 preventDefault 的，比如`touchmove`，合成器并不知道，只有等函数执行完，才能确定是否继续合成。

那么问题来了，浏览器是如何知道哪些事件需要被处理的？

我们知道，运行 js 是主线程的工作，当页面合成时，合成器线程会将有事件绑定的区域标记为“Non-Fast Scrollable Region”，非可快速滚动区域，这样，如果输入事件是发生在非可快速滚动区域时，合成器线程将会把事件发给给主线程，否则，合成器线程可以直接进行新的合成，无需等待。

{% asset_img nfsr1.png  %}

试想，如果我们将事件绑定到 body 上，有什么效果：

```js
document.body.addEventListener('touchstart', event => {
  if (event.target === area) {
    event.preventDefault()
  }
})
```

整个页面被标记为“Non-Fast Scrollable Region”，每次有事件发生时，合成器线程都需要与主线程进行通信，即使触发事件的对象并不是我们需要关注的，每次事件发生时，合成器都需要进行 hit test，并且需要等待函数执行完毕，这是很消耗性能的。

{% asset_img nfsr2.png %}

通过`passive:true`参数，可以提示浏览器，合成器可以不用等待，直接继续合成。请见 **[Improving Scroll Performance with Passive Event Listeners](https://developers.google.com/web/updates/2016/06/passive-event-listeners)**

```js
document.body.addEventListener(
  'touchmove',
  event => {},
  { passive: true }
)
```

不是所有的事件都可以 preventDefault，我们可以通过 event.cancelable 判断事件是否可以取消默认事件。

我们知道，大多数浏览器的刷新率为每秒 60 次。而触摸屏设备每秒可触发 60-120 次触摸事件。

假设一个连续事件，如 touchmove，每秒发送 120 次到主线程 1，那么与屏幕刷新的速度相比，它会进行多余的 hit test 和 js 执行。

{% asset_img rawevents.png %}

浏览器会对这种连续事件（wheel, mousewheel, mousemove, pointermove, touchmove）进行优化，它会将连续事件进行合并，并且延迟到`requestAnimationFrame`（下一次重绘之前）之前再执行。

{% asset_img coalescedevents.png %}

# 参考文献

1. **[interViewMap](https://yuchengkai.cn/docs/cs/#%E4%BB%8E%E8%BE%93%E5%85%A5-url-%E5%88%B0%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E5%AE%8C%E6%88%90%E7%9A%84%E8%BF%87%E7%A8%8B)**
2. **[Inside look at modern web browser (part 1)](https://developers.google.com/web/updates/2018/09/inside-browser-part1)**
3. **[Inside look at modern web browser (part 2)](https://developers.google.com/web/updates/2018/09/inside-browser-part2)**
4. **[Inside look at modern web browser (part 3)](https://developers.google.com/web/updates/2018/09/inside-browser-part3)**
5. **[Inside look at modern web browser (part 4)](https://developers.google.com/web/updates/2018/09/inside-browser-part4)**
6. **[async vs defer attributes](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html)**
7. **[坚持仅合成器的属性和管理层计数](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)**
8. **[Improving Scroll Performance with Passive Event Listeners](https://developers.google.com/web/updates/2016/06/passive-event-listeners)**
9. **[passive 的事件监听器](http://www.cnblogs.com/ziyunfei/p/5545439.html)**
10. **[Improving Load Performance - Chrome DevTools 101](https://www.youtube.com/watch?v=5fLW5Q5ODiE)**
11. **[Web 性能优化-CSS3 硬件加速(GPU 加速)](https://lz5z.com/Web%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96-CSS3%E7%A1%AC%E4%BB%B6%E5%8A%A0%E9%80%9F/)**
12. **[Eliminate content repaints with the new Layers panel in Chrome](https://blog.logrocket.com/eliminate-content-repaints-with-the-new-layers-panel-in-chrome-e2c306d4d752)**
