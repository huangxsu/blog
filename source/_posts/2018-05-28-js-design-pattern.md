---
title: JavaScript设计模式(上)
date: 2018-06-20 14:23:54
tags:
- JavaScript
- 设计模式
- 单例模式
- 闭包
---

JavaScript 设计模式探索。JavaScript 代码看不懂，打开浏览器运行一下立刻可以理解了。《JavaScript 设计模式与开发实践》，作者：曾探，读书笔记。

<!--more-->

# 面向对象的 JavaScript

## 多态

多态背后的思想是将“做什么”和“谁做，怎么做”分离开，也就是将“不变的事物”与“可能改变的事物”分离开。

```js
var makeSound = function(animal) {
  animal.sound()
}

var Duck = function() {}
Duck.prototype.sound = function() {
  console.log('gagaga')
}

var Chicken = function() {}
Chicken.prototype.sound = function() {
  console.log('gegege')
}

makeSound(new Duck())
makeSound(new Chicken())
```

我们想鸭和鸡发出“叫唤”的消息，他们接到消息后分别作出了不同的反应。如果我们再增加一只狗，只要追加一些代码而不用改的`makeSound`函数：

```js
var Dog = function() {}
Dog.prototype.sound = function() {
  console.log('wangwangwang')
}

makeSound(new Dog())
```

JavaScript 的变量在运行期间是可变的。一个 JavaScript 对象，既可以是 Duck 类型的对象，也可以是 Checken 类型的对象。这意味着 JavaScript 对象的多态性是与生俱来的。

多态最根本的作用是：通过把过程化的条件分支语句转化为对象的多态性，从而消除这些条件分支语句。

## 封装

封装的目的是将信息隐藏。
1、 封装数据 除了 ES6 中提供的`let`之外，一般通过函数创建作用域：

```js
var myObject = (function() {
  var __name = 'abc' // 私有变量
  return {
    // 公有方法
    getName: function() {
      return __name
    }
  }
})()
```

2、 封装实现

封装实现使得对象内部的变化对其他对象而言是透明，对象之间通过暴露 API 接口来通信。以`each`迭代器为例，迭代器的作用是顺序访问聚合对象 ，使用`each`函数的人不用关心它的内部实现，只要功能正确，及时修改了内部函数，对方接口或调用方式没有变化，用户就不用关心它内部实现的改变。

## 继承（原型模式）

原型模式通过克隆来创建对象。

```js
Object.create =
  Object.create ||
  function(obj) {
    var F = function() {}
    F.prototype = obj
    return new F()
  }
```

原型编程的基本规则：

1、 所以数据都是对象。

JavaScript 有两种数据类型：基本类型和对象类型。按照 JavaScript 设计者的本意，除了`undefined`之外，一切都应是对象。为了实现这一目的，number、boolean、string 这几种基本类型也可以通过“包装类”的方式变成对象类型。

我们不能说 JavaScript 中所有的数据都是对象，可以说绝大部分是。JavaScript 中存在一个根对象，`Object.prototype`对象，是一个空的对象。在 JavaScript 遇到的每个对象，都是从`Object.prototype`对象克隆来的，`Object.prototype`对象是它们的原型。

```js
var obj1 = new Object()
var obj2 = {}

Object.getPrototypeOf(obj1) === Object.prototype // true
Object.getPrototypeOf(obj2) === Object.prototype // true
```

2、 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它

```js
var objectFactory = function() {
  var obj = new Object()
  var Constructor = [].shift.call(arguments)

  obj.__proto__ = Constructor.prototype
  var ret = Constructor.apply(obj, arguments)

  return typeof ret === 'object' ? ret : obj
}

function Person(name) {
  this.name = name
}
Person.prototype.getName = function() {
  return this.name
}

var a = objectFactory(Person, 'abc')
```

3、 对象会记住它的原型

要实现 JavaScript 的原型链查找机制，每个对象至少应该先记住它自己的原型。

就 JavaScript 真正的实现来说，其实并不能说对象有原型，而只能说对象的构造器有原型。对于“对象把请求委托给它自己的原型”这句话，更好的说法是对象把请求委托给它的构造器的原型。

