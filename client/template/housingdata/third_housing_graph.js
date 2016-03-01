Template.housingData.onRendered(function() {
  // This callback so the chart loads properly, as well as the method in upload/server.js
  Meteor.call('myData', function(err, result) {
    if (err) {
      console.log(err)
    } else {

      //define constants, height/width

      var margin = {top: 20, right: 165, bottom: 40, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        bisectDate = d3.bisector(function(d) { return d.date; }).left,
        dotRadius = function() { return 3 };

      // Define the div for the tooltip
      var div = d3.select("body").append("div") 
        .attr("class", "tooltip")       
        .style("opacity", 0);

      //define scales and axes

      var x = d3.time.scale()
        .range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(5);

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      var color = d3.scale.category10();

      var line3 = d3.svg.line()
        .defined(function(d) {
          return Number(new Date(d.Time)) >= minX; 
        })
        .x(function(d) { return x(new Date(d.Time)); })
        .y(function(d) { return y(d.Index); })  

      //define key function to bind elements to documents
      
      //define the SVG element by selecting the SVG via its id attribute
      var svg = d3.select("#third_housing_graph")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")

      svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text('Price Index');

      // This function converts the following date structure into a literal number.
      // Min date in this graph represents January 1st, 2008, regardless of what timezone you start in.

      var minX = dateConversion('Mon Dec 31 2011 23:59:59 GMT+1400 (SGT)');

      //declare a Deps.autorun block
      Deps.autorun(function(){

          // This is entire dataset.
          var dataset = Data.find({dataSetId: 'hpi'}).fetch();

          // This is a subset where there are only positive values to the Edmonton Index.
          // var dataset = Data.find({AB_Edmonton_Index: {$ne: '0'}}).fetch()

          var keys = color.domain(d3.keys(dataset[0]).filter(function(key) { 
            if (key === 'Vancouver_HPI'
             || key === 'Toronto_HPI'
             || key === 'Montreal_HPI') {
              return key
            }
          }));

          var cities = color.domain().map(function(name) {
            return {
              name: name,
              values: dataset.map(function(d) {
                return {Time: d.Time, Index: +d[name]};
              })
            };
          });

          x.domain(d3.extent(dataset, function(d) {
            if (Number(new Date(d.Time)) >= minX) {
              return new Date(d.Time);
            }
          }));
          y.domain([
            d3.min(cities, function(c) {
              return d3.min(c.values, function(v) {
                if (Number(new Date(v.Time)) >= minX) {
                  return v.Index;
                }
              });
            }),
            d3.max(cities, function(c) {
              return d3.max(c.values, function(v) {
                return v.Index;
              });
            })
          ]);

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append('text')
            .attr('x', 800)
            .attr('y', 24)
            .style('text-anchor', 'middle')
            .text('Year');

          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price Index");

          // Rendering the line graph.
          var city = svg.selectAll('.city')
            .data(cities)

          city.enter()
            .append('g')
            .attr('class', 'city');

          city.append('path')
            .attr('class', 'line3')
            .attr('d', function(d) { return line3(d.values); })
            .attr("data-legend",function(d) { return d.name})
            .style("stroke", function(d) { return color(d.name); })

          city.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(new Date(d.value.Time)) + "," + y(d.value.Index) + ")"; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .style('fill', function(d) { return color(d.name); })
            .text(function(d) { return d.name; });

          city.exit().remove()

          // Rendering the points on the graph.
          var points = svg.selectAll('.cityPoint')
            .data(cities);

          points
            .enter()
            .append('g')
            .attr('class', 'cityPoint');

          points.selectAll('.point')
            .data(function(d) {
              return d.values;
            })
            .enter()
            .append('circle')
            .attr('circleId', function(d, i) {
              if (Number(new Date(d.Time)) >= minX) {
                return 'circleId-'+i;
              }
            })
            .attr('cx', function(d) {
              if (Number(new Date(d.Time)) >= minX) {
                return x(new Date(d.Time));
              }
            })
            .attr('cy', function(d) {
              if (Number(new Date(d.Time)) >= minX) {
                return y(d.Index);
              }
            })
            .attr('r', function(d) { 
              if (Number(new Date(d.Time)) >= minX) {
                return dotRadius()
              }
            });

          points.selectAll('circle')
            .on('mouseover', function(d) {
              d3.select(this)
                .style('r', dotRadius()*1.5)
                .style('fill', 'red');
              div.transition()    
                .duration(200)    
                .style("opacity", .9);    
              div.html("Index: " + d.Index + "<br/>" + "Time: " + d.Time)  
                .style("left", (d3.event.pageX - 25) + "px")   
                .style("top", (d3.event.pageY - 80) + "px");
            })
            .on('mouseout', function(d) {
              d3.select(this)
                .transition()
                .duration(1000)
                .style('r',dotRadius())
                .style('fill', 'black');
              div.transition()    
                .duration(500)    
                .style("opacity", 0); 
            });
  
          points.exit().remove();
               
          legend3 = svg.append("g")
            .attr("class","legend")
            .attr("transform","translate(50,30)")
            .style("font-size","12px")
            .call(d3.legend)

          setTimeout(function() { 
            legend3
              .style("font-size","20px")
              .attr("data-style-padding",10)
              .call(d3.legend)
          },1000)

      });
    }
  });
});