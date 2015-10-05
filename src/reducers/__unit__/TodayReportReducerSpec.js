import React from 'react';
import _ from 'lodash';
import expect from 'expect';
import reducer from '../TodayReportReducer';
import * as types from 'constants/ActionTypes';
import { groupedData } from '__TestData__';

const locationsState = groupedData();

describe('reducers/locations', () => {

  describe('EXPAND_ALL_CLICKED action', () => {

    it('updates expandAll state to false and clears out expanded rows', () => {
      const initialState = {expandAll: true, expandedRows: [1, 2, 3]};
      const actual = reducer(initialState, {type: types.EXPAND_ALL_CLICKED, newExpandState: false});
      expect(actual).toEqual({
        expandAll: false,
        expandedRows: []
      });
    });

    it('updates expandAll state to true and populates expanded rows', () => {
      const initialState = {
        expandAll: false,
        expandedRows: true,
        locations: locationsState
      };
      const actual = reducer(initialState, {type: types.EXPAND_ALL_CLICKED, newExpandState: true});
      expect(actual).toEqual({
        expandAll: true,
        expandedRows: [1],
        locations: locationsState
      });
    });
  });

  describe('LOCATIONS_LOADED action', () => {

    it('converts response and puts locations in state', () => {
      const action = {
        type: types.LOCATIONS_LOADED,
        locations: locationsState
      };
      const actual = reducer({loading: true}, action);
      expect(actual).toEqual({
        loading: false,
        locations: locationsState
      })
    });
  });

  describe('SORT_CLICKED action', () => {
    it('updates the state of order and locations', () => {
      const initialState = {
        locations: locationsState,
        order: {
          dataIndex: 'name',
          direction: 'ascending'
        }
      };
      const action = {
        type: types.SORT_CLICKED,
        locations: locationsState,
        dataIndex: 'amount',
        direction: 'descending'
      };

      const actual = reducer(initialState, action);

      expect(actual).toEqual({
        locations: locationsState,
        order: {
          dataIndex: 'amount',
          direction: 'descending'
        }
      });
    });
  });

  describe('EXPAND_ROW_TOGGLED action', () => {
    it('adds new row to expanded state if it does not exist', () => {
      const initialState = {
        expandedRows: []
      };
      const action = {
        type: types.EXPAND_ROW_TOGGLED,
        rowNumber: 1
      };

      const actual = reducer(initialState, action);

      expect(actual).toEqual({
        expandAll: false,
        expandedRows: [1]
      });
    });
    it('removes existing row from expanded state if it exists', () => {
      const initialState = {
        expandedRows: [1]
      };
      const action = {
        type: types.EXPAND_ROW_TOGGLED,
        rowNumber: 1
      };

      const actual = reducer(initialState, action);

      expect(actual).toEqual({
        expandAll: false,
        expandedRows: []
      });
    });
  });
});