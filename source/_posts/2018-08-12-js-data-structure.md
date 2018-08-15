---
title: Javascript数据结构之图
date: 2018-08-12 12:00:59
mathjax: true
tags:
  - JavaScript
  - 数据结构
  - 图
---

在 **[Javascript 数据结构之树](/2018/07/02/data-structure)** 这篇文章中我们学习了有关树的一些算法：二叉查找树、AVL 树和红黑树。本文继续介绍数据结构的高级算法：无向图和有向图。完整代码可到 **[Github](https://github.com/PennySuu/javascript-algorithms)** 上查看。

<!--more-->

# 图 Graph

与线性结构和树形结构相比，图是一种更复杂的数据结构。在线性结构中元素之间仅存在线性关系，即除了首元素和尾元素外，每个元素只有一个前驱和后继；在树形结构中，元素之间存在着明显的层次关系，且每一层上的元素可能和下一层中多个元素（子节点）相关，但只能和上一层的一个元素（父节点）相关；而在图形结构中，每一个数据元素都可以和其他任意的元素相关。

图是由定顶点集 V （Vertex）和边集 E （Edge）组成，V 是有穷非空集合，称为 **顶点集**， E 是有穷集合，称为 **边集**。

$e=\left ( u,v\right )$或$e=\left \langle u,v \right \rangle$，$u,v\in V$，其中$\left ( u,v\right )$表示顶点 u 与顶点 v 的一条无向边，简称边，$\left ( u,v\right )$和$\left ( v,u\right )$是等同的；而$\left \langle u,v \right \rangle$表示从顶点 u 到顶点 v 的一条有向边，u 为始点，v 为终点，$\left \langle u,v \right \rangle$和$\left \langle v,u \right \rangle$是不同的。

## 基本概念

1、 无向图：完全由无向边构成的图称为 **无向图**。
2、 有向图：完全由有向边构成的图称为 **有向图**。

{% asset_img graph.png 图的示例 %}

3、 权和网： 在图中，每条边可以标上具有某种含义的数值，称为该边上的 **权（Weight）**。通常权是一个非负实数，权可以标上从一个顶点到另一个顶点的距离、时间或代价等含义。边上有标识权的图称为 **网（Network）**。

{% asset_img network.png 图的示例 %}

4、 完全图：具有 n 个顶点的无向图，边数达到最大值$\frac{n(n-1)}{2}$时，称为无向完全图。有向完全图的边数达到最大值$n(n-1)$。
5、 领接点：在无向图中，若存在一条边$\left ( u,v\right )$，则称顶点 u 与顶点 v 互为 **领接点(Adjacent)**。边$\left ( u,v\right )$是顶点 u 和 v 的关联的边，顶点 u 和 v 是边$\left ( u,v\right )$关联的顶点。在有向图中，若存在一条边$\left \langle u,v \right \rangle$，则顶点 u 领接到顶点 v，顶点 v 领接自顶点 u。边$\left \langle u,v \right \rangle$和顶点 u、v 关联。
6、 顶点的 **度（Degree）**：图中与该顶点相关联边的数目。顶点 v 的度记为$D(v)$。例如，在图 G1 中，顶点 1 的度为 3。在有向图中，顶点 v 的度有入度和出度之分。以顶点 v 为终点的边的数目称为 **入度**，记为 $ID(v)$，以顶点 v 为起点的边的数目称为 **出度**，记为$OD(v)$。顶点的度等于它的入度和出度之和：$D(v)=ID(v)+OD(v)$。例如，在图 G2 中，顶点 V1 的入度为 1，出度为 2，顶点 v1 的度为 3。
若一个图有 n 个顶点和 e 条边，则该图所有顶点的度之和与边数 e 满足如下关系：$e=\frac{1} {2}\sum\_{i=0}^{n-1} D(v_i)$。该式表示度与边的关系。每条边关联两个顶点，对顶点的度的贡献为 2，所以全部顶点的度之和为所有边数的 2 倍。
7、 路径：在图中，路径是从顶点 u 到顶点 v 经过的顶点的序列。路径的长度指该路径上边的数目。在网中，路径长度指始点到终点的路径上各边的权重之和。
8、 连通图和连通分量： 在无向图中，若顶点 u 到 v 有路径，则 u 和 v 是连通的。若图中任意两个顶点都是连通的，则该图是连通图，如图 G1。无向图中的极大连通子图称为连通分量，如下图，有三个连通分量。

{% asset_img connectedComponent.png %}

9、 强连通图和强连通分量。在有向图 G 中，如果两个顶点间至少存在一条互相可达路径，称两个顶点强连通。如果有向图 G 的每两个顶点都强连通，称 G 是一个强连通图。
10、生成树： 生成树是一种特殊的生成子图，它包含图中的全部顶点，但只有$n-1$条边，生成树不唯一。

{% asset_img tree.png 生成树 %}

# 图的存储结构

图的存储结构除了存储图中各个顶点的信息外，还要存储于顶点相关联的边的信息。常见的存储结构有领接矩阵和领接链表。

## 领接矩阵

图的 **领接矩阵（Adjacency Matrix）**是用来表示顶点之间相邻关系的矩阵，两顶点间有相邻关系输入 1，否则输入 0。例如，无向图 G1 和有向图 G2 对应的领接矩阵分别是$A_1$和$A_2$.

$A_1$ :

{% asset_img A1.png %}

$A_2$ ：

{% asset_img A2.png %}

从领接矩阵$A_1$和$A_2$不难看出，无向图的领接矩阵是对称矩阵，因此一般可以采用压缩存储；有向图的领接矩阵一般不对称。用领接矩阵存储空间与顶点有关。

在看看网，始点到终点有相邻关系输入权值，无关系输入$\infty$，无向网 G3 和有向网 G4 对应的领接矩阵分别是$A_3$和$A_4$

$A_3$ :

{% asset_img A3.png %}

$A_4$ :

{% asset_img A4.png %}

用领接矩阵表示图，很容易判断任意两个顶点之间是否有边，同样很容易求出各个顶点的度。对于无向图，领接矩阵的第 i 行或第 i 列的非零元素的个数正好是第 i 个顶点的度。对于有向图，领接矩阵第 i 行的非零元素的个数正好是第 i 个顶点的出度，第 i 列的非无穷元素的个数正好是第 i 个顶点的入度。

领接矩阵虽然能很好地确定图中任意两个顶点之间是否有边，但是无论是求顶点的度，还是查找顶点的领接点，都需要访问对应的一行或一列中的所有数据，时间复杂度为$O(n)$。而要确定图中有多少边，必须按行对每个数据进行检测，时间复杂度$O(n^2)$，从空间上看，无论图中的顶点之间是否有边，都要在领接矩阵中保留存储空间，其空间复杂度$O(n^2)$，空间效率低。

## 领接表

**领接表** 是图的一种链式存储方法，由一个顺序存储的顶点表和 n 个链式存储的边表组成。顶点表由顶点组成；边表是由边节点组成的单链表，表示所有相邻于顶点$v_i$的边（在有向图中是以$v_i$为始点的边）。

让我们来看看图 G1、G2 和 G4 的领接表：$A_1$，$A_2$和$A_3$。

$A_1$ :

{% asset_img A11.png %}

$A_2$ ：

{% asset_img A22.png %}

$A_3$ ：

{% asset_img A33.png %}

领接表具有以下特点：

1. 在无向图的领接表中，顶点$v_i$的度恰好等于该顶点的领接表中边节点的个数；在有向图图中，顶点$v_i$的领接表中边节点的个数仅为该顶点的出度，若要求顶点的入度，可以通过建立一个有向图的逆领接表得到。如上图$A_2$所示，所谓逆领接表，就是对图中每个顶点$v_i$建立一个以$v_i$为终点的边。

2. 对于有 n 个顶点和 e 条边的无向图，其领接表有 n 个顶点节点和 2e 个边节点，而有向图，其领接表有 n 个顶点和 e 条边。

下面看看我们是如何用 JavaScript 实现图的数据结构的。

# 实现

图由顶点和边集合来表示，首先实现图的顶点类：**[GraphVertex](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/graph/GraphVertex.js)** ，这里，我们将使用领接表的方式实现图的存储，下面的代码中可以看到，一个顶点类包含一个相邻边节点链表：

```js
import LinkedList from '../linked-list/LinkedList'

export default class GraphVertex {
  /**
   * 图的顶点
   * @param {*} value
   */
  constructor(value) {
    if (value === undefined) {
      throw new Error('Graph vertex must have a value')
    }

    /**
     * @param {GraphEdge} edgeA
     * @param {GraphEdge} edgeB
     */
    const edgeComparator = (edgeA, edgeB) => {
      if (edgeA.getKey() === edgeB.getKey()) {
        return 0
      }

      return edgeA.getKey() < edgeB.getKey() ? -1 : 1
    }
    // 顶点的值
    this.value = value
    // 邻接表，保存边节点
    this.edges = new LinkedList(edgeComparator)
  }
  /**
   * 保存边节点
   * @param {GraphEdge} edge
   */
  addEdge(edge) {
    this.edges.append(edge)
    return this
  }
  /**
   * 删除边节点
   * @param {GraphEdge} edge
   */
  deleteEdge(edge) {
    this.edges.delete(edge)
  }
  /**
   * 是否为某条边的顶点
   * @param {GraphEdge} requiredEdge
   * @returns {boolean}
   */
  hasEdge(requiredEdge) {
    const edgeNode = this.edges.find({
      callback: edge => edge === requiredEdge
    })
    return !!edgeNode
  }
  /**
   * 找到与某个顶点的边
   * @param {GraphVertex} vertex
   * @returns {GraphEdge|null}
   */
  findEdge(vertex) {
    const edgeFinder = edge => {
      return edge.startVertex === vertex || edge.endVertex === vertex
    }
    const edge = this.edges.find({
      callback: edgeFinder
    })
    return edge ? edge.value : null
  }
  /**
   * 获取顶点所有的边
   * @returns{GraphEdge[]}
   */
  getEdges() {
    return this.edges.toArray().map(linkedListNode => linkedListNode.value)
  }
  /**
   * 删除顶点所有的边
   * @returns {GraphVertex}
   */
  deleteAllEdges() {
    this.getEdges().forEach(edge => this.deleteEdge(edge))
    return this
  }
  /**
   * 获取所有与顶点相连的点
   * @returns {GraphVertex[]}
   */
  getNeighbors() {
    const edges = this.edges.toArray()
    const neighborsConverter = node => {
      return node.value.startVertex === this
        ? node.value.endVertex
        : node.value.startVertex
    }
    return edges.map(neighborsConverter)
  }
  /**
   * 是否与某个顶点相连
   * @param {GraphVertex} vertex
   * @returns {boolean}
   */
  hasNeighbor(vertex) {
    const vertexNode = this.edges.find({
      callback: edge => edge.startVertex === vertex || edge.endVertex === vertex
    })
    return !!vertexNode
  }
  /**
   * 获取顶点的度（有向图的入度）
   * @returns {number}
   */
  getDegree() {
    return this.edges.toArray().length
  }
  /**
   * 获取顶点的值
   */
  getKey() {
    return this.value
  }
}
```

可以看到，获取顶点的度（有向图的入度）只需要获取链表的长度即可，十分便利。接下来，我们继续实现边类：**[GraphEdge](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/graph/GraphEdge.js)**。我们知道边由两个顶点组成，网的情况下，边还有自己的权重，所以`GraphEdge`类只需要记录这三个值即可：

```js
import GraphVertex from './GraphVertex'

export default class GraphEdge {
  /**
   * 图的边
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @param {number} weight
   */
  constructor(startVertex, endVertex, weight = 0) {
    // 边的始点
    this.startVertex = startVertex
    // 边的终点
    this.endVertex = endVertex
    // 边的权重
    this.weight = weight
  }
  /**
   * 获得边的顶点
   * @returns {srting}
   */
  getKey() {
    const startVertex = this.startVertex.getKey()
    const endVertex = this.endVertex.getKey()
    return `${startVertex}_${endVertex}`
  }
  /**
   * 反转边的始点与终点
   * @returns {GraphEdge}
   */
  reverse() {
    ;[this.startVertex, this.endVertex] = [this.endVertex, this.startVertex]
    return this
  }
}
```

其中`reverse`方法用于将边的始点与终点反转，为了实现逆邻接表时使用。最后，让我们看看实现数据结构图的方法：**[Graph](https://github.com/PennySuu/javascript-algorithms/blob/master/src/data-structures/graph/Graph.js)**：

```js
import GraphVertex from './GraphVertex'
import GraphEdge from './GraphEdge'

export default class Graph {
  /**
   * 图
   * @param {boolean} isDirected
   */
  constructor(isDirected = false) {
    // 顶点集合
    this.vertices = {}
    // 边集合
    this.edges = {}
    // 有向还是无向图
    this.isDirected = isDirected
  }
  /**
   * 添加顶点
   * @param {GraphVertex} newVertex
   * @returns {Graph}
   */
  addVertex(newVertex) {
    this.vertices[newVertex.getKey()] = newVertex
    return this
  }
  /**
   * 通过顶点的key值获取该顶点
   * @param {string} vertexKey
   * @returns {GraphVertex}
   */
  getVertexByKey(vertexKey) {
    return this.vertices[vertexKey]
  }
  /**
   * 获取图所有的顶点
   * @returns {GraphVertex[]}
   */
  getAllVertices() {
    return Object.values(this.vertices)
  }
  /**
   * 通过顶点的key值查找顶点
   * @param {GraphVertex} vertexKey
   * @returns {GraphVertex|null}
   */
  findVertexByKey(vertexKey) {
    if (this.vertices[vertexKey]) {
      return this.vertices[vertexKey]
    }
    return null
  }
  /**
   * 添加边
   * @param {GraphEdge} edge
   * @returns {Graph}
   */
  addEdge(edge) {
    // 判断之前是否已经有这条边的两个顶点
    let startVertex = this.getVertexByKey(edge.startVertex.getKey())
    let endVertex = this.getVertexByKey(edge.endVertex.getKey())
    // 如果之前没有，先添加新的顶点
    if (!startVertex) {
      this.addVertex(edge.startVertex)
      startVertex = this.getVertexByKey(edge.startVertex.getKey())
    }

    if (!endVertex) {
      this.addVertex(edge.endVertex)
      endVertex = this.getVertexByKey(edge.endVertex.getKey())
    }
    // 如果已经有这条边，不能重复添加
    if (this.edges[edge.getKey()]) {
      throw new Error('Edge has already been added before')
    } else {
      this.edges[edge.getKey()] = edge
    }
    // 如果是有向图，只需要为起点添加相邻边的记录
    if (this.isDirected) {
      startVertex.addEdge(edge)
    } else {
      // 如果是无向图，两个顶点都需要记录相邻边
      startVertex.addEdge(edge)
      endVertex.addEdge(edge)
    }
    return this
  }
  /**
   * 删除边
   * @param {GraphEdge} edge
   */
  deleteEdge(edge) {
    // 如果存在这条边，将其删除
    if (this.edges[edge.getKey()]) {
      delete this.edges[edge.getKey()]
    } else {
      // 不能删除不存在的边
      throw new Error('Edge not found in graph')
    }
    // 获取这条边的两个顶点
    const startVertex = this.getVertexByKey(edge.startVertex.getKey())
    const endVertex = this.getVertexByKey(edge.endVertex.getKey())
    // 将这条边的记录从两个顶点中删除
    startVertex.deleteEdge(edge)
    endVertex.deleteEdge(edge)
  }
  /**
   * 查找两个顶点是否相连
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @returns {GraphEdge|null}
   */
  findEdge(startVertex, endVertex) {
    // 如果顶点不存在，返回null
    const vertex = this.getVertexByKey(startVertex.getKey())
    if (!vertex) {
      return null
    }
    return vertex.findEdge(endVertex)
  }
  /**
   * 获取图的所有边
   * @returns {GraphEdge[]}
   */
  getAllEdges() {
    return Object.values(this.edges)
  }
  /**
   * 获取图的权重
   * @returns {number}
   */
  getWeight() {
    return this.getAllEdges().reduce((weight, graphEdge) => {
      return weight + graphEdge.weight
    }, 0)
  }
  /**
   * 生成逆向图
   */
  reverse() {
    this.getAllEdges().forEach(edge => {
      this.deleteEdge(edge)
      edge.reverse()
      this.addEdge(edge)
    })
  }
  /**
   * 获取某个顶点的相连的点
   * @param {GraphVertex} vertex
   * @returns {GraphVertex[]}
   */
  getNeighbors(vertex) {
    return vertex.getNeighbors()
  }
  /**
   * 获取图中所有顶点的索引
   * @returns {object}
   */
  getVerticesIndices() {
    const verticesIndices = {}
    this.getAllVertices().forEach((vertex, index) => {
      verticesIndices[vertex.getKey()] = index
    })
    return verticesIndices
  }
  /**
   * 获取图的邻接矩阵
   * @returns {*[][]}
   */
  getAdjacencyMatrix() {
    // 图中所有的点
    const vertices = this.getAllVertices()
    // 点的索引
    const verticesIndices = this.getVerticesIndices()

    // 邻接矩阵中的其他值，有向图为Infinity，无向图为0
    const initalValue = this.isDirected ? Infinity : 0
    // 邻接矩阵是一个二维数组
    const adjacencyMatrix = Array(vertices.length)
      .fill(null)
      .map(() => {
        return Array(vertices.length).fill(initalValue)
      })

    // 填充行与列
    vertices.forEach((vertex, vertexIndex) => {
      vertex.getNeighbors().forEach(neighbor => {
        const neighborIndex = verticesIndices[neighbor.getKey()]
        adjacencyMatrix[vertexIndex][neighborIndex] = this.isDirected
          ? this.findEdge(vertex, neighbor).weight
          : 1
      })
    })

    return adjacencyMatrix
  }
}
```

通过方法`getAdjacencyMatrix`，我们可以生成图的领接矩阵。在**[Github](https://github.com/PennySuu/javascript-algorithms/tree/master/src/data-structures/graph)**中有一些测试，通过测试可以更好的理解图的实现方法。

图的算法先到这里，接下来我们更多的了解一下图的其他相关知识。

# 图的遍历

**图的遍历（Traversing Graph）**是指从图中的某个顶点出发，对图中的所有顶点访问且仅访问一次的过程。常见的遍历有 **广度优先搜索（Breadth First Search，BFS）** 和 **深度优先搜索（Depth First Search，DFS）** 两种方式，它们对无向图和有向图都适用。

## 广度优先搜索

{% asset_img BFS.gif %}

从图中的某个顶点$v$开始，先访问该顶点，再一次访问该顶点的每一个未被访问过的领接点$w_1$、$w_2$、...。然后按此顺序访问顶点$w_1$、$w_2$、...的各个还未被访问过的领接点，重复上述过程，直达图中所有顶点都被访问过为止。BFS 的过程是一个以顶点$v$为起始点，由近及远，一次访问和顶点$v$有路径相通且路径长度为 1、2、3、...的顶点，并遵循“先被访问的顶点，其领接点就先被访问”的原则。BFS 不是一个递归的过程。

## 深度优先搜索

{% asset_img DFS.png %}

类似于树的先根遍历。从图的某个顶点$v$出发，访问它的任意一个领接点$w_1$；再从$w_1$出发，访问与$w_1$邻接但未被访问过的顶点$w_2$；然后再从$w_2$出发，进行类似访问，如此进行下去，直至所有的领接点都被访问过为止。接着，退回一步，退到前一次刚访问过的顶点，看是否还有其他未被访问的领接点。如果有，则访问此顶点，之后再从此顶点出发，进行与前述类似的访问。重复上述过程，直到连通图中的所有顶点都被访问过。DFS 是一个递归遍历的过程。

# 最小生成树

连通图的生成树是图的极小连通子图，又是图的极大无回路子图。一个有$n$个顶点的连通图的生成树只有$n-1$条边，若有$n$个顶点而少于$n-1$条边，则是非连通图，若多于$n-1$条边则一定形成回路。但是有$n-1$条边的子图不一定是生成树。

假设图$G=(V,E)$为连通图，则从图中的任意一点出发遍历时，会将$E$分成两个子集：$T(G)$和$B(G)$。$T(G)$是遍历图时经过的边的集合；$B(G)$是剩余边的集合。$T(G)$和图中所有点将一起构成连通图$G$的生成树。由深度优先遍历和广度优先遍历得到的生成树称为 **深度优先生成树** 和 **广度优先生成树**。如下图，分别是图 G5 的广度优先生成树和深度优先生成树：

{% asset_img spanningTree.png  %}

在一个无向网的所有生成树中，权值总和最小的生成树称为 **最小代价生成树（Minimun Cost Spanning Tree）**，简称最小生成树。利用最小生成树可以解决工程中的通信问题，比如，图 G 表示 n 个城市之间的通信网络，顶点表示城市，边表示两个城市之间的通信线路，权值表示线路的长度或造价，通过最小生成树可以到达求解通信线路总代价最小的方案。

最小生成树需满足以下三条准则：

1. 最小生成树的边必须是图中已存在的边
2. 当前仅当使用$n-1$条边来接图中$n$个顶点
3. 不能有回路

求图的最小生成树典型的算法为 **克鲁斯卡尔（Kruskal）算法** 和 **普里姆（Prim）算法**。

## 克鲁斯卡尔（Kruskal）算法

{% asset_img MST_kruskal.gif %}

克鲁斯卡尔算法的基本思路是：设图$G=(V,E)$是一个具有$n$个顶点的连通无向图，$T=(V,TE)$是图$G$的最小生成树，$V$是$T$的顶点集，$TE$是$T$的边集，构造最小生成树的步骤如下：

1、 新建图$T$，$T$拥有原图中相同的节点，但没有边
2、 将原图中所有的边按权值从小到大排序
3、 从权值最小的边开始，如果这条边连接的两个节点不在$T$的同一个连通分量中（否则会生成回路），则添加这条边
4、 重复 3，直至图$T$中所有的节点都在同一个连通分量中。

该算法的平均时间复杂度为$O(E\log\_{}V)$。

## 普里姆（Prim）算法

从一个顶点开始，普里姆算法按照以下步骤逐步扩大树中所含顶点的数目，直到遍及连通图的所有顶点：

1、 输入： 一个加权连通图，其中顶点集合为$V$，边集合为$E$。
2、 初始化：$V\_{new}$ = {$x$}，$x$为集合$V$中的任一节点，$E\_{new}$ = {}
3、 重复下列操作，直到$V\_{new} = V$：

1. 在集合$E$中取权值最小的边$\left ( u,v \right )$，其中$u$为集合$V\_{new}$中的元素，$v$是$V$中没有加入$V\_{new}$的顶点（如果存在有多条满足前述条件即具有相同权值的边，则可任意选取其中之一）

2. 将$v$加入集合$V\_{new}$中，将$\left ( u,v \right )$加入集合$E\_{new}$中

4、 输出： 使用集合$V\_{new}$和集合$E\_{new}$来描述所得到的最小生成树

让我们从一个例子理解上面的逻辑，首先，我们输入一个加权连通图，如下所示：

{% asset_img Prim_Algorithm_0.png %}

图中有 A、B、C、D、E、F、G 共 7 个顶点，每条边旁的数字代表权重。

接下来我们选取 D 为起点。顶点 A、B、E 和 F 与 D 相连。A 是距离 D 最近的顶点，因此将 A 及对应边 AD 以高亮表示。

| 不可选 | 可选    | 已选 |
| ------ | ------- | ---- |
| C G    | A B E F | D    |

{% asset_img Prim_Algorithm_1.png %}

接下来我们选取下一个顶点为距离 D 或 A 最近的顶点。B 距 D 为 9，距 A 为 7，E 为 15，F 为 6。因此，F 距 D 或 A 最近，因此将顶点 F 与相应边 DF 以高亮表示。

| 不可选 | 可选  | 已选 |
| ------ | ----- | ---- |
| C G    | B E F | D A  |

{% asset_img Prim_Algorithm_2.png %}

重复上面的步骤。距离 A 为 7 的顶点 B 被高亮表示。

| 不可选 | 可选  | 已选  |
| ------ | ----- | ----- |
| C      | B E G | D A F |

{% asset_img Prim_Algorithm_3.png %}

此时，可以在 C、E 与 G 间进行选择。C 距 B 为 8，E 距 B 为 7，G 距 F 为 11。E 最近，因此将顶点 E 与相应边 BE 高亮表示。

| 不可选 | 可选  | 已选    |
| ------ | ----- | ------- |
| -      | C E G | D A F B |

{% asset_img Prim_Algorithm_4.png %}

这里，可供选择的顶点只有 C 和 G。C 距 E 为 5，G 距 E 为 9，故选取 C，并与边 EC 一同高亮表示。

| 不可选 | 可选 | 已选      |
| ------ | ---- | --------- |
| -      | C G  | D A F B E |

{% asset_img Prim_Algorithm_5.png %}

顶点 G 是唯一剩下的顶点，它距 F 为 11，距 E 为 9，E 最近，故高亮表示 G 及相应边 EG。

| 不可选 | 可选 | 已选        |
| ------ | ---- | ----------- |
| -      | G    | D A F B E C |

{% asset_img Prim_Algorithm_6.png %}

现在，所有顶点均已被选取，图中绿色部分即为连通图的最小生成树。在此例中，最小生成树的权值之和为 39。

| 不可选 | 可选 | 已选          |
| ------ | ---- | ------------- |
| -      | -    | D A F B E C G |

{% asset_img Prim_Algorithm_7.png %}

# 最短路径

最短路径问题是图论研究中的一个经典算法问题，旨在寻找图（由结点和路径组成的）中两结点之间的最短路径。

## 戴克斯特拉（Dijkstra）算法-确定起点的最短路径问题

戴克斯特拉算法使用了广度优先搜索解决赋权有向图或者无向图的单源最短路径问题，Dijkstra 算法采用的是一种贪心的策略。

1. **[Dijkstra Algorithm - Single Source Shortest Path - Greedy Method YouTube](https://www.youtube.com/watch?v=XB4MIexjvY0)**

{% asset_img Dijkstra_Animation.gif %}

让我们看个例子，求下图$v\_{0}$到其余各顶点的最短路径，来理解 Dijkstra 算法：

{% asset_img Dijkstra.jpg %}

首先，$v\_{0}$是起点，列出$v\_{0}$到其余各个顶点的距离：

| S        | d[$v\_{1}$] | d[$v\_{2}$] | d[$v\_{3}$] | d[$v\_{4}$] | d[$v\_{5}$] |
| -------- | ----------- | ----------- | ----------- | ----------- | ----------- |
| $v\_{0}$ | $\infty$    | 10          | $\infty$    | 30          | 100         |

接下来从上表中选取距离最小的点$v\_{2}$，计算$v\_{2}$到其各个邻接点的距离，若计算的结果比上一步的结果小则替换，这里$v\_{2}$到$v\_{3}$的距离为 50，从$v\_{1}$到$v\_{3}$的距离可被修改为 10+50 =60，下面将重复这个过程：

| S        | d[$v\_{1}$] | d[$v\_{2}$] | d[$v\_{3}$] | d[$v\_{4}$] | d[$v\_{5}$] |
| -------- | ----------- | ----------- | ----------- | ----------- | ----------- |
| $v\_{0}$ | $\infty$    | 10          | $\infty$    | 30          | 100         |
| $v\_{2}$ | $\infty$    | 10          | 60          | 30          | 100         |

接来下继续选取距离最小的点$v\_{4}$（已经被选过的点不能再选），点$v\_{4}$的领接点有$v\_{3}$和$v\_{5}$，计算到$v\_{3}$和$v\_{5}$的距离分别为 30+20=50<60 和 30+60=90<100：

| S        | d[$v\_{1}$] | d[$v\_{2}$] | d[$v\_{3}$] | d[$v\_{4}$] | d[$v\_{5}$] |
| -------- | ----------- | ----------- | ----------- | ----------- | ----------- |
| $v\_{0}$ | $\infty$    | 10          | $\infty$    | 30          | 100         |
| $v\_{2}$ | $\infty$    | 10          | 60          | 30          | 100         |
| $v\_{4}$ | $\infty$    | 10          | 50          | 30          | 90          |

接来下继续选取距离最小的点$v\_{3}$（已经被选过的点不能再选），重复上述步骤，$v\_{5}$的值被替换 50+10=60：

| S        | d[$v\_{1}$] | d[$v\_{2}$] | d[$v\_{3}$] | d[$v\_{4}$] | d[$v\_{5}$] |
| -------- | ----------- | ----------- | ----------- | ----------- | ----------- |
| $v\_{0}$ | $\infty$    | 10          | $\infty$    | 30          | 100         |
| $v\_{2}$ | $\infty$    | 10          | 60          | 30          | 100         |
| $v\_{4}$ | $\infty$    | 10          | 50          | 30          | 90          |
| $v\_{3}$ | $\infty$    | 10          | 50          | 30          | 60          |

最后剩下$v\_{1}$和$v\_{5}$，由于$v\_{0}$到$v\_{1}$之间没有路径，不用继续考虑，而$v\_{5}$没有出边，我们的算法到这里结束。从$v\_{0}$到每个顶点的最短路径的结果是上表中最后一行。

这个算法是通过为每个顶点 v 保留从 s 到 v 的最短路径来工作的：

1、 初始时，原点 s 的路径权重被赋为 0 （d[s] = 0）。若对于顶点 s 存在能直接到达的边（s,m），则把 d[m]设为 w（s, m）,同时把所有其他（s 不能直接到达的）顶点的路径长度设为无穷大.当算法结束时，d[v] 中存储的便是从 s 到 v 的最短路径，或者如果路径不存在的话是无穷大。

2、 接下来做边的拓展操作：选择距离最小的一个点 u，依次拓展点 u 的所有领接点，如果存在一条从 u 到 v 的边，从 s 到 v 的最短路径可以通过边（u, v）来拓展，这条路径的长度是 d[u] + w(u, v)。如果这个值比目前已知的 d[v] 的值要小，我们可以用新值来替代当前 d[v] 中的值。所有邻接点都完成拓展操作进入步骤 3。

3、 重新执行步骤 2 的操作，一直运行到所有的 d[v] 都代表从 s 到 v 的最短路径的长度值。

算法维护两个顶点集合 S 和 Q。集合 S 保留所有已知最小 d[v] 值的顶点 v ，而集合 Q 则保留其他所有顶点。集合 S 初始状态为空，而后每一步都有一个顶点从 Q 移动到 S。这个被选择的顶点是 Q 中拥有最小的 d[u] 值的顶点。当一个顶点 u 从 Q 中转移到了 S 中，算法对 u 的每条外接边 (u, v) 进行拓展。

该算法的平均时间复杂度为$O(V^2)$。

## 弗洛伊德（Floyd-Warshall）算法-全局最短路径问题

弗洛伊德算法是解决任意两点间的最短路径的一种算法，可以正确处理无向图或有向图或负权（但不可存在负权回路)的最短路径问题，Floyd-Warshall 算法的原理是动态规划。

1. **[All Pairs Shortest Path (Floyd-Warshall) - Dynamic Programming YouTube](https://www.youtube.com/watch?v=oNI0rf2P9gE)**

让我们通过一个例子，理解弗洛伊德算法，如下所以，有向网 G6 和它的领接矩阵$A^0$（注意：这里顶点到自己的距离是 0，所有我们将矩阵顶点到自己的距离设为 0）：

{% asset_img Floyd-0.png %}

因为此时我们还不知道由点 1 直接到点 3 的距离是最小的，还是由点 1 到点 2 在到点 3 的距离是最小的，所以我们将通过有中间点和无中间点两个矩阵比较最短路径。

首先，以点 1 为中间点，构造$A^{1}$矩阵，由于假设点 1 位中间点，所以与点 1 相邻的点这步不用考虑，得到如下图：

{% asset_img Floyd-1.png %}

接下来要做的是把矩阵中为空的地方填充。先看$A^{1}\left [ 2,3 \right ]$处应该如何填入，原来$A^{0}\left [ 2,3 \right ] = 2$，假设以点 1 为中间点：$A^{1}\left [ 2,1 \right ] + A^{1}\left [ 1,3 \right ] = 8 + \infty$ 显然大于原来的值，所以$A^{1}\left [ 2,3 \right ]$填入较小的值 2。

{% asset_img Floyd-1-1.png %}

再来看$A^{1}\left [ 2,4 \right ]$处应该填入何值，原来$A^{0}\left [ 2,4 \right ] = \infty$，假设以点 1 为中间点：$A^{1}\left [ 2,1 \right ] + A^{1}\left [ 1,4 \right ] = 8 + 7$ 显然小于原来的值，所以$A^{1}\left [ 2,4 \right ]$填入较小的值 15。剩余空格以此类推，最终我们得到以点 1 为中间点是的最短路径矩阵：

{% asset_img Floyd-1-2.png %}

然后，以点 2 为中间点，构造$A^{2}$矩阵，得到如下图：

{% asset_img Floyd-2.png %}

接下来填充矩阵$A^{2}$，先看$A^{2}\left [ 1,3 \right ]$处应该如何填入，原来$A^{1}\left [ 1,3 \right ] = \infty$，假设以点 2 为中间点：$A^{2}\left [ 1,2 \right ] + A^{2}\left [ 2,3 \right ] = 5$，所以$A^{2}\left [ 1,3 \right ]$填入较小的值 5。填入矩阵$A^{2}$的值不再以$A^{0}$而以$A^{1}$为基础进行比较，因为$A^{1}$的路径比$A^{0}$短，剩余空格以此类推，最终我们得到以点 2 为中间点是的最短路径矩阵：

{% asset_img Floyd-2-1.png %}

然后，再以点 3 为中间点构造矩阵$A^{3}$，矩阵$A^{3}$将以$A^{2}$为基础进行上述同样的比较。最后以点 4 为中间点进行计算：

{% asset_img Floyd-3.png %}

最终我们得到了任意两点间最短路径的矩阵$A^{4}$，矩阵的每一行数据为该点到其他顶点的最短路径。从上述过程中，我们发现，矩阵$A^{1}$由$A^{0}$而来，$A^{2}$由$A^{1}$而来...由此我们可以得到如下公式：

$A^{k}\left [ i,j \right ]= $ min {$A^{k-1}\left [ i,j \right ], A^{k}\left [ i,k \right ]+A^{k}\left [ k,j \right ]$}

这就是弗洛伊德算法。

# 拓扑排序

拓扑排序（Topological Sorting）是一个有向无环图（DAG, Directed Acyclic Graph）的所有顶点的线性序列。且该序列必须满足下面两个条件：

1. 每个顶点出现且只出现一次。

2. 若存在一条从顶点 A 到顶点 B 的路径，那么在序列中顶点 A 出现在顶点 B 的前面。

实现拓扑排序的具体步骤：

1、 从 DAG 图中选择一个 没有前驱（即入度为 0）的顶点并输出。
2、 从图中删除该顶点和所有以它为起点的有向边。
3、 重复 1 和 2 直到当前的 DAG 图为空或当前图中不存在无前驱的顶点为止。后一种情况说明有向图中必然存在环。

{% asset_img tp.png %}

于是，得到拓扑排序后的结果是 { 1, 2, 4, 3, 5 }。通常，一个有向无环图可以有一个或多个拓扑排序序列。

# 参考文献

1. **[克鲁斯克尔算法-维基百科](https://zh.wikipedia.org/wiki/%E5%85%8B%E9%B2%81%E6%96%AF%E5%85%8B%E5%B0%94%E6%BC%94%E7%AE%97%E6%B3%95)**
2. **[普里姆算法-维基百科](https://zh.wikipedia.org/wiki/%E6%99%AE%E6%9E%97%E5%A7%86%E7%AE%97%E6%B3%95)**
3. **[最短路问题-维基百科](https://zh.wikipedia.org/wiki/%E6%9C%80%E7%9F%AD%E8%B7%AF%E9%97%AE%E9%A2%98)**
4. **[戴克斯特拉算法-维基百科](https://zh.wikipedia.org/wiki/%E6%88%B4%E5%85%8B%E6%96%AF%E7%89%B9%E6%8B%89%E7%AE%97%E6%B3%95)**
5. **[Floyd-Warshall 算法-维基百科](https://zh.wikipedia.org/wiki/Floyd-Warshall%E7%AE%97%E6%B3%95)**
6. **[拓扑排序 CSDN](https://blog.csdn.net/lisonglisonglisong/article/details/45543451)**
