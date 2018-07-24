---
title: JavaScript设计模式（2）
date: 2018-07-24 14:47:15
tags:
- JavaScript
- 设计模式
- 策略模式
- 代理模式
- 迭代器模式
- 发布—订阅模式
---

《JavaScript 设计模式与开发实践》，作者：曾探，读书笔记。本文介绍几种设计模式：策略模式、代理模式、迭代器模式和发布—订阅模式。本文中所有源代码存放在**[Github](https://github.com/PennySuu/js-design-pattern-exmaple-from-book)**。

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
2.  calculateBonus 函数缺乏弹性，如果新增绩效 C 或者修改绩效 S 的系数，需要修改 calculateBonus 函数内部，违反开放—封闭原则
3.  算法复用性差，计算奖金的算法没法复用

因此，我们使用策略模式重构这段代码，将不变的部分和变化的部分分隔开是每个设计模式的主题，策略模式的目的就是把算法的使用和算法的实现分离开。

这个例子中，算法的使用方式不变，都是根据某个算法得出结果，而算法的实现有各自的规则所以各不相同。

一个基于策略模式的程序至少由两部分组成：一组封装了具体算法并负责计算的策略类；一个环境类 Context，接收客户的请求，然后把请求委托给某一个策略类。

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

缓动算法最初来自 Flash，接收 4 个参数：动画已消耗的时间，小球原始位置，小球目标位置，动画持续的总时间。返回值是元素当前应该到达的位置：

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

Animate.prototype.start 方法负责启动动画，接收 4 个参数： 要改变的 CSS 属性名、小球运动的目标位置、动画持续时间、缓动算法：

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

1.  用户名不能为空
2.  密码长度不能少于 6 位
3.  手机号码必须符合格式

先来看看没有使用策略模式直接实现功能的版本：

```html
<html>
<body>
	<form action="http:// xxx.com/register" id="registerForm" method="post">
		请输入用户名：<input type="text" name="userName"/ >
		请输入密码：<input type="text" name="password"/ >
		请输入手机号码：<input type="text" name="phoneNumber"/ >
		<button>提交</button>
	</form>
	<script>
		var registerForm = document.getElementById( 'registerForm' );
		registerForm.onsubmit = function(){
			if ( registerForm.userName.value === '' ){
				alert ( '用户名不能为空' );
				return false;
			}
			if ( registerForm.password.value.length < 6 ){
				alert ( '密码长度不能少于6 位' );
				return false;
			}
			if ( !/(^1[3|5|8][0-9]{9}$)/.test( registerForm.phoneNumber.value ) ){
				alert ( '手机号码格式不正确' );
				return false;
			}
		}
	</script>
</body>
</html>
```

上面代码的缺点和计算奖金的最初版是一样的。

## 用策略模式重构表单校验

首先我们要把校验逻辑都封装成策略对象：

```js
var strategies = {
  isNonEmpty: function(value, errorMsg) {
    // 不为空
    if (value === '') {
      return errorMsg
    }
  },
  minLength: function(value, length, errorMsg) {
    // 限制最小长度
    if (value.length < length) {
      return errorMsg
    }
  },
  isMobile: function(value, errorMsg) {
    // 手机号码格式
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg
    }
  }
}
```

接下来准备实现作为 Context 的 Validator 类，负责接收用户的请求并委托给 strategy 对象。在这之前，让我们先了解用户是如何向 Validator 类发送请求的：

```js
var validataFunc = function() {
  var validator = new Validator() // 创建一个validator 对象
  //添加一些校验规则
  validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空')
  validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6 位')
  validator.add(registerForm.phoneNumber, 'isMobile', '手机号码格式不正确')
  var errorMsg = validator.start() // 获得校验结果
  return errorMsg // 返回校验结果
}

var registerForm = document.getElementById('registerForm')
registerForm.onsubmit = function() {
  var errorMsg = validataFunc() // 如果errorMsg 有确切的返回值，说明未通过校验
  if (errorMsg) {
    alert(errorMsg)
    return false // 阻止表单提交
  }
}
```

从代码中可以看到，我们创建了一个 validator 对象，然后通过 validator.add 方法添加校验规则，该方法接收 3 个参数：

```js
validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6 位')
```

1.  需要校验的 input 输入框
2.  'minLength:6'是一个以冒号隔开的字符串。 冒号前面的 minLength 代表客户挑选的 strategy 对象， 冒号后面的数字 6 表示在校验过程中所必需的一些参数。 'minLength:6'的意思就是校验 registerForm.password 这个文本输入框的 value 最小长度为 6。 如果这个字符串中不包含冒号，说明校验过程中不需要额外的参数信息， 比如'isNonEmpty'。
3.  校验未通过时返回的错误提示信息

然后调用 validator.start()方法启动校验，如果 validator.start()返回了一个确切的 errorMsg 字符串当作返回值， 说明该次校验没有通过， 此时需让 registerForm.onsubmit 方法返回 false 来阻止表单的提交。

现在看看 Validator 类具体是如何实现的：

```js
var Validator = function() {
  this.cache = [] // 保存校验规则
}

Validator.prototype.add = function(dom, rule, errorMsg) {
  var ary = rule.split(':') // 把strategy 和参数分开
  this.cache.push(function() {
    // 把校验的步骤用空函数包装起来，并且放入cache
    var strategy = ary.shift() // 用户挑选的strategy
    ary.unshift(dom.value) // 把input 的value 添加进参数列表
    ary.push(errorMsg) // 把errorMsg 添加进参数列表
    return strategies[strategy].apply(dom, ary)
  })
}

Validator.prototype.start = function() {
  for (var i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
    var msg = validatorFunc() // 开始校验，并取得校验后的返回信息
    if (msg) {
      // 如果有确切的返回值，说明校验没有通过
      return msg
    }
  }
}
```

使用策略模式重构代码之后， 我们仅仅通过“配置”的方式就可以完成一个表单的校验， 这些校验规则也可以复用在程序的任何地方， 还能作为插件的形式， 方便地被移植到其他项目中。

如果我们既想校验用户名是否为空， 又想校验它输入文本的长度不小于 10 呢？ 我们期望以这样的形式进行校验：

```js
validator.add(registerForm.userName, [
  {
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
  },
  {
    strategy: 'minLength:10',
    errorMsg: '用户名长度不能小于10 位'
  }
])
```

只需对 Validator 类的 add 方法稍加改造即可实现多规则校验：

```js
Validator.prototype.add = function(dom, rules){
  var self = this;
  for(var i = 0, rule; rule = rules[i++]){
    (function(rule){
      var strategyAry = rule.strategy.split(':')
      var errorMsg = rule.errorMsg
      self.cache.push(function(){
        var strategy = strategyAry.shift()
        strategyAry.unshift(dom.value)
        strategyAry.push(errorMsg)
        return strategies[strategy].apply(dom, strategyAry)
      })
    })(rule)
  }
}
```

## 策略模式的优缺点

优点：

1.  利用组合、 委托和多态等技术和思想， 可以有效地避免多重条件选择语句。
2.  提供了对开放—封闭原则的完美支持， 将算法封装在独立的 strategy 中， 使得它们易于切换， 易于理解， 易于扩展。
3.  策略模式中的算法也可以复用在系统的其他地方， 从而避免许多重复的复制粘贴工作。
4.  在策略模式中利用组合和委托来让 Context 拥有执行算法的能力， 这也是继承的一种更轻便的替代方案。

缺点：

1.  使用策略模式会在程序中增加许多策略类或者策略对象， 但实际上这比把它们负责的逻辑堆砌在 Context 中要好。
2.  使用策略模式， 必须了解所有的 strategy， 必须了解各个 strategy 之间的不同点，这样才能选择一个合适的 strategy。此时 strategy 要向客户暴露它的所有实现， 这是违反最少知识原则的。

## 一等函数对象与策略模式

Peter Norvig 在他的演讲中曾说过： “在函数作为一等对象的语言中， 策略模式是隐形的。 strategy 就是值为函数的变量。 ”在 JavaScript 中， 除了使用类来封装算法和行为之外， 使用函数当然也是一种选择。 这些“算法”可以被封装到函数中并且四处传递， 也就是我们常说的“高阶函数”。 实际上在 JavaScript 这种将函数作为一等对象的语言里， 策略模式已经融入到了语言本身当中， 我们经常用高阶函数来封装不同的行为， 并且把它传递到另一个函数中。 当我们对这些函数发出“调用”的消息时， 不同的函数会返回不同的执行结果。 在 JavaScript 中， “函数对象的多态性”来得更加简单。

如果去掉 strategies， 我们还能认出这是一个策略模式的实现吗？ 代码如下：

```js
var S = function(salary) {
  return salary * 4
}
var A = function(salary) {
  return salary * 3
}
var B = function(salary) {
  return salary * 2
}
var calculateBonus = function(func, salary) {
  return func(salary)
}
calculateBonus(S, 10000)
```

# 代理模式

代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。替身对象对请求做出一些处理之后，再把请求转交给本体对象。

## 保护代理和虚拟代理

保护代理用于控制不同权限的对象对目标对象的访问，但在 JavaScript 中并不容易实现保护代理，因为我们无法判断谁访问了某个对象。而虚拟代理是最常用的一种代理模式，虚拟代理把一个开销很大的对象，延迟到真正需要它的时候创建。

## 虚拟代理实现图片预加载

图片预加载是一种常用的技术，如果直接给`img`标签设置`src`属性，由于图片过大或者网络不佳，图片的位置往往有段时间是一片空白。常见的做法是用一张 loading 图片占位，异步加载图片，等图片加载好了再把他填充到`img`节点。这种场景就很适合使用虚拟代理。

我们通过`proxyImage`间接访问`MyImage`。`proxyImage`控制了客户对`MyImage`的访问，并且在此过程中加入一些额外的操作，比如在真正的图片加载好之前，先把`img`节点的`src`设置为 loading 图片：

```js
var myImage = (function() {
  var imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return {
    setSrc: function(src) {
      imgNode.src = src
    }
  }
})()
var proxyImange = (function() {
  var img = new Image()
  img.onload = function() {
    myImage.setSrc(this.src)
  }
  return {
    setSrc: function(src) {
      myImage.setSrc('loading.gif')
      img.src = src
    }
  }
})()
proxyImage.setSrc('somepicture.png')
```

## 代理的意义

为了说明代理的意义，我们先来了解一下面向对象设计的原则——单一职责原则：就一个类（通常也包括对象和函数等）而言，应该仅有一个引起他变化的原因。如果不使用代理模式，实现图片预加载的代码将是这样的：

```js
var MyImage = (function() {
  var imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  var img = new Image()
  img.onload = function() {
    imgNode.src = img.src
  }
  return {
    setSrc: function(src) {
      imgNode.src = 'loading.gif'
      img.src = src
    }
  }
})()
MyImage.setSrc('somepicture.png')
```

上段代码中的`MyImage`对象除了负责给`img`节点设置`src`外，还负责预加载图片。如果我们只是获取一些体积很小的图片或者未来不需要预加载，就不得不改动`MyImage`对象删掉预加载相关代码。

实际上，我们需要的是给`img`节点设置`src`，预加载图片只是一个锦上添花的功能。于是代理的作用就体现出来了。代理负责预加载图片，预加载的操作完成之后，把请求重新交给本体`MyImage`。

通过代理对象，在不改变或者增加`MyImage`的接口的情况下，给系统添加了新的行为。这符合开放——封闭原则。给`img`节点设置`src`和图片预加载这两个功能被隔离在两个对象里，互不影响。就算有一天不需要预加载，只需要改成请求本体而不是请求代理对象即可。

## 代理和本体接口的一致性

上一节说到，如果不需要预加载，直接请求本体即可，其中的关键是代理对象和本体都对外提供了`setSrc`方法，在客户看来，代理对象和本体是一致的。

另外值得一提的是，如果代理对象和本体对象都为一个函数（函数也是对象），函数必然都能被执行，则可以认为他们也具有一致的“接口”，代码如下：

```js
var myImage = (function() {
  var imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return function(src) {
    imgNode.src = src
  }
})()
var proxyImage = (function() {
  var img = new Image()
  img.onload = function() {
    myImage(this.src)
  }
  return function(src) {
    myImage('loading.gif')
    img.src = src
  }
})()
proxyImage('somepicture.jpg')
```

## 虚拟代理合并 HTTP 请求

我们通过代理函数`proxySynchronousFile`来收集一段时间之内的请求，最后一次性发给服务器：

```js
var synchronousFile = function(ids) {
  console.log('向服务器发送请求：' + ids)
}
var proxySynchronousFile = (function() {
  var cache = [], // 保存一段时间内需要同步的ID
    timer // 定时器
  return function(id) {
    cache.push(id)
    // 保证不会覆盖已经启动的定时器
    if (timer) {
      return
    }
    timer = setTimeout(function() {
      synchronousFile(cache.join()) // 2 秒后向本体发送需要同步的ID 集合
      clearTimeout(timer) // 清空定时器
      timer = null
      cache.length = 0 // 清空ID 集合
    }, 2000)
  }
})()
```

## 虚拟代理在惰性加载中的应用

假设有一个文件`miniConsole.js`，我们并不想一开始就加载，我们希望在有必要的时候才开始加载它，在加载之前，为了能让用户正常地使用里面的 API，通常我们的解决方案是用一个占位的 miniConsole 代理对象来给用户提前使用， 这个代理对象提供给用户的接口， 跟实际的 miniConsole 是一样的。等用户按下 F2 唤出控制台的时候， 才开始加载真正的 miniConsole.js 的代码， 加载完成之后将遍历 miniConsole 代理对象中的缓存函数队列， 同时依次执行它们。

```js
var miniConsole = (function(){
  var cache = []
  var handler = function(ev){
    if(ev.keyCode === 113){
      var script = document.createElement('script')
      script.onload = function(){
        for(var i = 0, fn; fn = cache[i++]){
          fn()
        }
      }
      script.src = 'miniConsole.js'
      document.getElementsByTagName('head')[0].appendChild(script)
      document.body.removeEventListener('keydown',handler)// 只加载一次miniConsole.js
    }
  }
  document.body.addEventListener('keydown',handler,false)

  return {
    log: function(){
      var args = arguments;
      cache.push(function(){
        return miniConsole.log.apply(miniConsole, args)
      })
    }
  }
})()

miniConsole.log( 11 ); // 开始打印log
// miniConsole.js 代码
miniConsole = {
  log: function(){
  // 真正代码略
  console.log( Array.prototype.join.call( arguments ) );
}
```

## 缓存代理

缓存代理可以为一些开销大的运算结果提供暂时的存储， 在下次运算时， 如果传递进来的参数跟之前一致， 则可以直接返回前面存储的运算结果。

```js
//举个粗糙的栗子。。。
var mult = function() {
  console.log('开始计算乘积')
  var a = 1
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i]
  }
  return a
}
var proxyMult = (function() {
  var cache = {}
  return function() {
    var args = Array.prototype.join.call(arguments, ',')
    if (args in cache) {
      return cache[args]
    }
    return (cache[args] = mult.apply(this, arguments))
  }
})()

proxyMult(1, 2, 3, 4) // 输出：24
proxyMult(1, 2, 3, 4) // 输出：24
```

## 用高阶函数动态创建代理

通过传入高阶函数这种更加灵活的方式， 可以为各种计算方法创建缓存代理。 现在这些计算方法被当作参数传入一个专门用于创建缓存代理的工厂中，这样一来， 我们就可以为乘法、 加法、 减法等创建缓存代理， 代码如下：

```js
/**************** 计算乘积 *****************/
var mult = function() {
  var a = 1
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i]
  }
  return a
}
/**************** 计算加和 *****************/
var plus = function() {
  var a = 0
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a + arguments[i]
  }
  return a
}
/**************** 创建缓存代理的工厂 *****************/
var createProxyFactory = function(fn) {
  var cache = {}
  return function() {
    var args = Array.prototype.join.call(arguments, ',')
    if (args in cache) {
      return cache[args]
    }
    return (cache[args] = fn.apply(this, arguments))
  }
}

var proxyMult = createProxyFactory(mult),
  proxyPlus = createProxyFactory(plus)
alert(proxyMult(1, 2, 3, 4)) // 输出：24
alert(proxyPlus(1, 2, 3, 4)) // 输出：10
```

# 迭代器模式

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。

现在我们来实现一个`each`函数，接收两个参数：被循环的数组；回调函数：

```js
var each = function(ary, callback) {
  for (var i = 0; i < ary.length; i++) {
    callback.call(ary[i], i, ary[i]) // 把下标和元素当作参数传给callback 函数
  }
}
each([1, 2, 3], function(i, n) {
  console.log([i, n])
})
```

## 内部迭代器和外部迭代器

1、 内部迭代器，内部已经定义好了迭代规则，它完全接手整个迭代过程，外部只需要一次初始化调用。这也是内部迭代器的缺点，无法自定义迭代的过程。比如，使用上面的`each`函数判断 2 个数组是否完全相等，我们只能这样写：

```js
var compare = function(ary1, ary2) {
  if (ary1.length !== ary2.length) {
    throw new Error('ary1 和ary2 不相等')
  }
  each(ary1, function(i, n) {
    if (n !== ary2[i]) {
      throw new Error('ary1 和ary2 不相等')
    }
  })
  alert('ary1 和ary2 相等')
}
compare([1, 2, 3], [1, 2, 4]) // throw new Error ( 'ary1 和ary2 不相等' );
```

2、 外部迭代器，必须显示的请求迭代下一个元素，增加了一些调用的复杂度，但也增加了迭代器的灵活性，我们可以手动控制迭代的过程或者顺序：

```js
var Iterator = function(obj) {
  var current = 0
  var next = function() {
    current += 1
  }
  var isDone = function() {
    return obj[current]
  }
  var getCurrentItem = function() {
    return obj[current]
  }
  return {
    next: next,
    isDone: isDone,
    getCurrentItem: getCurrentItem
  }
}
```

使用上面的`Iterator`迭代器改写`compare`函数：

```js
var compare = function(iterator1, iterator2) {
  while (!iterator1.isDone() && !iterator2.isDone()) {
    if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
      throw new Error('iterator1 和iterator2 不相等')
    }
    iterator1.next()
    iterator2.next()
  }
  alert('iterator1 和iterator2 相等')
}

var iterator1 = Iterator([1, 2, 3])
var iterator2 = Iterator([1, 2, 3])
compare(iterator1, iterator2) // 输出：iterator1 和iterator2 相等
```

内部迭代器和外部迭代器在实际生产中没有优劣之分，究竟使用哪个根据需求场景而定吧~

## 迭代类数组和字面量对象

jQuery 中提供了$.each 函数来封装各种迭代行为：

```js
$.each = function(obj, callback) {
  var value,
    i = 0,
    length = obj.length,
    isArray = isArrayLike(obj)

  if (isArray) {
    // 迭代类数组
    for (; i < length; i++) {
      value = callback.call(obj[i], i, obj[i])
      if (value === false) {
        break
      }
    }
  } else {
    // 迭代object对象
    for (i in obj) {
      value = callback.call(obj[i], i, obj[i])
      if (value === false) {
        break
      }
    }
  }
  return obj
}
```

## 中止迭代器

迭代器可以想 for 循环中的 break 一样，跳出循环，上一节的代码中：

```js
if(value === false){
  break;
}
```

约定如果回调函数的执行结果返回 false，终止循环。我们也可以改写一下 each 函数：

```js
var each = function(ary, callback) {
  for (var i = 0; i < ary.length; i++) {
    if (callback(i, ary[i]) === false) {
      break
    }
  }
}

each([1, 2, 3, 4, 5], function(i, n) {
  if (n > 3) {
    return false
  }
  console.log(n)
})
```

## 迭代器模式的应用举例

假设我们要实现根据不同的浏览器获取相应的上传组件对象，我们先看看最直接的实现：

```js
var getUploadObj = function() {
  try {
    return new ActiveXObject('TXFTNAcTiveX.FTNUpload')
  } catch (e) {
    if (supportFlash()) {
      var str = '<object type="application/x-shockwave-flash"></object>'
      return $(str).appendTo($('body'))
    } else {
      var str = '<input name="file" type="file" />'
      return $(str), appendTo($('body'))
    }
  }
}
```

看看上面的代码，为了得到一个 upload 对象，这个 getUploadObj 函数里充斥了 try，catch 已经 if 条件分支。第一很阅读，第二严重违反开闭原则。后来我们还增加支持了一些另外的上传方式，比如 HTML5，这时候唯一的办法是继续往 getUploadObj 函数里增加条件分支。

现在来梳理一下问题，目前一共有 3 种可能的上传的方式，我们不知道目前正在使用的浏览器支持哪几种。就好比我们有一个钥匙串，我们想打开一扇门但是不知道该使用哪把钥匙，于是从第一把开始，迭代钥匙串进行尝试，直到找到了正确的钥匙为止。

我们把每种获取 upload 对象的方法都封装在各自的函数里，然后使用迭代器，迭代获取这些 upload 对象，直到获取到一个可用的为止：

```js
var getActiveUploadObj = function() {
  try {
    return new ActiveXObject('TXFTNAcTiveX.FTNUpload')
  } catch (e) {
    return false
  }
}
var getFlashUploadObj = function() {
  if (supportFlash()) {
    var str = '<object type="application/x-shockwave-flash"></object>'
    return $(str).appendTo($('body'))
  }
  return false
}
var getFormUploadObj = function() {
  var str = '<input name="file" type="file" />'
  return $(str), appendTo($('body'))
}

// 迭代器
var iteratorUploadObj = function(){
  for(var i = 0, fn; fn = arguments[i++]){
    var uploadObj = fn()
    if(uploadObj !== false){
      return uploadObj;
    }
  }
}

var uploadObj = iteratorUploadObj(getActiveUploadObj,getFlashUploadObj,getFormUploadObj)
```

现在，我们要增加 HTML5 上传，只需要增加 HTML5 上传对象，然后依照优先级添加进迭代器：

```js
var getHtml5UploadObj = function() {}

var uploadObj = iteratorUploadObj(
  getActiveUploadObj,
  getFlashUploadObj,
  getHtml5UploadObj,
  getFormUploadObj
)
```

# 发布—订阅模式

发布—订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所以依赖于它的对象都将得到通知。在 JavaScript 开发中，我们一般用事件模型来代替传统的发布—订阅模式。

发布—订阅模式可以广泛应用于异步编程，代替传递回调函数的方案。

发布—订阅模式可以取代对象之间硬编码的通知机制，一个对象不用再显示地调用另外一个对象的某个接口。

## DOM 事件

只要我们曾经在 DOM 节点上面绑定过事件函数，我们就使用过发布—订阅模式。我们可以随意增加或删除订阅者，增加任何订阅者都不会影响发布者代码的编码：

```js
document.body.addEventListener(
  'click',
  function() {
    alert(2)
  },
  false
)
document.body.addEventListener(
  'click',
  function() {
    alert(3)
  },
  false
)
document.body.addEventListener(
  'click',
  function() {
    alert(4)
  },
  false
)
document.body.click() // 模拟用户点击
```

## 自定义事件

现在看看如何一步步实现发布—订阅模式：

1.  指定发布者。
2.  给发布者添加一个缓存列表，存放回调函数通知订阅者。
3.  发布消息时，发布者遍历缓存列表，依次触发订阅者的回调函数。

```js
var salesOffices = {} // 定义发布者
salesOffices.clientList = [] // 缓存列表， 存放订阅者的回调函数
// 增加订阅者
salesOffices.listen = function(fn) {
  this.clientList.push(fn) // 订阅的消息添加进缓存列表
}
// 发布消息
salesOffices.trigger = function() {
  for (var i = 0, fn; (fn = this.clientList[i++]); ) {
    fn.apply(this, arguments)
  }
}
```

我们发布两条消息消息，订阅者将收到我们发布的所有消息：

```js
// 小明订阅消息
salesOffices.listen(function(price, squareMeter) {
  console.log('价格= ' + price)
  console.log('squareMeter= ' + squareMeter)
})
// 小红订阅消息
salesOffices.listen(function(price, squareMeter) {
  console.log('价格= ' + price)
  console.log('squareMeter= ' + squareMeter)
})
salesOffices.trigger(2000000, 88) // 输出： 200万， 88平方米
salesOffices.trigger(3000000, 110) // 输出：300 万，110 平方米
```

改进代码，使订阅者只接收其感兴趣的消息，而不是全部接收：

```js
var salesOffices = {}
salesOffices.clientList = [] // 缓存列表，存放订阅者的回调函数

salesOffices.listen = function(key, fn) {
  // 如果还没有订阅过此类消息，给该类消息创建一个缓存列表
  if (!this.clientList[key]) {
    this.clientList[key] = []
  }
  this.clientList[key].push(fn) // 订阅的消息添加进消息缓存列表
}

// 发布消息
salesOffices.trigger = function() {
  var key = Array.prototype.shift.call(arguments), // 取出消息类型
    fns = this.clientList[key] // 取出该消息对应的回调函数集合
  // 如果没有订阅该消息，则返回
  if (!fns || fns.length === 0) {
    return false
  }
  for (var i = 0, fn; (fn = fns[i++]); ) {
    fn.apply(this, arguments) // arguments 是发布消息时附送的参数
  }
}

// 小明订阅88 平方米房子的消息
salesOffices.listen('squareMeter88', function(price) {
  console.log('价格= ' + price) // 输出： 2000000
})

// 小红订阅110 平方米房子的消息
salesOffices.listen('squareMeter110', function(price) {
  console.log('价格= ' + price) // 输出： 3000000
})

salesOffices.trigger('squareMeter88', 2000000) // 发布88 平方米房子的价格
salesOffices.trigger('squareMeter110', 3000000) // 发布110 平方米房子的价格
```

## 发布—订阅模式的通用实现

我们把发布—订阅的功能提取出来，放在一个单独的对象内，通过 installEvent 函数为其他对象添加发布—订阅的功能：

```js
//我们把发布—订阅的功能提取出来，放在一个单独的对象内：
var event = {
  clientList: [],
  listen: function(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn) // 订阅的消息添加进缓存列表
  },
  trigger: function() {
    var key = Array.prototype.shift.call(arguments), // (1);
      fns = this.clientList[key]
    if (!fns || fns.length === 0) {
      // 如果没有绑定对应的消息
      return false
    }
    for (var i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, arguments) // (2) // arguments 是trigger 时带上的参数
    }
  }
}

var installEvent = function(obj) {
  //注： for in 循环会遍历所有的属性，包括原型链上的
  for (var i in event) {
    obj[i] = event[i]
  }
}
//再来测试一番，我们给售楼处对象salesOffices 动态增加发布—订阅功能：
var salesOffices = {}
installEvent(salesOffices)
// 小明订阅消息
salesOffices.listen('squareMeter88', function(price) {
  console.log('价格= ' + price)
})
// 小红订阅消息
salesOffices.listen('squareMeter100', function(price) {
  console.log('价格= ' + price)
})
salesOffices.trigger('squareMeter88', 2000000) // 输出：2000000
salesOffices.trigger('squareMeter100', 3000000) // 输出：3000000
```

## 取消订阅事件

我们给 event 对象增加 remove 方法：

```js
event.remove = function(key, fn) {
  var fns = this.clientList[key]
  // 如果key 对应的消息没有被人订阅，则直接返回
  if (!fns) {
    return false
  }
  // 如果没有传入具体的回调函数，表示需要取消key 对应消息的所有订阅
  if (!fn) {
    fns && (fns.length = 0)
  } else {
    // 反向遍历订阅的回调函数列表
    for (var l = fns.length - 1; l >= 0; l--) {
      var _fn = fns[l]
      if (_fn === fn) {
        fns.splice(l, 1) // 删除订阅者的回调函数
      }
    }
  }
}

var salesOffices = {}
var installEvent = function(obj) {
  for (var i in event) {
    obj[i] = event[i]
  }
}

installEvent(salesOffices)

// 小明订阅消息
salesOffices.listen(
  'squareMeter88',
  (fn1 = function(price) {
    console.log('价格= ' + price)
  })
)

// 小红订阅消息
salesOffices.listen(
  'squareMeter88',
  (fn2 = function(price) {
    console.log('价格= ' + price)
  })
)

salesOffices.remove('squareMeter88', fn1) // 删除小明的订阅
salesOffices.trigger('squareMeter88', 2000000) // 输出：2000000
```

## 真实的例子——网站登录

假如我们正在开发一个商城网站， 网站里有 header 头部、 nav 导航、 消息列表、 购物车等模块。 这几个模块的渲染有一个共同的前提条件， 就是必须先用 ajax 异步请求获取用户的登录信息。

至于 ajax 请求什么时候能成功返回用户信息， 这点我们没有办法确定。但现在还不足以说服我们在此使用发布—订阅模式， 因为异步的问题通常也可以用回调函数来解决。

更重要的一点是， 我们不知道除了 header 头部、 nav 导航、 消息列表、 购物车之外， 将来还有哪些模块需要使用这些用户信息。 如果它们和用户信息模块产生了强耦合， 比如下面这样的形式：

```js
login.succ(function(data) {
  header.setAvatar(data.avatar) // 设置header模块的头像
  nav.setAvatar(data.avatar) // 设置导航模块的头像
  message.refresh() // 刷新消息列表
  cart.refresh() // 刷新购物车列表
})
```

现在登录模块是我们负责编写的， 但我们还必须了解 header 模块里设置头像的方法叫 setAvatar、 购物车模块里刷新的方法叫 refresh， 这种耦合性会使程序变得僵硬， header 模块不能随意再改变 setAvatar 的方法名， 它自身的名字也不能被改为 header1、 header2。 这是针对具体实现编程的典型例子， 针对具体实现编程是不被赞同的。

等到有一天， 项目中又新增了一个收货地址管理的模块， 这个模块本来是另一个同事所写的， 而此时你正在马来西亚度假， 但是他却不得不给你打电话： “Hi， 登录之后麻烦刷新一下收货地址列表。 ”于是你又翻开你 3 个月前写的登录模块， 在最后部分加上这行代码：

```js
login.succ(function(data) {
  header.setAvatar(data.avatar)
  nav.setAvatar(data.avatar)
  message.refresh()
  cart.refresh()
  address.refresh() // 增加这行代码
})
```

我们就会越来越疲于应付这些突如其来的业务要求， 要么跳槽了事， 要么必须来重构这些代码。

用发布—订阅模式重写之后， 对用户信息感兴趣的业务模块将自行订阅登录成功的消息事件。 当登录成功时， 登录模块只需要发布登录成功的消息， 而业务方接受到消息之后， 就会开始进行各自的业务处理， 登录模块并不关心业务方究竟要做什么， 也不想去了解它们的内部细节。 改善后的代码如下：

```js
// 登录成功
$.ajax('http:// xxx.com?login', function(data) {
  login.trigger('loginSucc', data) // 发布登录成功的消息
})
```

各模块监听登录成功的消息：

```js
// header模块
var header = (function() {
  login.listen('loginSucc', function(data) {
    header.setAvatar(data.avatar)
  })
  return {
    setAvatar: function(data) {
      console.log('设置header模块的头像')
    }
  }
})()
// nav模块
var nav = (function() {
  login.listen('loginSucc', function(data) {
    nav.setAvatar(data.avatar)
  })
  return {
    setAvatar: function(avatar) {
      console.log('设置nav模块的头像')
    }
  }
})()
```

## 全局的发布—订阅对象

回想下刚刚实现的发布—订阅模式， 我们给售楼处对象和登录对象都添加了订阅和发布的功能， 这里存在两个小问题：

1.  我们给每个发布者对象都添加了 listen 和 trigger 方法， 以及一个缓存列表 clientList，这其实是一种资源浪费。
2.  小明跟售楼处对象还是存在一定的耦合性， 小明至少要知道售楼处对象的名字是 salesOffices， 才能顺利的订阅到事件。

发布—订阅模式可以用一个全局的 Event 对象来实现， 订阅者不需要了解消息来自哪个发布者， 发布者也不知道消息会推送给哪些订阅者， Event 作为一个类似“中介者”的角色， 把订阅者和发布者联系起来。 见如下代码：

```js
var Event = (function() {
  var clientList = {},
    listen,
    trigger,
    remove
  listen = function(key, fn) {
    if (!clientList[key]) {
      clientList[key] = []
    }
    clientList[key].push(fn)
  }
  trigger = function() {
    var key = Array.prototype.shift.call(arguments),
      fns = clientList[key]
    if (!fns || fns.length === 0) {
      return false
    }
    for (var i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, arguments)
    }
  }
  remove = function(key, fn) {
    var fns = clientList[key]
    if (!fns) {
      return false
    }
    if (!fn) {
      fns && (fns.length = 0)
    } else {
      for (var l = fns.length - 1; l >= 0; l--) {
        var _fn = fns[l]
        if (_fn === fn) {
          fns.splice(l, 1)
        }
      }
    }
  }
  return {
    listen: listen,
    trigger: trigger,
    remove: remove
  }
})()

// 小红订阅消息
Event.listen('squareMeter88', function(price) {
  console.log('价格= ' + price) // 输出：'价格=2000000'
})

Event.trigger('squareMeter88', 2000000) // 售楼处发布消息
```

## 模块间通信

比如现在有两个模块， a 模块里面有一个按钮， 每次点击按钮之后， b 模块里的 div 中会显示按钮的总点击次数， 我们用全局发布—订阅模式完成下面的代码， 使得 a 模块和 b 模块可以在保持封装性的前提下进行通信:

```html
<!DOCTYPE html>
<html>
<body>
  <button id="count">点我</button>
  <div id="show"></div>
</body>
<script type="text/JavaScript">
  var a = (function(){
    var count = 0;
    var button = document.getElementById( 'count' );
    button.onclick = function(){
      Event.trigger( 'add', count++ );
    }
  })();
  var b = (function(){
    var div = document.getElementById( 'show' );
    Event.listen( 'add', function( count ){
      div.innerHTML = count;
    });
  })();
</script>
</html>
```

但在这里我们要留意另一个问题， 模块之间如果用了太多的全局发布—订阅模式来通信， 那么模块与模块之间的联系就被隐藏到了背后。 我们最终会搞不清楚消息来自哪个模块， 或者消息会流向哪些模块， 这又会给我们的维护带来一些麻烦。

## 先发布再订阅

这种需求在实际项目中是存在的， 比如在之前的商城网站中， 获取到用户信息之后才能渲染用户导航模块， 而获取用户信息的操作是一个 ajax 异步请求。 当 ajax 请求成功返回之后会发布一个事件， 在此之前订阅了此事件的用户导航模块可以接收到这些用户信息。

但是这只是理想的状况， 因为异步的原因， 我们不能保证 ajax 请求返回的时间， 有时候它返回得比较快， 而此时用户导航模块的代码还没有加载好（还没有订阅相应事件） ， 特别是在用了一些模块化惰性加载的技术后， 这是很可能发生的事情。

为了满足这个需求， 我们要建立一个存放离线事件的堆栈， 当事件发布的时候， 如果此时还没有订阅者来订阅这个事件， 我们暂时把发布事件的动作包裹在一个函数里， 这些包装函数将被存入堆栈中，等到终于有对象来订阅此事件的时候， 我们将遍历堆栈并且依次执行这些包装函数， 也就是重新发布里面的事件。 当然离线事件的生命周期只有一次，比如模块加载好后就可以完成先订阅再发布， 所以刚才的操作我们只能进行一次。

## 全局事件的命名冲突

全局的发布—订阅对象里只有一个 clinetList 来存放消息名和回调函数， 大家都通过它来订阅和发布各种消息， 久而久之， 难免会出现事件名冲突的情况， 所以我们还可以给 Event 对象提供创建命名空间的功能。

```js
/************** 先发布后订阅 ********************/
Event.trigger('click', 1)
Event.listen('click', function(a) {
  console.log(a) // 输出： 1
})
/************** 使用命名空间 ********************/
Event.create('namespace1').listen('click', function(a) {
  console.log(a) // 输出： 1
})
Event.create('namespace1').trigger('click', 1)
Event.create('namespace2').listen('click', function(a) {
  console.log(a) // 输出： 2
})
Event.create('namespace2').trigger('click', 2)
```

具体实现代码如下：

```js
var Event = (function() {
  var Event,
    _default = 'default'
  Event = (function() {
    var _listen,
      _trigger,
      _remove,
      _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      namespaceCache = {},
      _create,
      each = function(ary, fn) {
        var ret
        for (var i = 0, l = ary.length; i < l; i++) {
          var n = ary[i]
          ret = fn.call(n, i, n)
        }
        return ret
      }
    _listen = function(key, fn, cache) {
      if (!cache[key]) {
        cache[key] = []
      }
      cache[key].push(fn)
    }
    _remove = function(key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (var i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) {
              cache[key].splice(i, 1)
            }
          }
        } else {
          cache[key] = []
        }
      }
    }
    _trigger = function() {
      var cache = _shift.call(arguments),
        key = _shift.call(arguments),
        args = arguments,
        _self = this,
        ret,
        stack = cache[key]
      if (!stack || !stack.length) {
        return
      }
      return each(stack, function() {
        return this.apply(_self, args)
      })
    }
    _create = function(namespace) {
      var namespace = namespace || _default
      var cache = {},
        offlineStack = [], // 离线事件
        ret = {
          listen: function(key, fn) {
            _listen(key, fn, cache)
            if (offlineStack === null) {
              return
            }
            each(offlineStack, function() {
              this()
            })
            offlineStack = null
          },
          remove: function(key, fn) {
            _remove(key, cache, fn)
          },
          trigger: function() {
            var fn,
              args,
              _self = this
            _unshift.call(arguments, cache)
            args = arguments
            fn = function() {
              return _trigger.apply(_self, args)
            }
            if (offlineStack) {
              return offlineStack.push(fn)
            }
            return fn()
          }
        }
      return namespace
        ? namespaceCache[namespace]
          ? namespaceCache[namespace]
          : (namespaceCache[namespace] = ret)
        : ret
    }
    return {
      create: _create,
      remove: function(key, fn) {
        var event = this.create()
        event.remove(key, fn)
      },
      listen: function(key, fn) {
        var event = this.create()
        event.listen(key, fn)
      },
      trigger: function() {
        var event = this.create()
        event.trigger.apply(this, arguments)
      }
    }
  })()
  return Event
})()
```

## JavaScript 实现发布—订阅模式的便利性

在 Java 中实现一个自己的发布—订阅模式， 通常会把订阅者对象自身当成引用传入发布者对象中， 同时订阅者对象还需提供一个名为诸如 update 的方法， 供发布者对象在适合的时候调用。而在 JavaScript 中，我们用注册回调函数的形式来代替传统的发布—订阅模式， 显得更加优雅和简单。

另外， 在 JavaScript 中， 我们无需去选择使用推模型还是拉模型。 推模型是指在事件发生时， 发布者一次性把所有更改的状态和数据都推送给订阅者。 拉模型不同的地方是， 发布者仅仅通知订阅者事件已经发生了， 此外发布者要提供一些公开的接口供订阅者来主动拉取数据。 拉模型的好处是可以让订阅者“按需获取”， 但同时有可能让发布者变成一个“门户大开”的对象， 同时增加了代码量和复杂度。

刚好在 JavaScript 中， arguments 可以很方便地表示参数列表， 所以我们一般都会选择推模型， 使用 Function.prototype.apply 方法把所有参数都推送给订阅者。

发布—订阅模式的优点非常明显， 一为时间上的解耦， 二为对象之间的解耦。 它的应用非常广泛， 既可以用在异步编程中， 也可以帮助我们完成更松耦合的代码编写。 发布—订阅模式还可以用来帮助实现一些别的设计模式， 比如中介者模式。 从架构上来看， 无论是 MVC 还是 MVVM， 都少不了发布—订阅模式的参与， 而且 JavaScript 本身也是一门基于事件驱动的语言。

当然， 发布—订阅模式也不是完全没有缺点。 创建订阅者本身要消耗一定的时间和内存， 而且当你订阅一个消息后， 也许此消息最后都未发生， 但这个订阅者会始终存在于内存中。 另外， 发布—订阅模式虽然可以弱化对象之间的联系， 但如果过度使用的话， 对象和对象之间的必要联系也将被深埋在背后， 会导致程序难以跟踪维护和理解。 特别是有多个发布者和订阅者嵌套到一起的时候， 要跟踪一个 bug 不是件轻松的事情。
