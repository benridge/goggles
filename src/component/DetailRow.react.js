import React, { Component, PropTypes }  from 'react';

class DetailRow extends Component {

  render() {
    const duration = this._formatDuration();
    return (
      <div className="row">
        <div className="col-xs-1 expander-cell"></div>
          <div className="col-xs-5 name">
            <a href={ this.props.sourceUrl }>
              { this.props.source }
            </a>
          </div>
        <div className="col-xs-2 duration">{ duration }</div>
        <div className="col-xs-2">{ this.props.amount }"</div>
        <div className="col-xs-2">{ this.props.date }</div>
      </div>
    );
  }

  _formatDuration() {
    switch (this.props.duration) {
      case (0):
        return '';
      case (24):
      case (48):
      case (72):
        return this.props.duration + 'hr';
      default:
        return (this.props.duration / 24) + ' days';
    }
  }
}

DetailRow.propTypes = {
  date: PropTypes.string,
  duration: PropTypes.number,
  amount: PropTypes.number,
  source: PropTypes.string,
  sourceUrl: PropTypes.string
};

export default DetailRow;
