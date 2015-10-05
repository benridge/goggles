import LocationsActions from '../LocationsActions';
import expect from 'expect';
import { rawData, groupedData} from '__TestData__';
import * as types from 'constants/ActionTypes';
import LocationsApi from 'api/LocationsApi';


function mockLocationsApi() {
  const mockLoadToday = function() {
    console.log('overridden!');
    return new Promise((resolve) => {
      resolve(rawData());
    });
  };
  
  LocationsApi.loadToday = mockLoadToday.bind(this);
}

describe('LocationsActions', () => {
  describe('#locationsLoaded', () => {
    it('should return action with location data', () => {
      mockLocationsApi();
      const mockDispatch = function() {
        console.log('mockDispatch');
      };
      const expectedLocations = groupedData();
      const actualPromise = LocationsActions.loadLocations().apply(undefined, mockDispatch);

      //expect(actualAction).toEqual({
      //  type: types.LOCATION_LOADED,
      //  locations: expectedLocations
      //});
    });
  });
});