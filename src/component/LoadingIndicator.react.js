/**
 * @jsx React.DOM
 */

var React = require('react');

module.exports = React.createClass({
  displayName: 'LoadingIndicator',
  propTypes: {
    loading: React.PropTypes.bool
  },
  render: function() {
    var className = "alert alert-info";
    if (this.props.loading !== true) {
      className += " hidden";
    }
    return (
      <div id="loadingIndicator" className={ className } role="alert">Loading...</div>
    );
  }
});
//class="alert alert-info" role="alert"