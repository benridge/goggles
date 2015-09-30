import * as types from '../constants/ActionTypes';
import * as LocationHelper from '../utils/LocationHelper';

const initialState = {
  locations: [],
  loading: true,
  expandAll: false,
  order: {
    dataIndex: 'location',
    direction: 'ascending'
  },
  expandedRows: []
};

export default function locations(state = initialState, action = {}) {
  switch (action.type) {
  case types.LOCATIONS_LOADED:
    return Object.assign({}, state, {
      locations: action.locations,
      loading: false
    });

  case types.EXPAND_ALL_CLICKED:
    let expandedRowNumbers = [];
    if (action.newExpandState === true) {
      expandedRowNumbers = state.locations.map((groupedLocation) => {
        return groupedLocation.reports[0].ROW_NUM;
      }, this);
    }

    return Object.assign({}, state, {
      expandAll: action.newExpandState,
      expandedRows: expandedRowNumbers
    });

  case types.SORT_CLICKED:
    const updatedLocations = LocationHelper.orderBy(action.dataIndex, state.locations, action.direction);

    return Object.assign({}, state, {
      locations: updatedLocations,
      order: {
        dataIndex: action.dataIndex,
        direction: action.direction
      }
    });

  case types.EXPAND_ROW_TOGGLED:
    const newExpandedRows = Array.from(state.expandedRows);
    const rowIndex = newExpandedRows.indexOf(action.rowNumber);
    if (rowIndex === -1) {
      newExpandedRows.push(action.rowNumber);
    } else {
      newExpandedRows.splice(rowIndex, 1);
    }

    return Object.assign({}, state, {
      expandAll: false,
      expandedRows: newExpandedRows
    });
  default:
    return state;
  }
}
