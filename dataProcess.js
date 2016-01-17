var dateRevert = d3.time.format("%Y");

dataGroup2 = function(data, mainKey, secondKey){
	var nestedData = d3.nest()
		.key(function(d){ return dateRevert(d[mainKey]); })
			.sortKeys(d3.descending)
		.key(function(d){ return d[secondKey]; })
			.sortKeys(d3.ascending)
		.entries(data);
	return nestedData;
};
renderData = function(data){
	format = d3.time.format("%Y");
	return {
			Company : data.Company,
			Year    : format.parse(data.Year),
			Rank    : +data.Rank,
			RankG   : findRange(+data.Rank, rangeGroups),
			Revenue : +data["Revenue_in_millions"],
			Profit  : +data["Profit_in_millions"]
	};
};


rangeGroups = [
	{ min: 1,   max: 50  },
	{ min: 51,  max: 100 },
	{ min: 101, max: 200 },
	{ min: 201, max: 300 },
	{ min: 301, max: 400 },
	{ min: 401, max: 500 }
];

rangeTitle = ["1-50", "51-100", "101-200", "201-300", "301-400", "401-500"]

findRange = function(number, rangeObject){
	for(i = 0; i < rangeObject.length; i++){
		if( (number >= rangeObject[i].min) && (number <= rangeObject[i].max)){
			return i + 1;
		} 
	}
};

createLegend = function(canvas, legendValue, outline){
	legend = canvas.append("g").attr("class", "mainLegend")
		.attr("transform", "translate(" + (outline.width + outline.leftMargin - 10) + "," + (outline.topMargin + 10 )+ ")");	

	//append data
	legendText = legend.selectAll("text").data(legendValue);

	//enter data
	legendText.enter().append("text")
		.attr("class", "legendText");

	
	//update data
	legendText
		.text(function(d){ return d; })
		.attr("text-anchor", "end")
		.attr("x", function(d, i) { return -(legendValue.length - i -1)*90; })
		.attr("class", function(d, i) { return (i == 0) ? "legendText current_data": "legendText"})
}

	


interactiveLegend = function(canvas){
	getLegend = canvas.select("g.mainLegend");
	getText = getLegend.selectAll("text");

	getText.on("click", function(d, i){ 
		getText.attr("class", "legendText");
		d3.select(this).attr("class", "legendText current_data");

		scatterPlot(canvas.select("g.mainGraph"), nestedGroups[0].values[i].values, chartOutline, "Rank", "Revenue")			
		profitSize(canvas.select("g.mainGraph"), nestedGroups[0].values[i].values, chartOutline, "Rank", "Revenue");
	});
}

//Not currently being used
profitSize = function(container, data, sizeName){
	pixelMaxSize = 15
	sizeScale = d3.scale.linear()
		.range([0, pixelMaxSize])
		.domain(d3.extent(data, function(x){ return x[sizeName]; }));
	console.log(sizeScale.domain())
	return(sizeScale);	
}
