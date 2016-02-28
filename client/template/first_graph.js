Template.firstGraph.onRendered(function() {
  // This callback so the chart loads properly, as well as the method in upload/server.js
  Meteor.call('myData', function(err, result) {
    if (err) {
      console.log(err)
    } else {
      var data = Data.find({dataSetId: 'hpi'}).fetch();

      //define constants, height/width




      var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;


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

      var line = d3.svg.line()
        .defined(function(d) { return d.Index > 0; })
        .x(function(d) { return x(new Date(d.Time)); })
        .y(function(d) { return y(d.Index); })      

      //define key function to bind elements to documents
      

      //define the SVG element by selecting the SVG via its id attribute
      var svg = d3.select("#first_graph")
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
            if (key === "BC_Vancouver_Index"
             || key ==='ON_Toronto_Index'
             || key ==='QC_Montreal_Index') {
              return key
            }
          }));

          var cities = color.domain().map(function(name) {
            return {
              name: name,
              values: data.map(function(d) {
                return {Time: d.Time, Index: +d[name]};
              })
            };
          });

          console.log(cities)


          
          x.domain(d3.extent(dataset, function(d) { return new Date(d.Time); }));
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
            .enter();

          city.append('g')
            .attr('class', 'city');

          city.append('path')
            .attr('class', 'line')
            .attr('d', function(d) {return line(d.values); })
            .style("stroke", function(d) { return color(d.name); })

          city.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(new Date(d.value.Time)) + "," + y(d.value.Index) + ")"; })
            .attr("x", -100)
            .attr("dy", ".35em")
            .style('fill', function(d) { return color(d.name); })
            .text(function(d) { return d.name; });

      });
    }
  });
});