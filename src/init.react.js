var React = require('react');
var TodayReport = require('./page/TodayReport.react');
var NavBar = require('./component/NavBar.react');

React.render(
  <TodayReport />,
  document.getElementById('dynamic-content')
);