---
title: Pythagorean Tree
date: 2020-10-01T21:50:38-07:00
---
{{< d3js js=pythagoreantree svg=pythagoreantreesvg height=800 width=600 >}}

This post explores generating a [pythagorean tree](https://en.wikipedia.org/wiki/Pythagoras_tree_(fractal))
using [D3.js](https://d3js.org/) - one of my favorite libraries to
create data based visualizations. A pythagorean tree is a fractal, a
fractal is usually a pattern repeating itself over and over, the tree above is similarly
constructed by repeating a square block over and over again. Programmatically
a fractal can be generated using recursion. The code for the
tree above is a simple binary recursion which first generates an in memory
representation of the tree. State about position, angle, color and opacity for
each block is calculated and stored. This state is then used as data to bind
to an SVG embedded in the page. The javascript code located to generate this
tree can be found [here](https://github.com/grivan/weblog/blob/master/assets/js/pythagoreantree.js).

This is based on work by [@prcweb](https://www.prcweb.co.uk/lab/d3-tree/).
