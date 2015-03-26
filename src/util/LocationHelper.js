var LocationHelper = {
  orderBy: function(dataIndex, groupedLocations, order) {
    var orderIndexes = _.union([dataIndex], _.keys(groupedLocations[0]));
    var sorted = _.sortByAll(groupedLocations, orderIndexes);

    if (order === 'descending') {
      sorted = sorted.reverse();
    }
    return sorted;
  },

  map: function(locationArray) {
    return _.reduce(locationArray, (result, locationData) => {
      var groupedReports = _.find(result, { 'location' : locationData.location });
      if (!groupedReports) {
        groupedReports = {
          location: locationData.location,
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