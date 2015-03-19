var React = require('react');
var LatestReport = require('./page/LatestReport.react');
var TodayReport = require('./page/TodayReport.react');

React.render(
  <TodayReport />,
  document.getElementById('dynamic-content')
);