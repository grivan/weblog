/*
    A pythagorean tree
		Author: Grivan Thapar
		Based on work by Peter Cook (@prcweb)
*/

// global constants
var theta = 45;
var MAX_DEPTH = 10; // depth of the tree
var c = Math.cos(theta*Math.PI/180);
var s = Math.sin(theta*Math.PI/180);

// season colors
var seasons = [
	{name: "summer", colors: ['darkolivegreen', 'forestgreen'], pos: 1},
	{name: "fall", colors: ['darkorange', 'darkred'], pos: 0},
	{name: "winter", colors: ['powderblue', 'palegreen'], pos: -1}
]

// stores the state of the tree in memory
var branches = [];

// base block
var base_height = 100;
var base_width = 100;
var base_block = {
	x:0,
	y:0,
	height:base_height,
	width:base_width,
	transform:'translate(380,340)',
	depth:0,
	opacity: 0.5,
	color: 'darkred'
};


// main function that generates the tree
function branch(b, season_colors) {
  branches.push(b);
	if (b.depth >= MAX_DEPTH) return;
	var left = {
		x:b.x,
		y:b.y,
		height:b.height,
		width:b.width,
		transform:b.transform+'rotate('+-theta+')'+' scale('+c+')'+' translate(0,'+-b.height+') ',
		depth:b.depth+1,
		opacity: opacity(b.depth),
		color: color(b.depth+1, season_colors)
	};
	var lp = b.height*c*c;
	var rp = -b.height-b.height*c*s;
	var right = {
		x:b.x,y:b.y,
		height:b.height,
		width:b.width,
		transform:b.transform+'rotate('+(90-theta)+')'+' scale('+s+')'+' translate('+(-b.height*s*s*0)+','+(-b.height-b.height) + ') ',
		depth:b.depth+1,
		opacity: opacity(b.depth),
		color: color(b.depth+1, season_colors)

	};
	branch(left, season_colors);
	branch(right, season_colors);
}

function transform() {

}

// given a note t return opacity
function opacity(depth) {
	if(depth > MAX_DEPTH - 6) {
		return 0.1*(depth+5);
	}
	return 0.5;
}

// given a node t return color
function color(depth, season_colors) {
	var color = depth%2 == 0 ? 'darkred':'brown';
	if(depth > MAX_DEPTH - 6) {
		color = Math.random()>0.3 ? season_colors[0]:season_colors[1];
	}
	return color;
}

// creates svg elements
function create() {
	// add the tree
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
		.style('fill',function(d){return d.color;})
		.style('fill-opacity',function(d){return d.opacity;})
		.attr('id', function(d) {return 'id-'+d.i;});

	// add the season picker circles
	d3.select('svg')
		.selectAll('circle')
		.data(seasons)
		.enter()
		.append('circle')
		.style('fill', function(d) {return d.colors[0]})
		.attr('id', function(d) {return d.name})
		.attr('r', 15)
		.attr('cx', function(d) {return 430 - 50*d.pos})
		.attr('cy', 520)
		.attr("stroke", "grey")
		.attr("stroke-width", 0)
		.on('mouseenter', function(d){
			regenerate(false, d.colors)
			d3.select(this)
			.attr("stroke-width", 4)
		})
		.on('mouseleave', function(d){
			regenerate(false, d.colors)
			d3.select(this)
			.attr("stroke-width", 0)
		});
}

// updates svg elements, note only color changes
function update() {
	d3.select('svg')
		.selectAll('rect')
		.data(branches)
		.transition()
		.duration(1000)
		.style('fill',function(d){return d.color;})
}

// handy function to regenerate the tree with different colors
function regenerate(initialise, season_colors) {
  branches = [];
	if (initialise) {
		branch(base_block, season_colors);
		create();
	}
	else {
		branch(base_block, season_colors);
		update();
	}
}

// draw the tree
regenerate(true, seasons[0]['colors']);
