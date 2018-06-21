---
title: JavaScript设计模式(中)
date: 2018-06-21 14:47:15
tags:
- JavaScript
- 设计模式
- 策略模式
---

《JavaScript 设计模式与开发实践》，作者：曾探，读书笔记。本文介绍几种设计模式：策略模式。

<!--more-->

# 策略模式

策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

## 使用策略模式计算奖金

假如， 绩效为 S 的人年终奖有 4 倍工资， 绩效为 A 的人年终奖有 3 倍工资， 而绩效为 B 的人年终奖是 2 倍工资。 我们提供一段代码来计算员工的年终奖。

`calculateBonus`函数接收两个参数：工资和绩效：

```js
var calculateBonus = function(salary, performanceLevel) {
  if (performanceLevel === 'S') {
    return salary * 4
  } else if (performanceLevel === 'A') {
    return salary * 3
  } else if (performanceLevel === 'B') {
    return salary * 2
  }
}

calculateBonus('B', 20000) // 输出： 40000
calculateBonus('S', 6000) // 输出： 24000
```

这段代码十分简单，但是存在显而易见的缺点：

1.  calculateBonus 函数比较庞大，包含很多 if-else 条件语句，覆盖所有的逻辑分支
2.  calculateBonus 函数缺乏弹性，如果新增绩效 C 或者修改绩效 S 的系数，需要修改 calculateBonus 函数内部，违反开发-封闭原则
3.  算法复用性差，计算奖金的算法没法复用

因此，我们使用策略模式重构这段代码，将不变的部分和变化的部分分隔开是每个设计模式的主题，策略模式的目的就是把算法的使用和算法的实现分离开。

这个例子中，算法的使用方式不变，都是根据某个算法得出结果，而算法的实现有各自的规则所以各不相同。

一个基于策略模式的程序至少由两部分组成：一组封装了具体算法并负责计算的策略类；环境类 Context，Context 接收客户的请求，然后把请求委托给某一个策略类。

现在模仿传统面向对象语言，把每种绩效的计算规则都封装在对应的策略类里：

```js
var performanceS = function() {}
performanceS.prototype.calculate = function(salary) {
  return salary * 4
}

var performanceA = function() {}
performanceA.prototype.calculate = function(salary) {
  return salary * 3
}

var performanceB = function() {}
performanceB.prototype.calculate = function(salary) {
  return salary * 2
}
```

接下来定义奖金类 Bonus：

```js
var Bonus = function() {
  this.salary = null // 原始工资
  this.strategy = null // 绩效等级对应的策略对象
}
Bonus.prototype.setSalary = function(salary) {
  this.salary = salary // 设置员工的原始工资
}
Bonus.prototype.setStrategy = function(strategy) {
  this.strategy = strategy // 设置员工绩效等级对应的策略对象
}
Bonus.prototype.getBonus = function() {
  // 取得奖金数额
  return this.strategy.calculate(this.salary) // 把计算奖金的操作委托给对应的策略对象
}
```

计算奖金：

```js
var bonus = new Bonus()
bonus.setSalary(10000)

bonus.setStrategy(new performanceS()) // 设置策略对象
console.log(bonus.getBonus()) // 输出：40000
bonus.setStrategy(new performanceA()) // 设置策略对象
console.log(bonus.getBonus()) // 输出：30000
```

## JavaScript 版本的策略模式

上一节中，我们让 strategy 对象从各个策略类中创建而来， 这是模拟一些传统面向对象语言的实现。实际上在 JavaScript 语言中， 函数也是对象， 所以更简单和直接的做法是把 strategy 直接定义为函数：

```js
var strategies = {
  S: function(salary) {
    return salary * 4
  },
  A: function(salary) {
    return salary * 3
  },
  B: function(salary) {
    return salary * 2
  }
}
```

同样， Context 也没有必要必须用 Bonus 类来表示，我们依然用 calculateBonus 函数充当 Context 来接受用户的请求。 经过改造， 代码的结构变得更加简洁：

```js
var calculateBonus = function(level, salary) {
  return strategies[level](salary)
}

console.log(calculateBonus('S', 20000)) // 输出：80000
console.log(calculateBonus('A', 10000)) // 输出：30000
```

## 多态在策略模式中的体现

每个策略对象负责的算法已被各自封装在对象内部。 当我们对这些策略对象发出“计算奖金”的请求时， 它们会返回各自不同的计算结果， 这正是对象多态性的体现， 也是“它们可以相互替换”的目的。

## 使用策略模式实现缓动动画

用 JavaScript 实现动画效果的原理跟动画片的制作一样， 动画片是把一些差距不大的原画以较快的帧数播放， 来达到视觉上的动画效果。 在 JavaScript 中，可以通过连续改变元素的某个 CSS 属性， 比如 left、 top、 background-position 来实现动画效果。

我们准备编写一个动画类和一些缓动算法， 实现小球以各种各样的缓动效果在页面中运动。在运动开始之前， 需要提前记录一些有用的信息：

