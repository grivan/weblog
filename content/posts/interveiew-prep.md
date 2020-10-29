---
title: "Interview Prep"
date: 2020-08-06T23:18:52-07:00
draft: true
---
### Tree Problems

1. [Maximum Difference Between Node and Ancestor](!https://leetcode.com/problems/maximum-difference-between-node-and-ancestor/solution/)
  * I solved via brute force, each pair of nodes will be compared and this complexity is O(N2).
  * A better approach is to do a single tree recursion but pass the current max and current min values.

2. [Closest Binary Search Tree](!https://leetcode.com/problems/closest-binary-search-tree-value/)
    * Basic in order traversal
    * Important thing to note in BST is that the value on right can be larger than the parent!

3. [Range Sum of BST](!https://leetcode.com/problems/range-sum-of-bst/)
  * Sum elements of a BST between two digits, solved via simple pre order traversal. Calculate sums for each subtree and add up.

### String Manipulation
1. [Valid Palindrom II](!https://leetcode.com/problems/valid-palindrome-ii/)
  * Checking for palindrome can be done using two pointers, one at start and other at end and then comparing them.
  * In this particular problem however, since one edit can be made. One has to check for all edits that can be made and see if the string is still a palindrome. A greedy approach can be taken for linear solution.

### Prefix Sum
1. [Random Pick with Weight](!https://leetcode.com/problems/random-pick-with-weight/)
  * The problem involves using prefix search. Basically generate a prefix tree and see where the random number generated between 0 to sum of the sequence lies on the `range` of weights.
  * An optimization is binary search of the input series is given sorted.

### Stack
1. [Basic Calculator](!https://leetcode.com/problems/basic-calculator-ii/solution/)
  * [TODO] Struggled with this!

2. [Exclusive Time of Functions](!https://leetcode.com/problems/exclusive-time-of-functions/)
  * Was able to solve this in > 45 minutes
  * Approach was fine but took time debugging the code

### Two Pointers
1. [Interval List Intersection](!https://leetcode.com/problems/interval-list-intersections/)
  * Solved this in less than 30 minutes! I guess experience from Hulu was useful in catching EPG bugs.

### Misc
1. [Pick Random Index](!https://leetcode.com/problems/random-pick-index/submissions/)
  * I made a hash-map first and then return index O(1) for pick
  * Another approach is to simply do a O(n) search and count all occurrences.
  * One can sort the list too and then perform a binary search
