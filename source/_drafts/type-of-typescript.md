---
title: Typescript 的 type
tags: typescript
---

TypeScript 是 JavaScript 的一个超集，主要提供了**类型系统**和**对 ES6 的支持**，它由 Microsoft 开发，代码**[开源于 GitHub](https://github.com/Microsoft/TypeScript)** 上。

<!--more-->

# 基础类型

JS 中有 5 中基本类型：boolean，number，string，null，undefined，两种引用类型：Array，Object。Typescript（以下简称 TS）支持与 JS 相同的数据类型，此外还提供枚举等类型。

## boolean

在 TS 中，类型标注通过`:TypeAnnotation`语法，比如 boolean 类型：

```ts
let isDone: boolean = false
```

## number

TS 同 JS 一样，所有的数字都是浮点数。除了十进制喝十六进制，TS 还支持 ES6 中引入的二进制喝八进制字面量：

```ts
let decLiteral: number = 6
let hexLiteral: number = 0xf00d
let binaryLiteral: number = 0b1010
let octalLiteral: number = 0o744
```

## string

```ts
let name: string = 'Gene'
let age: number = 37
let sentence: string = `Hello, my name is ${name}.

I'll be ${age + 1} years old next month.`
```

## void

`void`表示没有任何类型，可以用来表示没有任何返回值的函数：

```ts
function warnUser(): void {
  console.log('This is my warning message')
}
```

声明一个`void`类型的便利没什么用，只能将它赋值为`undefined`或`null`。

```ts
let unusable: void = undefined
```

## null 和 undefined

默认情况下`null`和`undefined`是所有类型的子类型。 就是说你可以把 `null`和`undefined`赋值给`number`类型的变量。然而，当你指定了`--strictNullChecks`标记，`null`和`undefined`只能赋值给 `void` 和它们各自。

## any

`any`表示允许被赋值为任意类型：

```ts
let notSure: any = 4
notSure = 'maybe a string instead'
notSure = false // okay, definitely a boolean
```

访问任意类似元素的任何属性和方法，都不会引起 TS 报错：

```ts
let anyThing: any = 'hello'
console.log(anyThing.myName)
console.log(anyThing.myName.firstName)
anyThing.setName('Jerry')
anyThing.setName('Jerry').sayHello()
anyThing.myName.setFirstName('Cat')
```

注意：变量在声明时，如果为指定类型，则默认被识别为`any`类型。

## never

`never`类型表示永远不存在的值的类型。比如：never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 never 类型，当它们被永不为真的类型保护所约束时。

never 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。 即使 any 也不可以赋值给 never。

```ts
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message)
}

// 推断的返回值类型为never
function fail() {
  return error('Something failed')
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {}
}
```

## 数组

TS 有两种方式表示数组元素，一种是：`TypeAnnotation[]`：

```ts
let list: number[] = [1, 2]
```

另一种是：`Array<TypeAnnotation>`:

```ts
let list: Array<number> = [1, 2, 3]
```

## 元组

元组表示已知元素数量和类型的数组，各元素的类型不一定是相同的，比如：

```ts
let x: [string, number]

x = ['hello', 10] // OK

x = [10, 'hello'] // Error
```

注意，当访问一个越界元素时，TS 将使用联合类型进行约束：

```ts
x[3] = 'world' // OK, 字符串可以赋值给(string | number)类型

console.log(x[5].toString()) // OK, 'string' 和 'number' 都有 toString

x[6] = true // Error, 布尔不是(string | number)类型
```

## object

```ts
declare function create(o: object | null): void

create({ prop: 0 }) // OK
create(null) // OK

create(42) // Error
create('string') // Error
create(false) // Error
create(undefined) // Error
```

# 枚举

`enum`类型是对 JS 标准数据类型的一个补充。你可以使用枚举定义一些带名字的常量。TS 支持数字和基于字符串的枚举。

## 数字枚举

```ts
enum Response {
  No,
  Yes
}

function respond(recipient: string, message: Response): void {
  // ...
}

respond('Princess Caroline', Response.Yes)
```

默认情况，从`0`开始为元素编号，后面元素自动加 1。你可以手动指定成员的数值：

```ts
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}
```

如上，我们定义了一个数字枚举， `Up` 使用初始化为 1。 `Direction.Up` 的值为 1， `Down` 为 2， `Left` 为 3， `Right` 为 4。

## 字符串枚举

字符串枚举里每个成员都必须用字符串，或另外一个字符串枚举成员进行初始化。

```ts
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}
```

## 运行时的枚举

枚举在运行时以对象的形式存在：

```ts
enum E {
  X,
  Y,
  Z
}
function f(obj: { X: number }) {
  return obj.X
}
f(E)
```

上面的代码并不会报错，因为枚举`E`在运行时是一个对象，有`X`属性且值为 0。

枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射：

```ts
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}

console.log(Days['Sun'] === 0) // true
console.log(Days['Mon'] === 1) // true
console.log(Days['Tue'] === 2) // true
console.log(Days['Sat'] === 6) // true

console.log(Days[0] === 'Sun') // true
console.log(Days[1] === 'Mon') // true
console.log(Days[2] === 'Tue') // true
console.log(Days[6] === 'Sat') // true
```

TS 会将上面这段代码编译为下面的 JS:

```js
var Days
;(function(Days) {
  Days[(Days['Sun'] = 0)] = 'Sun'
  Days[(Days['Mon'] = 1)] = 'Mon'
  Days[(Days['Tue'] = 2)] = 'Tue'
  Days[(Days['Wed'] = 3)] = 'Wed'
  Days[(Days['Thu'] = 4)] = 'Thu'
  Days[(Days['Fri'] = 5)] = 'Fri'
  Days[(Days['Sat'] = 6)] = 'Sat'
})(Days || (Days = {}))
```

注意：字符串枚举不会生成反向映射。

## 常量枚举

常量枚举是使用`const enum`定义的的枚举类型：

```ts
const enum Directions {
  Up,
  Down,
  Left,
  Right
}

let directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right
]
```

常量枚举与普通枚举的区别是，它会再编译节点被删除，并且不能包含计算成员。上例的编译结果是：

```js
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */]
```

# 泛型