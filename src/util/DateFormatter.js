var moment = require('moment');

module.exports = {
  formatDateString: function(dateString) {
    var date = moment(new Date(dateString));
    return date.calendar();
  }
};