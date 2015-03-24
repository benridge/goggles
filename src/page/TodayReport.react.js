/**
 * @jsx React.DOM
 */

var React = require('react');
var request = require('superagent');
var _ = require('lodash');

var ServerConfig = require('../../server/common').config();

var GroupRow = require('./../component/GroupRow.react');
var DetailRow = require('./../component/DetailRow.react');
var LoadingIndicator = require('./../component/LoadingIndicator.react');
var DateFormatter = require('../util/DateFormatter');

var columnSizeCssMap = {
  'duration': 'col-xs-1',
  'name': 'col-xs-6 col-s-8',
  'amount': 'col-xs-1',
  'date': 'col-xs-4 col-s-2'
};

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
      .get(ServerConfig.TOMCAT_URL + '/FindpowReport/index.json?snowReportType=today')
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
          <div id="report-title" className="list-group-item active">Today's Reports</div>
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
      <div className="list-group-item-info column-header">
        <div className="row">
          <div className={ columnSizeCssMap.duration }></div>
          <div className={ columnSizeCssMap.name } onClick={this._sortReport}>Location</div>
          <div className={ columnSizeCssMap.amount } onClick={this._sortReport}></div>
          <div className={ columnSizeCssMap.date } onClick={this._sortReport}>Updated</div>
        </div>
      </div>
    );
  },

  _getLocations: function() {

    var locationMap = _.reduce(this.state.locations, (result, locationData) => {
      result[locationData.location] = result[locationData.location] || [];
      result[locationData.location].push(locationData);
      return result;
    }, {});

    return _.reduce(locationMap, (result, locationArray) => {
      var groupRowData = locationArray[0];
      var detailRows = this._getDetailRows(locationArray);
      var formattedDate = DateFormatter.formatTodayDate(groupRowData.source_date);
      result.push(
        <GroupRow
          key={ groupRowData.ROW_NUM }
          idx={ groupRowData.ROW_NUM }
          name={ groupRowData.location }
          date={ formattedDate }
          amount={ groupRowData.amount }
          source={ groupRowData.source_name }
          sourceUrl={ groupRowData.url }
        >
          { detailRows }
        </GroupRow>
      );
      return result;
    }, []);
  },

  _getDetailRows: function(detailRowDataArray) {
    var duration;
    var prevDuration = 0;
    var formattedDate;
    return _.reduce(detailRowDataArray, (result, detailRowData) => {
      duration = detailRowData.duration !== prevDuration ? detailRowData.duration : 0;
      prevDuration = detailRowData.duration;
      formattedDate = DateFormatter.formatTodayDate(detailRowData.source_date);


      result.push(
        <DetailRow
          key={ detailRowData.ROW_NUM }
          date={ formattedDate }
          duration={ duration }
          amount={ detailRowData.amount }
          source={ detailRowData.source_name }
          sourceUrl={ detailRowData.url }
        />
      );
      return result;
    }, []);
  }
});
