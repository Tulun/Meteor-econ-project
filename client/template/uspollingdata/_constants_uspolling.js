Template.usPollingData.onRendered(function() {
  // This callback so the chart loads properly, as well as the method in upload/server.js
  Meteor.call('myData', function(err, result) {
    if (err) {
      console.log(err)
    } else {
      // Returns a flattened hierarchy containing all leaf nodes under the root.
      // classes = function(root) {
      //   var classes = [];

      //   function recurse(name, node) {
      //     if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
      //     else classes.push({packageName: name, className: node.name, value: node.size});
      //   }

      //   recurse(null, root);
      //   return {children: classes};
      // }

      processData = function(data) {
        console.log('process data start is: ', data);
        var newDataSet = [];
        data.forEach(function(prop){ 
          console.log('this is prop: ', Number(prop.Total_Votes.split(',').join('')));
          return newDataSet.push({packageName: prop.Democratic_Candidate + " " + prop.dataSetId, className: prop.Democratic_Candidate.toLowerCase(), size: Number(prop.Total_Votes.split(',').join(''))});
        })
        console.log("This is newDataSet: ", newDataSet);
        return {children: newDataSet};
      }
    }
  });
});