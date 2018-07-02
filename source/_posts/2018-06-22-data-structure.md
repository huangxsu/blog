---
title: Javascript数据结构（上）
date: 2018-06-22 16:53:12
tags:
- JavaScript 
- 数据结构
- 链表/队列/栈
- 哈希表
- 堆
- 优先队列
---

数据结构是计算机中组织和存储数据的一种特殊方式，它可以高效地访问和修改数据。更确切地说，数据结构是数据值的集合，数据值之间的关系或操作可以应用于数据。本文主要介绍数据结构的初级算法：链表、队列、栈、哈希表、堆和优先队列。完整代码可到 **[Github](https://github.com/PennySuu/javascript-algorithms)** 上查看。

<!--more-->

# 数据结构

数据结构是相互之间存在一种或多种特定关系的数据元素的集合。我们从数据的逻辑结构、数据的存储结构和数据的操作 3 个方面理解数据结构。

## 逻辑结构

数据的逻辑结构是指各个元素之间的逻辑关系，按照逻辑关系的特性，可将数据结构分为以下 4 类：

1.  线性结构： 元素之间存在“一对一”的关系。若非空结构，则有且只有一个开始节点和终端节点，开始节点没有前驱有一个后继，终端节点没有后继有一个前驱，其余节点有且只有一个前驱和一个后继。
2.  树形结构： 元素之间存在“一对多”的关系。若非空结构，则有一个根节点，该节点无前驱，其余节点有且只有一个前驱，所以节点都可以有多个后继。
3.  图形结构： 元素之间存在“多对多”的关系。若非空结构，则任何节点都可能有多个前驱和后继。
4.  集合结构： 元素之间的关系是松散性的，元素之间除了“同属于一个集合”的特性之外，无其他关系

{% asset_img logic.jpg 逻辑结构 %}

有时也将逻辑结构分为两大类：线性结构和非线性结构。其中树、图、集合都是非线性结构。

## 存储结构

数据的存储结构（物理结构）是数据的逻辑结构在计算机中的实现。它包括数据元素值的表示和逻辑关系的表示两部分，是依赖于计算机的。通常有以下 4 种方式：

1.  顺序存储方式：将所有的数据元素存放在一个连续的存储空间中，并使逻辑上相邻的数据元素其对应的物理位置也相邻，即数据元素的逻辑位置关系和物理位置关系保持一致。
2.  链式存储方式：不要求逻辑相邻的元素在物理位置上也相邻，元素可以存储在任意的物理位置上。每个数据元素的存储表示有两部分组成：元素值和存放表示逻辑关系的指针。
3.  索引存储方式：在存储数据的同时，还增设了一个索引表。索引表中的每一项包括关键字和地址，关键字是能够唯一标识一个元素的数据项，地址是元素的存储地址或存储区的首地址。
4.  散列存储方式：也叫哈希存储，是指将数据元素存储在一片连续的区域内，每个元素的具体存储地址是根据该元素的关键字值，通过散列（哈希）函数直接计算出来的。

在以上 4 种存储方式中，顺序存储和链式存储是最基本、最常用的两种，索引存储和散列存储是为了提高查找效率而经常采用 的两种存储方式。

## 数据的操作

数据的操作是对数据进行某种方法的处理，也称数据的运算。只有当数据对象按一定的逻辑结构组织起来，并选择了适当的存储方法存储到计算机中，与其相关的运算才有了实现的基础。所以，数据的操作也可被认为是定义在数据逻辑结构上的操作，但操作的实现却要考虑数据的存储结构。常用的操作可以归纳为以下几种：

1.  创建： 建立数据的存储
2.  销毁： 对已经存在的存储结构将其所有空间释放
3.  插入： 在数据存储结构的适当位置上加入一个指定的新的元素
4.  删除： 将数据存储结构中某个满足指定条件的数据元素进行删除
5.  查找： 在数据存储结构中查找满足指定条件的数据元素
6.  修改： 修改数据存储结构中某个数据元素的值
7.  遍历： 对数据存储结构中每一个数据元素按某种路径访问一次且仅访问一次。

# 链表 Linked List

链表是一种线性表，让我们先来了解一下线性表的概念，线性表是有 n（n>=0）个数据元素构成的有限序列。线性表在计算机中可以用顺畅存储和链式存储两种方式结构来表示，其中用顺序存储结构表示的线性表称为顺序表，用链式存储结构表示的线性表称为链表。链表有分为单链表、双向链表和循环链表。

链表不会按线性顺序存储数据，而是每个节点里保存着到下一个节点的指针。由于不必须按顺序存储，链表在插入的时候可以达到 O(1) 的复杂度，但是查找一个节点或者访问特定编号的节点则需要 O(n) 的时间。

链表是由一组代表队列的节点组成，在最简单的情形下，每个节点包含存放数据元素值得数据域和存放指向逻辑上相邻节点的指针域 。这种结构可以实现在任何位置高效的插入或删除，缺点是访问时间是线性的，随机访问不够灵活。

链表最明显的好处就是，常规数组排列关联项目的方式可能不同于这些数据项目在记忆体或磁盘上顺序，数据的访问往往要在不同的排列顺序中转换。而链表是一种自我指示数据类型，因为它包含指向另一个相同类型的数据的指针（链接）。链表允许插入和移除表上任意位置上的节点，但是不允许随机存取。

{% asset_img linked-list.svg 链表 %}

1.  **[trekhleb github](https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/linked-list)**
2.  **[YouTuBe](https://www.youtube.com/watch?v=njTh_OwMljA&index=2&t=1s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)**

## 单链表的操作

1、 查找操作

1.  按位序号查找：给定带查找节点在单链表中的位序号`i`确定它的值，操作结果返回链表中第`i`个节点的数据域值。0<=i<=n-1(n 为链表长度)。
2.  按值查找：查找与给定值`x`相等的节点，若找到返回该节点在链表中的位置，否则返回-1。

2、 插入操作：在单链表的第`i`个节点之前插入一个数据域值为`x`的新节点，当 i=0 时，在表头插入，当 i=n 时在表尾插入。

{%asset_img linked-list-insert.png 插入操作%}

3、 删除操作：只要改变被删除节点的前驱节点的后继指针即可。

4、 建立操作： 单链表是一种动态存储结构，他不需要预先分配存储空间。生成单链表的过程是一个节点“逐个插入”的过程，根据插入位置的不同，分为两种：头插法和尾插法。

JavaScript 实现**链表**数据结构的核心代码：**[LinkedListNode.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/linked-list/LinkedListNode.js)**和**[LinkedList.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/linked-list/LinkedList.js)**。

## 实现

`LinkedListNode`节点类，用于构造节点，保存数据和指针：

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

`LinkedList`类，实现链表的功能，由于单链表只需要一个头指针就能唯一标识他，所以单链表类的成员变量需要设置一个头指针。

```js
import LinkedListNode from './LinkedListNode'
import Comparator from '../../utils/Comparator'

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
    const newNode = new LinkedListNode(value)

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
    while (this.head && this.compare.equal(this.head.value, value)) {
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
  find({ value = undefined, callback = undefined }) {
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
}
```

# 队列 Queue

## 定义

队列是一种特殊的抽象数据类型或集合，集合中的实体是有顺序的，并且规定只能在队尾新增元素——入队（enqueue），只能在对头移除元素——出队（dequeue）,因此队列是一种先进先出（FIFO: First-In-First-Out）的数据结构。第一个被添加的元素将是第一个被移除的元素，同理，新添加的元素需要等到它前面的所有元素都被移除了才可以被移除。`peek`方法允许在不移除对头元素的情况下获取其值。队列是一种线性数据结构，更确切的说是一种顺序集合。

{% asset_img queue.svg 队列 %}

## 参考

1.  **[trekhleb gitbug](https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/queue)**
2.  **[YouTuBe](https://www.youtube.com/watch?v=wjI1WNcIntg&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=3&)**

## 实现

JavaScript 实现**队列**数据结构的核心代码： **[Queue.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/queue/Queue.js)**。

```js
import LinkedList from '../linked-list/LinkedList'

export default class Queue {
  constructor() {
    this.linkedList = new LinkedList()
  }
  isEmpty() {
    return !this.linkedList.tail
  }
  /**
   * 获得对头元素的值
   */
  peek() {
    if (!this.linkedList.head) {
      return null
    }
    return this.linkedList.head.value
  }
  /**
   * 入队
   * @param {*} value
   */
  enqueue(value) {
    this.linkedList.append(value)
  }
  /**
   * 出队
   */
  dequeue() {
    const removedHead = this.linkedList.deleteHead()
    return removedHead ? removedHead.value : null
  }
}
```

队列操作方法的实现细节可复用上一节链表中定义的方法，`peek`方法是获取队列头部元素的值，`euqueue`入队方法是在队尾插入一个节点，`dequeue`方式是移除对头元素。

# 栈 Stack

## 定义

栈和队列都是线性数据结构，栈和队列的区别在于移除元素的方式，栈只能移除最新添加的元素，即后进先出（LIFO: Last-In-First-Out）。栈对集合的操作只能在集合顶部进行，通过`push`在集合顶部添加元素，通过`pop`在集合顶部移除元素，通过`peek`方法可获取集合最顶部的元素值。第一个添加的元素只有等到上面的元素都移除后才能被移除。

{% asset_img stack.png 栈 %}

## 参考

1.  **[trekhleb gitbug](https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/stack)**
2.  **[YouTuBe](https://www.youtube.com/watch?v=wjI1WNcIntg&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=3&)**

## 实现

JavaScript 实现**栈**数据结构的核心代码： **[Stack.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/stack/Stack.js)**。

```js
import LinkedList from '../linked-list/LinkedList'

export default class Stack {
  constructor() {
    this.linkedList = new LinkedList()
  }
  isEmpty() {
    return !this.linkedList.tail
  }
  /**
   * 获取尾部元素值
   */
  peek() {
    if (this.isEmpty()) {
      return null
    }
    return this.linkedList.tail.value
  }
  /**
   * 入栈
   * @param {*} value
   */
  push(value) {
    this.linkedList.append(value)
  }
  /**
   * 出栈
   */
  pop() {
    const removedTail = this.linkedList.deleteTail()
    return removedTail ? removedTail.value : null
  }
}
```

和队列一样，这里我们同样可以复用链表的方法。

# 哈希表 Hash Table

## 定义

哈希表，也叫散列表，是一种可以将键映射到值的数据结构。它通过计算一个关于键值的函数，将所需查询的数据映射到表中一个位置来访问记录，这加快了查找速度。这个映射函数称做散列函数，存放记录的数组称做散列表。

一个通俗的例子是，为了查找电话簿中某人的号码，可以创建一个按照人名首字母顺序排列的表，在首字母为 W 的表中查找“王”姓的电话号码，显然比直接查找就要快得多。这里使用人名作为关键字，“取首字母”是这个例子中散列函数的函数法则，存放首字母的表对应散列表。关键字和函数法则理论上可以任意确定。

{% asset_img hash-table.svg 哈希表 %}

理想情况下，散列函数会为每个键分配一个独一无二的存储桶，但是大多数哈希表设计使用了不完美的散列函数，这可能会导致哈希冲突，散列函数为多个 key 生成了相同的索引。

{% asset_img hash-collision.svg 单独链表法 %}

其中一种解决冲突（collisions）的方法是单独链表法：将散列到同一个存储位置的所有元素保存在一个链表中。

## 参考

1.  **[trekhleb gitbug](https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/hash-table)**
2.  **[YouTuBe](https://www.youtube.com/watch?v=shs0KM3wKv8&index=4&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)**

## 实现

JavaScript 实现**哈希表**数据结构的核心代码： **[HashTable.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/hash-table/HashTable.js)**。

```js
import LinkedList from '../linked-list/LinkedList'

// 哈希表的大小直接影响冲突的个数
// 哈希表越大冲突数越少
// 为了演示冲突是何如处理的，把哈希表的大小设置为32，一个很小的值
const defaultHashTableSize = 32

export default class HashTable {
  /**
   * @param {number} hashTableSize
   */
  constructor(hashTableSize = defaultHashTableSize) {
    // 创建一个特定大小的哈希表，每个桶填充一个空链表
    this.buckets = Array(hashTableSize)
      .fill(null)
      .map(() => new LinkedList())

    // 实际key与hashkey之间的映射
    this.keys = {}
  }
  /**
   * 将key转换为哈希值
   * @param {string} key
   * @returns {number}
   */
  hash(key) {
    const hash = Array.from(key).reduce(
      (hashAccumulator, keySymbol) => hashAccumulator + keySymbol.charCodeAt(0),
      0
    )

    return hash % this.buckets.length
  }

  /**
   * 新增元素
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    const keyHash = this.hash(key)
    this.keys[key] = keyHash
    const bucketLinkedList = this.buckets[keyHash]
    const node = bucketLinkedList.find({
      callback: nodeValue => nodeValue.key === key
    })

    if (!node) {
      bucketLinkedList.append({ key, value })
    } else {
      node.value.value = value
    }
  }

  /**
   * 删除元素
   * @param {string} key
   * @return {*}
   */
  delete(key) {
    const keyHash = this.hash(key)
    delete this.keys[key]
    const bucketLinkedList = this.buckets[keyHash]
    const node = bucketLinkedList.find({
      callback: nodeValue => nodeValue.key === key
    })
    if (node) {
      return bucketLinkedList.delete(node.value)
    }
    return null
  }

  /**
   * 获取某个元素值
   * @param {string} key
   * @return {*}
   */
  get(key) {
    const bucketLinkedList = this.buckets[this.hash(key)]
    const node = bucketLinkedList.find({
      callback: nodeValue => nodeValue.key === key
    })
    return node ? node.value.value : undefined
  }
}
```

# 堆 Heap

## 定义

堆一种基于树的数据结构，并且满足堆的规则：

1.  任意节点小于（或大于）它的所有后裔，最小元（或最大元）在堆的根上（堆序性）。
2.  堆总是一棵完全树。即除了最底层，其他层的节点都被元素填满，且最底层尽可能地从左到右填入。

将根节点最大的堆叫做最大堆或大根堆，根节点最小的堆叫做最小堆或小根堆。由二叉树实现的堆叫二叉堆，下面我们都以二叉堆为例。

{% asset_img heap.svg 大根堆%}

{% asset_img heap1.png 500 小根堆 %}

## 用数组表示堆

我们知道堆是一种基于树的数据结构，叶子节点依照从左到右的规则填入，所以我们可以使用数组来表示一个堆结构：

{% asset_img heapToArray.png 用数组表示堆 %}

从图中可以得出，已知父节点的索引`index`，可以得到左子节点的索引`index*2+1`和右子节点的索引`index*2+2`，反之知道子节点的索引可以推出父节点的索引，然后根据索引可以得到在数组中对应的值。

## 插入元素

假设我们将插入一个值为 85 的元素，由于堆是树结构，新增的节点从最底层从左到右填入，如下图：

{% asset_img heapAdd.png 交换算法 %}

从图中可以看出，这是一个大根堆，我们首先将元素 85 插入最底层，然后和它的父节点做比较，如果比父节点值大，则和父节点进行交换，重复和父节点比较的过程直到父节点比其值大时停止交换，在这个例子中，我们交换了两次。

## 删除根

假设我们将大根堆的根节点删除，删除后将堆的最后一个节点放置到根节点的位置，如果有其他叶子节点，则此时的根节点一定不是最大值，如下图所示：

{% asset_img heapRemove.png 删除根算法 %}

我们首先比较根节点（30）左子节点和右子节点的大小，选两者中较大者和根节点比较，如果比根节点大，则和根节点（30）交换位置，交换后的节点（30）继续和左右子节点中较大者进行比较，交换，直到没有叶子节点或者叶子节点都比该节点（30）小，在这个列子中，30 总共交换了两次。

## 参考

1.  **[trekhleb gitbug](https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/heap)**
2.  **[YouTuBe](https://www.youtube.com/watch?v=t0Cq6tVNRBA&index=5&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)**

## 实现

JavaScript 实现**小根堆**数据结构的核心代码： **[MinHeap.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/heap/MinHeap.js)**。由于篇幅有限，具体实现代码在此就不黏贴了。

# 优先队列

## 定义

优先队列中的每个元素都有各自的优先级，优先级最高的元素最先得到服务；优先级相同的元素按照其在优先队列中的顺序得到服务。优先队列一般可以用**堆**来实现。

普通的队列是一种先进先出的数据结构，元素在队列尾追加，而从队列头删除。在优先队列中，元素被赋予优先级。当访问元素时，具有最高优先级的元素最先删除。优先队列具有最高级先出 （first in, largest out）的行为特征。

优先队列所以可以用堆来实现，但是优先队列和堆的概念完全不同。好比列表可以用链表或数组来实现，优先队列可以用堆或者无序数组来实现。

## 操作

优先队列至少需要支持下列三种操作：

1.  插入带优先级的元素
2.  取出优先级最高的元素
3.  查看最高优先级的元素：o(1)时间复杂度

## 参考

1.  **[trekhleb gitbug](https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/priority-queue)**
2.  **[YouTuBe](https://www.youtube.com/watch?v=wptevk0bshY&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=6)**

## 实现

JavaScript 实现**优先队列**数据结构的核心代码： **[PriorityQueue.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/priority-queue/PriorityQueue.js)**。这里我们使用上一节实现的小根堆类来实现优先队列。

数据结构的初级算法就先介绍到这里。之后会继续更新数据结构的高级算法。

# 参考文献

1.  **[[数据结构和算法分析笔记]堆 Heap](http://blog.51cto.com/sauron/1227373)**
