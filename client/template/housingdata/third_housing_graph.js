Template.housingData.onRendered(function() {
  // This callback so the chart loads properly, as well as the method in upload/server.js
  Meteor.call('myData', function(err, result) {
    if (err) {
      console.log(err)
    } else {


      //define constants, height/width




      var margin = {top: 20, right: 150, bottom: 40, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        dotRadius = function() { return 1 };



      //define scales and axes

      var x = d3.time.scale()
        .range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);

      
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      var color = d3.scale.category10();

      // 2008 is value / row 210.
      // 2014 is row 282.

      var i=0;
      var line3 = d3.svg.line()
        .defined(function(d) {
          return Number(new Date(d.Time)) >= minDate; 
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

      var minDate = dateConversion('Mon Dec 31 2007 23:59:59 GMT+1400 (SGT)');

      //declare a Deps.autorun block
      Deps.autorun(function(){



          //perform a reactive query on the collection to get an array
          // var dataset1 = Data.find({dataSetId: 'hpi'},
          //  {fields: {BC_Vancouver_Index: 1, Time: 1}}).fetch();


          // var dataset2 = Data.find({dataSetId: 'hpi'},
          //  {fields: {BC_Victoria_Index: 1, Time: 1}}).fetch();

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

          //
          var cities = color.domain().map(function(name) {
            return {
              name: name,
              values: dataset.map(function(d) {
                return {Time: d.Time, Index: +d[name]};
              })
            };
          });

          x.domain(d3.extent(dataset, function(d) {
            i+=1; 
            console.log("Current value is: ", i, " ", Number(new Date(d.Time)));
            // console.log(new Date(d.Time));
            if (Number(new Date(d.Time)) >= minDate) {
              return new Date(d.Time);
            }
          }));
          y.domain([
            d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.Index; }); }),
            d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.Index; }); })
          ]);

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append('text')
            .attr('x', 6)
            .attr('y', 18)
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

          var city = svg.selectAll('.city')
            .data(cities)


          city.enter()
            .append('g')
            .attr('class', 'city');

          city.append('path')
            .attr('class', 'line')
            .attr('d', function(d) { console.log('d is: ', d); return line3(d.values); })
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

          //The following code adds points to the graph -- I didn't like the look, so I commented it out.
          // It does work, though.

          var points = svg.selectAll('.groupOfPoint')
            .data(cities);





          //   points
          //   .enter()
          //   .append('g')
          //   .attr('class', 'groupOfPoint');

          //   points.selectAll('.point')
          //     .data(function(d) {
          //       return d.values;
          //     })
          //     .enter()
          //     .append('circle')
          //     .attr('cx', function(d) {
          //       return x(new Date(d.Time))
          //     })
          //     .attr('cy', function(d) {
          //       return y(d.Index);
          //     })
          //     .attr('r', dotRadius());


         
          // points.exit().remove();
         
          // points.attr('class', function(d,i) { return 'point point-' + i });
          
          // d3.transition(points)
          //   .attr('cx', function(d) {
          //     return x(new Date(d.values.forEach(function(c) {
          //       console.log("cx is: ", c.Time);
          //       return c.Time;
          //     })))})
          //   .attr('cy', function(d) {
          //     return y(d.values.forEach(function(c) {
          //       console.log("cy is: ", c.Index)
          //       return c.Index;
          //     }))
          //   })
          //   .attr('r', dotRadius())




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