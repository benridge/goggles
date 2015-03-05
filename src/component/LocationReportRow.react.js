/**
 * @jsx React.DOM
 */

var React = require('react');
var DateFormatter = require('../util/DateFormatter');
var AmountFormatter = require('../util/AmountFormatter');

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
    var altText = this.props.name + " report details";
    var formattedDate = DateFormatter.formatDateString(this.props.date);
    var amountCategory = AmountFormatter.getAmountCategory(this.props.amount, 24);
    var amountClasses = "col-xs-2 amount-" + amountCategory;

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">
            <div className="row">
              <div className="col-xs-1">
                <a className="collapsed" data-toggle="collapse" href={ href }  title={ altText } aria-expanded="false" aria-controls={ collapseId }>
                  <span className="glyphicon glyphicon-chevron-down"></span>
                </a>
              </div>
              <div className="col-xs-5">{ this.props.name }</div>
              <div className={ amountClasses }>{ this.props.amount }"</div>
              <div className="col-xs-4 report-date">{ formattedDate }</div>
            </div>
          </h3>
        </div>
        <div className="collapse" id={ collapseId }>
          <div className="panel-body">
            <div className="row">
              <div className="col-xs-1"></div>
              <a href={ this.props.sourceUrl }>
                <div className="col-xs-5">{ this.props.source }</div>
              </a>
              <div className="col-xs-2">{ this.props.amount }"</div>
              <div className="col-xs-3">{ formattedDate }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});