JavaScript 给对象提供了一个名为`__proto__`的隐藏属性，默认会指向它的构造器原型，即`[Constructor].prototype`。实际上，`__proto__`就是对象跟“对象构造器的原型”联系起来的纽带。

4、 如果对象无法响应某个请求，它会把这个请求委托给它的构造器的原型

在 JavaScript 中，对象最初都是有 Object.prototype 对象克隆而来，但是对象构造器的原型并不仅限于 Object.prototype，而是可以动态指向其他对象。

这样一来，当对象 A 需要借用对象 B 的能力是，可以把对象 A 的构造器的原型指向对象 B，从而达到继承的效果：

```js
var obj = { name: 'abc' }

var A = function() {}
A.prototype = obj

var a = new A()
console.log(a.name) // 'abc'
```

当我们期望一个类继承自另外一个类时，可以模拟实现：

```js
var A = function() {}
A.prototype = { name: 'abc' }

var B = function() {}
B.prototype = new A()

var b = new B()
console.log(b.name) // 'abc'
```

# this & call & apply

## this

JavaScript 的`this`总是指向一个对象，该对象是基于函数的执行环境动态绑定的，而非函数声明时的环境。

1、 this 的指向

1.  作为对象的方法调用，`this`指向该对象：

```js
var obj = {
  a: 1,
  getA: function() {
    console.log(this === obj) // true
    console.log(this.a) // 1
  }
}
```

2.  作为普通函数调用，`this`总是指向全局对象，在浏览器的 JavaScript 里，全局对象是`window`对象：

```js
window.name = 'globalName'

var myObject = {
  name: 'abc',
  getName: function() {
    return this.name
  }
}

var getName = myObject.getName
console.log(getName()) // globalName
```

在 ES5 的`strict`模式下，这种情况下的 this 已经被规定不会指向全局对象，而是`undefined`。

3.  构造器调用，`this`指向构造器生成的对象：

```js
var MyClass = function() {
  this.name = 'abc'
}
var obj = new MyClass()
console.log(obj.name) // abc
```

如果构造器函数显示的返回了一个`object`类型的对象，那么`this`指向显示返回的对象：

```js
var MyClass = function() {
  this.name = 'abc'
  return {
    name: 'def'
  }
}

var obj = new MyClass()
console.log(obj.name) // def
```

4.  Function.prototype.call 或 Function.prototype.apply 调用

2、 丢失的 this

以下想实现一个根据 id 获取 dom 的函数：

```js
var getId = document.getElementById
getId('div1')
```

运行发现改函数不能实现想要的功能。原因是`document.getElementById`方法内部实现用到`this`，本来指向`document`对象，但用`getId`引用之后再调用，就成了普通函数调用，`this`指向了`window`，可以如下修正：

```js
document.getElementById = (function(func) {
  return function() {
    return func.apply(document, arguments)
  }
})(document.getElementById)
```

## call & apply

`apply`接受两个参数：指定函数内`this`对象、一个带下标的集合，可为数组。

`call`传入的参数数量不固定：第一个代表函数内`this`指向，从第二个参数开始往后，每个参数一次传入函数。

当使用`call`或`apply`时，如果第一个参数是`null`，函数体内的`this`会指向默认的宿主对象，在浏览器中是`window`，但是严格模式下，还是`null`。

1.  改变 this 的指向

```js
var obj1 = {
  name: 'abc'
}
var obj2 = {
  name: 'def'
}
window.name = 'window'

var getName = function() {
  console.log(this.name)
}

getName() // window
getName.call(obj1) // abc
getName.call(obj2) //def
```

2.  Function.prototype.bind

下面实现一个稍微复杂点的`bind`函数，预先填入一些参数：

```js
Function.prototype.bind = function() {
  var self = this,
    context = [].shift.call(arguments),
    args = [].slice.call(arguments)
  return function() {
    return self.apply(content, [].concat.call(args, [].slice.call(arguments)))
  }
}

var obj = {
  name: 'abc'
}

var func = function(a, b, c, d) {
  console.log(this.name) // abc
  console.log(a, b, c, d) // 1,2,3,4
}.bind(obj, 1, 2)

func(3, 4)
```

