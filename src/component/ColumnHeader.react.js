import React, { Component, PropTypes } from 'react';

const columnSizeCssMap = {
  'expander': 'col-xs-1',
  'duration': 'col-xs-2',
  'name': 'col-xs-5',
  'amount': 'col-xs-2',
  'date': 'col-xs-2'
};

class ColumnHeader extends Component {
  render() {
    let glyphiconDirection = 'glyphicon-chevron-right';
    if (this.props.isExpandAll === true) {
      glyphiconDirection = 'glyphicon-chevron-down';
    }
    return (
      <div className="list-group-item-info column-header">
        <div className="row">
          <div className={ columnSizeCssMap.expander + ' expander-cell' }>
            <a href="#" onClick={ this.props.onExpandAllToggle }><span className={ 'glyphicon ' + glyphiconDirection }></span></a>
          </div>
          <div className={ columnSizeCssMap.name }><a href="#" onClick={ this.props.onSortClick }>Location</a></div>
          <div className={ columnSizeCssMap.duration }></div>
          <div className={ columnSizeCssMap.amount }><a href="#" onClick={ this.props.onSortClick }>Amount</a></div>
          <div className={ columnSizeCssMap.date }>Updated</div>
        </div>
      </div>
    );
  }
}

ColumnHeader.propTypes = {
  onSortClick: PropTypes.func.isRequired,
  onExpandAllToggle: PropTypes.func.isRequired,
  isExpandAll: PropTypes.bool.isRequired
};

export default ColumnHeader;