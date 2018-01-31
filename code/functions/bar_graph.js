function update_bar(year, data){

    var type = ['Fossil', 'Renewable']
    var values = []
    var percentage = []
    var color = d3.scale.ordinal().range(['red','green']);
    var gap = 10
    var labelspace = 100
    var diff_values = []
    var height_bar = 20

    // get values according to year and clicked lands
    for (i = 0; i < data.length; i++){
        for (j = 0; j < data[i].length; j++){
            if (data[i][j]['YEAR'] == year){
                values.push(data[i][j])
                percentage.push([data[i][j],data[i][j - 1]])
            }
        }
    }

    for (var i = 0; i < percentage.length; i++){
        var now = percentage[i][0]['VALUE']
        var old = percentage[i][1]['VALUE']
        var diff = (((now - old) / old) * 100)
        diff_values.push(diff)
    }

    var country = values.map(function (d) {
        return d.CC
    });

    grouped_values = []

    // group data
    for (i = 0; i < values.length - 1; i++){
        if (values[i]['CC'] == values[i + 1]['CC']){
            grouped_values.push([values[i],values[i + 1]])
        }
    }

    var zipped_data = []

    for (var i = 0; i < grouped_values.length; i++){
        for (var j = 0; j < grouped_values[i].length; j++){
            zipped_data.push(grouped_values[i][j]['VALUE'])
        }
    }

    var chart_height = height_bar * zipped_data.length + gap * grouped_values.length;
    var group_height = height_bar * grouped_values.length

    var x = d3.scale.linear()
        .domain([0, d3.max(zipped_data)])
        .range([0, 1000]);

    var y = d3.scale.linear()
        .range([chart_height + gap, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickFormat('')
        .tickSize(0)
        .orient("left")

    var xAxis = d3.svg.axis()
        .scale(xb)
        .orient("top")


    bar_svg.selectAll('.bar')
        .remove()

    var bar = bar_svg.selectAll('.bar')
        .data(zipped_data)
        .enter().append('g')
        .attr('class', 'bar')
        .attr("transform", function(d, i) {
            return "translate(" + labelspace + "," + (i * height_bar + gap * 2) + ")";
        });

    bar.append('rect')
        .attr("fill", function(d,i) {
            return color(i % 2);
        })
        .attr('id', function(d, i) {
            return 'b' + i
        })
        .attr("width", x )
        .attr("height", height_bar - 1)

    bar.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add text label in bar
    bar.append("text")
        .attr("x", function(d) {
            return x(d) - 20;
        })
        .attr("y", height_bar / 2)
        .attr("fill", "white")
        .attr("dy", ".35em")
        .text(function(d) {
            return Math.round(d);
        });

    // Draw labels
    bar.append("text")
        .attr("class", "label")
        .attr("x", - 50)
        .attr("y", function(d, i) {
             return i
         })
        .attr("dy", ".35em")
        .text(function(d,i) {
          return country[i];
      });

}
