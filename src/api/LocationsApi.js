import fetch from 'isomorphic-fetch';
import Environment from 'env/Environment';
import { TODAY_URL } from 'constants/ApiUrls';

export function loadToday() {
  return Environment.getServerConfig().then((serverConfig)=> {
    //there's probably a better way to run against mock data
    //instead of having this (prod) code checking a config setting
    const useMockData = serverConfig.UseMockData;
    if (useMockData) {
      return mockData();
    } else {
      const serverRoot = serverConfig.TOMCAT_URL;
      return new Promise((resolve) => {
        fetch(serverRoot + TODAY_URL)
          .then(response => response.json())
          .then(json => resolve(json.report.locations));
      });
    }
  });
}

function mockData() {
  return new Promise((resolve, reject) => {
    resolve([
      {
        "ROW_NUM": 1,
        "location": "Arapahoe Basin",
        "start_date": "10/25/2010",
        "duration": 24,
        "home_url": "http://arapahoebasin.com/",
        "source_name": "coloradoski.com",
        "url": "http://www.coloradoski.com/SnowReport/",
        "amount": 3,
        "source_date": "03/23/2015 05:55 AM MDT",
        "source_seq": "M"
      },
      {
        "ROW_NUM": 2,
        "location": "Arapahoe Basin",
        "start_date": "10/25/2010",
        "duration": 24,
        "home_url": "http://arapahoebasin.com/",
        "source_name": "arapahoebasin.com",
        "url": "http://www.arapahoebasin.com/ABasin/snow-conditions/default.aspx",
        "amount": 3,
        "source_date": "03/23/2015 05:36 AM MDT",
        "source_seq": "M"
      },
      {
        "ROW_NUM": 3,
        "location": "Arapahoe Basin",
        "start_date": "10/25/2010",
        "duration": 48,
        "home_url": "http://arapahoebasin.com/",
        "source_name": "coloradoski.com",
        "url": "http://www.coloradoski.com/SnowReport/",
        "amount": 5,
        "source_date": "03/23/2015 05:55 AM MDT"
      },
      {
        "ROW_NUM": 4,
        "location": "Arapahoe Basin",
        "start_date": "10/25/2010",
        "duration": 72,
        "home_url": "http://arapahoebasin.com/",
        "source_name": "arapahoebasin.com",
        "url": "http://www.arapahoebasin.com/ABasin/snow-conditions/default.aspx",
        "amount": 7,
        "source_date": "03/23/2015 05:36 AM MDT"
      },

      {
        "ROW_NUM": 7,
        "location": "Beaver Creek",
        "start_date": "11/24/2010",
        "duration": 24,
        "home_url": "http://www.snow.com/discoverourresorts/beavercreek/landing.aspx",
        "source_name": "snow.com",
        "url": "http://www.snow.com/mountainconditions/snowandweatherreports.aspx",
        "amount": 1,
        "source_date": "03/23/2015 04:06 PM MDT",
        "source_seq": "M"
      },
      {
        "ROW_NUM": 8,
        "location": "Beaver Creek",
        "start_date": "11/24/2010",
        "duration": 48,
        "home_url": "http://www.snow.com/discoverourresorts/beavercreek/landing.aspx",
        "source_name": "snow.com",
        "url": "http://www.snow.com/mountainconditions/snowandweatherreports.aspx",
        "amount": 1,
        "source_date": "03/23/2015 04:06 PM MDT"
      },
      {
        "ROW_NUM": 9,
        "location": "Beaver Creek",
        "start_date": "11/24/2010",
        "duration": 168,
        "home_url": "http://www.snow.com/discoverourresorts/beavercreek/landing.aspx",
        "source_name": "snow.com",
        "url": "http://www.snow.com/mountainconditions/snowandweatherreports.aspx",
        "amount": 3,
        "source_date": "03/23/2015 04:06 PM MDT"
      },

      {
        "ROW_NUM": 43,
        "location": "Winter Park",
        "start_date": "11/17/2010",
        "duration": 24,
        "home_url": "http://www.winterparkresort.com/",
        "source_name": "coloradoski.com",
        "url": "http://www.coloradoski.com/SnowReport/",
        "amount": 10,
        "source_date": "03/23/2015 01:16 PM MDT",
        "source_seq": "M"
      },
      {
        "ROW_NUM": 44,
        "location": "Winter Park",
        "start_date": "11/17/2010",
        "duration": 48,
        "home_url": "http://www.winterparkresort.com/",
        "source_name": "coloradoski.com",
        "url": "http://www.coloradoski.com/SnowReport/",
        "amount": 24,
        "source_date": "03/23/2015 01:16 PM MDT"
      },
      {
        "ROW_NUM": 45,
        "location": "Wolf Creek",
        "start_date": "10/30/2010",
        "duration": 24,
        "home_url": "http://wolfcreekski.com/",
        "source_name": "coloradoski.com",
        "url": "http://www.coloradoski.com/SnowReport/",
        "amount": 8,
        "source_date": "03/23/2015 09:55 AM MDT",
        "source_seq": "M"
      },
      {
        "ROW_NUM": 46,
        "location": "Wolf Creek",
        "start_date": "10/30/2010",
        "duration": 24,
        "home_url": "http://wolfcreekski.com/",
        "source_name": "wolfcreekski.com",
        "url": "http://www.wolfcreekski.com/snow.asp",
        "amount": 8,
        "source_date": "03/23/2015 09:53 AM MDT",
        "source_seq": "M"
      },
      {
        "ROW_NUM": 47,
        "location": "Wolf Creek",
        "start_date": "10/30/2010",
        "duration": 48,
        "home_url": "http://wolfcreekski.com/",
        "source_name": "coloradoski.com",
        "url": "http://www.coloradoski.com/SnowReport/",
        "amount": 24,
        "source_date": "03/23/2015 09:55 AM MDT"
      },
      {
        "ROW_NUM": 48,
        "location": "Wolf Creek",
        "start_date": "10/30/2010",
        "duration": 48,
        "home_url": "http://wolfcreekski.com/",
        "source_name": "wolfcreekski.com",
        "url": "http://www.wolfcreekski.com/snow.asp",
        "amount": 24,
        "source_date": "03/23/2015 09:53 AM MDT"
      }
    ]);
  });
}
