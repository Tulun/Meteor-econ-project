// Meteor.methods({
//   parseUpload( data ) {
//     check( data, Array );

//     for (let i=0; i<data.length; i++) {
//       let item = data[i],
//         exists = USCrimeData.findOne({ State: item.State } );

//       if (!exists) {
//         USCrimeData.insert(item);
//       } else { 
//         console.warn( 'Rejected. This item already exists.')
//       }
//     }
//   }
// });

Meteor.methods({
  parseUpload( data, dataSetId ) {
    check( data, Array );

    for (let i=0; i<data.length; i++) {
      let item = data[i]
      // I have pulled the dataSet name from the CSV file to add an 'id' to each datapoint.
      data[i].dataSetId = dataSetId;
      Data.insert(item);
    }
  }
});