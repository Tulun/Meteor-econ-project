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

  // Fake JSON data, using this to figure out the filter function for my data.
  // var json = {"countries_msg_vol": {
  //   "CA": 170, "US": 393, "BB": 12, "CU": 9, "BR": 89, "MX": 192, "PY": 32, "UY": 9, "VE": 25, "BG": 42, "CZ": 12, "HU": 7, "RU": 184, "FI": 42, "GB": 162, "IT": 87, "ES": 65, "FR": 42, "DE": 102, "NL": 12, "CN": 92, "JP": 65, "KR": 87, "TW": 9, "IN": 98, "SG": 32, "ID": 4, "MY": 7, "VN": 8, "AU": 129, "NZ": 65, "GU": 11, "EG": 18, "LY": 4, "ZA": 76, "A1": 2, "Other": 254 
  // }};