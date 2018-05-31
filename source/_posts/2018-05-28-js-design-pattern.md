---
title: JavaScript设计模式
date: 2018-05-28 14:23:54
tags:
- JavaScript
- 设计模式
---

JavaScript 设计模式探索。《JavaScript 设计模式与开发实践》，作者：曾探，读书笔记。

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

JavaScript 的变量了下载运行期间是可变的。一个 JavaScript 对象，既可以是 Duck 类型的对象，也可以是 Checken 类型的对象。这意味着 JavaScript 对象的多态性是与生俱来的。

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

封装实现使得对象内部的变化对其他对象而言是透明，对象之间通过暴露 API 接口来通信。以`each`迭代器为例，迭代器的作用是顺序访问聚合对象 ，使用`each`函数的人不用关心她的内部实现，只用功能正确，及时修改了内部函数，对方接口或调用方式没有变化，用户就不用关心它内部实现的改变。

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

1.  所以数据都是对象。

JavaScript 有两种数据类型：基本类型和对象类型。按照 JavaScript 设计者的本意，除了`undefined`之外，一切对应是对象。为了实现这一目的，number、boolean、string 这几种基本类型也可以通过“包装类”的方式变成对象类型。

我们不能说 JavaScript 中所有的数据都是对象，可以说绝大部分是。JavaScript 中存在一个跟对象，`Object.prototype`对象，是一个空的对象。在 JavaScript 遇到的每个对象，都是从`Object.prototype`对象克隆来的，`Object.prototype`对象是它们的原型。

```js
var obj1 = new Object()
var obj2 = {}

Object.getPrototypeOf(obj1) === Object.prototype // true
Object.getPrototypeOf(obj2) === Object.prototype // true
```

2.  要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它

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

3.  对象会记住它的原型

要 JavaScript 的原型链查找机制，每个对象至少应该先记住它自己的原型。

就 JavaScript 真正的实现来说，其实并不能说对象有原型，而只能说对象的构造器有原型。对于“对象把请求委托给它自己的原型”这句话，更好的说法是对象把请求委托给它的构造器的原型。

JavaScript 给对象提供了一个名为`__proto__`的隐藏属性，默认会指向它的构造器原型，即`[Constructor].prototype`。实际上，`__proto__`就是对象跟“对象构造器的原型”联系起来的纽带。

4.  如果对象无法响应某个请求，它会把这个请求委托给它的构造器的原型

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

**(未完待续)**
