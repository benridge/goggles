import React, { Component, PropTypes } from 'react';
import * as AmountFormatter from '../utils/AmountFormatter';

class GroupRow extends Component {
  render() {
    const collapseId = this.props.idx + "Collapse";
    const href = "#" + collapseId;
    const altText = this.props.name + " report details";
    const amountCategory = AmountFormatter.getAmountCategory(this.props.amount, 24);
    const amountClasses = "col-xs-2 amount-" + amountCategory;
    const linkCollapseCls = this.props.expanded ? '' : 'collapsed';
    const collapsedContentCls = this.props.expanded ? 'collapse in' : 'collapse';
    const glyphicon = this.props.expanded ? 'glyphicon-chevron-down' : 'glyphicon-chevron-right';
    const ariaExpanded = this.props.expanded.toString();
    //fixes an apparent bug in bootstrap collapse that doesn't remove height of 0 if collapsed manually and then dom is updated
    const collapsedStyle = {
      height: this.props.expanded ? 'inherit' : '0'
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
              onClick={ this.props.onExpandToggle }
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
  }
}

GroupRow.propTypes = {
    idx: PropTypes.number,
    name: PropTypes.string,
    date: PropTypes.string,
    amount: PropTypes.number,
    source: PropTypes.string,
    sourceUrl: PropTypes.string,
    expanded: PropTypes.bool,
    onExpandToggle: PropTypes.func
};

export default GroupRow;
