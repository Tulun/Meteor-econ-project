Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  //  waitOn: function() {
  //    return Meteor.subscribe('data');
  // }
});

Router.route('/', {name: 'index'});

Router.route('/upload', {name: 'upload'});

Router.route('/housingdata', {
  name: 'housingData'
  // data: function() { return Data.find({ dataSetId: 'hpi'}).fetch();}
});


Router.route('/uspollingdata', {
  name: 'usPollingData'
});

Router.route('/polarclock', {
  name: 'polarClock'
});