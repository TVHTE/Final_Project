function clear_all(){

  d3.selectAll(".bar")
    .remove()
	.transition().duration(100)
		.attr("d", function(d){
            console.log("d")
            return null;
        });
  }
