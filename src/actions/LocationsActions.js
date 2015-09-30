import * as types from 'constants/ActionTypes';
import { loadToday, testToday } from 'api/LocationsApi';
import * as LocationHelper from 'utils/LocationHelper';

function locationsLoaded(locations) {
  return { type: types.LOCATIONS_LOADED, locations };
}

export function loadLocations() {
  return (dispatch) => {
    return testToday()
      .then((locations) => {
        const groupedLocations = LocationHelper.map(locations);
        return dispatch(locationsLoaded(groupedLocations));
      });
  };
}

export function expandAll(newExpandState) {
  return { type: types.EXPAND_ALL_CLICKED, newExpandState };
}

export function expandRowToggle(rowNumber) {
  return { type: types.EXPAND_ROW_TOGGLED, rowNumber};
}

export function sort(newSortState) {
  return {
    type: types.SORT_CLICKED,
    dataIndex: newSortState.dataIndex,
    direction: newSortState.direction
  };
}
