/**
 * @jsx React.DOM
 */

var React = require('react');
var AmountFormatter = require('../util/AmountFormatter');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      expanded: this.props.initExpanded
    };
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({
      expanded: newProps.initExpanded
    });
  },

  propTypes: {
    idx: React.PropTypes.number,
    name: React.PropTypes.string,
    date: React.PropTypes.string,
    amount: React.PropTypes.number,
    source: React.PropTypes.string,
    sourceUrl: React.PropTypes.string,
    initExpanded: React.PropTypes.bool
  },

  render: function() {
    var collapseId = this.props.idx + "Collapse";
    var href = "#" + collapseId;
    var altText = this.props.name + " report details";
    var amountCategory = AmountFormatter.getAmountCategory(this.props.amount, 24);
    var amountClasses = "col-xs-2 amount-" + amountCategory;
    var linkCollapseCls = this.state.expanded ? '' : 'collapsed';
    var collapsedContentCls = this.state.expanded ? 'collapse in' : 'collapse';
    var glyphicon = this.state.expanded ? 'glyphicon-chevron-down' : 'glyphicon-chevron-right';
    var ariaExpanded = this.state.expanded.toString();
    //fixes an apparent bug in bootstrap collapse that doesn't remove height of 0 if collapsed manually and then dom is updated
    var collapsedStyle = {
      height: this.state.expanded ? 'inherit' : '0'
    };

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">
            <a className={'expander-link ' + linkCollapseCls}
              data-toggle="collapse"
              href={ href }
              title={ altText }
              aria-expanded={ ariaExpanded }
              aria-controls={ collapseId }
              onClick={ this._onExpand }
            >
              <div className="row">
                <div className="col-xs-1 expander-cell">
                  <span className={ 'glyphicon ' + glyphicon }></span>
                </div>
                <div className="col-xs-5 name">{ this.props.name }</div>
                <div className="col-xs-2 duration"></div>
                <div className={ amountClasses }>{ this.props.amount }"</div>
                <div className="col-xs-2 report-date">{ this.props.date }</div>
              </div>
            </a>
          </h3>
        </div>
        <div className={ collapsedContentCls } id={ collapseId } aria-expanded={ ariaExpanded } style={ collapsedStyle }>
          <div className="panel-body">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  },

  _onExpand: function() {
    this.setState({
      expanded: !this.state.expanded
    });
  }
});

