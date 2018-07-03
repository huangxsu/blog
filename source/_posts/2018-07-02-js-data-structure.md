---
title: Javascript数据结构（下）
date: 2018-07-02 20:55:01
tags:
- JavaScript 
- 数据结构
- 字典树
---

在 **[Javascript 数据结构（上）](/2018/06/22/data-structure)** 这篇文章中我们学习了数据结构的初级算法：链表、队列、栈、哈希表、堆和优先队列。本文继续介绍数据结构的高级算法：字典树。完整代码可到 **[Github](https://github.com/PennySuu/javascript-algorithms)** 上查看。

<!--more-->

# 字典树 Trie

字典树，又称单词查找树，是一种有序树，是一种哈希树的变种，用于保存关联数组，其中的键通常是字符串。与二叉查找数不同，建不是直接保存在节点中，而是有节点在树中的位置决定。一个节点的所有子孙都有相同的前缀，而根节点对应空字符串。

Trie 这个术语来自于 retrieval。根据词源学，trie 的发明者 Edward Fredkin 把它读作/ˈtriː/ "tree"。[1][2]但是，其他作者把它读作/ˈtraɪ/ "try"。

{% asset_img trie.svg Trie结构 %}

上图是一个保存了 8 个键的 trie 结构，"A", "to", "tea", "ted", "ten", "i", "in", "inn"。键不需要被显式地保存在节点中。图示中标注出完整的单词，只是为了演示 trie 的原理。

典型应用是用于统计，排序和保存大量的字符串（但不限于字符串），所以经常被搜索引擎系统用于文本词频统计。它的优点是：利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较，查询效率比哈希树高。

1.  **[trekhleb github](https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/trie)**
2.  **[YouTuBe](https://www.youtube.com/watch?v=zIjfhVPRZCg&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=7&t=0s)**

## 操作

1、 插入操作
2、 查找操作
