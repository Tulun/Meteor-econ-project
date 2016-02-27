Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
   waitOn: function() {
     return Meteor.subscribe('data');
  }
});

Router.route('/', {name: 'index'});

Router.route('/upload', {name: 'upload'});

Router.route('/housingdata', {
  name: 'firstGraph',
  data: function() {return Data.find({ dataSetId: 'hpi'}).fetch();}
})
