---
title: What is Virtual Dom 虚拟DOM
date: 2018-06-05 11:15:19
banner: /2018/06/05/virtual-dom/bg.png
tags:
- JavaScript
- Virtual Dom
---

虚拟 DOM 的概念最初是由 React 框架提示出。先介绍时下很火的“js 框架存在的根本原因（deepest reason）”，然后一起探索虚拟 DOM 的核心思想。

<!--more-->

# 保持 UI 与状态同步

假设，我们要实现如下图所示的功能，输入邮箱回车，列表新增一条数据，删除数据，列表展示空状态：

{% asset_img state&ui.gif Keeping the UI in sync with the state is hard %}

我们可以用一个数组保存邮箱，输入邮箱并回车时将数据添加到数组并更新视图 UI，删除邮箱时将数据从数组移除并更新视图 UI。可以想象，状态每次更新都需要更新视图 UI。

如果使用 Javascript 原生语法实现功能，需要使用 JS 语法创建 HTML 元素，每次状态更新，还得手动新增或删除 DOM，并且处理跨浏览器兼容性。添加一条数据更新状态只用两行代码，而更新 UI 要 11 行：

```js
addAddress(address){
    // state logic
    const id = String(Date.now())
    this.state = this.state.concat({address, id})

    // UI logic
    this.updateHelp()
    const li = document.createElement('li')
    const span = document.createElement('span')
    const del = document.createElement('a')
    span.innerText = address
    del.innerText = 'delete'
    del.setAttribute('data-delete-id', id)
    this.ul.appendChild(li)
    li.appendChild(del)
    li.appendChild(span)
    this.items[id] = li
}
```

即使用原生 JS 实现了功能，我们的代码也是非常脆弱的。比如 UI 结构更变了。随着应用程序越来越复杂，需要在 JS 里维护的字段越来越多，需要监听事件和事件回调更新页面 DOM 的操作也越来越多。所以，保持视图和数据同步需要编写大量乏味、脆弱的代码。

而 JS 框架可以提供跨浏览器兼容的状态与 UI 同步的功能，实现基于两个基本策略：

1.  重新渲染整个组件：React。当状态变更时对比新旧两个 DOM，更新需要变更的节点。直接操作 DOM 是很消耗性能的，所以 React 提出了虚拟 DOM 的概念。
2.  使用观察者模式监听变化：Angular 和 Vue.js。状态变量被监听，当发生变化时，只有与之相关的 DOM 会被更新。

JS 框架其他的优点：

1.  支持组件化
2.  丰富的第三方库解决问题
3.  丰富的第三方组件
4.  浏览器扩展工具帮助调试
5.  适合做单页面应用
6.  强大的社区支持

# 原生 DOM

开始探索虚拟 DOM 技术之前，让我们先来回顾一下原始 DOM。

DOM 代表文档结构模型（Document Object Model），是用对象来表示结构化文档的一种方式。DOM 具有跨平台、语言独立的特点，它可以用来处理数据在 HTML、XML 等文件中的交互。浏览器处理的 DOM 实现的细节，所以我们可以使用 JS 和 CSS 与进行它交互。我们可以对 DOM 进行查看、更新、删除、插入等操作。

DOM 的问题是无法优化动态创建 UI 视图。试想我们浏览网站时，向下滚动时可能会生成上千个节点，浏览器可能会用很长的时间渲染这些节点。

# 虚拟 DOM

不直接操作 DOM，我们建立一个 DOM 的抽象对象，这样，我们就可以操作 DOM 的轻量级复制对象，对比差异，重新渲染 DOM，更改需要变更的地方。这比直接操作重量级 DOM 节点容易多了。

有两个需要思考的问题：何时重新渲染 DOM？如何高效的实现重新渲染？

我们可以通过脏检测和观察者模式检查状态的变更。而高效的实现重新渲染需要：

1.  高效的差异对比算法（diff algorithms）
2.  批量读写 DOM
3.  实现局部更新

虚拟 DOM 技术使我们避免直接操作 DOM 改进前端性能，而只需要处理模仿 DOM 树的轻量级 JS 对象，下面开始探索虚拟 DOM 技术的核心思想：

1.  用 JS 对象模拟 DOM 树
2.  状态变更后，对比新旧两个树，记录差异
3.  把第 2 步中记录的差异更新到真正的 DOM 树，更新视图 UI。

## 用 JS 对象模拟 DOM 树

用 JavaScript 表示一个 DOM 节点，只需记录它的节点类型、属性和子节点：

