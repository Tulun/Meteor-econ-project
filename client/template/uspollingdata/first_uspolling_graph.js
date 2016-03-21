Template.usPollingData.onRendered(function() {
  // This callback so the chart loads properly, as well as the method in upload/server.js
  Meteor.call('myData', function(err, result) {
    if (err) {
      console.log(err)
    } else {
      var data = Data.find({
        $or:
          [
            { dataSetId: 'iowa_democrat'},
            { dataSetId: 'nevada_democrat'},
            { dataSetId: 'south_carolina_democrat'},
            { dataSetId: 'new_hampshire_democrat'}
          ]
      }).fetch()

      // Constants

      var diameter = 960,
        format = d3.format(",d"),
        color = d3.scale.category10();

      var svg = d3.select("#first_uspolling_graph")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

      var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .value(function(d) {
          console.log("This is in bubble : ", d.size);
          return Number(d.size);
        })
        .padding(1.5);

      Deps.autorun(function(){
        var node = svg.selectAll(".node")
          .data(bubble.nodes(processData(data)).filter(function(d) { return !d.children;}))


        node.enter()
          .append('g')
          .attr("class", "node")
          .attr("transform", function(d) { console.log("This is in transform :", d); return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
          .text(function(d) {console.log(d.size); return d.packageName + ": " + format(d.value); });

        node.append("circle")
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) { return color(d.className); });

        node.append("text")
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function(d) {console.log('text d is: ', d); return d.packageName});
      });
    }
  });
});