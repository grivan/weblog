/*
    A pythagorean tree
		Author: Grivan Thapar
		Based on work by Peter Cook (@prcweb)
*/

var branches = [];
var maxDepth = 10;
var height = 100;
var width = 100;
var seed = {x:0,y:0,height:height,width:width,transform:'translate(380,340)',depth:0};
var theta = 45;
var nin = Math.PI/2;
var MAX_DEPTH = 10;
var c = Math.cos(theta*Math.PI/180);
var s = Math.sin(theta*Math.PI/180);
var aLeft = [0,1];

// TODO
var seasons = {
	fall: ['orange', 'red'],
	winter: ['green', 'white'],
	summer: ['green', 'light'],
}
//var aRight = [c*c,1+c*sin];
//var mLeft = [cos*cos,cos*sin,-cos*sin,cos];
//var mRight = [sin*sin,-cos*sun,cos*sin,sin*sin];

function transform() {

}

function branch(b) {
    branches.push(b);
	if (b.depth >= MAX_DEPTH) return;
	var left = {x:b.x,y:b.y,height:b.height,width:b.width,transform:b.transform+'rotate('+-theta+')'+' scale('+c+')'+' translate(0,'+-b.height+') ',depth:b.depth+1};
	var lp = b.height*c*c;
	var rp = -b.height-b.height*c*s;
	var right = {x:b.x,y:b.y,height:b.height,width:b.width,transform:b.transform+'rotate('+(90-theta)+')'+' scale('+s+')'+' translate('+(-b.height*s*s*0)+','+(-b.height-b.height) + ') ',depth:b.depth+1};
	branch(left);
	branch(right);
}

function opacity(t) {
	if(t.depth > MAX_DEPTH -6) {
		return 0.06*(t.depth+10);
	}
	return 0.5
}

function color(t) {
	var color = t.depth%2 == 0 ? 'darkred':'brown';
	if(t.depth > MAX_DEPTH - 6) {
		color = Math.random()>0.3 ? 'orange':'red';
	}
	return color;
}

function create() {
	d3.select('svg')
		.selectAll('rect')
		.data(branches)
		.enter()
		.append('rect')
		.attr('x',function(d){return d.x;})
		.attr('y',function(d){return d.y;})
		.attr('height',function(d){return d.height;})
		.attr('width',function(d){return d.width;})
		.attr('transform',function(d){return d.transform;})
		.style('stroke-width',5)
		.style('fill',function(d){return color(d);})
		.style('fill-opacity',function(d){return opacity(d);})
		.attr('id', function(d) {return 'id-'+d.i;})
}

function update() {
		d3.select('svg')
		.selectAll('rect')
		.data(branches)
		.transition()
		.duration(1000)
		.attr('x',function(d){return d.x;})
		.attr('y',function(d){return d.y;})
		.attr('height',function(d){return d.height;})
		.attr('width',function(d){return d.width;})
		.attr('transform',function(d){return d.transform;})
		.style('stroke-width',5)
		.style('fill',function(d){return color(d);})
		.style('fill-opacity',function(d){return opacity(d);})
		.attr('id', function(d) {return 'id-'+d.i;})
}

function regenerate(initialise) {
  branches = [];
	branch(seed);
	initialise ? create() : update();
}

d3.selectAll('.regenerate')
	.on('click', regenerate);

regenerate(true);
setInterval(function() {regenerate(false);}, 5*60*4);