3.  借用其他对象的方法

```js
;(function() {
  Array.prototype.push.call(arguments, 3)
  console.log(arguments) //[1,2,3]
})(1, 2)
```

# 闭包 closure

闭包的形成与变量的作用域和生存周期密切相关，下面我们先了解这两个知识点。

## 变量的作用域

变量的作用域，就是指变量的有效范围。在全局下声明的变量可以在任何地方被访问，在函数内声明的变量，如果声明时没有带`var`，是全局变量，如果带`var`，是局部变量，可以在函数内的任何地方被访问到。此外，函数内如果没有声明某个变量，那么变量的搜索会沿着代码执行环境创建的作用域链往外层逐层搜索，一直搜索到全局对象为止。

```js
var a = 1

var func1 = function() {
  var b = 2
  var func2 = function() {
    var c = 3
    console.log(b) // 2
    console.log(a) // 1
  }
  func2()
  console.log(c) //Uncaught ReferenceError: c is not defined
}

func1()
```

## 变量的生存周期

全局变量的生存周期是永久的，而函数内用`var`声明的局部变量的生存周期随着函数调用的结束而销毁。

在闭包中，局部变量的生存周期可以被延续，让我们看下面这个列子：

假设页面上有 5 个`div`节点，我们通过循环来个每个`div`绑定`onclick`事件，按照索引顺序打印出各自的索引值。

```html
<div>1</div>
<div>2</div>
<div>3</div>
<div>4</div>
<div>5</div>
```

下面这段代码，`for`循环里是一个立即执行函数，该立即执行函数里保存了`i`的引用，`for`循环将执行 5 次，每次循环的`i`值因为被立即执行函数引用无法销毁，所以被封闭起来。当事件函数顺着作用域链中从内到外查找变量`i`时，会先找到被封闭在闭包环境中的`i`。

每次循环，会将立即执行函数以及`i`值存在堆栈中，当循环结束后，从堆栈中依次执行立即执行函数。

```js
var nodes = document.getElementsByTagName('div')

for (var i = 0, len = nodes.length; i < len; i++) {
  ;(function(i) {
    nodes[i].onclick = function() {
      console.log(i)
    }
  })(i)
}
```

## 闭包的更多作用

1、 **封装变量**

`mult`函数接收一些参数，返回这些参数的乘积。对于那些相同的参数，每次都进行计算是一种浪费，我们可以加入缓存机制来提高性能。可以想到，用来保存缓存的`cache`变量仅仅在`mult`函数中被使用，所以我们可以把`cache`变量封装在`mult`函数内部，既可以减少页面中全局变量，又可以避免`cache`被误改引发 bug：

```js
var mult = (function() {
  var cache = {}

  var calculate = function() {
    var a = 1
    for (var i = 0; i < arguments.length; i++) {
      a = a * arguments[i]
    }
    return a
  }
  return function() {
    var args = Array.prototype.join.call(
      Array.prototype.sort.call(arguments),
      ','
    )
    if (args in cache) {
      return cache[args]
    }
    return (cache[args] = calculate.apply(null, arguments))
  }
})()
```

2、 **延续局部变量的生存周期**

`img`对象经常用于进行数据上报：

```js
var report = function(src) {
  var img = new Image()
  img.src = src
}

report('http://xxx.com/getUserInfo')
```

但是通过查询后台的记录我们得知，因为一些低版本浏览器的实现存在 bug，在这些浏览器下使用`report`函数进行数据上报会丢失 30%左右的数据，也就是说，`report`函数并不是每一次都成功发起了 HTTP 请求。丢失数据的原因是`img`是`report`函数中的局部变量，当`report`函数的调用结束后，`img`局部变量随即被销毁，而此时或许还没来得及发出 HTTP 请求，所以此次请求就会丢失掉。

现在我们把`img`变量用闭包封闭起来，就可以解决丢失的问题：

```js
var report = (function() {
  var imgs = []
  return function(src) {
    var img = new Image()
    imgs.push(img)
    img.src = src
  }
})()
```

