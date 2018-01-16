window.onload = function(){

    function filterJSON(json, key, value) {
      var result = [];
      json.forEach(function(val,idx,arr){

        if(val[key] == value){

          result.push(val)
        }
      })
      return result;
    }

    // margin for map
    var margin = {top: 50, right: 80, bottom: 40, left: 160},
        width = 1300 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // margin for line
    var margin_line = {top: 50, right: 80, bottom: 40, left: 160},
        width_line = 2000 - margin.left - margin.right,
        height_line = 1200 - margin.top - margin.bottom;

    // colour for map
    var colour = d3.scale.category20();

    var colour = d3.scale.linear()
					.range(["#000099", "#0033cc"])
					.domain([200, 0]);

    var projection = d3.geo.mercator()
        .scale(1)
        .translate([0, 0]);

    var path = d3.geo.path()
        .projection(projection);

    var map = new Datamap({element: document.getElementById('container'),
    fills: {
            HIGH: '#afafaf',
            LOW: '#123456',
            MEDIUM: 'blue',
            UNKNOWN: 'rgb(0,0,0)',
            defaultFill: 'green'
        },
        data: {
            IRL: {
                fillKey: 'LOW',
                numberOfThings: 2002
            },
            NLD: {
                fillKey: 'MEDIUM',
                numberOfThings: 10381
            }
        }
    });

    map.legend();

    // svg for line
    var line_svg = d3.select("body")
        .append("svg")
          .attr('class', 'line_svg')
          .attr("width", width_line)
          .attr("height", height_line)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // Parse the date / time
    var parseTime = d3.time.format("%Y%m%d").parse;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Province:</strong> <span style='color:red'>" + d.properties.subunits + "</span>";
        })

    svg.call(tip);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Define the line
    var line = d3.svg.line()
        .x(function(d) { return x(d.DATE); })
        .y(function(d) { return y(d.VALUE); });

    // load in both datasets
    queue()
        .defer(d3.json, 'data/DATA_FOSL.json')
        .defer(d3.json, 'data/DATA_REN.json')
        .await(function(error, json, nl) {
          if (error) throw window.alert("Failed loading data");

          json.forEach(function(d) {
              d.YEAR = parseTime(d.YEAR.toString());
              d.VALUE = +d.VALUE
              d.active = true;
          });

            var l = topojson.feature(nl, nl.objects.subunits).features[3],
                b = path.bounds(l),
                s = .2 / Math.max((b[1][0] - b[0][0]) / width , (b[1][1] - b[0][1]) / height),
                t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

            projection
                .scale(s)
                .translate(t);

            svg.append("g")
                .attr("class", "subunits")
                .selectAll("path")
                .data(topojson.feature(nl, nl.objects.subunits).features)
                // .data(json)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", function(d, i) {
                    return colour(i * 50);
                })
                .attr("class", function(d, i) {
                    return d.properties.name;
                })

            // enabling change of color to red
            let hoverEnabled = false;
                svg.on('mousedown', x => hoverEnabled = true)
                    .on('mouseup', x => hoverEnabled = false)
                svg.selectAll('.subunits path')
                    .on('mouseover', tip.show, function(d) {
                        if (hoverEnabled) {
                            this.classList.add('hovered');
                        }})
                    .on('mouseout', tip.hide);


            svg.append("path")
                .attr("class", "sub-borders")
                .attr("d", path(topojson.mesh(nl, nl.objects.subunits, function(a, b) { return a !== b; })));

            svg.selectAll('.subunits path').on('click', function(d) {
                section = d.properties.name

                knmi_data = filterJSON(json, 'STN', section);

                knmi_data.forEach(function(d) {
                    d.VALUE = +d.VALUE
                    d.active = true;
                });

                //debugger
                updateGraph(knmi_data);

                jQuery('h1.page-header').html(section);
                });

            // generate initial graph
            knmi_data = filterJSON(json, 'STN', 'Limburg');

            updateGraph(knmi_data)

        });

    function updateGraph(data) {

    var color = d3.scale.ordinal().range(["steelblue"]);

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.DATE; }));
    y.domain([d3.min(data, function(d) { return d.VALUE; }), d3.max(data, function(d) { return d.VALUE; })]);

    line_svg.selectAll("text").remove()

    // Nest the entries by stad
    dataNest = d3.nest()
        .key(function(d) {return d.STN;})
        .entries(data);

    var result = dataNest.filter(function(val,idx, arr){
          return $("." + val.key).attr("fill") != "#ccc"
          // matching the data with selector status
        })

    var stad = line_svg.selectAll(".line")
        .data(result, function(d){return d.key});

    stad.enter().append("path")
        .attr("class", "line")
        .text(result, function(d){return d.TYPE});

    stad.transition()
        .style("stroke", function(d,i) { return d.color = color(d.key); })
        .attr("id", function(d){ return 'tag'+d.key.replace(/\s+/g, '');}) // assign ID
        .attr("d", function(d){

            return line(d.values)
        });

    stad.exit().remove();

    line_svg.selectAll(".axis").remove();

    line_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      var yaxis = line_svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    // Add a label to the y axis
    line_svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(function(d, i){return result[i].values[0]['TYPE']})
        .attr("class", "y axis label");

    // mouse event
    var mouseG = line_svg.append("g")
        .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(dataNest)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 7)
        .style("stroke", 'red')
        .style("fill", "red")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine.append("text")
        .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
            .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
            .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
            .style("opacity", "0");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line")
            .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
            .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
            .style("opacity", "1");
            })
        .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line")
            .attr("d", function() {
                var d = "M" + mouse[0] + "," + height;
                d += " " + mouse[0] + "," + 0;
                return d;
            });

    d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
            var xDate = x.invert(mouse[0]),
            bisect = d3.bisector(function(d) { return d.DATE; }).right;
            idx = bisect(d.values, xDate);
            var beginning = 0,
            end = lines[0].getTotalLength(),
            target = null;


    while (true){
        target = Math.floor((beginning + end) / 2);
        pos = lines[0].getPointAtLength(target);
        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
            break;
        }
        if (pos.x > mouse[0])      end = target;
        else if (pos.x < mouse[0]) beginning = target;
        else break; //position found
        }

    d3.select(this).select('text')
        .style("fill", "red")
        .style("font-size", "18px")
        .text(y.invert(pos.y).toFixed(2));

    return "translate(" + mouse[0] + "," + pos.y +")";

        });
    });

    // title
    line_svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top - 20))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("text-decoration", "underline")
        .text("Line graph showing max temp(TX) for " + data[0]['STN']);

    // name
    line_svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top - 600))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Toon van Holthe tot Echten");

    };
}
