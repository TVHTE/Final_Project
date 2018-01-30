function update_graph(data) {

    var color = d3.scale.ordinal().range(['red','green']);
    var type = ['Fossil', 'Renewable'];

    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

    // scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.YEAR; }));
    y.domain([0, 100]);

    line_svg.selectAll("text").remove()

    // nest the entries by country
    dataNest = d3.nest()
        .key(function(d) {return d.TYPE;})
        .entries(data);

    var result = dataNest.filter(function(val, idx, arr){
    	  return $("." + val.key).attr("fill") != "#ccc"
    	  // matching the data with selector status
    	})

    var country = line_svg.selectAll(".line")
        .data(result, function(d, i){return d.key[i]});

    country.enter().append("path")
        .attr("class", "line")
        .text(result, function(d){return d.CC})

    country.transition()
    	.style("stroke", function(d,i) { return d.color = color(d.key); })
    	.attr("id", function(d){ return 'tag'+d.key.replace(/\s+/g, '');}) // assign ID
    	.attr("d", function(d){
    		return line(d.values)
    	});

    country.exit().remove();

    line_svg.selectAll(".axis").remove();

    line_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var yaxis = line_svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    // add a label to the y axis
    line_svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text('% of total energy produced')
        .attr("class", "y axis label");

    // add legend to line chart
    var legend = line_svg.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('x', width - 20)
        .attr('y', function(d, i){ return i *  20;})
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) {
          return color(d.TYPE);
        });

    legend.append('text')
        .attr('x', width - 8)
        .attr('y', function(d, i){ return (i *  20) + 9;})
        .text(function(d){ return d.TYPE; });

}
