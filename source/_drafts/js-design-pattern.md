---
title: JavaScript设计模式（3）
date: 2018-08-01 20:28:57
tags:
  - JavaScript
  - 设计模式
  - 命令模式
---

《JavaScript 设计模式与开发实践》，作者：曾探，读书笔记。本文介绍几种设计模式：命令模式。本文中所有源代码存放在**[Github](https://github.com/PennySuu/js-design-pattern-exmaple-from-book)**。

<!--more-->

# 命令模式

命令模式的核心是对命令进行封装，消除命令的调用者和命令的接收者之间的耦合关系。意思是，调用命令的人，不关心接收命令的人是谁，接收命令的人也不关心是谁发出的命令。

命令模式包含如下角色：

1. Command：抽象命令类
2. ConcreteCommand：具体命令类
3. Invoker：调用者
4. Receiver：接收者
5. Client：客户类

{% asset_img Command.jpg %}

下面通过一个例子来理解命令模式，想象有一个电视遥控器，上面有两个按键。

```html
<button type="button" id="button1">按键1</button>
<button type="button" id="button2">按键2</button>
```

按键按下之后会发生一些事情是不变的，而具体发生什么事情是可变，通过定义`setCommand`函数往按键上安装命令，执行命令的动作被约定为`command.execute()`方法。

```js
var setCommand = function(button, command) {
  button.onclick = function() {
    command.execute()
  }
}
```

此处的`setCommand`方法相当于命令模式中的`Command`抽象命令类，将不变的事物抽象出来。

假设一个按钮负责开机，另一个按钮负责关机，我们将开机、关机两个功能放在`Menu`对象中实现。由于`Menu`对象中的方法实现了具体的功能，可知`Menu`对象为命令模式中命令的`Receiver`接收者。

```js
var Menu = {
  on: function() {
    console.log('on')
  },
  off: function() {
    console.log('off')
  }
}
```

命令模式约定使用`command.execute()`方法执行命令，我们需要继续编写`ConcreteCommand`具体命令类:

```js
class OnCommand {
  constructor(receiver) {
    this.receiver = receiver
  }
  execute() {
    this.receiver.on()
  }
}

class OffCommand {
  constructor(receiver) {
    this.receiver = receiver
  }
  execute() {
    this.receiver.off()
  }
}
```

`ConcreteCommand`具体命令类接收`Receiver`接收者为参数，在`execute`方法中执行具体实现功能的方法。实例化具体命令类得到`Invoker`调用者。通过`setCommand`方法将命令绑定到具体的按钮对象上。

```js
var onButton = document.getElementById('button1')
var offButton = document.getElementById('button2')

var onCommand = new OnCommand(Menu)
var offCommand = new OffCommand(Menu)

setCommand(onButton, onCommand)
setCommand(offButton, offCommand)
```

这个例子中的客户类是`button`对象。

上面的代码编写使用面向对象的方式实现，将`Receiver`当成属性保存起来。在 JS 中，可以使用闭包的方式将`Receiver`保存起来:

```js
var onButton = document.getElementById('button1')

var OnCommand = function(receiver) {
  return {
    execute: function() {
      receiver.on()
    }
  }
}

var onCommand = new OnCommand(Menu)
setCommand(onButton, onCommand)
```

命令模式的作用不仅是封装运算块，而且可以很方便地给命令对象增加撤销操作，重做操作，宏命令功能，下面依次举例说明。

## 撤销命令

在执行命令时记录小球当前的位置，以实现撤销命令操作的功能。

```js
var ball = document.getElementById('ball')
var pos = document.getElementById('pos')
var moveBtn = document.getElementById('moveBtn')
var cancelBtn = document.getElementById('cancelBtn')

var MoveCommand = function(receiver, pos) {
  var oldPos = null
  return {
    execute: function() {
      receiver.start('left', pos, 1000, 'strongEaseOut')
      oldPos = receiver.dom.getBoundingClientRect()[receiver.propertyName]
      // 记录小球开始移动前的位置
    },
    unexecute: function() {
      receiver.start('left', oldPos, 1000, 'strongEaseOut')
      // 回到小球移动前记录的位置
    }
  }
}

var moveCommand
moveBtn.onclick = function() {
  var animate = new Animate(ball)
  moveCommand = new MoveCommand(animate, pos.value)
  moveCommand.execute()
}
cancelBtn.onclick = function() {
  moveCommand.unexecute() // 撤销命令
}
```

## 重做

将执行过的命令存放到堆栈中，重做时只需要从头开始依次执行命令即可：

```html
<html>
  <body>
    <button id="replay">播放录像</button>
  </body>
  <script>
    var Ryu = {
      attack: function() {
        console.log('攻击')
      },
      defense: function() {
        console.log('防御')
      },
      jump: function() {
        console.log('跳跃')
      },
      crouch: function() {
        console.log('蹲下')
      }
    }
    var makeCommand = function(receiver, state) {
      // 创建命令
      return function() {
        receiver[state]()
      }
    }
    var commands = {
      '119': 'jump', // W
      '115': 'crouch', // S
      '97': 'defense', // A
      '100': 'attack' // D
    }
    var commandStack = [] // 保存命令的堆栈
    document.onkeypress = function(ev) {
      var keyCode = ev.keyCode,
        command = makeCommand(Ryu, commands[keyCode])
      if (command) {
        command() // 执行命令
        commandStack.push(command) // 将刚刚执行过的命令保存进堆栈
      }
    }
    document.getElementById('replay').onclick = function() {
      // 点击播放录像
      var command
      while ((command = commandStack.shift())) {
        // 从堆栈里依次取出命令并执行
        command()
      }
    }
  </script>
</html>
```

## 宏命令

宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令。假设有一个万能遥控器，只要按一个按钮就能关上房间门，打开电脑，登录 QQ。

```js
var closeDoorCommand = {
  execute: function() {
    console.log('关门')
  }
}
var openPcCommand = {
  execute: function() {
    console.log('开电脑')
  }
}
var openQQCommand = {
  execute: function() {
    console.log('登录QQ')
  }
}
var MacroCommand = function() {
  return {
    commandsList: [],
    add: function(command) {
      this.commandsList.push(command)
    },
    execute: function() {
      for (var i = 0, command; (command = this.commandsList[i++]); ) {
        command.execute()
      }
    }
  }
}
var macroCommand = MacroCommand()
macroCommand.add(closeDoorCommand)
macroCommand.add(openPcCommand)
macroCommand.add(openQQCommand)
macroCommand.execute()
```

# 组合模式

# 参考文献

1.  **[命令模式](https://design-patterns.readthedocs.io/zh_CN/latest/behavioral_patterns/command.html)**
