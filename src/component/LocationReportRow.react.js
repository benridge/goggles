/**
 * @jsx React.DOM
 */

var React = require('react');

module.exports = React.createClass({

  propTypes: {
    idx: React.PropTypes.number,
    name: React.PropTypes.string,
    date: React.PropTypes.string,
    amount: React.PropTypes.number,
    source: React.PropTypes.string,
    sourceUrl: React.PropTypes.string
  },

  render: function() {
    var collapseId =  this.props.idx + "Collapse";
    var href = "#" + collapseId;
    return (
      <div className="panel panel-default">
        <a className="collapsed" data-toggle="collapse" href={ href } aria-expanded="false" aria-controls={ collapseId }>
          <div className="panel-heading">
            <h3 className="panel-title">
              <div className="row">
                <div className="col-xs-6">{ this.props.name }</div>
                <div className="col-xs-3">{ this.props.amount }</div>
                <div className="col-xs-3">{ this.props.date }</div>
              </div>
            </h3>
          </div>
        </a>
        <div className="collapse" id={ collapseId }>
          <div className="panel-body">
            <div className="row">
              <div className="col-xs-6">{ this.props.source }</div>
              <div className="col-xs-3">{ this.props.amount }</div>
              <div className="col-xs-3">{ this.props.date }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});