/**
 * @jsx React.DOM
 */

var React = require('react');
var AmountFormatter = require('../util/AmountFormatter');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      glyphicon: 'glyphicon-chevron-right'
    };
  },

  propTypes: {
    idx: React.PropTypes.number,
    name: React.PropTypes.string,
    date: React.PropTypes.string,
    amount: React.PropTypes.number,
    source: React.PropTypes.string,
    sourceUrl: React.PropTypes.string
  },

  render: function() {
    var collapseId = this.props.idx + "Collapse";
    var href = "#" + collapseId;
    var altText = this.props.name + " report details";
    var amountCategory = AmountFormatter.getAmountCategory(this.props.amount, 24);
    var amountClasses = "col-xs-2 amount-" + amountCategory;

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">
            <a className="expander-link collapsed"
              data-toggle="collapse"
              href={ href }
              title={ altText }
              aria-expanded="false"
              aria-controls={ collapseId }
              onClick={ this._onExpand }
            >
              <div className="row">
                <div className="col-xs-1 expander-cell">
                  <span className={ 'glyphicon ' + this.state.glyphicon }></span>
                </div>
                <div className="col-xs-5 name">{ this.props.name }</div>
                <div className="col-xs-2 duration"></div>
                <div className={ amountClasses }>{ this.props.amount }"</div>
                <div className="col-xs-2 report-date">{ this.props.date }</div>
              </div>
            </a>
          </h3>
        </div>
        <div className="collapse" id={ collapseId }>
          <div className="panel-body">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  },

  _onExpand: function() {
    if (this.state.glyphicon === 'glyphicon-chevron-right') {
      this.setState({
        glyphicon: 'glyphicon-chevron-down'
      });
    } else {
      this.setState({
        glyphicon: 'glyphicon-chevron-right'
      });
    }
  }
});