## 闭包和面向对象设计

对象以方法的形式包含了过程，而闭包则是在过程中以环境的形式包含了数据。通常用面向对象思想能实现的功能，用闭包也能实现。

```js
//闭包
var extent = function() {
  var value = 0
  return {
    call: function() {
      value++
      console.log(value)
    }
  }
}
var extent = extent()
extent.call() // 1
extent.call() // 2

// 面向对象
var extent = {
  value: 0,
  call: function() {
    this.value++
    console.log(this.value)
  }
}
extent.call() // 1
extent.call() // 2

// 或者
var Extent = function() {
  this.value = 0
}

Extent.prototype.call = function() {
  this.value++
  console.log(value)
}

var extent = new Extent()
extent.call() // 1
extent.call() // 2
```

# 高阶函数

高阶函数是指至少满足下列条件之一的函数：

1.  函数可以作为参数被传递
2.  函数可以作为返回值输出

JavaScript 语言中的函数显然满足高阶函数的条件。下面就列举一些高阶函数的应用。

## 函数作为参数传递

1.  回调函数
2.  Array.prototype.sort

```js
//ajax回调函数
var getUserInfo = function(userId, callback) {
  $.ajax('http://xxx.com/getUserInfo?' + userId, function(data) {
    if (typeof callback === 'function') {
      callback(data)
    }
  })
}
getUserInfo(13157, function(data) {
  alert(data.userName)
})
```

```js
//Array.prototype.sort接收一个函数当作参数，这个函数里封装了数组元素的排序规则
;[1, 4, 3].sort(function(a, b) {
  return a - b
})
;[1, 4, 3].sort(function(a, b) {
  return b - a
})
```

## 函数作为返回值输出

让函数继续返回一个可执行的函数，意味着运算过程是可延续的。

1.  判断数据的类型
2.  getSingle

```js
// 判断数据的类型

var Type = {}
for (var i = 0, type; (type = ['String', 'Array', 'Number'][i++]); ) {
  ;(function(type) {
    Type['is' + type] = function(obj) {
      return Object.prototype.toString.call(obj) === '[object ' + type + ']'
    }
  })(type)
}
```

```js
// 单例模式
var getSingle = function(fn) {
  var ret
  return function() {
    return ret || (ret = fn.apply(this, argument))
  }
}
```

## 高阶函数实现 AOP

AOP（面向切面编程）的主要作用是把一些跟核心业务逻辑无关的功能抽离出来，比如日志统计、安全控制、移动处理等。抽离出来后再通过“动态织入”的方式参入业务逻辑模块中。这样做的好处是可以保证业务逻辑模块的纯净和高内聚性，还可以复用日志统计等功能模块。

在 JavaScript 中实现 AOP，都是指把一个函数“动态织入”到另外一个函数之中，这里通过扩展`Function.prototype`来实现：

```js
Function.prototype.before = function(beforefn) {
  var __self = this // 保存原函数的引用
  return function() {
    // 返回包含了原函数和新函数的"代理"函数
    beforefn.apply(this, arguments) // 执行新函数，修正this
    return __self.apply(this, arguments) // 执行原函数
  }
}

Function.prototype.after = function(afterfn) {
  var __self = this
  return function() {
    var ret = __self.apply(this, arguments)
    afterfn.apply(this, arguments)
    return ret
  }
}

var func = function() {
  console.log(2)
}

func = func
  .before(function() {
    console.log(1)
  })
  .after(function() {
    console.log(3)
  })

func() // 1 2 3
```

## 高阶函数的其他应用

1、 **currying**

`currying`又称部分求值，一个`currying`的函数首先会接收一些参数，该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。待到函数被真正需要求值的时候，之前传入的所以参数都会被一次性用于求值。

柯里化是把接收多个参数的函数换成接收一个单一参数的函数，该函数返回一个可接收余下的参数并返回结果的新函数。

我们通过一个列子来理解`currying`，假设我们要编写一个计算每月开销的`cost`函数，每天结束之前记录下进行花了多少钱，直到第 30 天才进行求值计算：

