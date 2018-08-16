---
title: Javascript数据结构之树
date: 2018-08-01 20:55:01
mathjax: true
tags:
  - JavaScript
  - 数据结构
  - 树
  - 二叉查找树
  - 平衡二叉树/AVL树
  - 红黑树
---

在 **[Javascript 数据结构之初级](/2018/06/22/data-structure)** 这篇文章中我们学习了数据结构的初级算法：链表、队列、栈、哈希表、堆、优先队列和字典树。本文继续介绍数据结构的高级算法：二叉查找树、平衡二叉树和红黑树。完整代码可到 **[Github](https://github.com/PennySuu/javascript-algorithms)** 上查看。

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

二叉树是一种特殊的树，它的每个节点最多只有两颗子树，并且这两颗子树也是二叉树。由于二叉树中的两颗子树有左右之分，所以二叉树是有序树。

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
  }
  /**
   * 平衡因子
   * @return {number}
   */
  get balanceFactor() {
    return this.leftHeight - this.rightHeight
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
      return this.parent.parent.right
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

二叉树的一个重要的应用是它们在查找中的使用。我们知道二分查找具有很高的查找效率，但是由于二分查找要求表中记录按关键字有序，且不能用链表做存储结构，因此当表的插入、删除操作非常频繁时，维护表的有序性，需要移动表中很多记录。这种由移动记录引起的额外时间开销，就好、会抵消二分查找的优点。二叉查找树不仅具有二分查找的效率，同时又便于查找表中进行记录的增加和删除操作。

假设树中的每个节点存储一项数据。在我们的例子中，为简单起见，假设它们是整数，还假设所有的项都是互异的。

二叉查找树具备的性质：

1.  若左子树不空，则左子树上所有节点的值均小于根节点的值
2.  若右子树不空，则右子树上所谓节点的值均大于根节点的值
3.  它的左右子树也都是二叉查找树

如下图，左边的树是二叉查找树，但右边的树则不是，因为左子树中存在一个节点项 `7` 比根节点大。

{% asset_img adt.png 两棵二叉树（只有左边的树是查找树） %}

1.  **[Inserting on BST on YouTube](https://www.youtube.com/watch?v=wcIRPqTR3Kc&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=9&t=0s)**
2.  **[BST 交互式可视化效果](https://www.cs.usfca.edu/~galles/visualization/BST.html)**

## 操作

1.  `find`查找： 假设树非空，若为空直接返回`null`，查找过程的主要步骤：若给定值`k`等于根节点，返回根节点；若给定值`k`小于根节点，在根节点的左子树上进行查找；若给定值`k`大于根节点，在根节点右子树上进行查找。递归上述过程。

2.  `insert`插入：假设待插入节点`k`，首先，在二叉查找树中查找，若查找成功，则待插入节点已存在，不用插入；否则，将新节点插入，和查找规则一致，比根节点小再左子树上进行插入，比根节点大在右子树上进行插入。新插入的节点一定是作为叶子节点添加。

3.  `remove`删除：删除一个节点要保证删除后仍然是一颗二叉查找树。删除情况稍微复杂一些，我们下一节再讨论。

## 删除

删除操作可以分 4 种情况来考虑：

1.  若待删除的节点是叶子节点，直接删除即可。
2.  若待删除的节点只有左子树，没有右子树，根据二叉查找树的特点，可将被删除节点的左子树直接替换其位置。

{% asset_img left.png 删除只有左子树的节点35 %}

3.  若待删除的节点只有右子树，没有左子树，和第 2 种情况相同，将被删除节点的右子树直接替换其位置。

{% asset_img right.png 删除只有右子树的节点65 %}

4.  若待删除的节点既有左子树又有右子树，那么我们可以找到其左子树中最大的一个节点，或者我们也可以找到其右子树中最小的一个节点，在我们的代码示例中使用的是后者，从右子树中找最小的一个节点，找到后用这个节点替换待删除的节点。如果右子树中最小的节点恰好是待删除节点的右孩子节点，根据二叉查找树的特点，我们知道，这个最小的节点没有左孩子节点，所以，在替换之后，还需将待删除节点改位置的右子树更新为我们之前找到的节点的右子树。稍微有点复杂，多画几幅图试试便会明白。

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

# 平衡二叉树/ AVL 树

二叉查找树的查找效率与二叉树的形状有关，对于给定序列建立的二叉查找树，若其左、右子树均匀分布，则查找过程类似于有序表的二分查找，时间复杂度为 O($\log\_{2}n$)。但若给定序列原来有序，则建立的二叉查找树蜕化为单链表，其查找效率同顺序查找一样，时间复杂度为 O(n)，因此，在构造二叉查找树的过程中，当出现左右子树分布不均匀时，若能对其进行调整，使其依然保持均匀，就能有效地保证二叉查找树仍具有较高的查找效率。

{% asset_img AVL_Tree_Example.gif 平衡二叉树的调整方法 %}

平衡二叉树又称为 AVL 树（得名于它的发明者 G. M. Adelson-Velsky 和 E. M. Landis），它或是一颗空树，或是一颗具有下列性质的二叉树：它的左子树和右子树都是平衡二叉树，且左子树和右子树深度只差的绝对值不超过 1。

若将二叉树中某个节点的左子树深度与右子树深度之差称为该节点的 **平衡因子（平衡度）** ，则平衡二叉树中任意节点的平衡因子的绝对值小于等于 1。在 AVL 树中节点的平衡因子有 3 种可能的取值：-1、0 和 1。下图给出了两颗二叉查找树，二叉树中每一个节点旁边标注的数据就是该节点的平衡因子。由平衡二叉树的定义可知，图(a)所示是一个平衡二叉树，而图(b)所示的是一颗不平衡的二叉树。

{% asset_img avl_not.png %}

在平衡二叉树上插入或删除节点后，可能使二叉树失去平衡。下面具体讨论 AVL 树上因插入新节点导致失去平衡时的调整方法。假设在 AVL 树上插入新节点而失去平衡的最小树的根节点为 A，即 A 是距离新节点最近的，且平衡因子绝对值大于 1 的节点。失去平衡后的操作分为单向旋转和双向旋转，其实双向旋转是单向旋转的一个变种。

1.  **[AVL Tree Insertion on YouTube](https://www.youtube.com/watch?v=rbg7Qf8GkQ4&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=12&)**
2.  **[AVL Tree 交互式可视化效果](https://www.cs.usfca.edu/~galles/visualization/AVLtree.html)**

## 单向旋转

1、 **单向右旋平衡处理 LL 型：**由于在 A 的左孩子的左子树上插入新节点，是 A 的平衡度由 1 增至 2，致使以 A 为根的子树失去平衡。此时应进行一次向右旋转操作，提升 A 的左孩子节点为新的子树根节点，A 下降为新根节点的右孩子，同时将新根节点原来的右子树调整为 A 的左子树。

我们先来看一个例子，插入 3,2,1，我们得了一个不平衡的二叉树，因为节点 3 的平衡因子大于 1，插入步骤和树形状是 Left-Left(左-左)，即 LL 型。由上面的定义，我们需要提升节点 2，降低节点 3 使其成为节点 2 的右孩子。这时因为节点 2 原来没有右孩子节点，调整到这里便可结束，稍后我们继续看一个原来有右孩子的情形。

{% asset_img LL.png %}

这个例子中，图(a)是一颗平衡的二叉树，图(b)插入节点 15 后，失去平衡，失去平衡的最小树的根节点是 A，其平衡因子大于 1，我们可以看到是在节点 A 左孩子的左子树上插入导致树失去平衡，所以这是一个 LL 型，需向右旋转，提升 B 节点，降低 A 节点成为 B 节点的右孩子，因为 B 节点原来有右孩子，需要将原来的右孩子设为 A 节点的左孩子。之所以可以这么做是因为二叉查找树的性质，左子树的值一定小于根节点，右子树的值一定大小根节点。调整后得到图(c)，一颗平衡的二叉树。

{% asset_img LL2.png %}

下面我们看看代码如果实现**单向右旋平衡处理 LL 型：**

```js
/**
* LL型
* @param {BinarySearchTreeNode} rootNode
*/
rotateLeftLeft(rootNode) {
  // 将rootNode节点与leftNode节点的的链接断开
  const leftNode = rootNode.left
  rootNode.setLeft(null)

  //使leftNode节点成为rootNode节点父节点的左节点(新子树的节点)
  if (rootNode.parent) {
    rootNode.parent.setLeft(leftNode)
  } else if (rootNode === this.root) {
    //如果传入的rootNode节点就是树的根节点，使leftNode节点作为新的根
    this.root = leftNode
  }

  //将leftNode节点的右子节点设为rootNode节点的左子节点
  //因为leftNode的右节点将被rootNode节点代替
  if (leftNode.right) {
    rootNode.setLeft(leftNode.right)
  }
  //将根节点设为leftNode节点的右子节点
  leftNode.setRight(rootNode)
}
```

2、**单向左旋平衡处理 RR 型：**由于在 A 的右孩子的右子树上插入新节点， A 的平衡度与-1 变为-2，使以 A 为根的子树失去平衡。此时应进行一次向左旋转操作。提升 A 的右孩子为新的子树根节点，A 下降为新根节点的左孩子，同时将新根节点的左子树调整为 A 的右子树。

我们先看一个简单的例子，插入 1,2,3，我们得到了一个不平衡的二叉树，因为节点 1 的平衡度小于-1，插入步骤和树形状是 Right-Right（右-右），即 RR 型。由刚才的定义，我们需要提示节点 2，降低节点 1 使其成为节点 2 的左孩子，这时因为节点 2 原来没有左孩子，调整到这里便可结束，稍后我们再看一个有左孩子的例子。

{% asset_img RR.png %}

如下图，图(a)是一颗平衡二叉树，图(b)插入节点 70 后，失去平衡，失去平衡的最小树的根节点是 A，其平衡因子小于-1，我们可以看到是在节点 A 右孩子的右子树上插入新节点导致的失衡，所以这是一个 RR 型，需左旋转，提升节点 B，降低节点 A 成为节点 B 的左孩子，因为节点 B 原来有左孩子节点 30，所以需将原来的左孩子调整为节点 A 的右孩子。调整后得到图(c)，一颗平衡二叉树。

{% asset_img RR2.png %}

下面我们看看代码如果实现**单向左旋平衡处理 RR 型：**

```js
/**
  * RR型
  * @param {BinarySearchTreeNode} rootNode
  */
rotateRightRight(rootNode) {
  // 将rootNode节点与rightNode节点的的链接断开
  const rightNode = rootNode.right
  rootNode.setRight(null)

  //使rightNode节点成为rootNode节点父节点的右节点
  if (rootNode.parent) {
    rootNode.parent.setRight(rightNode)
  } else if (rootNode === this.root) {
    this.root = rightNode
  }
  //将rightNode节点的左子节点设为rootNode节点的右子节点
  //因为rightNode的左节点将被rootNode节点代替
  if (rightNode.left) {
    rootNode.setRight(rightNode.left)
  }
  //将rootNode设为rightNode的左节点
  rightNode.setLeft(rootNode)
}
```

## 双向旋转

刚才说过双向旋转是单向旋转的变种，基本思路是先将双向旋转型调整为单向旋转型，再进行单向旋转。

1、 **先左后右平衡处理 LR 型：** 由于在 A 的左孩子的右子树上插入新节点，使 A 的平衡度有 1 变为 2，失去平衡，此时应进行两次旋转操作（先左旋后右旋），提升 A 的左孩子的右孩子为新的子树根节点，A 下降为新根节点的右孩子，A 的左孩子 B 调整为新根节点的左孩子，新根节点原来的左孩子调整为 B 的右孩子，新根节点原来的右孩子调整为 A 节点的左孩子。

先看一个简单的例子，插入 3,1,2，可以看到，由于节点 3 的平衡度大于 1，这是一个不平衡的树，插入步骤和树形状是 Left-Right（左-右），即 LR 型。我们分两步进行调整，首先提升节点 2，下降节点 1 使其成为节点 2 的左孩子，然后进行 LL 型旋转，上面定义中的操作是由不平衡到平衡的直接调整步骤，这里我们采用的是间接构造 LL 型再调整的步骤，殊途同归。因为节点 2 没有左右孩子节点，所以到此便得到一颗平衡二叉树。

{% asset_img LR.png %}

再来看一个稍微复杂的例子，下图中，图(a)是一颗平衡二叉树，图(b)插入节点 45 后，失去平衡，失去平衡的最小树的根节点是 A，其平衡因子大于 1，我们可以看到是在 A 的左孩子的右子树上插入节点导致失衡，所以这是一个 LR 型，我们按照上面的定义进行调整，提升节点 C 为新的根节点，使 A 节点作为其右孩子，使 B 节点作为其左孩子，C 节点原来的左孩子调整为 B 节点的右孩子，原来的右孩子调整为 A 节点的左孩子。调整后得到图(c)一颗平衡二叉树。

{% asset_img LR2.png %}

在代码中，我们使用的简单例子里的先调整为 LL 型，再进行 LL 型旋转实现功能，毕竟 LL 旋转的方法是现成的了，因为新根节点的右孩子会在 LL 型中被调整，所以这里我们只需要调整新根节点左孩子即可：

```js
/**
* LR型
* @param {BinarySearchTreeNode} rootNode
*/
rotateLeftRight(rootNode) {
  // 将rootNode节点与leftNode节点的的链接断开
  const leftNode = rootNode.left
  rootNode.setLeft(null)

  // 将leftNode节点与其右子节点（leftRightNode）的的链接断开
  const leftRightNode = leftNode.right
  leftNode.setRight(null)

  // 将leftRightNode的左子节点链接到leftNode的右子节点
  if (leftRightNode.left) {
    leftNode.setRight(leftRightNode.left)
    leftRightNode.setLeft(null)
  }
  // 将rootNode的左节点设为leftRightNode
  rootNode.setLeft(leftRightNode)
  // 将leftRightNode的左节点设为leftNode
  leftRightNode.setLeft(leftNode)
  // 形成LL型结构
  this.rotateLeftLeft(rootNode)
}
```

2、 **先右后左平衡处理 RL 型：**由于在 A 的右孩子的左子树上插入新节点，使 A 的平衡度由-1 变成-2，失去平衡，此时应进行两次旋转操作（先右旋后左旋），提升 A 的右孩子的左孩子为新的根节点，A 下降为其左孩子，A 的右孩子 B 下降为其右孩子。新根节点原来的左子树调整为 A 的右孩子，新根节点原来的右子树调整为 B 的左孩子。

先看一个简单的例子，插入 1,3,2，由于节点 1 的平衡度小于-2，失去平衡，插入步骤和树形状 Right-Left（右-左），即 RL 型。我们需要分两步进行调整，首先提升节点 2，降低节点 3 使其成为节点 2 的右孩子，然后进行 RR 型旋转。因为节点 2 没有左右孩子节点，所以到此便得到一颗平衡二叉树。

{% asset_img RL.png %}

再看一个有左右孩子节点的例子，下图中，图(a)是一颗平衡二叉树，图(b)插入节点 55 后，失去平衡，失去平衡的最小树的根节点是 A，其平衡因子小于 -1，我们可以看到是在 A 的右孩子的左子树上插入节点导致失衡的，所以这是一个 RL 型，按照上面的定义，提升 C 为新的根节点，下降 A 为 C 的左孩子，下降 B 为 C 的右孩子，使 C 的左子树调整为 A 的右孩子，使 C 的右子树调整为 B 的左孩子。调整后得到图(c)一颗平衡二叉树。

{% asset_img RL2.png %}

在代码中，我们使用的简单例子里的先调整为 RR 型，再进行 RR 型旋转，因为新根节点的左孩子会在 RR 型中被调整，所以这里我们只需要调整新根节点右孩子即可：

```js
/**
* RL型
* @param {BinarySearchTreeNode} rootNode
*/
rotateRightLeft(rootNode) {
  //将rootNode节点与其右节点的链接断开
  const rightNode = rootNode.right
  rootNode.setRight(null)

  //将rightNode节点与其左节点的链接断开
  const rightLeftNode = rightNode.left
  rightNode.setLeft(null)

  //将rightLeftNode节点的右子节点设为rightNode节点的右子节点
  //因为rightLeftNode的右节点将被rightNode节点代替
  if (rightLeftNode.right) {
    rightNode.setLeft(rightLeftNode.right)
    rightLeftNode.setRight(null)
  }
  //将rootNode的右节点设为rightLeftNode
  rootNode.setRight(rightLeftNode)
  //将rightLeftNode节点的右节点设为rightNode
  rightLeftNode.setRight(rightNode)
  //构成RR型
  this.rotateRightRight(rootNode)
}
```

## 插入

在插入一个新节点后，我们需要重新判断树的平衡性，向上遍历找到最小的一个不平衡的树，判断平衡因子，如果平衡因子大于 1，说明左子树比较重，可能是 LL 或 LR 型，如果平衡因子小于 1，说明右子树比较重，可能是 RR 或 RL 型。区分 LL 和 LR 是根据根节点的左孩子的平衡度，LL 说明树形偏左，根节点的左孩子的平衡度大于 0，否则则是 LR 型。根据相同的原理可以区分 RR 型和 RL 型。在判断出不平衡树是哪种情况后，我们便可以根据上面的方法进行调整。判断二叉树是否平衡的代码：

```js
  balance(node) {
    //平衡因子不在[-1.0,1]这个范围内，需要重新调整使树平衡
    //左树不平衡
    if (node.balanceFactor > 1) {
      //LL型
      if (node.left.balanceFactor > 0) {
        this.rotateLeftLeft(node)
      } else if (node.left.balanceFactor < 0) {
        //LR型
        this.rotateLeftRight(node)
      }
    } else if (node.balanceFactor < -1) {
      // 右树不平衡
      if (node.right.balanceFactor < 0) {
        // RR型
        this.rotateRightRight(node)
      } else if (node.right.balanceFactor > 0) {
        // RL型
        this.rotateRightLeft(node)
      }
    }
  }
```

JavaScript 实现 **平衡二叉树** 数据结构的核心代码：**[AVLTree.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/tree/avl-tree/AVLTree.js)**

# 红黑树 Red Black Tree

红黑树是一种自平衡的二叉排序树，它是 1972 年由鲁道夫·贝尔发明的。在红黑树上的操作有着良好的最坏情况下的运行时间，即它可以在 O($log_2(n)$) 时间内完成查找、插入和删除操作。

红黑树是一种每个节点都带有颜色属性的二叉查找树，颜色是红色或黑色。可以把一颗红黑树视为一颗扩充的二叉树，用外部节点表示空指针。红黑树除了具有二叉排序树的所有性质之外，还具有以下三点性质：

1.  根节点和所有外部节点的颜色都是黑色
2.  从根节点到外部节点的路径上没有两个连续的红色节点
3.  从根节点到外部节点的所有路径上都包含相同数目的黑色节点

如下图是一颗红黑树，长方形的标有 NIL 的节点是外部节点。

{% asset_img red-black-tree.png  %}

1.  [Red Black Tree Insertion by Tushar Roy YouTube](https://www.youtube.com/watch?v=UaLIHuR1t8Q&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=63)
2.  [Red Black Tree Deletion by Tushar Roy YouTube](https://www.youtube.com/watch?v=CTvfzU_uNKE&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=64)
3.  [Red Black Tree 交互式可视化效果](https://www.cs.usfca.edu/~galles/visualization/RedBlack.html)

## 查找

每颗红黑树都是一颗二叉排序树，因此在对红黑树进行查找时，可以采用运用普通二叉树上的查找算法，查找过程不需要颜色信息。

对于普通二叉排序树进行查找的时间复杂度为 O(n)，n 为二叉排序树的深度，对于红黑树则为 O($log_2(n)$)。由于在查找普通二叉排序树、AVL 树和红黑树时，所用代码是相同的，并且在最坏情况下，AVL 树的深度最小，因此，在那些以查找为主的应用程序中，在最坏情况下，AVL 树都能获得最好的时间复杂度。

## 插入

首先使用二叉排序树的插入算法将一个节点插入到红黑树中，该节点将作为新的叶子节点插入到红黑树中某一外部节点位置。在插入过程中需要为新节点设置颜色。

若插入前红黑树为空树，则新插入的节点将成为根节点，根据性质 1，根节点必须要黑色；若插入前红黑树不为空树，将新节点的颜色设为黑色，将违反性质 3，从根节点到外部节点的路径上的黑色节点个数不等。因此，新节点必须设为红色，这就有可能违反红黑树的性质 2，出现连续两个红色节点，故需要重新平衡。

若将新节点标为红色，与性质 2 冲突，说明新节点的父节点为红色，则父节点一定不是根节点，因为根节点是黑色的，所以存在祖父节点为黑色。

学过 AVL 树之后，红黑树的平衡调整将变得很容易理解，首先我们判断新节点的叔叔节点的颜色，如果叔叔节点是红色，我们只需要改变颜色；如果叔叔节点是黑色，我们需要根据具体情况旋转处理再改变颜色。下面让我们先看看叔叔节点是红色的情况。

## 叔叔节点为红色

节点说明：`g`祖父（grandparent）节点，`p`父（parent）节点，`u`叔叔（uncle）节点，`x`新节点。

调整：`p` 和 `u` 设为黑色，`g` 设为红色，如果 `g` 为根据点，则 `g` 保持黑色不变。因此当`g`是根节点时，红黑树从根节点到外部节点的路径上的黑色节点个数增加 1。

1、 LL 型：`p` 是 `g` 的左孩子，`x` 是 `p` 的左孩子

{% asset_img LLr.png %}

2、 LR 型：`p` 是 `g` 的左孩子，`x` 是 `p` 的右孩子

{% asset_img LRr.png %}

3、 RR 型：`p` 是 `g` 的右孩子，`x` 是 `p` 的右孩子

{% asset_img RRr.png %}

4、RL 型：`p` 是 `g` 的右孩子，`x` 是 `p` 的左孩子

{% asset_img RLr.png %}

若因为改变`g`的颜色产生了不平衡现在，则`g`作为新的`x`节点，继续进行再平衡处理，让我们看看代码是如何实现的：

```js
balance(node) {
  // 如果是根节点，什么都不需要改变
  if (this.nodeComparator.equal(node, this.root)) {
    return
  }
  // 如果新节点的父节点是黑色，新节点是红色，树是平衡的
  if (this.isNodeBlack(node.parent)) {
    return
  }
  // 新节点的祖父节点
  const grandParent = node.parent.parent
  // 新节点有叔叔节点，且叔叔节点是红色，改变颜色即可
  if (node.uncle && this.isNodeRed(node.uncle)) {
    // 叔叔节点和父节点变为黑色
    this.makeNodeBlack(node.uncle)
    this.makeNodeBlack(node.parent)

    // 如果祖父节点不是根节点，祖父节点变为红色
    if (!this.nodeComparator.equal(grandParent, this.root)) {
      this.makeNodeRed(grandParent)
    } else {
      // 如果祖父节点是根节点，不需要改变颜色
      return
    }
    // 继续检查树的平衡性
    this.balance(grandParent)
  }
  // 如果叔叔节点是黑色，或者没有叔叔节点（外部节点也是黑色），需要先旋转后变色
  else if (!node.uncle || this.isNodeBlack(node.uncle)) {
    //下一节中进行讲解
  }
}
```

## 叔叔节点为黑色

调整：先根据树形进行相应的调整，调整的方式和上一章将过的 AVL 树一样的，再将子树的新根节点与旧根节点的颜色进行替换，并结束重新平衡过程。

1、 LL 型：`p` 是 `g` 的左孩子，`x` 是 `p` 的左孩子

{% asset_img LLb.png %}

2、 LR 型：`p` 是 `g` 的左孩子，`x` 是 `p` 的右孩子

{% asset_img LRb.png %}

3、 RR 型：`p` 是 `g` 的右孩子，`x` 是 `p` 的右孩子

{% asset_img RRb.png %}

4、RL 型：`p` 是 `g` 的右孩子，`x` 是 `p` 的左孩子

{% asset_img RLb.png %}

让我们看看代码是如何实现的：

```js
balance(node) {
  // 省略...
  // 如果叔叔节点是黑色，或者没有叔叔节点（外部节点也是黑色），需要先旋转后变色
  else if (!node.uncle || this.isNodeBlack(node.uncle)) {
    // 有祖父节点时才需要进行下列操作
    if (grandParent) {
      // 新的祖父节点
      let newGrandParent
      // 如果父节点是祖父节点的左孩子
      if (this.nodeComparator.equal(grandParent.left, node.parent)) {
        // 如果新节点是父节点的左孩子
        if (this.nodeComparator.equal(node.parent.left, node)) {
          // 进行LL型旋转
          newGrandParent = this.leftLeftRotation(grandParent)
        } else {
          // 否则进行LR型旋转
          newGrandParent = this.leftRightRotation(grandParent)
        }
      }
      // 如果父节点是祖父节点的右孩子
      else {
        // 如果新节点是父节点的右孩子
        if (this.nodeComparator.equal(node.parent.right, node)) {
          // 进行RR型旋转
          newGrandParent = this.rightRightRotation(grandParent)
        } else {
          // 进行RL型旋转
          newGrandParent = this.rightLeftRotation(grandParent)
        }
      }
      // 如果新的祖父节点是根节点，设为黑色
      if (newGrandParent && newGrandParent.parent === null) {
        this.root = newGrandParent
        this.makeNodeBlack(this.root)
      }
    }
  }
}
```

JavaScript 实现 **红黑树** 数据结构的核心代码：**[RedBlackTree.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/tree/red-black-tree/RedBlackTree.js)**

# 时间复杂度

| 数据结构   | 访问   | 查找   | 插入   | 删除   | 备注 |
| ---------- | ------ | ------ | ------ | ------ | ---- |
| 二叉查找树 | n      | n      | n      | n      |      |
| AVL 树     | log(n) | log(n) | log(n) | log(n) |      |
| 红黑树     | log(n) | log(n) | log(n) | log(n) | -    |

数据结构树的介绍到这里就先告一段落，后续还会继续介绍数据结构图**[Javascript 数据结构之图](/2018/08/12/js-data-structure/)**。

# 参考文献

1.  **[数据结构——C 语言描述](http://mooc.chaoxing.com/nodedetailcontroller/visitnodedetail?knowledgeId=519743)**
2.  **[Trekhleb javascript-algorithms Github](https://github.com/trekhleb/javascript-algorithms)**
3.  《数据结构——Java 语言描述》 第 1 版，作者：刘小晶，清华大学出版社