```js
function Element(tagName, props, children) {
  this.tagName = tagName
  this.props = props
  this.children = children
}

Element.prototype.render = function() {
  var el = document.createElement(this.tagName) // 创建元素
  var props = this.props

  for (var propName in props) {
    var propValue = props[propName]
    el.setAttribute(propName, propValue) // 设置属性
  }

  var children = this.children || []
  children.forEach(function(child) {
    var childEl =
      child instanceof Element
        ? child.render() // 子节点也是虚拟DOM，递归构建DOM节点
        : document.createTextNode(child) // 构建文本节点
    el.appendChild(childEl)
  })

  return el
}
```

现在，我们可以使用`Element`类创建虚拟 DOM，并将虚拟 DOM 转化为真是的 DOM 节点插入到文档中：

```js
import el from './element'

let lid = el('li', { key: 'd', style: 'color: red' }, ['li#d'])
let lie = el('li', { key: 'e', style: 'color:green' }, ['li#e'])
let lia = el('li', { key: 'a', style: 'color: blue' }, ['li#a'])
let lib = el('li', { key: 'b', style: 'color: yellow' }, ['li#b'])
let lic = el('li', { key: 'c', style: 'color: orange' }, ['li#c'])
let lif = el('li', { key: 'f', style: 'color: purple' }, ['li#f'])

let oldTree = el('ul', { key: 'old' }, [lia, lib, lic, lid])

var root = oldTree.render()
document.body.appendChild(root)
```

