// Toon van Holthe tot Echten
// UvA - Minor programmeren
// Final project

function clear_all(data){

    d3.selectAll(".bar")
    .remove()
    .transition().duration(100)
    	.attr("d", function(d){
            return null;
        });
  }
