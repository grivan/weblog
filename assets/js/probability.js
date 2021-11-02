/*
 Visualizing Probability Distributions
*/


var margin = { top: 50, right: 50, bottom: 50, left: 50 },
   width = 970 - margin.left - margin.right,
   height = 700 - margin.top - margin.bottom;

var svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("width", width + margin.left + margin.right)
            .style("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [1]

function rectangle() {
  svg.selectAll("group1")
   .data(data)
   .enter()
   .append("rect")
   .attr("x", function (d, i) { /* ... \*/ })
   .attr("y", function (d, i) { /* ... \*/ })
   .attr("width", function (d, i) { /* ... \*/ })
   .attr("height", function (d, i) { /* ... \*/ });
}

rectangle()