```js
var cost = (function() {
  var args = []
  return function() {
    if (arguments.length === 0) {
      var money = 0
      for (var i = 0; i < args.length; i++) {
        money += args[i]
      }
      return money
    } else {
      ;[].push.apply(args, arguments)
    }
  }
})()

cost(200) // 未真正求值
cost(300) // 未真正求值
cost(100) // 未真正求值

console.log(cost()) // 600
```

接下来我们编写一个通用的`function currying(){}`，接收一个参数——将要被`currying`的函数：

```js
var currying = function(fn) {
  var args = []
  return function() {
    if (arguments.length === 0) {
      return fn.apply(this, args)
    } else {
      ;[].push.apply(args, arguments)
      return arguments.callee
    }
  }
}
var cost = (function() {
  var money = 0
  return function() {
    for (var i = 0; i < arguments.length; i++) {
      money += arguments[i]
    }
    return money
  }
})()
var cost = currying(cost)
cost(100)
cost(200)
cost(300)
console.log(cost)
```

2、 **uncurrying**

反柯里化和柯里化的含义正好相反，如果说柯里化的作用是固定部分参数，使函数针对性更强，那么反柯里化的作用就是扩大一个函数的应用范围，使一个函数适用于其他对象。

如果说`curry`是预先传入一些参数，那么`uncurrying`就是把原来已经固定的参数或者`this`上下文当做参数延迟到未来传递，也就是把`this.mothod`的调用模式转化成`method(this,arg1,arg2...)`。

我们可以使用`call`或者`apply`改变函数运行时的`this`指向，而从可以使用其他对象的方法。那么有没有办法把泛化`this`的过程提取出来呢。`uncurrying`就是用来解决这个问题的。以下代码是`uncurrying`的实现方式之一：

```js
Function.prototype.uncurrying = function() {
  var self = this
  return function() {
    var obj = Array.prototype.shift.call(arguments)
    return self.apply(obj, arguments)
  }
}
//另一种实现

Function.prototype.uncurrying = function() {
  var self = this
  return function() {
    return Function.prototype.call.apply(self, arguments)
  }
}
```

当我们想使用`array`对象的`push`方法时，我们可能会这样实现：

```js
;(function() {
  Array.prototype.push.call(arguments, 4)
  console.log(arguments) // [1,2,3,4]
})(1, 2, 3)
```

使用反柯里化的方式，我们可以这样实现：

```js
var push = Array.prototype.push.uncurrying()
;(function() {
  push(arguments, 4)
  console.log(arguments)
})(1, 2, 3)
```

3、**函数节流**

函数频繁地调用，会造成大的性能问题，比如`window.onresize`事件、`mousemove`事件等。

假设我们需要在`window.onresize`事件中打印当前浏览器窗口大小，在通过拖拽改变窗口大小的时候，打印窗口的工作 1s 进行了 10 次，而实际 2 次就够了，我们可以按时间段来忽略一些事件请求，比如确保 500ms 内只打印一次，借助`setTimeout`可以实现。

下面`throttle`函数的原理是，将即将被执行的函数用`setTimeout`延迟一段时间执行。如果该次延迟执行还没完成，则忽略接下来调用该函数的请求。`throttle`函数接收 2 个参数，第一个参数为需要被延迟执行的函数，第二个参数为延迟执行的时间：

```js
var throttle = function(fn, interval) {
  var __self = fn,
    timer,
    firstTime = true
  return function() {
    var args = arguments,
      __me = this
    if (firstTime) {
      __self.apply(__me, args)
      return (firstTime = false)
    }
    if (timer) {
      return false
    }
    timer = setTimeout(function() {
      clearTimeout(timer)
      timer = null
      __self.apply(__me, args)
    }, interval || 500)
  }
}

window.onresize = throttle(function() {
  console.log(1)
}, 500)
```

4、 **分时函数**

书中举例创建 DOM 节点时使用分时函数，个人觉得 DOM 节点可以使用`document.createDocumentFragment()`优化，所以这里只列出了分时函数的实现，具体应用还待探索中……`timeChunk`函数接收 3 个参数：全部数组、逻辑函数、分块数：

