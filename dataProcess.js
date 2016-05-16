// render data, process the data and returns only (or all) the data used from the .csv. This is done prior to plotting
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

//Rank Groups
rangeGroups = [
	{ min: 1,   max: 50  },
	{ min: 51,  max: 100 },
	{ min: 101, max: 200 },
	{ min: 201, max: 300 },
	{ min: 301, max: 400 },
	{ min: 401, max: 500 }
];

//Rank Group titles (mainly used for legend)
rangeTitle = ["1-50", "51-100", "101-200", "201-300", "301-400", "401-500"]

// function to find where each file F500 Rank falls under (number = rank)
findRange = function(number, rangeObject){
	for(i = 0; i < rangeObject.length; i++){
		if( (number >= rangeObject[i].min) && (number <= rangeObject[i].max)){
			return i;
		} 
	}
};


//used to revert back date format to Year text (used in dataGruop2)
var dateRevert = d3.time.format("%Y");

//general nested (grouped) data
//two levels of grouping in the object, parent key is year (mainKey), followed by nested key (secondKey).
dataGroup2 = function(data, mainKey, secondKey){
	var nestedData = d3.nest()
		.key(function(d){ return +dateRevert(d[mainKey]); })
			.sortKeys(d3.descending) //Sort Year descending
		.key(function(d){ return d[secondKey]; })
			.sortKeys(d3.ascending) //sorting by rank groups (ascending)
		.entries(data);
	return nestedData;
};




//creating a basic legend using d3.js
createLegend = function(canvas, legendValue){
	plot = canvas.plot;
	outline = canvas.outline;
	//group legend text
	legend = plot.append("g").attr("class", "mainLegend")
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

// make legend interactive (update ranked data being plotted)
interactiveLegend = function(canvas){
	plot = canvas.plot;
	getLegend = plot.select("g.mainLegend");
	getText = getLegend.selectAll("text");

	//update on click
	getText.on("click", function(d, i){ 
		// update class for each text
		getText.attr("class", "legendText");
		d3.select(this).attr("class", "legendText current_data");

		//get current dropdown value
		getSelect = document.getElementsByClassName("simpleDropdown")[0];
		getIndex = getSelect.selectedIndex;

		console.log(getSelect.options[getIndex].text)

		//update scatter plot		
		scatterPlot(canvas, nestedGroups[getIndex].values[i].values, "Rank", "Revenue")			
	});
}

// really lazy dropdown just creating dropdown (with select options) using d3.js
dropDown = function(appendTo, values, canvas, data, outline, xValue, yValue){
	plot = canvas.plot;
	d3.select(appendTo).append("select").attr("class", "simpleDropdown");
	getDropdown = d3.select("select.simpleDropdown");
	getOptions = getDropdown.selectAll("option").data(values)
	getOptions.enter().append("option").text(function(d){ return d;});

	//update chart data with select change
	getDropdown.on("change", function(selected){
		getLegendText = plot.select("g.mainLegend text.legendText.current_data").text();
		getLegendTextIndex = rangeTitle.indexOf(getLegendText);
		console.log(this.selectedIndex);
		scatterPlot(canvas, data[this.selectedIndex].values[getLegendTextIndex].values, xValue, yValue);
		
	})
}



// nest data by Key, find the mean Profit of group
dataGroup3 = function(data, mainKey){
	var nestedData = d3.nest()
		.key(function(d){ return dateRevert(d[mainKey]); })
			.sortKeys(d3.descending)
		.rollup(function(d) { return d3.mean(d, function(dx) { return dx.Profit; }); })
		.entries(data);
	return nestedData;
};



putTitle = function(mainCanvas, plotText){
	getPlot = mainCanvas.plot;
	getMargins = mainCanvas.outline;
	getPlot.append("text")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (getMargins.leftMargin + getMargins.width/2) + "," + (getMargins.topMargin/2)+ ")")	
		.text(plotText);
}


updateAxisLabels = function(canvas, xAxisLabel, yAxisLabel){
	getGraph = canvas.plot.select("g.mainGraph");
	getGraph.select("text.y_axis_label").text(yAxisLabel);
	getGraph.select("text.x_axis_label").text(xAxisLabel);
	
}
