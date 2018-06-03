---
title: JavaScript设计模式
date: 2018-05-28 14:23:54
tags:
- JavaScript
- 设计模式
---

JavaScript 设计模式探索。JavaScript 代码看不懂，打开浏览器运行一下立刻可以理解了。《JavaScript 设计模式与开发实践》，作者：曾探，读书笔记。**（未完待续……）**

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

**(未完待续)**
