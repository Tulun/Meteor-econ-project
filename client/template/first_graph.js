Template.firstGraph.onRendered(function() {

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

  var line = d3.svg.line()
  .x(function(d) { return x(new Date(d.Time)); })
  .y(function(d) { return y(Number(d.BC_Vancouver_Index)); })


  

  //define key function to bind elements to documents
  

  //define the SVG element by selecting the SVG via its id attribute
  var svg = d3.select("#first_graph")
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

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
      var dataset = Data.find({dataSetId: 'hpi'}).fetch();

      var paths = svg.selectAll('path.line')
        .data([dataset]);



      //update scale domains and axises
      // var w = 600;
      // var h = 300;

      // var xscale = d3.scale.ordinal()
      //   .rangeRoundBands([0,w], 0.05);
      // var yscale = d3.scale.linear()
      //   .range([0,h]);
      
      x.domain(d3.extent(dataset, function(d) { return new Date(d.Time); }));
      y.domain(d3.extent(dataset, function(d) { return Number(d.BC_Vancouver_Index); }));

      // //Define key function, to be used when binding data
      // var key = function(d) {
      //     return d._id;
      // };

      svg.select(".x.axis")
      .transition()
      .duration(1000)
      .call(xAxis);

      svg.select(".y.axis")
      .transition()
      .duration(1000)
      .call(yAxis);

      //select elements that correspond to documents

      //handle new documents via enter()
      paths.enter()
        .append('path')
        .attr('d', line);
             

      //handle updates to documents via transition()
      paths.transition()
      

      //handle removed documents via exit()
      paths.exit()
          .remove();
  });
});