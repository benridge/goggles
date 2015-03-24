var React = require('react');

module.exports = React.createClass({

  propTypes: {
    date: React.PropTypes.string,
    duration: React.PropTypes.number,
    amount: React.PropTypes.number,
    source: React.PropTypes.string,
    sourceUrl: React.PropTypes.string
  },

  render: function() {
    var duration = this._formatDuration();
    return (
      <div className="row">
        <div className="col-xs-1 duration">{ duration }</div>
          <div className="col-xs-6 col-s-8 name">
            <a href={ this.props.sourceUrl }>
              { this.props.source }
            </a>
          </div>
        <div className="col-xs-1">{ this.props.amount }"</div>
        <div className="col-xs-4 col-s-2">{ this.props.date }</div>
      </div>
    );
  },

  _formatDuration: function() {
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
});