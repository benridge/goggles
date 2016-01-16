import React, { Component, PropTypes } from 'react';

class ReportDateRow extends Component {
  render() {
    let className = "list-group-item";
    const date = new Date().toString();
    if (this.props.loading == true) {
      className += " hidden";
    }
    return (
      <div className={ className }>
        <span className="report-date-label">Report generated: </span>
        <span className="report-date-value">{ date }</span>
      </div>
    );
  }
}

ReportDateRow.propTypes = {
    loading: PropTypes.bool
};

export default ReportDateRow;