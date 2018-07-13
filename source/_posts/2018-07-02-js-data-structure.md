---
title: Javascript数据结构（下）
date: 2018-07-02 20:55:01
mathjax: true
tags:
- JavaScript 
- 数据结构
- 字典树
- 二叉树
- 二分查找
---

在 **[Javascript 数据结构（上）](/2018/06/22/data-structure)** 这篇文章中我们学习了数据结构的初级算法：链表、队列、栈、哈希表、堆和优先队列。本文继续介绍数据结构的高级算法：字典树、二叉树、二分查找。完整代码可到 **[Github](https://github.com/PennySuu/javascript-algorithms)** 上查看。

<!--more-->

# 树

树是由 n ($n\geq0$)个节点构成的有限集合，当 n=0 时，称为空树；当 n>0 时，n 个节点需满足以下条件：

1.  有且仅有一个称为根的节点。
2.  其余节点可分为 m 个互不相交的有限集合，且每个集合又构成一棵树，这棵树称为根节点的子树。

一棵非空的树，只有根节点没有前驱节点，其余节点有且仅有一个前驱，单可以有多个后继。

## 树的常用术语

{% asset_img tree.png 一棵树 %}

在上图中，节点 A 是根。节点 F 有一个父亲 A 并且有儿子 K、L 和 M。每一个节点可以有任意多个儿子，也可能没有儿子。没有儿子的节点称为 **叶子节点** ；上图中的叶子节点是 B、C、H、I、P、Q、K、L、M 和 N。具有相同父亲的节点为 **兄弟** ；因此 K、L 和 M 都是兄弟。用类似的发放可以定义 **祖父** 和 **孙子** 关系。

从节点 $n_1$ 到 $n_k$ 的 **路径** 定义为节点$n_1$，$n_2$，...，$n_k$ 的一个序列，使得对于 $1 \leq i < k$ 节点的 $n_i$ 是 $n_{i+1}$ 的父亲。这条路径的 **长度** 是该路径上的边的条数，即$k-1$。从每个节点到它自己有一条长为 0 的路径。在一棵树中，从根节点到每个节点恰好存在一条路径。

对任意节点$n_i$，$n_i$的 **深度** 为从根到$n_i$的唯一的路径的长度。因此，根的深度为 0。$n_i$的 **高** 是从$n_i$到一片树叶的最长路径的长。因此所以的叶子节点的高都是 0.一棵树的高等于它的根的高。上图中。E 的深度为 1 而高为 2；F 的深度为 1 高也为 1；该树的高为 3.一个数的深度等于它的最深的叶子节点的深度；该深度总是等于这棵树的高。

# 字典树 Trie

字典树，又称单词查找树，是一种有序树，是一种哈希树的变种，用于保存关联数组，其中的键通常是字符串。与二叉查找数不同，建不是直接保存在节点中，而是有节点在树中的位置决定。一个节点的所有子孙都有相同的前缀，而根节点对应空字符串。

Trie 这个术语来自于 retrieval。根据词源学，trie 的发明者 Edward Fredkin 把它读作`/ˈtriː/` "tree"。[1][2]但是，其他作者把它读作`/ˈtraɪ/`"try"。

{% asset_img trie.svg Trie结构 %}

上图是一个保存了 8 个键的 trie 结构，"A", "to", "tea", "ted", "ten", "i", "in", "inn"。键不需要被显式地保存在节点中。图示中标注出完整的单词，只是为了演示 trie 的原理。

典型应用是用于统计，排序和保存大量的字符串（但不限于字符串），所以经常被搜索引擎系统用于文本词频统计。它的优点是：利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较，查询效率比哈希树高。

1.  **[trekhleb github](https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/trie)**
2.  **[YouTuBe](https://www.youtube.com/watch?v=zIjfhVPRZCg&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=7&t=0s)**

## 操作

1、 插入操作

假设我们准备插入一个单词`pea`，首先将单词转换为字符数组['p','e','a']，遍历字符数组创建节点，其中下一个节点是上一个节点的孩子节点，根据当前节点的索引可以此时是否是一个完整的单词，通过`isComplete`变量对当前节点进行标记

2、 查找操作

假设我们准备查找是否存在`pea`这个单词，和上面一样，首先需要转换为字符数组['p','e','a']，遍历数组，当前节点`p`是否有孩子节点`e`，如果有，当前节点重置为`e`，并判断当前节点`e`是否有孩子节点`a`如果有，则存在`pea`，迭代过程中哪一步返回结果为`false`则不存在单词`pea`。因为我们只需要判断是否有某个孩子节点，最快的查询方式应该使用哈希表来实现，所以本文中，我们使用哈希表来保存某个节点的孩子节点。

JavaScript 实现**字典树**数据结构的核心代码：**[TrieNode.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/trie/TrieNode.js)**和**[Trie.js](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/trie/TrieNode.js)**。

## 实现

`TireNode`节点类，用于构造节点，保存字符，是否完成的标记和以该字符为前缀的孩子节点：

```js
import HasTable from '../hash-table/HashTable'

export default class TrieNode {
  constructor(character, isCompleteWord = false) {
    this.character = character
    this.isCompleteWord = isCompleteWord
    this.children = new HasTable()
  }
  getChild(character) {
    return this.children.get(character)
  }
  addChild(character, isCompleteWord = false) {
    if (!this.children.has(character)) {
      this.children.set(character, new TrieNode(character, isCompleteWord))
    }
    return this.children.get(character)
  }
  hasChild(character) {
    return this.children.has(character)
  }
  suggestChildren() {
    return [...this.children.getKeys()]
  }
  toString() {
    let childrenAsString = this.suggestChildren().toString()
    childrenAsString = childrenAsString ? `:${childrenAsString}` : ''
    const isCompleteWord = this.isCompleteWord ? '*' : ''
    return `${this.character}${isCompleteWord}${childrenAsString}`
  }
}
```

`Trie`类，实现字典树的功能，设置根节点为`*`代表空字符串：

```js
import TrieNode from './TrieNode'

// 根节点值为空
const HEAD_CHARACTER = '*'

export default class Trie {
  constructor() {
    this.head = new TrieNode(HEAD_CHARACTER)
  }
  addWord(word) {
    const characters = Array.from(word)
    let currentNode = this.head
    for (let charIndex = 0; charIndex < characters.length; charIndex++) {
      const isComplete = charIndex === characters.length - 1
      currentNode = currentNode.addChild(characters[charIndex], isComplete)
    }
  }
  suggesNextCharacters(word) {
    const lastCharacter = this.getLastCharacterNode(word)
    if (!lastCharacter) {
      return null
    }
    return lastCharacter.suggestChildren()
  }
  doesWordExist(word) {
    return !!this.getLastCharacterNode(word)
  }
  getLastCharacterNode(word) {
    const characters = Array.from(word)
    let currentNode = this.head
    for (let charIndex = 0; charIndex < characters.length; charIndex++) {
      if (!currentNode.hasChild(characters[charIndex])) {
        return null
      }
      currentNode = currentNode.getChild(characters[charIndex])
    }
    return currentNode
  }
}
```

# 二叉树
