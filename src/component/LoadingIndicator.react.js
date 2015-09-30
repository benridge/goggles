import React, { Component, PropTypes } from 'react';

class LoadingIndicator extends Component {
  render() {
    let className = "alert alert-info";
    if (this.props.loading !== true) {
      className += " hidden";
    }
    return (
      <div id="loadingIndicator" className={ className } role="alert">Loading...</div>
    );
  }
}

LoadingIndicator.propTypes = {
    loading: PropTypes.bool
};

export default LoadingIndicator;