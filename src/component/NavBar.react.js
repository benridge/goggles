var React = require("react");

module.exports = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
  },

  render: function() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top center-block">
        <div className="container-fluid">
          <div className="row">
            <h4 className="col-xs-12">Latest 24 Hour Reports</h4>
          </div>
        </div>
      </nav>
    );
  },

  _sortReport: function(event) {
    alert('Sorting!');
    console.log('TODO: sort', event);
  }
});