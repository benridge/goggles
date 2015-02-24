/**
 * @jsx React.DOM
 */

var React = require('react');
var request = require('superagent');
var _ = require('lodash');

var ServerConfig = require('../server/common').config();

var LocationReportRow = require('./component/LocationReportRow.react');
var LoadingIndicator = require('./component/LoadingIndicator.react');

module.exports = React.createClass({
  displayName: 'TodayReport',
  getInitialState: function() {
    return {
      locations: [],
      loading: true
    };
  },

  componentDidMount: function() {
    request
      .get(ServerConfig.TOMCAT_URL + '/FindpowReport/index.json?snowReportType=latest')
      .end((res) => {
        var report = JSON.parse(res.text).report;

        this.setState({
          locations: report.locations,
          loading: false
        });
      });
  },

  render: function() {
    var locations = this._getLocations();
    var blankSlateClassNames = "panel panel-default blankSlate";
    var hideBlankSlate = locations.length > 0 || this.state.loading === true;
    if (hideBlankSlate) {
      blankSlateClassNames += " hidden";
    }

    return (
      <div id="report-container">
        <LoadingIndicator loading={ this.state.loading} />
        <div className={ blankSlateClassNames }>
          <div className="panel-body">
            No reports yet for today.
          </div>
        </div>
        { locations }
      </div>
    );
  },

  _getLocations: function() {
    return _.map(this.state.locations, (locationData, index)  => {
      return <LocationReportRow
        key={ index }
        idx={ index }
        name={ locationData.location }
        date={ locationData.source_date }
        amount={ locationData.amount }
        source={ locationData.source_name }
      />;
    });
  }
});
