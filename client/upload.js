Template.upload.onCreated( () => {
  Template.instance().uploading = new ReactiveVar( false );
});

Template.upload.helpers({
  uploading() {
    return Template.instance().uploading.get();
  }
});

Template.upload.events({
  'change [name="uploadCSV"]' ( event, template ) {
    // We'll handle the conversion and upload here
    template.uploading.set( true );
    // These variables pull out the name of the CSV file so we can add it to the data.
    var filename = event.target.files[0].name;
    var dataSetId = filename.substring(0, filename.indexOf('.'));


    
    Papa.parse(event.target.files[0], {
      header: true,
      complete( results, file ) {

        // Handle the upload here.
        Meteor.call( 'parseUpload', results.data, dataSetId, (error, response ) => {
          if ( error ) {
            console.log( error.reason )
          } else {
            // Handle success here.
            template.uploading.set( false );
            Bert.alert( 'Uploading complete!', 'success', 'growl-top-right' );
          }
        });
      }
    });
  }
});