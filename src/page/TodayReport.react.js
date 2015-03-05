/**
 * @jsx React.DOM
 */

var React = require('react');
var request = require('superagent');
var _ = require('lodash');

var ServerConfig = require('../../server/common').config();

var LocationReportRow = require('./../component/LocationReportRow.react');
var LoadingIndicator = require('./../component/LoadingIndicator.react');
var NavBar = require('./../component/NavBar.react');

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
    var table = this._getTable();
    var blankSlate = this._getBlankSlate();
    var header = this._getHeader();

    return (
      <div id="report-container">

        <LoadingIndicator loading={ this.state.loading} />

        <div className="list-group">
          <div id="report-title" className="list-group-item active">Latest 24 Hour Reports</div>
          { blankSlate }
          { header }
          { table }
        </div>
      </div>
    );
  },

  _getTable: function() {
    if (this.state.locations.length > 0) {
      var locations = this._getLocations();
      return { locations };
    }
  },

  _getBlankSlate: function() {
    var blankSlateClassNames = "";
    var showBlankSlate = this.state.locations.length === 0 && this.state.loading === false;
    if (showBlankSlate) {
      return (
        <div className="list-group-item">
          <div className={ blankSlateClassNames }>
            No reports yet for today.
          </div>
        </div>
      );
    }
  },

  _getHeader: function() {
    return (
      <div data-spy="affix" data-offset-top="100" className="report-column-header">
        <div className="list-group-item-info">
          <div className="row">
            <div className="col-xs-1"></div>
            <div className="col-xs-5" onClick={this._sortReport}>Location</div>
            <div className="col-xs-2" onClick={this._sortReport}>Amount</div>
            <div className="col-xs-4" onClick={this._sortReport}>Date</div>
          </div>
        </div>
      </div>
    );
  },

  _getLocations: function() {
    return _.map(this.state.locations, (locationData, index)  => {
      return (
        <div className="list-group-item location-row">
          <LocationReportRow
            key={ index }
            idx={ index }
            name={ locationData.location }
            date={ locationData.source_date }
            amount={ locationData.amount }
            source={ locationData.source_name }
            sourceUrl={ locationData.url }
          />
        </div>
      );
    });
  }
});
