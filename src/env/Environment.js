var Environment = {
  getServerRoot: function() {
    return (window.location.origin || (document.location.protocol + "//" + document.location.host)) + ':8080';
  }
};

module.exports = Environment;