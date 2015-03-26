/**
 * @jsx React.DOM
 */

var React = require('react');
var _ = require('lodash');

var LocationStore = require('../store/LocationStore');

var GroupRow = require('./../component/GroupRow.react');
var DetailRow = require('./../component/DetailRow.react');
var LoadingIndicator = require('./../component/LoadingIndicator.react');
var DateFormatter = require('../util/DateFormatter');
var LocationHelper = require('../util/LocationHelper');

var columnSizeCssMap = {
  'duration': 'col-xs-1',
  'name': 'col-xs-5',
  'amount': 'col-xs-2',
  'date': 'col-xs-4'
};

module.exports = React.createClass({
  displayName: 'TodayReport',
  getInitialState: function() {
    return {
      groupedLocations: [],
      loading: true,
      order: {
        dataIndex: 'location',
        direction: 'ascending'
      }
    };
  },

  componentDidMount: function() {
    LocationStore.load('/FindpowReport/index.json?snowReportType=today')
                 .then(this._onLocationsLoaded);
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
    if (this.state.groupedLocations.length > 0) {
      return  this._getLocations();
    }
  },

  _getBlankSlate: function() {
    var blankSlateClassNames = "";
    var showBlankSlate = _.keys(this.state.locationMap).length === 0 && this.state.loading === false;
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
          <div className={ columnSizeCssMap.name }><a href="#" onClick={this._sortReport}>Location</a></div>
          <div className={ columnSizeCssMap.amount }><a href="#" onClick={this._sortReport}>Amount</a></div>
          <div className={ columnSizeCssMap.date }>Last Updated</div>
        </div>
      </div>
    );
  },

  _getLocations: function() {
    return _.reduce(this.state.groupedLocations, (result, groupedLocation) => {
      var groupRowData = groupedLocation.reports[0];
      var detailRows = this._getDetailRows(groupedLocation.reports);
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
  },

  _onLocationsLoaded: function(locations) {
    var groupedLocations = LocationHelper.map(locations);
    this.setState({
      groupedLocations: groupedLocations,
      loading: false
    });
  },

  _sortReport: function(event) {
    var direction, dataIndex;
    if (event.target.textContent === 'Amount') {
      dataIndex = 'amount';
      direction = 'descending';
    } else if (event.target.textContent === 'Location') {
      dataIndex = 'location';
      direction = 'ascending';
    }
    var groupedLocations = LocationHelper.orderBy(dataIndex, this.state.groupedLocations, direction);

    this.setState({
      groupedLocations: groupedLocations,
      order: {
        dataIndex: dataIndex,
        direction: direction
      }
    });

  }
});
