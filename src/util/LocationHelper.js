var LocationHelper = {
  orderBy: function(locations, dataIndex) {
    return _.sortBy(locations, dataIndex);
  }
};

module.exports = LocationHelper;