1.  动画开始时，小球所在的元素位置
2.  小球移动的目标位置
3.  动画开始时的准确时间点
4.  小球运动持续时间

随后， 我们会用 setInterval 创建一个定时器， 定时器每隔 19ms 循环一次。 在定时器的每一帧里， 我们会把动画已消耗的时间、 小球原始位置、 小球目标位置和动画持续的总时间等信息传入缓动算法。 该算法会通过这几个参数， 计算出小球当前应该所在的位置。 最后再更新该 div 对应的 CSS 属性， 小球就能够顺利地运动起来了。

缓动算法最初来着 Flash，接收 4 个参数：动画已消耗的时间，小球原始位置，小球目标位置，动画持续的总时间。返回值是元素当前应该到达的位置：

```js
var tween = {
  linear: function(t, b, c, d) {
    return (c * t) / d + b
  },
  easeIn: function(t, b, c, d) {
    return c * (t /= d) * t + b
  },
  strongEaseIn: function(t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b
  },
  strongEaseOut: function(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b
  },
  sineaseIn: function(t, b, c, d) {
    return c * (t /= d) * t * t + b
  },
  sineaseOut: function(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b
  }
}
```

在页面上定义一个小球：

```html
<div id="div" style="position:absolute;background:blue"></div>
```

接下来定义 Animate 类，Animate 的构造函数接收一个参数：即将运动的 dom 节点：

```js
var Animate = function(dom) {
  this.dom = dom // 进行运动的dom 节点
  this.startTime = 0 // 动画开始时间
  this.startPos = 0 // 动画开始时，dom 节点的位置，即dom 的初始位置
  this.endPos = 0 // 动画结束时，dom 节点的位置，即dom 的目标位置
  this.propertyName = null // dom 节点需要被改变的css 属性名
  this.easing = null // 缓动算法
  this.duration = null // 动画持续时间
}
```

Animate.prototype.start 方法复制启动动画，接收 4 个参数： 要改变的 CSS 属性名、小球运动的目标位置、动画持续时间、缓动算法：

```js
Animate.prototype.start = function(propertyName, endPos, duration, easing) {
  this.startTime = +new Date() // 动画启动时间
  this.startPos = this.dom.getBoundingClientRect()[propertyName] // dom 节点初始位置
  this.propertyName = propertyName // dom 节点需要被改变的CSS 属性名
  this.endPos = endPos // dom 节点目标位置
  this.duration = duration // 动画持续事件
  this.easing = tween[easing] // 缓动算法
  var self = this
  var timeId = setInterval(function() {
    // 启动定时器，开始执行动画
    if (self.step() === false) {
      // 如果动画已结束，则清除定时器
      clearInterval(timeId)
    }
  }, 19)
}
```

Animate.prototype.step 方法代表小球运动的每一帧要做的事情。 在此处， 这个方法负责计算小球的当前位置并调用更新 CSS 属性值的方法 Animate.prototype.update。 代码如下：

```js
Animate.prototype.step = function() {
  var t = +new Date() // 取得当前时间
  // (1)
  if (t >= this.startTime + this.duration) {
    this.update(this.endPos) // 更新小球的CSS 属性值
    return false
  }
  var pos = this.easing(
    t - this.startTime,
    this.startPos,
    this.endPos - this.startPos,
    this.duration
  )
  // pos 为小球当前位置
  this.update(pos) // 更新小球的CSS 属性值
}
```

代码(1)处的意思是， 如果当前时间大于动画开始时间加上动画持续时间之和， 说明动画已经结束， 此时要修正小球的位置。 因为在这一帧开始之后， 小球的位置已经接近了目标位置， 但很可能不完全等于目标位置。 此时我们要主动修正小球的当前位置为最终的目标位置。 此外让 Animate.prototype.step 方法返回 false， 可以通知 Animate.prototype.start 方法清除定时器。

Animate.prototype.update 方法负责更新小球 CSS 属性值的：

```js
Animate.prototype.update = function(pos) {
  this.dom.style[this.propertyName] = pos + 'px'
}

var div = document.getElementById('div')
var animate = new Animate(div)
animate.start('left', 500, 1000, 'strongEaseOut')
// animate.start( 'top', 1500, 500, 'strongEaseIn' );
```

利用这个动画类和一些缓动算法就可以让小球运动起来。 我们使用策略模式把算法传入动画类中， 来达到各种不同的缓动效果， 这些算法都可以轻易地被替换为另外一个算法， 这是策略模式的经典运用之一。

## 更广义的“算法”

从定义上看， 策略模式就是用来封装算法的。 但如果把策略模式仅仅用来封装算法， 未免有一点大材小用。 在实际开发中， 我们通常会把算法的含义扩散开来， 使策略模式也可以用来封装一系列的“业务规则”。 只要这些业务规则指向的目标一致， 并且可以被替换使用， 我们就可以用策略模式来封装它们。

## 表单校验

假设我们正在编写一个注册的页面， 在点击注册按钮之前， 有如下几条校验逻辑：
 