```js
var timeChunk = function(ary, fn, count) {
  var t
  var start = function() {
    for (var i = 0; i < Math.min(count || 1, ary.length); i++) {
      var obj = ary.shift()
      fn(obj)
    }
  }
  return function() {
    t = setInterval(function() {
      if (ary.length === 0) {
        return clearInterval(t)
      }
      start()
    }, 200)
  }
}

var ary = []
for (var i = 1; i <= 1000; i++) {
  ary.push(i)
}

var renderFriendList = timeChunk(
  ary,
  function(n) {
    var div = document.createElement('div')
    div.innerHTML = n
    document.body.appendChild(div)
  },
  8
)
renderFriendList()
```

5、 **惰性加载函数**

因浏览器之间的实现差异，一些嗅探工作总是不可避免，比如我们需要一个在各个浏览器中能够通用的事件绑定函数`addEvent`，常见写法如下：

```js
var addEvent = function(elem, type, handler) {
  if (window.addEventListener) {
    return elem.addEventListener(type, handler, false)
  } else if (window.attachEvent) {
    return elem.attachEvent('on' + type, handler)
  }
}
```

这个函数的缺点是每次调用时都会执行`if`条件分支，虽然开销不大，但有一些方法可以避免重复的执行过程。

第二种方案是这样，我们把嗅探浏览器的操作提前到代码加载的时候，在代码加载的时候立刻进行一次判断，以便让`addEvent`返回一个包含正确逻辑的函数：

```js
var addEvent = (function() {
  if (window.addEventListener) {
    return function(elem, type, handler) {
      elem.addEventListener(type, handler, false)
    }
  } else if (window.attachEvent) {
    return function(elem, type, handler) {
      elem.attachEvent('on' + type, handler)
    }
  }
})()
```

目前的`addEvent`函数依然有个缺点，也许我们从头到尾都没有使用过`addEvent`函数，这样看来，前一次的浏览器嗅探就是完全多余的了。

第三种方案即是惰性载入函数方案。此时`addEvent`依然被声明为一个普通函数，在函数里依然有一些分支判断。但是在第一次进入条件分支之后，在函数内部会重写这个函数，重写之后的函数就是我们期望的`addEvent`函数，在下一次进入`addEvent`函数的时候，不会再存在条件分支语句：

```js
var addEvent = function(elem, type, handler){
  if(window.addEventListener){
    addEvent = function(elem, type. handler){
      elem.addEventListener(type, handler, false)
    }
  }else if(window.attachEvent){
    addEvent = function(elem, type, handler) {
      elem.attachEvent('on' + type, handler)
    }
  }
  addEvent(elem,type,handler)
}
```

# 单例模式

单例模式的定义是：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

## 实现单例模式

要实现一个标准的单例模式并不复杂，用一个变量标志是否已经为某个类创建过对象，如果是，则直接返回该对象：

```js
var Singleton = function(name) {
  this.name = name
}
Singleton.prototype.getName = function() {
  console.log(this.name)
}
Singleton.getInstance = (function() {
  var instance = null
  return function(name) {
    if (!instance) {
      instance = new Singleton(name)
    }
    return instance
  }
})()

var a = Singleton.getInstance('sven1')
var b = Singleton.getInstance('sven2')
console.log(a === b) // true
```

我们通过`Singleton.getInstance`来获取`Singleton`类的唯一对象，这种方式相对简单，但有一个问题，增加了这个类的“不透明性”。

## 透明的单例模式

在下面的例子中，我们将使用`CreateDiv`单例类，该类的作用是在页面中创建唯一的`div`节点：

```js
var CreateDiv = (function() {
  var instance
  var CreateDiv = function(html) {
    if (instance) {
      return instance
    }
    this.html = html
    this.init()
    return (instance = this)
  }
  CreateDiv.prototype.init = function() {
    var div = document.createElement('div')
  }
})()
```

虽然上面的代码实现了透明的单例类，但它同样有一些缺点，`CreateDiv`的构造函数实际上负责了两件事：创建对象执行初始化方法，保证只有一个对象。没有遵循单一职责原则。

