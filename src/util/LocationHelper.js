var LocationHelper = {
  orderBy: function(dataIndex, groupedLocations, order) {
    var sorted = _.sortBy(groupedLocations, dataIndex);
    if (order === 'descending') {
      sorted = sorted.reverse();
    }
    return sorted;
  },

  map: function(locationArray) {
    return _.reduce(locationArray, (result, locationData) => {
      var groupedReports = _.find(result, { 'name' : locationData.location });
      if (!groupedReports) {
        groupedReports = {
          name: locationData.location,
          amount: locationData.amount,
          reports: []
        };
        result.push(groupedReports);
      }
      groupedReports.reports.push(locationData);

      return result;
    }, []);
  }
};

module.exports = LocationHelper;