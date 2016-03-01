// This file has ALL the constants / function used by all the data in this particular file.
// The way Meteor loads file is by how NESTED a file is first (lowest first), then by name.
// So because this file is called _constants_housing, it will load before the rest of my graphs.

Template.housingData.onRendered(function() {
  // This callback so the chart loads properly, as well as the method in upload/server.js
  Meteor.call('myData', function(err, result) {
    if (err) {
      console.log(err)
    } else {

      d3.legend = function(g) {
        g.each(function() {
          var g= d3.select(this),
              items = {},
              svg = d3.select(g.property("nearestViewportElement")),
              legendPadding = g.attr("data-style-padding") || 5,
              lb = g.selectAll(".legend-box").data([true]),
              li = g.selectAll(".legend-items").data([true])

          lb.enter().append("rect").classed("legend-box",true)
          li.enter().append("g").classed("legend-items",true)

          svg.selectAll("[data-legend]").each(function() {
              var self = d3.select(this)
              items[self.attr("data-legend")] = {
                pos : self.attr("data-legend-pos") || this.getBBox().y,
                color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke") 
              }
            })

          items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})

          
          li.selectAll("text")
              .data(items,function(d) { return d.key})
              .call(function(d) { d.enter().append("text")})
              .call(function(d) { d.exit().remove()})
              .attr("y",function(d,i) { return i+"em"})
              .attr("x","1em")
              .text(function(d) { ;return d.key})
          
          li.selectAll("circle")
              .data(items,function(d) { return d.key})
              .call(function(d) { d.enter().append("circle")})
              .call(function(d) { d.exit().remove()})
              .attr("cy",function(d,i) { return i-0.25+"em"})
              .attr("cx",0)
              .attr("r","0.4em")
              .style("fill",function(d) { return d.value.color})  
          
          // Reposition and resize the box
          var lbbox = li[0][0].getBBox()  
          lb.attr("x",(lbbox.x-legendPadding))
              .attr("y",(lbbox.y-legendPadding))
              .attr("height",(lbbox.height+2*legendPadding))
              .attr("width",(lbbox.width+2*legendPadding))
        })
        return g
      }
      // This function converts a date in the following format: Mon Dec 31 2007 23:59:59 GMT+1400 (SGT)'
      // OR '2008-01-01' (etc) to for conditional statements. I use the above format to cover the timezone differences.
      // Essentially, in the above example, I am filtering for the min date of Jan 1st, 2008, using the 
      // most forward time zone.
      dateConversion = function(date) {
        return Number(new Date(date));
      };

    };
  });
})