---
title: Javascript数据结构 Data Structure 
date: 2018-06-22 16:53:12
tags:
- JavaScript
- 数据结构
- 链表/队列/栈
---

大学时上过《算法与数据结构》这门课，当时对计算机、网络、程序都没有很深的理解，导致为了应付考试，死记硬背了不少概念，但真正理解的屈指可数。工作后，重新学习数据结构，或许能有更深刻的体悟。

数据结构是计算机中组织和存储数据的一种特殊方式，它可以高效地访问和修改数据。更确切地说，数据结构是数据值的集合，数据值之间的关系或操作可以应用于数据。本文的完整代码可在 trekhleb 的**[Github](https://github.com/trekhleb/javascript-algorithms)**中获得。

<!--more-->

# 链表 Linked List

链表是一种线性表，但是并不会按线性顺序存储数据，而是每个节点里保存着到下一个节点的指针。由于不必须按顺序存储，链表在插入的时候可以达到 O(1) 的复杂度，但是查找一个节点或者访问特定编号的节点则需要 O(n) 的时间。

链表是由一组代表队列的节点组成，在最简单的情形下，每个节点有数据和指向队列中下一个节点的指针组成。这种结构可以实现在任何位置高效的插入或删除，缺点是访问时间是线性的，随机访问不够灵活。

链表最明显的好处就是，常规数组排列关联项目的方式可能不同于这些数据项目在记忆体或磁盘上顺序，数据的访问往往要在不同的排列顺序中转换。而链表是一种自我指示数据类型，因为它包含指向另一个相同类型的数据的指针（链接）。链表允许插入和移除表上任意位置上的节点，但是不允许随机存取。链表有很多种不同的类型：单向链表，双向链表以及循环链表。

{% asset_img linked-list.svg 链表 %}

Javascript 实现链表结构的核心代码：`LinkedListNode.js`和`LinkedList.js`。

`LinkedListNode`类，用于构造节点，保存数据和指针：

```js
export default class LinkedListNode {
  constructor(value, next = null) {
    this.value = value
    this.next = next
  }
  toString(callback) {
    return callback ? callback(this.value) : `${this.value}`
  }
}
```

`LinkedList`类，实现链表的功能：

```js
import LinkedListNode from './LinkedListNode'
import Comparator from '../../utils/comparator/Comparator'

export default class LinkedList {
  /**
   *@param {Function} [comparatorFunction]
   */
  constructor(comparatorFunction) {
    /** @var LinkedListNode */
    this.head = null

    /** @var LinkedListNode */
    this.tail = null

    this.compare = new Comparator(comparatorFunction)
  }
  //在头部插入一个节点
  prepend(value) {
    //构造一个新节点当做头部节点
    const newNode = new LinkedListNode(value, this.head)
    this.head = newNode

    //如果还没有尾部节点，让刚才创建的新节点作为尾部节点
    if (!this.tail) {
      this.tail = newNode
    }
    return this
  }
  /**
   *@description 在尾部插入一个节点
   *@param {*} value
   *@return {LinkedList}
   */
  append(value) {
    const newNodw = new LinkedListNode(value)

    //如果没有头部节点，让刚才创建的新节点作为头部节点
    if (!this.head) {
      this.head = newNode
      this.tail = newNode

      return this
    }

    //将新节点作为尾部节点
    this.tail.next = newNode
    this.tail = newNode

    return this
  }
  /**
   *@description 删除某个节点
   *@param {*} value
   *@return {LinkedListNode}
   */
  delete(value) {
    if (!this.head) {
      return null
    }
    let deleteNode = null

    //如果删除的是头部节点，那么使下一个节点作为头部节点
    while (this.head && this.compare.equal(this.head, value)) {
      deleteNode = this.head
      this.head = this.head.next
    }

    let currentNode = this.head

    if (currentNode !== null) {
      while (currentNode.next) {
        //如果下一个节点将被删除，那么使下一个节点的下一下节点代替该节点
        if (this.compare.equal(currentNode.next.value, value)) {
          deleteNode = currentNode.next
          currentNode.next = currentNode.next.next
        } else {
          currentNode = currentNode.next
        }
      }
    }
    //如果删除的是最后一个节点，更新this.tail
    if (this.compare.equal(this.tail.value, value)) {
      this.tail = currentNode
    }
    return deleteNode
  }
  /**
   *@description 查找节点
   * @param {Object} findParams
   * @param {*} findParams.value
   * @param {function} [findParams.callback]
   * @return {LinkedListNode}
   */
  find(value = undefined, callback = undefined) {
    if (!this.head) {
      return null
    }

    let currentNode = this.head
    while (currentNode) {
      //如果有回调函数，使用回调函数去查找节点
      if (callback && callback(currentNode.value)) {
        return currentNode
      }
      if (value !== undefined && this.compare.equal(currentNode.value, value)) {
        return currentNode
      }
      currentNode = currentNode.next
    }
    return null
  }
  /**
   *@description 删除尾部节点
   * @return {LinkedListNode}
   */
  deleteTail() {
    if (this.head === this.tail) {
      const deletedTail = this.tail
      this.head = null
      this.tail = null

      return deletedTail
    }
    const deletedTail = this.tail

    let currentNode = this.head
    while (currentNode.next) {
      if (!currentNode.next.next) {
        currentNode.next = null
      } else {
        currentNode = currentNode.next
      }
    }
    this.tail = currentNode
    return deletedTail
  }
  /**
   *@description 删除头部节点
   * @return {LinkedListNode}
   */
  deleteHead() {
    if (!this.head) {
      return null
    }

    const deletedHead = this.head

    if (this.head.next) {
      this.head = this.head.next
    } else {
      this.head = null
      this.tail = null
    }

    return deletedHead
  }
  /**
   *@description 转换为数组
   * @return {LinkedListNode[]}
   */
  toArray() {
    const nodes = []

    let currentNode = this.head
    while (currentNode) {
      nodes.push(currentNode)
      currentNode = currentNode.next
    }

    return nodes
  }
  /**
   * @param {function} [callback]
   * @return {string}
   */
  toString(callback) {
    return this.toArray()
      .map(node => node.toString(callback))
      .toString()
  }
}
```
