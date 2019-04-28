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




除了这两点之外， 命令模式还支持撤销、 排队等操作， 本章稍后将会详细讲解。



# 参考文献

1.  **[命令模式](https://design-patterns.readthedocs.io/zh_CN/latest/behavioral_patterns/command.html)**