完整代码可见**[element.js](https://github.com/PennySuu/virtual-dom/blob/master/src/element.js)**。

## 比较两棵虚拟 DOM 树的差异

比较差异 diff 算法是 Virtual Dom 的核心算法。两棵树完整的 diff 算法时间复杂度为 O(n^3)，但在前端中，我们很少跨层移动 DOM 元素，所以 Virtual Dom 只会对同一个层级的元素进行对比，这样算法复杂度可达到 O(n)。

{% asset_img diff.png Virtual Dom的diff算法示意图 %}

1、 差异类型

我们说对比两棵树的差异并记录，都有哪些差异呢？

1.  替换原来的节点
2.  移动、删除、新增子节点
3.  修改节点属性
4.  变更文本节点内容

所以可以定义几种差异类型：

```js
var REPLACE = 0
var REORDER = 1
var PROPS = 2
var TEXT = 3

// 替换节点
patches[0] = [{
    type: REPLACE，
    node: newNode
}]
// 更新属性
patches[2]=[{
    type: PROPS,
    props:{
        id: 'test'
    }
}]
```

2、 深度优先遍历，记录差异

{% asset_img depth-first.png 深度优先遍历 %}

```js
function diff(oldTree, newTree) {
  var index = 0 // 当前节点的标志
  var patches = {} // 记录每个节点差异的对象
  dfsWalk(oldTree, newTree, index, patches)
  return patches
}

//深度优先遍历
function dfsWalk(oldNode, newNode, index, patches) {
  // 这里分四种情况：
  // 1. 如果没有新节点，保持原样即可
  // 2. 如果新旧节点是字符串，即文本节点，对比文本节点差异： patch.TEXT
  // 3. 如果新旧节点相同，对比属性差异：diffProps()，再对比子节点：diffChildren()
  // 4. 如果新旧节点不相同，替换旧节点： patch.REPLACE
  if (newNode === null) {
  } else if (_.isString(oldNode) && _.isString(newNode)) {
    if (newNode !== oldNode) {
      currentPatch.push({ type: patch.TEXT, content: newNode })
    }
  } else if (
    oldNode.tagName === newNode.tagName &&
    oldNode.key === newNode.key
  ) {
    var propsPatches = diffProps(oldNode, newNode)
    if (propsPatches) {
      currentPatch.push({ type: patch.PROPS, props: propsPatches })
    }
    diffChildren(
      oldNode.children,
      newNode.children,
      index,
      patches,
      currentPatch
    )
  } else {
    currentPatch.push({ type: patch.REPLACE, node: newNode })
  }
  // 记录每个节点的差异
  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}

//遍历子节点
function diffChildren(oldChildren, newChildren, index, patches) {
  // 同层列表节点对比差异 (REORDER)，见下小节
  var diffs = listDiff(oldChildren, newChildren, 'key')
  newChildren = diffs.children

  if (diffs.moves.length) {
    var reorderPatch = { type: patch.REORDER, moves: diffs.moves }
    currentPatch.push(reorderPatch)
  }
  var leftNode = null //记录上一次遍历的节点
  var currentNodeIndex = index
  oldChildren.forEach(function(child, i) {
    var newChild = newChildren[i]
    currentNodeIndex =
      leftNode && leftNode.count // 计算节点的标识 count 代表子节点的个数
        ? currentNodeIndex + leftNode.count + 1
        : currentNodeIndex + 1
    dfsWalk(child, newChild, currentNodeIndex, patches) // 深度遍历子节点的子节点
    leftNode = child
  })
}
```

在记录差异过程中，新旧两棵树进行深度优先遍历，每遍历到一个节点就进行差异对比。例如，上面`div`和新的`div`有差异，当前标记是 0：

```js
patches[0] = [{...},{...}]
```

同理`p`是`patches[1]`，`ul`是`patches[3]`。

新旧两个节点相同时，我们还需要比对两个节点属性的差异`diffProps()`：

```js
function diffProps(oldNode, newNode) {
  var count = 0 // 记录差异数
  var oldProps = oldNode.props
  var newProps = newNode.props

  var key, value
  var propsPatches = {}

  // 遍历旧节点属性，找到需要更新的（update or remove）
  for (key in oldProps) {
    value = oldProps[key]
    if (newProps[key] !== value) {
      count++
      propsPatches[key] = newProps[key]
    }
  }

  // 遍历新节点属性，找到需要新增的（add）
  for (key in newProps) {
    value = newProps[key]
    if (!oldProps.hasOwnProperty(key)) {
      count++
      propsPatches[key] = newProps[key]
    }
  }

  if (count === 0) {
    return null
  }

  return propsPatches
}
```

3、 列表对比算法

如果将子节点`p,ul,div`的顺序换成`div,p,ul`，这个对比该如何实现呢？这就是 Vritual Dom 技术 diff 算法需要解决的核心问题，也是对性能有很大影响的问题。这里引用的是 **[livoras](https://github.com/livoras/blog/issues/13)** 实现的方法：字符串最小编辑距离问题，动态规划求解算法，该算法的问题是将移动操作拆分为删除和插入，损失性能。完整 diff 算法代码可见**[diff.js](https://github.com/PennySuu/virtual-dom/blob/master/src/diff.js)**，**[list-diff.js](https://github.com/PennySuu/virtual-dom/blob/master/src/list-diff.js)**。

```js
function listDiff(oldList, newList, key) {
  var oldMap = makeKeyIndexAndFree(oldList, key)
  var newMap = makeKeyIndexAndFree(newList, key)

  var newFree = newMap.free

  var oldKeyIndex = oldMap.keyIndex
  var newKeyIndex = newMap.keyIndex

  var moves = []

  var children = []
  var i = 0
  var item
  var itemKey
  var freeIndex = 0

  // 这里分两步
  // 1. 遍历旧列表，去除新列表中不存在的节点
  // 2. 遍历新列表，插入新增节点，移动位置变化的节点（移动被拆分为：删除+插入）

  //遍历旧列表，判断是否还存在于新列表中
  while (i < oldList.length) {
    item = oldList[i]
    itemKey = getItemKey(item, key)
    //有key的情况
    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null) // 不存在的节点
      } else {
        var newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    }
    // 无key的情况
    else {
      var freeItem = newFree[freeIndex++]
      children.push(freeItem || null)
    }
    i++
  }

  var simulateList = children.slice(0)
  // 移除不存在的节点，并记录下来
  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)
      removeSimulate(i)
    } else {
      i++
    }
  }
  // 遍历新列表，i是新列表的指针，j是刚才处理过的旧列表的指针
  var j = (i = 0)
  while (i < newList.length) {
    item = newList[i]
    itemKey = getItemKey(item, key)

    var simulateItem = simulateList[i]
    var simulateItemKey = getItemKey(simulateItem, key)

    // 有key的情况
    if (simulateItem) {
      // 新旧节点key相等时，保持原样
      if (itemKey === simulateItemKey) {
        j++
      } else {
        // 旧列表中没有时，插入
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        } else {
          var nextItemKey = getItemKey(simulateList[j + 1], key)
          // 旧列表中有，且当前索引的下一项的key与新列表当前索引下的key相同
          // 把当前项移除，旧列表当前索引项即和新列表相同
          if (nextItemKey === itemKey) {
            remove(i)
            removeSimulate(j)
            j++
          }
          // 旧列表中有，插入
          else {
            insert(i, item)
          }
        }
      }
    }
    // 无key的情况
    else {
      insert(i, item)
    }
    i++
  }

  // 如果旧列表没有索引到最后，移除旧列表中剩余项
  var k = simulateList.length - j
  while (j++ < simulateList.length) {
    k--
    remove(k + i)
  }

  return {
    moves: moves,
    children: children
  }
}

function makeKeyIndexAndFree(list, key) {
  var keyIndex = {}
  var free = []
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i]
    var itemKey = getItemKey(item, key)
    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}
```

可以看出，有`key`和无`key`的差别，无`key`时所有节点都不会被复用。

React 16 之前的版本，如果列表添加唯一`key`，通过节点在旧集合中的位置（\_mountIndex），与访问过的节点在旧集合中最右的位置（lastIndex）比较，判断节点是否需要移动，如图：

{% asset_img react.jpg 移动%}

但是这个算法也有一个问题，如下图所示，最优操作应该是只移动 D，但是该算法给出的结果是移动 ABC:

{% asset_img react-1.jpg 问题%}

Vue 使用**[snabbdom](https://github.com/snabbdom/snabbdom)**中的算法，新旧两个集合各有两个头尾变量 StartIndex 和 EndIndex 相互比较：

{% asset_img vue.jpg 500 vue diff %}

后来 React 16 又推出了`Fiber`…… 算法的优化是无穷无尽的，这里就不再继续探索了。

## 把差异应用的真实 DOM 数上

对真实的 DOM 数进行深度变量，同时根据`patches`进行差异替换操作：

```js
function patch(node, patches) {
  var walkers = { index: 0 }
  dfsWalk(node, walkers, patches)
}

function dfsWalk(node, walker, patches) {
  var currentPatches = patches[walker.index] // 从patches拿出当前节点的差异

  var len = node.childNodes ? node.childNodes.length : 0
  for (var i = 0; i < len; i++) {
    // 深度遍历子节点
    var child = node.childNodes[i]
    walker.index++
    dfsWalk(child, walker, patches)
  }

  if (currentPatches) {
    applyPatches(node, currentPatches) // 对当前节点进行DOM操作
  }
}
function applyPatches(node, currentPatches) {
  currentPatches.forEach(function(currentPatch) {
    switch (currentPatch.type) {
      case REPLACE:
        node.parentNode.replaceChild(currentPatch.node.render(), node)
        break
      case REORDER:
        reorderChildren(node, currentPatch.moves)
        break
      case PROPS:
        setProps(node, currentPatch.props)
        break
      case TEXT:
        node.textContent = currentPatch.content
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  })
}
```

完整代码可见 **[patch.js](https://github.com/PennySuu/virtual-dom/blob/master/src/patch.js)**。

## 应用

Virtual DOM 算法主要是实现上面步骤的三个函数：element，diff，patch。然后就可以实际的进行使用：

```js
import diff from './diff'
import patch from './patch'
import el from './element'

let lia = el('li', { key: 'a', style: 'color: blue' }, ['li#a'])
let lib = el('li', { key: 'b', style: 'color: yellow' }, ['li#b'])
let lic = el('li', { key: 'c', style: 'color: orange' }, ['li#c'])

let p = el('p', { key: 'p' }, ['virtual dom'])
let ul = el('ul', { key: 'ul' }, [lia, lib, lic])

let oldTree = el('div', { key: 'parent' }, [p, ul])
let newTree = el('div', { key: 'parent' }, [ul, p])

var root = oldTree.render()
document.body.appendChild(root)

setTimeout(function() {
  var patches = diff(oldTree, newTree)
  console.log(patches)
  patch(root, patches)
}, 1000)
```

本文所实现的完整代码存放在 **[Github](https://github.com/PennySuu/virtual-dom)**，仅供学习。

# 参考文献

1.  Tony Freed **[What is Virtual Dom](https://tonyfreed.blog/what-is-virtual-dom-c0ec6d6a925c)**
2.  livoras **[深度剖析：如何实现一个 Virtual DOM 算法](https://github.com/livoras/blog/issues/13)**
3.  Alberto Gimeno **[The deepest reason why modern JavaScript frameworks exist](https://medium.com/dailyjs/the-deepest-reason-why-modern-javascript-frameworks-exist-933b86ebc445)**
4.  **[livoras/list-diff](https://github.com/livoras/list-diff)**
5.  **[Matt-Esch/virtual-dom](https://github.com/Matt-Esch/virtual-dom)**
6.  **[React 源码剖析系列 － 不可思议的 react diff](https://zhuanlan.zhihu.com/p/20346379)**
7.  **[react16 的 diff 算法相比于 react15 有什么改动？](https://www.zhihu.com/question/266800762/answer/392365854)**
