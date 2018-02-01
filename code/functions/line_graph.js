// update the graph according to selected country
function update_graph(data) {
    var color = d3.scale.ordinal().range(['red','green']);
    var type = ['Fossil', 'Renewable'];

    // scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.YEAR; }));
    y.domain([0, 100]);

    line_svg.selectAll("text").remove()

    var y_axis_line = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

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

    line_svg.append("g")
        .attr("class", "y axis")
        .call(y_axis_line);

    // new legend
    var legend = d3.select("#legend")
        .selectAll("text")
        .data(dataNest, function(d){return d.key});

    //checkboxes
    legend.enter().append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0)
        .attr("y", function (d, i) { return 0 +i*15; })  // spacing
        .attr("fill",function(d) {
            return color(d.key);
            })
        .attr("class", function(d,i){return "legendcheckbox " + d.key})
        .on("click", function(d){

            d.active = !d.active;

            d3.select(this).attr("fill", function(d){
                if(d3.select(this).attr("fill")  == "#ccc"){
                    return color(d.TYPE);
                }else {
                    return "#ccc";
                }
            })

            var result = dataNest.filter(function(val,idx, arr){
                return $("." + val.key).attr("fill") != "#ccc"
                // matching the data with selector status
            })

            // Hide or show the lines based on the ID
            line_svg.selectAll(".line").data(result, function(d){ return d.key;})
                .enter()
                .append("path")
                .attr("class", "line")
                .style("stroke", function(d,i) { return d.color = color(d.key); })
                .attr("d", function(d){
                    return line(d.values);
                });

            line_svg.selectAll(".line").data(result, function(d){return d.key}).exit().remove()

        })

        // Add the Legend text
    legend.enter().append("text")
        .attr("x", 15)
        .attr("y", function(d,i){return 10 +i*15;})
        .attr("class", "legend");

   legend.transition()
        .style("fill", "#777" )
        .text(function(d){return d.key;});

}
