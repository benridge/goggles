import React from 'react';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import TodayReport from './page/TodayReport.react';
import rootReducer from './reducers/Root';
import { mockLocations } from 'mockData';
import { LOCATIONS_LOADED } from 'constants/ActionTypes';
import 'babel-core/polyfill';


const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware // lets us dispatch() functions
  //loggerMiddleware // neat middleware that logs actions
)(createStore);

const store = createStoreWithMiddleware(rootReducer);
let locations = [];

if (window.location.hash === '#mockData') {
  store.dispatch({ type: LOCATIONS_LOADED, locations: mockLocations });
}

React.render(
  <Provider store={ store }>
    { () => <TodayReport locations={ locations }/> }
  </Provider>,
  document.getElementById('dynamic-content')
);
