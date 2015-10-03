import _ from 'lodash';

export function orderBy(dataIndex, groupedLocations, direction) {
  const orderIndexes = _.union([dataIndex], _.keys(groupedLocations[0]));
  let sorted = _.sortByAll(groupedLocations, orderIndexes);

  if (direction === 'descending') {
    sorted = sorted.reverse();
  }
  return sorted;
}

export function map(locationArray) {
  return _.reduce(locationArray, (result, locationData) => {
    let groupedReports = _.find(result, { 'location' : locationData.location });
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