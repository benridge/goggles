import React from 'react/addons';
import { createStore } from 'redux';
import expect from 'expect';
import { Provider } from 'react-redux';
import TodayReport from '../page/TodayReport.react';
import { mockTestStateData } from './LocationData';

const TestUtils = React.addons.TestUtils;

describe('App', () => {
  let provider;

  const defaultState = {
    locations: mockTestStateData(),
    loading: false,

    order: {
      dataIndex: 'name',
      direction: 'ascending'
    },
    expandAll: false,
    expandedRows: []
  };

  afterEach(() => {
    if (provider) {
      React.unmountComponentAtNode(document.body);
    }
  });

  const render = function(testState) {
    testState = {
      TodayReport: Object.assign({}, defaultState, testState)
    };

    const testReducer = function(state = testState) {
      return state;
    };

    let store = createStore(testReducer);

    provider = React.render(
      <Provider store={ store }>
        { () => <TodayReport /> }
      </Provider>,
      document.body
    );
  };

  const expectResortHeader = function(){
    const resortHeader = document.querySelectorAll('.panel-title .name');
    expect(resortHeader.length).toBe(1);
    expect(resortHeader[0].textContent).toBe('Arapahoe Basin');
  };

  it('shows collapsed report', () => {
    const testState = {};

    render(testState);

    expectResortHeader();

    const collapsedResort = document.querySelectorAll('.panel .collapse[aria-expanded="false"]');
    expect(collapsedResort.length).toBe(1);
  });

  it('shows expanded report', () => {
    const testState = {
      expandAll: true,
      expandedRows: [1]
    };

    render(testState);

    expectResortHeader();

    const expandedResort = document.querySelectorAll('.panel .collapse.in[aria-expanded="true"]');
    expect(expandedResort.length).toBe(1);
  });
});