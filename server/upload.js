Meteor.methods({
  parseUpload( data, dataSetId ) {
    check( data, Array );
    // Exists here checks if the file has been uploaded. This checks for the file name.
    // The same file name (example.csv -> 'example' is the name of the data set) cannot be loaded
    // into Mongo.
    var exists = Data.findOne({ dataSetId: dataSetId })
    if (!exists) {
      for (let i=0; i<data.length; i++) {
        let item = data[i]
        // I have pulled the dataSet name from the CSV file to add an 'id' to each datapoint.
        data[i].dataSetId = dataSetId;
        Data.insert(item);
      }
    } else {
      console.warn('Rejected. This file has already been uploaded.')
    }
  }
});