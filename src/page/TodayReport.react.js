import React, { Component, PropTypes }  from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import ColumnHeader from './../component/ColumnHeader.react';
import GroupRow from './../component/GroupRow.react';
import DetailRow from './../component/DetailRow.react';
import LoadingIndicator from './../component/LoadingIndicator.react';
import * as DateFormatter from '../utils/DateFormatter';
import { loadLocations, expandAll, expandRowToggle, sort } from '../actions/LocationsActions';

class TodayReport extends Component {

  constructor(props) {
    super(props);
    this._onExpandAll = this._onExpandAll.bind(this);
    this._sortReport = this._sortReport.bind(this);
    this._getHeader = this._getHeader.bind(this);
  }

  componentDidMount() {
    if (this.props.locations.length === 0) {
      this.props.dispatch(loadLocations());
    }
  }

  render() {
    const table = this._getTable();
    const blankSlate = this._getBlankSlate();
    const header = this._getHeader();

    return (
      <div id="report-container">

        <LoadingIndicator loading={ this.props.loading} />

        <div className="list-group">
          <div id="report-title" className="list-group-item active">Today's Reports</div>
          { blankSlate }
          { header }
          { table }
        </div>
      </div>
    );
  }

  _getTable() {
    if (this.props.locations.length > 0) {
      return  this._getLocations();
    }
  }

  _getBlankSlate() {
    const showBlankSlate = _.keys(this.props.locations).length === 0 && this.props.loading === false;
    if (showBlankSlate) {
      return (
        <div className="list-group-item">
          <div>
            No reports yet for today.
          </div>
        </div>
      );
    }
  }

  _getHeader() {
    return (
      <ColumnHeader
        onSortClick={ this._sortReport }
        onExpandAllToggle={ this._onExpandAll }
        isExpandAll={ this.props.expandAll }
      />
    );
  }

  _getLocations() {
    return _.reduce(this.props.locations, (result, groupedLocation) => {
      const groupRowData = groupedLocation.reports[0];
      const detailRows = this._getDetailRows(groupedLocation.reports);
      const formattedDate = DateFormatter.formatTodayDate(groupRowData.source_date);
      result.push(
        <GroupRow
          key={ groupRowData.ROW_NUM }
          idx={ groupRowData.ROW_NUM }
          name={ groupRowData.location }
          date={ formattedDate }
          amount={ groupRowData.amount }
          source={ groupRowData.source_name }
          sourceUrl={ groupRowData.url }
          expanded={ this._isRowExpanded(groupRowData.ROW_NUM) }
          onExpandToggle={ this._onExpandRowToggle.bind(this, groupRowData.ROW_NUM) }
        >
          { detailRows }
        </GroupRow>
      );
      return result;
    }, []);
  }

  _getDetailRows(detailRowDataArray) {
    let duration;
    let prevDuration = 0;
    let formattedDate;

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

  _sortReport(event) {

    const dataIndex = event.target.textContent.toLowerCase();
    const previousOrder = this.props.order;
    let direction = 'ascending';

    if (dataIndex === previousOrder.dataIndex) {
      direction = previousOrder.direction === 'descending' ? 'ascending' : 'descending';
    }

    this.props.dispatch(sort({dataIndex, direction}));
  }

  _onExpandAll() {
    this.props.dispatch(expandAll(!this.props.expandAll));
  }

  _onExpandRowToggle(rowNumber) {
    this.props.dispatch(expandRowToggle(rowNumber));
  }

  _isRowExpanded(rowNumber) {
    return this.props.expandAll || this.props.expandedRows.indexOf(rowNumber) > -1;
  }
}

TodayReport.propTypes = {
  dispatch: PropTypes.func.isRequired,
  locations: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  order: PropTypes.object.isRequired,
  expandAll: PropTypes.bool.isRequired,
  expandedRows: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  const pageState = state.TodayReport;
  return {
    locations: pageState.locations,
    loading: pageState.loading,
    order: pageState.order,
    expandAll: pageState.expandAll,
    expandedRows: pageState.expandedRows
  };
}

export default connect(mapStateToProps)(TodayReport);
