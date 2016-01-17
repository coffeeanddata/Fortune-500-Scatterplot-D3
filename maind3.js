outlineParameters = function(width, height, top, bottom, left, right){
	var barMargin   = {top:top, right:right, bottom:bottom, left: left},
		chartWidth  = width  - barMargin.left - barMargin.right,
		chartHeight = height - barMargin.top  - barMargin.bottom;

	return({
		width: chartWidth, height: chartHeight, 
		topMargin: barMargin.top, bottomMargin: barMargin.bottom, 
		leftMargin: barMargin.left, rightMargin: barMargin.right
	});
}
getCanvas = function(barClass, outline){
	var div = d3.select("body").append("div").attr("id", barClass);
	var canvas = div.append("svg")
		.attr("width",  outline.width  + outline.leftMargin + outline.rightMargin)
		.attr("height", outline.height + outline.topMargin + outline.bottomMargin)
	return(canvas)
}




scatterPlot = function(graph, data, outline, xValue, yValue){
	graph.selectAll(".axis").remove();
	var xScale = d3.scale.linear().range([0, outline.width]);
	var yScale = d3.scale.linear().range([outline.height, 0]);

	//map data values (x,y) to graph scale
	xScale.domain(d3.extent(data, function(x) { return x[xValue]; }));
	yScale.domain(d3.extent(data, function(x) { return x[yValue]; }));


	// Create Axis group
	var xAxisGroup = graph.append("g").attr("transform", "translate(0, " + outline.height + ")").attr("class", "y axis");
	var yAxisGroup = graph.append("g").attr("class", "y axis");

	// Create Axis
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	var yAxis = d3.svg.axis().scale(yScale).orient("left");

	
	// Call Axis
	xAxisGroup.transition().duration(1000).call(xAxis);
	yAxisGroup.transition().duration(1000).call(yAxis);


	// Bind Data
	var scatter = graph.selectAll("circle").data(data);

	//Enter
	scatter.enter().append("circle")
		.attr("class", "scatterplotCircles")
		.attr("r", 0);

	//Update
	scatter
		.transition().duration(1000)
		.attr("r", 5) 
		.attr("cx", function(x) { return xScale(x[xValue]); })
		.attr("cy", function(x) { return yScale(x[yValue]); });

	//Exit
	scatter.exit()
		.transition().duration(1000)
			.attr("r", 0)
			.remove();
}


groupByKey = function(data, mainKey){
	var nestedData = d3.nest()
		.key(function(d){ return dateRevert(d[mainKey]); })
			.sortKeys(d3.descending)
		.entries(data);
	return nestedData;
};


















