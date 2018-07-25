---
title: Javascript数据结构（下）
date: 2018-07-02 20:55:01
mathjax: true
tags:
- JavaScript 
- 数据结构
- 二分查找
---

在 **[Javascript 数据结构（上）](/2018/06/22/data-structure)** 这篇文章中我们学习了数据结构的初级算法：链表、队列、栈、哈希表、堆、优先队列和字典树。本文继续介绍数据结构的高级算法：二分查找。完整代码可到 **[Github](https://github.com/PennySuu/javascript-algorithms)** 上查看。**To Be Continued**

<!--more-->

# 树

树是由 n ($n\geq0$)个节点构成的有限集合，当 n=0 时，称为空树；当 n>0 时，n 个节点需满足以下条件：

1.  有且仅有一个称为根的节点。
2.  其余节点可分为 m 个互不相交的有限集合，且每个集合又构成一棵树，这棵树称为根节点的子树。

一棵非空的树，只有根节点没有前驱节点，其余节点有且仅有一个前驱，单可以有多个后继。

## 树的常用术语

{% asset_img tree.png 一棵树 %}

在上图中，节点 A 是根。节点 F 有一个父亲 A 并且有儿子 K、L 和 M。每一个节点可以有任意多个儿子，也可能没有儿子。没有儿子的节点称为 **叶子节点** ；上图中的叶子节点是 B、C、H、I、P、Q、K、L、M 和 N。具有相同父亲的节点为 **兄弟** ；因此 K、L 和 M 都是兄弟。用类似的发放可以定义 **祖父** 和 **孙子** 关系。

从节点 $n*1$ 到 $n_k$ 的 **路径** 定义为节点$n_1$，$n_2$，...，$n_k$ 的一个序列，使得对于 $1 \leq i < k$ 节点的 $n_i$ 是 $n*{i+1}$ 的父亲。这条路径的 **长度** 是该路径上的边的条数，即$k-1$。从每个节点到它自己有一条长为 0 的路径。在一棵树中，从根节点到每个节点恰好存在一条路径。

对任意节点$n_i$，$n_i$的 **深度** 为从根到$n_i$的唯一的路径的长度。因此，根的深度为 0。$n_i$的 **高** 是从$n_i$到一片树叶的最长路径的长。因此所以的叶子节点的高都是 0.一棵树的高等于它的根的高。上图中。E 的深度为 1 而高为 2；F 的深度为 1 高也为 1；该树的高为 3.一个数的深度等于它的最深的叶子节点的深度；该深度总是等于这棵树的高。

# 二叉树 Binary Tree

二叉树是一种特殊的树，它的每个结点最多只有两颗子树，并且这两颗子树也是二叉树。由于二叉树中的两颗子树有左右之分，所以二叉树是有序树。

{% asset_img btree.jpg 具有3个节点的二叉树的五种形态 %}

## 二叉树的遍历

二叉树的遍历是指沿着某条搜索路径对二叉树中的节点进行访问，使得每个节点均被访问一次且仅被访问一次。

1、 先根遍历

1.  访问根节点
2.  先根遍历左子树
3.  先根遍历右子树

2、 中根遍历

1.  中根遍历左子树
2.  访问根节点
3.  中根遍历右子树

3、 后根遍历

1.  后根遍历左子树
2.  后根遍历右子树
3.  访问根节点

对二叉树进行不同的遍历得到不同的序列，如下图，是表达式`(A+B)*C-D/E`所对应的语法树：

{% asset_img traverse.png  %}

对此语法树进行先根遍历得到序列：-\*+ABC/DE；中根遍历得到序列：A+B\*C-D/E；后根遍历得到序列：AB+C\*DE/-。它们就是这个表达式所对应的前缀表达式、中缀表达式和后缀表达式。

二叉树的遍历其实并不难，多练习几次便能很熟练的掌握。

## 实现

因为一个二叉树节点最多有两个子节点，所以我们可以保存直接链接到它们的链。在树节点的声明中，节点就是由元素的值加上到其他节点（parent、left 和 right）的引用组成的结构。JavaScript 实现 **二叉树** 数据结构的核心代码：**[BinaryTreeNode.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/tree/BinaryTreeNode.js)** 。

```js
import Comparator from '../../utils/Comparator'
import HashTable from '../hash-table/HashTable'

export default class BinaryTreeNode {
  /**
   * @param {*} value
   */
  constructor(value = null) {
    // 左节点
    this.left = null
    // 右节点
    this.right = null
    // 父节点
    this.parent = null
    // 节点值
    this.value = value
    this.nodeComparator = new Comparator()
  }
  /**
   * @return {number}
   */
  get leftHeight() {
    if (!this.left) {
      return 0
    }
    return this.left.height + 1
  }
  /**
   * @return {number}
   */
  get rightHeight() {
    if (!this.right) {
      return 0
    }
    return this.right.height + 1
  }
  /**
   * 获取树的深度
   * @return {number}
   */
  get height() {
    return Math.max(this.leftHeight, this.rightHeight)
  }turn (this.leftHeight === this.rightHeight)
  }
  /**
   * 获取父节点的兄弟节点
   */
  get uncle() {
    // 判断是否有父节点
    if (!this.parent) {
      return undefined
    }
    // 判断父节点是否有父节点
    if (!this.parent.parent) {
      return undefined
    }
    // 判断祖父节点是否有两个孩子节点
    if (!this.parent.parent.left || !this.parent.parent.right) {
      return undefined
    }
    // 判断祖父节点的左节点是否是父节点
    if (this.nodeComparator.equal(this.parent, this.parent.parent.left)) {
      // 父节点的兄弟节点是右节点
      return ths.parent.parent.right
    }
    // 父节点的兄弟节点是左节点
    return this.parent.parent.left
  }
  /**
   * @param {*} value
   * @return {BinaryTreeNode}
   */
  setValue(value) {
    this.value = value
    return this
  }
  /**
   * @param {BinaryTreeNode} node
   * @return {BinaryTreeNode}
   */
  setLeft(node) {
    // 重置左节点的父节点，因为左节点可能会被置为空，空节点没有父节点
    if (this.left) {
      this.left.parent = null
    }
    this.left = node
    if (this.left) {
      this.left.parent = this
    }
    return this
  }
  /**
   * @param {BinaryTreeNode} node
   * @return {BinaryTreeNode}
   */
  setRight(node) {
    if (this.right) {
      this.right.parent = null
    }
    this.right = node
    if (node) {
      this.right.parent = this
    }
    return this
  }
  /**
   * @param {BinaryTreeNode} nodeToRemove
   * @return {boolean}
   */
  removeChild(nodeToRemove) {
    if (this.left && this.nodeComparator.equal(this.left, nodeToRemove)) {
      this.left = null
      return true
    }
    if (this.right && this.nodeComparator.equal(this.right, nodeToRemove)) {
      this.right = null
      return true
    }
    return false
  }
  /**
   * @param {BinaryTreeNode} nodeToReplace
   * @param {BinaryTreeNode} replacementNode
   * @return {boolean}
   */
  replaceChild(nodeToReplace, replacementNode) {
    if (!nodeToReplace || !replacementNode) {
      return false
    }
    if (this.left && this.nodeComparator.equal(this.left, nodeToReplace)) {
      this.left = replacementNode
      return true
    }
    if (this.right && this.nodeComparator.equal(this.right, nodeToReplace)) {
      this.right = replacementNode
      return true
    }
    return false
  }
  /**
   * @param {BinaryTreeNode} sourceNode
   * @param {BinaryTreeNode} targetNode
   */
  static copyNode(sourceNode, targetNode) {
    targetNode.setValue(sourceNode.value)
    targetNode.setLeft(sourceNode.left)
    targetNode.setRight(sourceNode.right)
  }
  /**
   * 获取中根遍历的值
   */
  traverseInOrder() {
    let traverse = []
    // 左节点
    if (this.left) {
      traverse = traverse.concat(this.left.traverseInOrder())
    }
    // 根节点
    traverse.push(this.value)
    // 右节点
    if (this.right) {
      traverse = traverse.concat(this.right.traverseInOrder())
    }
    return traverse
  }
}
```

# 二叉查找树

二叉树的一个重要的应用是它们在查找中的使用。假设树中的每个节点存储一项数据。在我们的例子中，为简单起见，假设它们是整数，还假设所有的项都是互异的。

二叉查找树具备的性质：

1.  若左子树不空，则左子树上所有节点的值均小于根节点的值
2.  若右子树不空，则右子树上所谓节点的值均大于根节点的值
3.  它的左右子树也都是二叉查找树

如下图，左边的树是二叉查找树，单右边的树则不是，因为左子树中存在一个节点项 7 比根节点大。

{% asset_img adt.png 两棵二叉树（只有左边的树是查找树） %}

## 操作

1.  `find`查找： 根据二叉查找树的特点，假设树非空，若为空直接返回`null`，查找过程的主要步骤：若给定值`k`等于根节点，返回根节点；若给定值`k`小于根节点，在根节点的左子树上进行查找；若给定值`k`大于根节点，在根节点右子树上进行查找。递归上述过程。

2.  `insert`插入：假设待插入节点`k`，首先，在二叉查找树中查找，若查找成功，则待插入节点已存在，不用插入；否则，将新节点插入，和查找规则一致，比根节点小再左子树上进行插入，比根节点大在右子树上进行插入。新插入的节点一定是作为叶子节点添加。

3.  `remove`删除：删除一个节点要保证删除后仍然是一颗二叉查找树。删除情况稍微复杂一些，我们下一节再讨论。

## 删除

删除操作可以分 4 种情况来考虑：

1.  若待删除的节点是叶子节点，直接删除即可。
2.  若待删除的节点只有左子树，没有右子树，根据二叉查找树的特点，可将被删除节点的左子树直接替换其位置。

{% asset_img left.png 删除只有左子树的节点35 %}

3.  若待删除的节点只有右子树，没有左子树，和第 2 种情况相同，将被删除节点的右子树直接替换其位置。

{% asset_img right.png 删除只有右子树的节点65 %}

4.  做待删除的节点既有左子树又有右子树，那么我们可以找到其左子树中最大的一个节点，或者我们也可以找到其右子树中最小的一个节点，在我们的代码示例中使用的是后者，从右子树中找最小的一个节点，找到后用这个节点替换待删除的节点。如果右子树中最小的节点恰好是待删除节点的右孩子节点，根据二叉查找树的特点，我们知道，右孩子节点没有左孩子节点，所以，在替换之后，还需将待删除节点改位置的右子树更新为我们之前找到的节点的右子树。稍微有点复杂，多画几幅图试试便会明白。

{% asset_img left&right.png 删除具有左右子树的节点12  %}

## 实现

我们先构造二叉查找树节点，实现查找树的功能，再封装二叉查找树类。JavaScript 实现 **二叉查找树** 数据结构的核心代码：**[BinarySearchTreeNode.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/tree/binary-search-tree/BinarySearchTreeNode.js)** 和 **[BinarySearchTree.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/tree/binary-search-tree/BinarySearchTree.js)**。

`BinarySearchTreeNode`类，基于`BinaryTreeNode`类实现：

```js
import BinaryTreeNode from '../BinaryTreeNode'
import Comparator from '../../../utils/Comparator'

export default class BinarySearchTreeNode extends BinaryTreeNode {
  /**
   * @param {*} node value
   * @param {*} compareFunction
   */
  constructor(value = null, compareFunction = undefined) {
    super(value)
    this.compareFunction = compareFunction
    this.nodeValueComparator = new Comparator(compareFunction)
  }
  /**
   * 插入子节点
   * @param {*} value
   * @return {BinarySearchTreeNode}
   */
  insert(value) {
    if (this.nodeValueComparator.equal(this.value, null)) {
      this.value = value
      return this
    }
    // 插入的节点比本节点小，应插入到左边
    if (this.nodeValueComparator.lessThan(value, this.value)) {
      if (this.left) {
        return this.left.insert(value)
      }
      const newNode = new BinarySearchTreeNode(value, this.compareFunction)
      this.setLeft(newNode)
      return newNode
    }
    // 插入的节点大于本节点，应插入到右边
    if (this.nodeValueComparator.greaterThan(value, this.value)) {
      if (this.right) {
        return this.right.insert(value)
      }
      const newNode = new BinarySearchTreeNode(value, this.compareFunction)
      this.setRight(newNode)

      return newNode
    }
    return this
  }
  /**
   * 查询某个节点
   * @param {*} value
   * @return {BinarySearchTreeNode}
   */
  find(value) {
    // 要查询的节点与本节点相等，返回本节点
    if (this.nodeValueComparator.equal(this.value, value)) {
      return this
    }
    // 要查询的节点小于本节点，应沿左树进行查找
    if (this.nodeValueComparator.lessThan(value, this.value) && this.left) {
      return this.left.find(value)
    }
    // 要查询的节点大于本节点，应沿右树进行查找
    if (this.nodeValueComparator.greaterThan(value, this.value) && this.right) {
      return this.right.find(value)
    }
    // 没找到返回null
    return null
  }
  /**
   * @param {*} value
   * @return {boolean}
   */
  contains(value) {
    return !!this.find(value)
  }
  /**
   * 移除某个节点
   * @param {*} value
   */
  remove(value) {
    const nodeToRemove = this.find(value)
    // 没有找到要移除的节点
    if (!nodeToRemove) {
      throw new Error('Item not found in the tree')
    }
    const { parent } = nodeToRemove

    if (!nodeToRemove.left && !nodeToRemove.right) {
      // 要移除的节点没有孩子节点
      if (parent) {
        // 如果该节点有父节点，删除父节点与该节点间的联系
        parent.removeChild(nodeToRemove)
      } else {
        // 如果该节点没有父亲节，将该节点的值设为undefined
        nodeToRemove.setValue(undefined)
      }
    } else if (nodeToRemove.left && nodeToRemove.right) {
      // 要移除的节点有孩子节点且有两个
      // 从要移除的节点的右孩子节点树（较大节点）中找出最小的那个节点，用来替换将要移除的节点
      const nextBiggerNode = nodeToRemove.right.findMin()

      // 如果刚才找到的节点不等于要移除节点的右孩子节点
      if (!this.nodeComparator.equal(nextBiggerNode, nodeToRemove.right)) {
        // 将刚才找到的节点删除
        this.remove(nextBiggerNode.value)
        // 替换为要移除的节点
        nodeToRemove.setValue(nextBiggerNode.value)
      } else {
        // 如果刚才找到的节点等于要移除节点的右孩子节点
        // 将要移除节点的值设为右节点的值
        nodeToRemove.setValue(nodeToRemove.right.value)
        // 并把将要移除节点的右孩子节点直接用它的右子节点替换
        nodeToRemove.setRight(nodeToRemove.right.right)
      }
    } else {
      // 如果要移除的节点只有一个孩子节点
      const childNode = nodeToRemove.left || nodeToRemove.right
      if (parent) {
        // 如果该节点有父节点，用孩子节点替换该节点
        parent.replaceChild(nodeToRemove, childNode)
      } else {
        // 如果该节点没有父节点，将孩子节点复制到该节点去
        BinaryTreeNode.copyNode(childNode, nodeToRemove)
      }
    }
    return true
  }
  /**
   * 查找最小的节点
   * @return {BinarySearchTreeNode}
   */
  findMin() {
    if (!this.left) {
      return this
    }
    return this.left.findMin()
  }
}
```

`BinarySearchTree`类：

```js
import BinarySearchTreeNode from './BinarySearchTreeNode'

export default class BinarySearchTree {
  constructor(nodeValueCompareFunction) {
    this.root = new BinarySearchTreeNode(null, nodeValueCompareFunction)

    this.nodeComparator = this.root.nodeComparator
  }
  insert(value) {
    return this.root.insert(value)
  }
  contains(value) {
    return this.root.contains(value)
  }
  remove(value) {
    return this.root.remove(value)
  }
}
```

**未完待续**