## 用代理实现单例模式

现在我们通过引入代理类的方式，解决上面提到的问题：

```js
var CreateDiv = function(html) {
  this.html = html
  this.init()
}
CreateDiv.prototype.init = function() {
  var div = document.createElement('div')
  div.innerHTML = this.html
  document.body.appendChild(div)
}
```

代理类`ProxySingletonCreateDiv`：

```js
var ProxySingletonCreateDiv = (function() {
  var instance
  return function(html) {
    if (!instance) {
      instance = new CreateDiv(html)
    }
    return instance
  }
})()

var a = new ProxySingletonCreateDiv('sven1')
var b = new ProxySingletonCreateDiv('sven2')
alert(a === b)
```

现在我们把负责单例的逻辑移到了代理类`ProxySingletonCreateDiv`中，这样一来`CreateDiv`就变成了一个普通的类，它跟`ProxySingletonCreateDiv`组合起来可以达到单例模式的效果。

## JavaScript 中的单例模式

前面提到的几种单例模式的实现， 更多的是接近传统面向对象语言中的实现， 单例对象从“类”中创建而来。 在以类为中心的语言中， 这是很自然的做法。

但 JavaScript 其实是一门无类（class-free） 语言， 也正因为如此， 生搬单例模式的概念并无意义。 在 JavaScript 中创建对象的方法非常简单， 既然我们只需要一个“唯一”的对象， 为什么要为它先创建一个“类”呢？

全局变量不是单例模式， 但在 JavaScript 开发中， 我们经常会把全局变量当成单例来使用。 例如：

```js
var a = {}
```

当用这种方式创建对象 a 时， 对象 a 确实是独一无二的。 如果 a 变量被声明在全局作用域下， 则我们可以在代码中的任何位置使用这个变量， 全局变量提供给全局访问是理所当然的。 这样就满足了单例模式的两个条件。

## 惰性单例

惰性单例指的是在需要的时候才创建对象实例。下面我们将以 WebQQ 的登录浮窗为例， 介绍与全局变量结合实现惰性的单例，很明显这个浮窗在页面里总是唯一的：

```js
var createLoginLayer = function() {
  var div = document.createElement('div')
  div.innerHTML = '我是登录浮窗'
  div.style.display = 'none'
  document.body.appendChild(div)
  return div
}
document.getElementById('loginBtn').onclick = function() {
  var loginLayer = createLoginLayer()
  loginLayer.style.display = 'block'
}
```

## 通用的惰性单例

上一节我们完成了一个可用的惰性单例， 但是它还有如下问题：

1.  违反单一职责原则，创建对象和管理单例的逻辑都放在`createLoginLayer`对象内部
2.  如果我们下次需要创建页面中唯一的 iframe，或者 script 标签，就必须得如法炮制，把 createLoginLayer 函数几乎照抄一遍。

现在我们就把如何管理单例的逻辑从原来的代码中抽离出来， 这些逻辑被封装在 `getSingle` 函数内：

```js
var getSingle = function(fn){
  var result
  return function(){
    return result || result = fn.apply(this, arguments)
  }
}
```

接下来将用于创建登录浮窗的方法用参数 fn 的形式传入 getSingle， 我们不仅可以传入 createLoginLayer， 还能传入 createScript 等。 之后再让 getSingle 返回一个新的函数， 并且用一个变量 result 来保存 fn 的计算结果。 result 变量因为身在闭包中， 它永远不会被销毁。 在将来的请求中， 如果 result 已经被赋值， 那么它将返回这个值。 代码如下：

```js
var createLoginLayer = function() {
  var div = document.createElement('div')
  div.innerHTML = '我是登录浮窗'
  div.style.display = 'none'
  document.body.appendChild(div)
  return div
}
var createSingleLoginLayer = getSingle(createLoginLayer)
document.getElementById('loginBtn').onclick = function() {
  var loginLayer = createSingleLoginLayer()
  loginLayer.style.display = 'block'
}
```

# 参考文献

1.  tcatche github **[函数式编程-柯里化和反柯里化](https://github.com/tcatche/tcatche.github.io/issues/22)**
