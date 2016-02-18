Meteor.methods({
  parseUpload( data ) {
    check( data, Array );

    for (let i=0; i<data.length; i++) {
      let item = data[i],
        exists = USCrimeData.findOne({ state: item.State } );

      if (!exists) {
        USCrimeData.insert(item);
      } else { 
        console.warn( 'Rejected. This item already exists.')
      }
    }
  }
});