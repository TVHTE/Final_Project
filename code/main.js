/** VARIABLES */

// margin for map
var margin = {top: 50, right: 80, bottom: 40, left: 160},
    width = 1300 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// margin for line
var margin_line = {top: 50, right: 80, bottom: 40, left: 160},
    width_line = 2000 - margin.left - margin.right,
    height_line = 800 - margin.top - margin.bottom;

// margin for bar
var margin_bar = {top: 0, right: 0, bottom: 0, left: 0},
    width_bar = 2000 - margin_bar.left - margin_bar.right,
    height_bar = 20 - margin_bar.top - margin_bar.bottom;

var x = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]);

var xb = d3.scale.ordinal()
    .rangeRoundBands([0, width_bar], .1),
    xb1 = d3.scale.ordinal(),
    yb = d3.scale.linear().range([height_bar, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5),
    yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

var map_svg = d3.select("#datamap")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 2000 10000")
    .attr("perserveAspectRatio", "xMaxYMax")
    .attr("id", "map");

var line_svg = d3.select("#line")
    .append("svg")
        .attr('class', 'line_svg')
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 1200 900")
        .attr("perserveAspectRatio", "xMaxYMax")
        .attr("id", "line");

var bar_svg = d3.select("#bar")
    .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 1200 900")
        .attr("perserveAspectRatio", "xMaxYMax")
        .attr("id", "bar");

var init_year = 1961

// slider
d3.select("#slider").insert("p", ":first-child")
    .append("input")
        .attr("type", "range")
        .attr("min", "1961")
        .attr("max", "2017")
        .attr("value", init_year)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 1200 900")
        .attr("perserveAspectRatio", "xMaxYMax")
        .attr("id", "year");

// parse the date / time
var parseTime = d3.time.format("%Y").parse;

// define the line
var line_REN = d3.svg.line()
   .x(function(d) { return x(d.YEAR); })
   .y(function(d) { return y(d.VALUE); });

var line = d3.svg.line()
   .x(function(d) { return x(d.YEAR); })
   .y(function(d) { return y(d.VALUE); });


window.onload = function(){

    queue()
        .defer(d3.json, "/data/DATA_FOSL.json")
        .defer(d3.json, "/data/DATA_REN.json")
        .defer(d3.json, "/data/META.json")
        .defer(d3.json, "/data/data_project.json")
        .await(analyze);

    function analyze(error, FOSL, REN, META, DATA) {
        if(error) { console.log(error); }

        var dataset = {}

        var onlyValues = META.map(function(obj){ return obj['CLASS']; });
        var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);

        var paletteScale = d3.scale.linear()
               .domain([minValue,maxValue])
               .range(["#EFEFFF","#02386F"]);

        // fill dataset in appropriate format
        META.forEach(function(item){
            var iso = item['CC'],
                value = item['CLASS'];
                dataset[iso] = { income_class: value, fillColor: paletteScale(value) };
            });

        var data_bar  = []

        // render map
        var map = new Datamap({
            element: document.getElementById('map'),
            done: function(datamap) {
                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
                    id = geo.id;
                    data = filter_JSON(DATA,'CC',id);
                    update_graph(data)

                    data_bar.push(data)
                    j = 0

                    // delete element if occurs more than 1 time
                    for (var i = 1; i < data_bar.length; i++){
                        if (data_bar[i][0] == data[0]){
                            j += 1
                            if (j > 1){
                                data_bar.splice(i,1)
                            }
                        }
                    }

                    // use slider
                    d3.select("#year").on("input", function() {
                        year = this.value
                        update_bar(year, data_bar)
                    });
                });
            },
            projection: 'mercator', // big world map
            // countries don't listed in dataset will be painted with this color
            fills: { defaultFill: '#F5F5F5' },
            data: dataset,
            geographyConfig: {
                borderColor: '#DEDEDE',
                highlightBorderWidth: 2,
                // don't change color on mouse hover
                highlightFillColor: function(geo) {
                    return geo['fillColor'] || '#F5F5F5';
                },
                // only change border
                highlightBorderColor: '#f4f142',
                // show desired information in tooltip
                popupTemplate: function(geo, data) {
                    // don't show tooltip if country don't present in dataset
                    if (!data) { return ; }
                    // tooltip content
                    return ['<div class="hoverinfo">',
                        '<strong>', geo.properties.name, '</strong>',
                        '<br>Income category: <strong>', data.income_class, '</strong>',
                        '</div>'].join('');
                }
            }
        });
    }
}
