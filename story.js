var sections = [];

var formatDate = d3.timeParse("%Y.%m");

d3.selectAll(".section").each(function(d,i){sections[i]=this;})




var LineChart = function() {

	/*this.element = "#graph;
	this.svgId = "svg32";
	this.width_=500;
	this.height_= 500;
	this.data = data;
	this.margin = {top: 20, right: 30, bottom: 20, left: 50};
	this.xVar = "Date";
	this.yVar = "P";

	this.appendChart();*/

}

LineChart.prototype = {
	element: null,
	svgId: null,
	width: function(value) {
		if (!arguments.length) return this.width_;
		this.width_ = value;
		if(this.svgAppened()) this.updateWidthHeight();
		return this;
	},
	height: function(value) {
		if (!arguments.length) return this.height_;
		this.height_ = value;
		if(this.svgAppened()) this.updateWidthHeight();
		return this;
	},
	data: function(value){
		if (!arguments.length) return this.data_;
		this.data_ = value;
		if(this.svgAppened()) this.updateData();
		return this;
	},

	margin: {top: 20, right: 30, bottom: 20, left: 50},

	xVar: function(value){
		if (!arguments.length) return this.xVar_;
		this.xVar_ = value;
		if(this.svgAppened()) this.updateVars();
		return this;
	},

	yVar: function(value){
		if (!arguments.length) return this.yVar_;
		this.yVar_ = value;
		if(this.svgAppened()) this.updateVars();
		return this;
	},

	svgAppened: function() {
		return document.getElementById(this.svgId);
	},

	appendChart: function(){
					var margin = this.margin, 
					width = this.width(), 
					height = this.height(), 
					data = this.data(),
					element = this.element, 
					svgId = this.svgId,
					xVar = this.xVar(),
					yVar = this.yVar();

				    width = width - margin.left - margin.right;
				    height = height - margin.top - margin.bottom;

				    this.svg = d3.select(element)
				  				.append('svg')
				  				.attr('id',svgId)
				  				.style("font-size","8px")
							    .attr("width",  width + margin.left + margin.right) 
							    .attr("height", height + margin.top + margin.bottom);


				    var svg1 = this.svg
							    .append('g')
							    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					this.x = d3.scaleTime()
				    		.range([0, width]);

				   var x = this.x;

					var y = d3.scaleLinear()
				    		.range([height, 0]);
				    this.y = y;


					this.line = d3.line()
							    .x(function(d) { return x(d[xVar]); })
							    .y(function(d) { return y(d[yVar]); });

					var line = this.line;


					    x.domain(d3.extent(data, function(d) { return d[xVar]; }));
					  	y.domain(d3.extent(data, function(d) { return d[yVar]; }));
					  	svg1.append("g")
					    .attr("class", "x axis")
					    .attr("transform", "translate(0," + height + ")")
					    .call(d3.axisBottom(x));

				      svg1.append("g")
				      .attr("class", "y axis")
				      .call(d3.axisLeft(y))
					  .append("text")
				      .attr("transform", "rotate(-90)")
				      .attr("y", 6)
				      .attr("dy", ".71em")
				      .style("text-anchor", "end")
				      .text("Price ($)");

				      svg1.append("path")
				      .datum(data)
				      .attr("class", "line")
				      .attr("d", line);

				    svg1.append('text')
				    .text('S&P 500')
				    .style("text-anchor","middle")
				    .style("stroke", 'none')
				    .style("font-size", 48)
				    .style("fill", 'steelblue')
				    .style('font-weight','bold')
				    .style("opacity", 0.3)
				    .attr("transform", "translate("+width/2+","+height/2+")");

				    return this;
	},

	updateWidthHeight: function() {

					var margin = this.margin, 
					width = this.width(), 
					height = this.height(), 
					data = this.data(),
					element = this.element, 
					svgId = this.svgId,
					xVar = this.xVar(),
					yVar = this.yVar(),
					x = this.x,
					y = this.y,
					line = this.line,
					svg = this.svg;

				    width = width - margin.left - margin.right;
				    height = height - margin.top - margin.bottom;

				    this.svg.transition()
				    .attr("width",  width + margin.left + margin.right)
				    .attr("height",  height + margin.top + margin.bottom);

					x.range([0, width]);
					y.range([height, 0]);


				    line
				    .x(function(d) { return x(d[xVar]); })
				    .y(function(d) { return y(d[yVar]); });

				    svg.select('.x.axis').transition()
				    .attr("transform", "translate(0," + height + ")")
				    .call(d3.axisBottom(x));

				    svg.select('.y.axis').transition()
				    .call(d3.axisLeft(y));

				    svg.select(".line").transition().attr("d", line);

	},

	updateVars: function () {

		var margin = this.margin, 
					width = this.width(), 
					height = this.height(), 
					data = this.data(),
					element = this.element, 
					svgId = this.svgId,
					xVar = this.xVar(),
					yVar = this.yVar(),
					x = this.x,
					y = this.y,
					line = this.line;

					width = width - margin.left - margin.right;
				    height = height - margin.top - margin.bottom;

					line.x(function(d) { return x(d[xVar]); })
							    .y(function(d) { return y(d[yVar]); });



					    x.domain(d3.extent(data, function(d) { return d[xVar]; }));
					  	y.domain(d3.extent(data, function(d) { return d[yVar]; }));

					  	this.svg.select('.x.axis')
					  	.transition()
					  	.attr("transform", "translate(0," + height + ")")
					  	.call(d3.axisBottom(x));

					  	this.svg.select('.y.axis').transition().call(d3.axisLeft(y));
					  	this.svg.select(".line").transition().attr("d", line);

	},

	updateData: function() {

	},

	addCPI : function() {

		
	}
}

d3.tsv('./data/shiller.txt', type, function(error, data) {
 		if (error) throw error;

 		var lineChart = new LineChart(data);
  	lineChart.element = "#graph";
	lineChart.svgId = "svg32";

lineChart.width(500).height(600).data(data).xVar("Date").yVar("P").appendChart();

	var transitions = {
		0: function() {lineChart.height(600);},
		1: function() {lineChart.height(600).yVar("Price");},
		resize: function(width, height) { lineChart.width(width).height(height);}
	}



var scr = new Scroll(document.getElementById('container'), sections, document.getElementById('graph'), transitions);


 		});





function type(d) {

if (d.Date.length===6) {d.Date= d.Date.split(".")[0] +".10";}

  d.Date = formatDate(d.Date);
  d.Price = +d.Price;
  d.CPI = +d.CPI;
  d.P = +d.P;
  d.Earnings=d.Earnings?+d.Earnings:NaN;
  d.CAPE = d.CAPE? +d.CAPE:NaN;
  return d;
}