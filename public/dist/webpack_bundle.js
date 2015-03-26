/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1);
	var LatestReport = __webpack_require__(2);
	var TodayReport = __webpack_require__(3);
	
	React.render(
	  React.createElement(TodayReport, null),
	  document.getElementById('dynamic-content')
	);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @jsx React.DOM
	 */
	
	var React = __webpack_require__(1);
	var request = __webpack_require__(4);
	var _ = __webpack_require__(5);
	
	var LocationStore = __webpack_require__(6);
	
	var LocationReportRow = __webpack_require__(7);
	var LoadingIndicator = __webpack_require__(8);
	var NavBar = __webpack_require__(9);
	
	module.exports = React.createClass({
	  displayName: 'LatestReport',
	  getInitialState: function() {
	    return {
	      locations: [],
	      loading: true
	    };
	  },
	
	  componentDidMount: function() {
	    LocationStore.load('/FindpowReport/index.json?snowReportType=latest')
	      .then(function(locations)  {
	        this.setState({
	          locations: locations,
	          loading: false
	        });
	      }.bind(this));
	  },
	
	  render: function() {
	    var table = this._getTable();
	    var blankSlate = this._getBlankSlate();
	    var header = this._getHeader();
	
	    return (
	      React.createElement("div", {id: "report-container"}, 
	
	        React.createElement(LoadingIndicator, {loading:  this.state.loading}), 
	
	        React.createElement("div", {className: "list-group"}, 
	          React.createElement("div", {id: "report-title", className: "list-group-item active"}, "Latest 24 Hour Reports"), 
	          blankSlate, 
	          header, 
	          table 
	        )
	      )
	    );
	  },
	
	  _getTable: function() {
	    if (this.state.locations.length > 0) {
	      var locations = this._getLocations();
	      return { locations:locations };
	    }
	  },
	
	  _getBlankSlate: function() {
	    var blankSlateClassNames = "";
	    var showBlankSlate = this.state.locations.length === 0 && this.state.loading === false;
	    if (showBlankSlate) {
	      return (
	        React.createElement("div", {className: "list-group-item"}, 
	          React.createElement("div", {className: blankSlateClassNames }, 
	            "No reports yet for today."
	          )
	        )
	      );
	    }
	  },
	
	  _getHeader: function() {
	    return (
	      React.createElement("div", {"data-spy": "affix", "data-offset-top": "50", className: "report-column-header"}, 
	        React.createElement("div", {className: "list-group-item-info"}, 
	          React.createElement("div", {className: "row"}, 
	            React.createElement("div", {className: "col-xs-1"}), 
	            React.createElement("div", {className: "col-xs-5 col-s-7", onClick: this._sortReport}, "Location"), 
	            React.createElement("div", {className: "col-xs-1", onClick: this._sortReport}), 
	            React.createElement("div", {className: "col-xs-4", onClick: this._sortReport}, "Date")
	          )
	        )
	      )
	    );
	  },
	
	  _getLocations: function() {
	    return _.map(this.state.locations, function(locationData, index)   {
	      return (
	        React.createElement("div", {className: "list-group-item location-row"}, 
	          React.createElement(LocationReportRow, {
	            key: index, 
	            idx: index, 
	            name:  locationData.location, 
	            date:  locationData.source_date, 
	            amount:  locationData.amount, 
	            source:  locationData.source_name, 
	            sourceUrl:  locationData.url}
	          )
	        )
	      );
	    });
	  }
	});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @jsx React.DOM
	 */
	
	var React = __webpack_require__(1);
	var _ = __webpack_require__(5);
	
	var LocationStore = __webpack_require__(6);
	
	var GroupRow = __webpack_require__(10);
	var DetailRow = __webpack_require__(11);
	var LoadingIndicator = __webpack_require__(8);
	var DateFormatter = __webpack_require__(12);
	var LocationHelper = __webpack_require__(13);
	
	var columnSizeCssMap = {
	  'duration': 'col-xs-1',
	  'name': 'col-xs-5',
	  'amount': 'col-xs-2',
	  'date': 'col-xs-4'
	};
	
	module.exports = React.createClass({
	  displayName: 'TodayReport',
	  getInitialState: function() {
	    return {
	      groupedLocations: [],
	      loading: true,
	      order: {
	        dataIndex: 'location',
	        direction: 'ascending'
	      }
	    };
	  },
	
	  componentDidMount: function() {
	    LocationStore.load('/FindpowReport/index.json?snowReportType=today')
	                 .then(this._onLocationsLoaded);
	  },
	
	  render: function() {
	    var table = this._getTable();
	    var blankSlate = this._getBlankSlate();
	    var header = this._getHeader();
	
	    return (
	      React.createElement("div", {id: "report-container"}, 
	
	        React.createElement(LoadingIndicator, {loading:  this.state.loading}), 
	
	        React.createElement("div", {className: "list-group"}, 
	          React.createElement("div", {id: "report-title", className: "list-group-item active"}, "Today's Reports"), 
	          blankSlate, 
	          header, 
	          table 
	        )
	      )
	    );
	  },
	
	  _getTable: function() {
	    if (this.state.groupedLocations.length > 0) {
	      return  this._getLocations();
	    }
	  },
	
	  _getBlankSlate: function() {
	    var blankSlateClassNames = "";
	    var showBlankSlate = _.keys(this.state.locationMap).length === 0 && this.state.loading === false;
	    if (showBlankSlate) {
	      return (
	        React.createElement("div", {className: "list-group-item"}, 
	          React.createElement("div", {className: blankSlateClassNames }, 
	            "No reports yet for today."
	          )
	        )
	      );
	    }
	  },
	
	  _getHeader: function() {
	    return (
	      React.createElement("div", {className: "list-group-item-info column-header"}, 
	        React.createElement("div", {className: "row"}, 
	          React.createElement("div", {className:  columnSizeCssMap.duration}), 
	          React.createElement("div", {className:  columnSizeCssMap.name}, React.createElement("a", {href: "#", onClick: this._sortReport}, "Location")), 
	          React.createElement("div", {className:  columnSizeCssMap.amount}, React.createElement("a", {href: "#", onClick: this._sortReport}, "Amount")), 
	          React.createElement("div", {className:  columnSizeCssMap.date}, "Last Updated")
	        )
	      )
	    );
	  },
	
	  _getLocations: function() {
	    return _.reduce(this.state.groupedLocations, function(result, groupedLocation)  {
	      var groupRowData = groupedLocation.reports[0];
	      var detailRows = this._getDetailRows(groupedLocation.reports);
	      var formattedDate = DateFormatter.formatTodayDate(groupRowData.source_date);
	      result.push(
	        React.createElement(GroupRow, {
	          key:  groupRowData.ROW_NUM, 
	          idx:  groupRowData.ROW_NUM, 
	          name:  groupRowData.location, 
	          date: formattedDate, 
	          amount:  groupRowData.amount, 
	          source:  groupRowData.source_name, 
	          sourceUrl:  groupRowData.url
	        }, 
	          detailRows 
	        )
	      );
	      return result;
	    }.bind(this), []);
	  },
	
	  _getDetailRows: function(detailRowDataArray) {
	    var duration;
	    var prevDuration = 0;
	    var formattedDate;
	    return _.reduce(detailRowDataArray, function(result, detailRowData)  {
	      duration = detailRowData.duration !== prevDuration ? detailRowData.duration : 0;
	      prevDuration = detailRowData.duration;
	      formattedDate = DateFormatter.formatTodayDate(detailRowData.source_date);
	
	
	      result.push(
	        React.createElement(DetailRow, {
	          key:  detailRowData.ROW_NUM, 
	          date: formattedDate, 
	          duration: duration, 
	          amount:  detailRowData.amount, 
	          source:  detailRowData.source_name, 
	          sourceUrl:  detailRowData.url}
	        )
	      );
	      return result;
	    }, []);
	  },
	
	  _onLocationsLoaded: function(locations) {
	    var groupedLocations = LocationHelper.map(locations);
	    this.setState({
	      groupedLocations: groupedLocations,
	      loading: false
	    });
	  },
	
	  _sortReport: function(event) {
	    var direction, dataIndex;
	    if (event.target.textContent === 'Amount') {
	      dataIndex = 'amount';
	      direction = 'descending';
	    } else if (event.target.textContent === 'Location') {
	      dataIndex = 'location';
	      direction = 'ascending';
	    }
	    var groupedLocations = LocationHelper.orderBy(dataIndex, this.state.groupedLocations, direction);
	
	    this.setState({
	      groupedLocations: groupedLocations,
	      order: {
	        dataIndex: dataIndex,
	        direction: direction
	      }
	    });
	
	  }
	});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = superagent;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = _;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var request = __webpack_require__(4);
	var Environment = __webpack_require__(16);
	
	var LocationStore = {
	  load: function(url) {
	    return Environment.getServerConfig().then(function(ServerConfig) {
	      var serverRoot = ServerConfig.TOMCAT_URL;
	      return new Promise(function(resolve, reject)  {
	        request
	          .get(serverRoot + url)
	          .end(function(res)  {
	            var report = JSON.parse(res.text).report;
	            resolve(report.locations);
	          });
	      });
	    });
	
	  },
	
	  loadTestData: function(url) {
	    return new Promise(function(resolve, reject)  {
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
	};
	
	module.exports = LocationStore;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @jsx React.DOM
	 */
	
	var React = __webpack_require__(1);
	var DateFormatter = __webpack_require__(12);
	var AmountFormatter = __webpack_require__(15);
	
	module.exports = React.createClass({displayName: "exports",
	
	  propTypes: {
	    idx: React.PropTypes.number,
	    name: React.PropTypes.string,
	    date: React.PropTypes.string,
	    amount: React.PropTypes.number,
	    source: React.PropTypes.string,
	    sourceUrl: React.PropTypes.string
	  },
	
	  render: function() {
	    var collapseId =  this.props.idx + "Collapse";
	    var href = "#" + collapseId;
	    var altText = this.props.name + " report details";
	    var formattedDate = DateFormatter.formatDateString(this.props.date);
	    var amountCategory = AmountFormatter.getAmountCategory(this.props.amount, 24);
	    var amountClasses = "col-xs-1 amount-" + amountCategory;
	
	    return (
	      React.createElement("div", {className: "panel panel-default"}, 
	        React.createElement("div", {className: "panel-heading"}, 
	          React.createElement("h3", {className: "panel-title"}, 
	            React.createElement("div", {className: "row"}, 
	              React.createElement("div", {className: "col-xs-1"}, 
	                React.createElement("a", {className: "collapsed", "data-toggle": "collapse", href: href, title: altText, "aria-expanded": "false", "aria-controls": collapseId }, 
	                  React.createElement("span", {className: "glyphicon glyphicon-chevron-down"})
	                )
	              ), 
	              React.createElement("div", {className: "col-xs-5 col-s-7"},  this.props.name), 
	              React.createElement("div", {className: amountClasses },  this.props.amount, "\""), 
	              React.createElement("div", {className: "col-xs-4 report-date"}, formattedDate )
	            )
	          )
	        ), 
	        React.createElement("div", {className: "collapse", id: collapseId }, 
	          React.createElement("div", {className: "panel-body"}, 
	            React.createElement("div", {className: "row"}, 
	              React.createElement("div", {className: "col-xs-1"}), 
	              React.createElement("a", {href:  this.props.sourceUrl}, 
	                React.createElement("div", {className: "col-xs-5 col-s-7"},  this.props.source)
	              ), 
	              React.createElement("div", {className: "col-xs-1"},  this.props.amount, "\""), 
	              React.createElement("div", {className: "col-xs-4"}, formattedDate )
	            )
	          )
	        )
	      )
	    );
	  }
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @jsx React.DOM
	 */
	
	var React = __webpack_require__(1);
	
	module.exports = React.createClass({
	  displayName: 'LoadingIndicator',
	  propTypes: {
	    loading: React.PropTypes.bool
	  },
	  render: function() {
	    var className = "alert alert-info";
	    if (this.props.loading !== true) {
	      className += " hidden";
	    }
	    return (
	      React.createElement("div", {id: "loadingIndicator", className: className, role: "alert"}, "Loading...")
	    );
	  }
	});
	//class="alert alert-info" role="alert"

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1);
	
	module.exports = React.createClass({displayName: "exports",
	  propTypes: {
	    onClick: React.PropTypes.func
	  },
	
	  render: function() {
	    return (
	      React.createElement("nav", {className: "navbar navbar-default navbar-fixed-top center-block"}, 
	        React.createElement("div", {className: "container-fluid"}, 
	          React.createElement("div", {className: "row"}, 
	            React.createElement("h4", {className: "col-xs-12"}, "Latest 24 Hour Reports")
	          )
	        )
	      )
	    );
	  },
	
	  _sortReport: function(event) {
	    alert('Sorting!');
	    console.log('TODO: sort', event);
	  }
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @jsx React.DOM
	 */
	
	var React = __webpack_require__(1);
	var DateFormatter = __webpack_require__(12);
	var AmountFormatter = __webpack_require__(15);
	
	module.exports = React.createClass({displayName: "exports",
	
	  propTypes: {
	    idx: React.PropTypes.number,
	    name: React.PropTypes.string,
	    date: React.PropTypes.string,
	    amount: React.PropTypes.number,
	    source: React.PropTypes.string,
	    sourceUrl: React.PropTypes.string
	  },
	
	  render: function() {
	    var collapseId = this.props.idx + "Collapse";
	    var href = "#" + collapseId;
	    var altText = this.props.name + " report details";
	    var amountCategory = AmountFormatter.getAmountCategory(this.props.amount, 24);
	    var amountClasses = "col-xs-2 amount-" + amountCategory;
	
	    return (
	      React.createElement("div", {className: "panel panel-default"}, 
	        React.createElement("div", {className: "panel-heading"}, 
	          React.createElement("h3", {className: "panel-title"}, 
	            React.createElement("div", {className: "row"}, 
	              React.createElement("div", {className: "col-xs-1"}, 
	                React.createElement("a", {className: "expander-link collapsed", "data-toggle": "collapse", href: href, title: altText, "aria-expanded": "false", "aria-controls": collapseId }, 
	                  React.createElement("span", {className: "glyphicon glyphicon-chevron-down"})
	                )
	              ), 
	              React.createElement("div", {className: "col-xs-5 name"},  this.props.name), 
	              React.createElement("div", {className: amountClasses },  this.props.amount, "\""), 
	              React.createElement("div", {className: "col-xs-4 report-date"},  this.props.date)
	            )
	          )
	        ), 
	        React.createElement("div", {className: "collapse", id: collapseId }, 
	          React.createElement("div", {className: "panel-body"}, 
	             this.props.children
	          )
	        )
	      )
	    );
	  }
	});


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1);
	
	module.exports = React.createClass({displayName: "exports",
	
	  propTypes: {
	    date: React.PropTypes.string,
	    duration: React.PropTypes.number,
	    amount: React.PropTypes.number,
	    source: React.PropTypes.string,
	    sourceUrl: React.PropTypes.string
	  },
	
	  render: function() {
	    var duration = this._formatDuration();
	    return (
	      React.createElement("div", {className: "row"}, 
	        React.createElement("div", {className: "col-xs-1 duration"}, duration ), 
	          React.createElement("div", {className: "col-xs-5 name"}, 
	            React.createElement("a", {href:  this.props.sourceUrl}, 
	               this.props.source
	            )
	          ), 
	        React.createElement("div", {className: "col-xs-2"},  this.props.amount, "\""), 
	        React.createElement("div", {className: "col-xs-4"},  this.props.date)
	      )
	    );
	  },
	
	  _formatDuration: function() {
	    switch (this.props.duration) {
	      case (0):
	        return '';
	      case (24):
	      case (48):
	      case (72):
	        return this.props.duration + 'hr';
	      default:
	        return (this.props.duration / 24) + ' days';
	    }
	  }
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var moment = __webpack_require__(14);
	
	module.exports = {
	  formatDateString: function(dateString) {
	    var date = moment(new Date(dateString));
	    return date.calendar();
	  },
	
	  formatTodayDate: function(dateString) {
	    var date = moment(new Date(dateString));
	    return date.format('h:mm A');
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

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
	    return _.reduce(locationArray, function(result, locationData)  {
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

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = moment;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  getAmountCategory: function(amount, duration) {
	    var divisor, timeAdjustedAmount;
	
	    if (!amount || !duration || amount === 0) {
	      return "none";
	    }
	
	    divisor = duration/24;
	    timeAdjustedAmount = amount/divisor;
	
	    if (timeAdjustedAmount < 6) {
	      return "small";
	    }
	    if (timeAdjustedAmount >= 6 && timeAdjustedAmount < 12) {
	      return "medium";
	    }
	    if (timeAdjustedAmount >= 12 && timeAdjustedAmount < 18) {
	      return "large";
	    }
	    return "xlarge";
	  }
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var request = __webpack_require__(4);
	
	var serverConfig;
	
	var Environment = {
	  getServerConfig: function() {
	
	    return new Promise(function(resolve, reject)  {
	      if (serverConfig) {
	        resolve(serverConfig);
	      } else {
	        request
	          .get('/environment.js')
	          .end(function(res)  {
	            var env = res.body;
	            serverConfig = env;
	
	            resolve(env);
	          });
	      }
	      });
	  }
	};
	
	module.exports = Environment;

/***/ }
/******/ ])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2VjYWI2MzdkYzUyOTNhNDYxMmMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luaXQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiUmVhY3RcIiIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9MYXRlc3RSZXBvcnQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvVG9kYXlSZXBvcnQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3VwZXJhZ2VudFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIl9cIiIsIndlYnBhY2s6Ly8vLi9zcmMvc3RvcmUvTG9jYXRpb25TdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L0xvY2F0aW9uUmVwb3J0Um93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnQvTG9hZGluZ0luZGljYXRvci5yZWFjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L05hdkJhci5yZWFjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L0dyb3VwUm93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnQvRGV0YWlsUm93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL0RhdGVGb3JtYXR0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvTG9jYXRpb25IZWxwZXIuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9tZW50XCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvQW1vdW50Rm9ybWF0dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9lbnYvRW52aXJvbm1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FB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QUksa0JBQWtCLEdBQUcsRUFBRSxFQUFFO09BQ3ZELE9BQU8sT0FBTyxDQUFDO01BQ2hCO0tBQ0QsT0FBTyxRQUFRLENBQUM7SUFDakI7RUFDRixDOzs7Ozs7QUN0QkQsS0FBSSxPQUFPLEdBQUcsbUJBQU8sQ0FBQyxDQUFZLENBQUMsQ0FBQzs7QUFFcEMsS0FBSSxZQUFZLENBQUM7O0FBRWpCLEtBQUksV0FBVyxHQUFHO0FBQ2xCLEdBQUUsZUFBZSxFQUFFLFdBQVcsQ0FBQzs7S0FFM0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFDLE9BQU8sRUFBRSxNQUFNLElBQU07T0FDdkMsSUFBSSxZQUFZLEVBQUU7U0FDaEIsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3ZCLE1BQU07U0FDTCxPQUFPO1lBQ0osR0FBRyxDQUFDLGlCQUFpQixDQUFDO1lBQ3RCLEdBQUcsQ0FBQyxTQUFDLEdBQUcsSUFBTTthQUNiLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFDL0IsYUFBWSxZQUFZLEdBQUcsR0FBRyxDQUFDOzthQUVuQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDZCxDQUFDLENBQUM7UUFDTjtRQUNBLENBQUMsQ0FBQztJQUNOO0FBQ0gsRUFBQyxDQUFDOztBQUVGLE9BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgM2VjYWI2MzdkYzUyOTNhNDYxMmNcbiAqKi8iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIExhdGVzdFJlcG9ydCA9IHJlcXVpcmUoJy4vcGFnZS9MYXRlc3RSZXBvcnQucmVhY3QnKTtcbnZhciBUb2RheVJlcG9ydCA9IHJlcXVpcmUoJy4vcGFnZS9Ub2RheVJlcG9ydC5yZWFjdCcpO1xuXG5SZWFjdC5yZW5kZXIoXG4gIDxUb2RheVJlcG9ydCAvPixcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2R5bmFtaWMtY29udGVudCcpXG4pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy9pbml0LnJlYWN0LmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBSZWFjdDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiUmVhY3RcIlxuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdzdXBlcmFnZW50Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgTG9jYXRpb25TdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3JlL0xvY2F0aW9uU3RvcmUnKTtcblxudmFyIExvY2F0aW9uUmVwb3J0Um93ID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvTG9jYXRpb25SZXBvcnRSb3cucmVhY3QnKTtcbnZhciBMb2FkaW5nSW5kaWNhdG9yID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvTG9hZGluZ0luZGljYXRvci5yZWFjdCcpO1xudmFyIE5hdkJhciA9IHJlcXVpcmUoJy4vLi4vY29tcG9uZW50L05hdkJhci5yZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdMYXRlc3RSZXBvcnQnLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2NhdGlvbnM6IFtdLFxuICAgICAgbG9hZGluZzogdHJ1ZVxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIExvY2F0aW9uU3RvcmUubG9hZCgnL0ZpbmRwb3dSZXBvcnQvaW5kZXguanNvbj9zbm93UmVwb3J0VHlwZT1sYXRlc3QnKVxuICAgICAgLnRoZW4oKGxvY2F0aW9ucykgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBsb2NhdGlvbnM6IGxvY2F0aW9ucyxcbiAgICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRhYmxlID0gdGhpcy5fZ2V0VGFibGUoKTtcbiAgICB2YXIgYmxhbmtTbGF0ZSA9IHRoaXMuX2dldEJsYW5rU2xhdGUoKTtcbiAgICB2YXIgaGVhZGVyID0gdGhpcy5fZ2V0SGVhZGVyKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cInJlcG9ydC1jb250YWluZXJcIj5cblxuICAgICAgICA8TG9hZGluZ0luZGljYXRvciBsb2FkaW5nPXsgdGhpcy5zdGF0ZS5sb2FkaW5nfSAvPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1ncm91cFwiPlxuICAgICAgICAgIDxkaXYgaWQ9XCJyZXBvcnQtdGl0bGVcIiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW0gYWN0aXZlXCI+TGF0ZXN0IDI0IEhvdXIgUmVwb3J0czwvZGl2PlxuICAgICAgICAgIHsgYmxhbmtTbGF0ZSB9XG4gICAgICAgICAgeyBoZWFkZXIgfVxuICAgICAgICAgIHsgdGFibGUgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG5cbiAgX2dldFRhYmxlOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5sb2NhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGxvY2F0aW9ucyA9IHRoaXMuX2dldExvY2F0aW9ucygpO1xuICAgICAgcmV0dXJuIHsgbG9jYXRpb25zIH07XG4gICAgfVxuICB9LFxuXG4gIF9nZXRCbGFua1NsYXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmxhbmtTbGF0ZUNsYXNzTmFtZXMgPSBcIlwiO1xuICAgIHZhciBzaG93QmxhbmtTbGF0ZSA9IHRoaXMuc3RhdGUubG9jYXRpb25zLmxlbmd0aCA9PT0gMCAmJiB0aGlzLnN0YXRlLmxvYWRpbmcgPT09IGZhbHNlO1xuICAgIGlmIChzaG93QmxhbmtTbGF0ZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGJsYW5rU2xhdGVDbGFzc05hbWVzIH0+XG4gICAgICAgICAgICBObyByZXBvcnRzIHlldCBmb3IgdG9kYXkuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgX2dldEhlYWRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS1zcHk9XCJhZmZpeFwiIGRhdGEtb2Zmc2V0LXRvcD1cIjUwXCIgY2xhc3NOYW1lPVwicmVwb3J0LWNvbHVtbi1oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW0taW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy01IGNvbC1zLTdcIiBvbkNsaWNrPXt0aGlzLl9zb3J0UmVwb3J0fT5Mb2NhdGlvbjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMVwiIG9uQ2xpY2s9e3RoaXMuX3NvcnRSZXBvcnR9PjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiIG9uQ2xpY2s9e3RoaXMuX3NvcnRSZXBvcnR9PkRhdGU8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIF9nZXRMb2NhdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLm1hcCh0aGlzLnN0YXRlLmxvY2F0aW9ucywgKGxvY2F0aW9uRGF0YSwgaW5kZXgpICA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtaXRlbSBsb2NhdGlvbi1yb3dcIj5cbiAgICAgICAgICA8TG9jYXRpb25SZXBvcnRSb3dcbiAgICAgICAgICAgIGtleT17IGluZGV4IH1cbiAgICAgICAgICAgIGlkeD17IGluZGV4IH1cbiAgICAgICAgICAgIG5hbWU9eyBsb2NhdGlvbkRhdGEubG9jYXRpb24gfVxuICAgICAgICAgICAgZGF0ZT17IGxvY2F0aW9uRGF0YS5zb3VyY2VfZGF0ZSB9XG4gICAgICAgICAgICBhbW91bnQ9eyBsb2NhdGlvbkRhdGEuYW1vdW50IH1cbiAgICAgICAgICAgIHNvdXJjZT17IGxvY2F0aW9uRGF0YS5zb3VyY2VfbmFtZSB9XG4gICAgICAgICAgICBzb3VyY2VVcmw9eyBsb2NhdGlvbkRhdGEudXJsIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL3BhZ2UvTGF0ZXN0UmVwb3J0LnJlYWN0LmpzXG4gKiovIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgTG9jYXRpb25TdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3JlL0xvY2F0aW9uU3RvcmUnKTtcblxudmFyIEdyb3VwUm93ID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvR3JvdXBSb3cucmVhY3QnKTtcbnZhciBEZXRhaWxSb3cgPSByZXF1aXJlKCcuLy4uL2NvbXBvbmVudC9EZXRhaWxSb3cucmVhY3QnKTtcbnZhciBMb2FkaW5nSW5kaWNhdG9yID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvTG9hZGluZ0luZGljYXRvci5yZWFjdCcpO1xudmFyIERhdGVGb3JtYXR0ZXIgPSByZXF1aXJlKCcuLi91dGlsL0RhdGVGb3JtYXR0ZXInKTtcbnZhciBMb2NhdGlvbkhlbHBlciA9IHJlcXVpcmUoJy4uL3V0aWwvTG9jYXRpb25IZWxwZXInKTtcblxudmFyIGNvbHVtblNpemVDc3NNYXAgPSB7XG4gICdkdXJhdGlvbic6ICdjb2wteHMtMScsXG4gICduYW1lJzogJ2NvbC14cy01JyxcbiAgJ2Ftb3VudCc6ICdjb2wteHMtMicsXG4gICdkYXRlJzogJ2NvbC14cy00J1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVG9kYXlSZXBvcnQnLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBncm91cGVkTG9jYXRpb25zOiBbXSxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBvcmRlcjoge1xuICAgICAgICBkYXRhSW5kZXg6ICdsb2NhdGlvbicsXG4gICAgICAgIGRpcmVjdGlvbjogJ2FzY2VuZGluZydcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBMb2NhdGlvblN0b3JlLmxvYWQoJy9GaW5kcG93UmVwb3J0L2luZGV4Lmpzb24/c25vd1JlcG9ydFR5cGU9dG9kYXknKVxuICAgICAgICAgICAgICAgICAudGhlbih0aGlzLl9vbkxvY2F0aW9uc0xvYWRlZCk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGFibGUgPSB0aGlzLl9nZXRUYWJsZSgpO1xuICAgIHZhciBibGFua1NsYXRlID0gdGhpcy5fZ2V0QmxhbmtTbGF0ZSgpO1xuICAgIHZhciBoZWFkZXIgPSB0aGlzLl9nZXRIZWFkZXIoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwicmVwb3J0LWNvbnRhaW5lclwiPlxuXG4gICAgICAgIDxMb2FkaW5nSW5kaWNhdG9yIGxvYWRpbmc9eyB0aGlzLnN0YXRlLmxvYWRpbmd9IC8+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwXCI+XG4gICAgICAgICAgPGRpdiBpZD1cInJlcG9ydC10aXRsZVwiIGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtaXRlbSBhY3RpdmVcIj5Ub2RheSdzIFJlcG9ydHM8L2Rpdj5cbiAgICAgICAgICB7IGJsYW5rU2xhdGUgfVxuICAgICAgICAgIHsgaGVhZGVyIH1cbiAgICAgICAgICB7IHRhYmxlIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIF9nZXRUYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZ3JvdXBlZExvY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gIHRoaXMuX2dldExvY2F0aW9ucygpO1xuICAgIH1cbiAgfSxcblxuICBfZ2V0QmxhbmtTbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJsYW5rU2xhdGVDbGFzc05hbWVzID0gXCJcIjtcbiAgICB2YXIgc2hvd0JsYW5rU2xhdGUgPSBfLmtleXModGhpcy5zdGF0ZS5sb2NhdGlvbk1hcCkubGVuZ3RoID09PSAwICYmIHRoaXMuc3RhdGUubG9hZGluZyA9PT0gZmFsc2U7XG4gICAgaWYgKHNob3dCbGFua1NsYXRlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgYmxhbmtTbGF0ZUNsYXNzTmFtZXMgfT5cbiAgICAgICAgICAgIE5vIHJlcG9ydHMgeWV0IGZvciB0b2RheS5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICBfZ2V0SGVhZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW0taW5mbyBjb2x1bW4taGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb2x1bW5TaXplQ3NzTWFwLmR1cmF0aW9uIH0+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb2x1bW5TaXplQ3NzTWFwLm5hbWUgfT48YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuX3NvcnRSZXBvcnR9PkxvY2F0aW9uPC9hPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY29sdW1uU2l6ZUNzc01hcC5hbW91bnQgfT48YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuX3NvcnRSZXBvcnR9PkFtb3VudDwvYT48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbHVtblNpemVDc3NNYXAuZGF0ZSB9Pkxhc3QgVXBkYXRlZDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG5cbiAgX2dldExvY2F0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8ucmVkdWNlKHRoaXMuc3RhdGUuZ3JvdXBlZExvY2F0aW9ucywgKHJlc3VsdCwgZ3JvdXBlZExvY2F0aW9uKSA9PiB7XG4gICAgICB2YXIgZ3JvdXBSb3dEYXRhID0gZ3JvdXBlZExvY2F0aW9uLnJlcG9ydHNbMF07XG4gICAgICB2YXIgZGV0YWlsUm93cyA9IHRoaXMuX2dldERldGFpbFJvd3MoZ3JvdXBlZExvY2F0aW9uLnJlcG9ydHMpO1xuICAgICAgdmFyIGZvcm1hdHRlZERhdGUgPSBEYXRlRm9ybWF0dGVyLmZvcm1hdFRvZGF5RGF0ZShncm91cFJvd0RhdGEuc291cmNlX2RhdGUpO1xuICAgICAgcmVzdWx0LnB1c2goXG4gICAgICAgIDxHcm91cFJvd1xuICAgICAgICAgIGtleT17IGdyb3VwUm93RGF0YS5ST1dfTlVNIH1cbiAgICAgICAgICBpZHg9eyBncm91cFJvd0RhdGEuUk9XX05VTSB9XG4gICAgICAgICAgbmFtZT17IGdyb3VwUm93RGF0YS5sb2NhdGlvbiB9XG4gICAgICAgICAgZGF0ZT17IGZvcm1hdHRlZERhdGUgfVxuICAgICAgICAgIGFtb3VudD17IGdyb3VwUm93RGF0YS5hbW91bnQgfVxuICAgICAgICAgIHNvdXJjZT17IGdyb3VwUm93RGF0YS5zb3VyY2VfbmFtZSB9XG4gICAgICAgICAgc291cmNlVXJsPXsgZ3JvdXBSb3dEYXRhLnVybCB9XG4gICAgICAgID5cbiAgICAgICAgICB7IGRldGFpbFJvd3MgfVxuICAgICAgICA8L0dyb3VwUm93PlxuICAgICAgKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwgW10pO1xuICB9LFxuXG4gIF9nZXREZXRhaWxSb3dzOiBmdW5jdGlvbihkZXRhaWxSb3dEYXRhQXJyYXkpIHtcbiAgICB2YXIgZHVyYXRpb247XG4gICAgdmFyIHByZXZEdXJhdGlvbiA9IDA7XG4gICAgdmFyIGZvcm1hdHRlZERhdGU7XG4gICAgcmV0dXJuIF8ucmVkdWNlKGRldGFpbFJvd0RhdGFBcnJheSwgKHJlc3VsdCwgZGV0YWlsUm93RGF0YSkgPT4ge1xuICAgICAgZHVyYXRpb24gPSBkZXRhaWxSb3dEYXRhLmR1cmF0aW9uICE9PSBwcmV2RHVyYXRpb24gPyBkZXRhaWxSb3dEYXRhLmR1cmF0aW9uIDogMDtcbiAgICAgIHByZXZEdXJhdGlvbiA9IGRldGFpbFJvd0RhdGEuZHVyYXRpb247XG4gICAgICBmb3JtYXR0ZWREYXRlID0gRGF0ZUZvcm1hdHRlci5mb3JtYXRUb2RheURhdGUoZGV0YWlsUm93RGF0YS5zb3VyY2VfZGF0ZSk7XG5cblxuICAgICAgcmVzdWx0LnB1c2goXG4gICAgICAgIDxEZXRhaWxSb3dcbiAgICAgICAgICBrZXk9eyBkZXRhaWxSb3dEYXRhLlJPV19OVU0gfVxuICAgICAgICAgIGRhdGU9eyBmb3JtYXR0ZWREYXRlIH1cbiAgICAgICAgICBkdXJhdGlvbj17IGR1cmF0aW9uIH1cbiAgICAgICAgICBhbW91bnQ9eyBkZXRhaWxSb3dEYXRhLmFtb3VudCB9XG4gICAgICAgICAgc291cmNlPXsgZGV0YWlsUm93RGF0YS5zb3VyY2VfbmFtZSB9XG4gICAgICAgICAgc291cmNlVXJsPXsgZGV0YWlsUm93RGF0YS51cmwgfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwgW10pO1xuICB9LFxuXG4gIF9vbkxvY2F0aW9uc0xvYWRlZDogZnVuY3Rpb24obG9jYXRpb25zKSB7XG4gICAgdmFyIGdyb3VwZWRMb2NhdGlvbnMgPSBMb2NhdGlvbkhlbHBlci5tYXAobG9jYXRpb25zKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGdyb3VwZWRMb2NhdGlvbnM6IGdyb3VwZWRMb2NhdGlvbnMsXG4gICAgICBsb2FkaW5nOiBmYWxzZVxuICAgIH0pO1xuICB9LFxuXG4gIF9zb3J0UmVwb3J0OiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBkaXJlY3Rpb24sIGRhdGFJbmRleDtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LnRleHRDb250ZW50ID09PSAnQW1vdW50Jykge1xuICAgICAgZGF0YUluZGV4ID0gJ2Ftb3VudCc7XG4gICAgICBkaXJlY3Rpb24gPSAnZGVzY2VuZGluZyc7XG4gICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQudGV4dENvbnRlbnQgPT09ICdMb2NhdGlvbicpIHtcbiAgICAgIGRhdGFJbmRleCA9ICdsb2NhdGlvbic7XG4gICAgICBkaXJlY3Rpb24gPSAnYXNjZW5kaW5nJztcbiAgICB9XG4gICAgdmFyIGdyb3VwZWRMb2NhdGlvbnMgPSBMb2NhdGlvbkhlbHBlci5vcmRlckJ5KGRhdGFJbmRleCwgdGhpcy5zdGF0ZS5ncm91cGVkTG9jYXRpb25zLCBkaXJlY3Rpb24pO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBncm91cGVkTG9jYXRpb25zOiBncm91cGVkTG9jYXRpb25zLFxuICAgICAgb3JkZXI6IHtcbiAgICAgICAgZGF0YUluZGV4OiBkYXRhSW5kZXgsXG4gICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uXG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvcGFnZS9Ub2RheVJlcG9ydC5yZWFjdC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gc3VwZXJhZ2VudDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwic3VwZXJhZ2VudFwiXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJfXCJcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcbnZhciBFbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4uL2Vudi9FbnZpcm9ubWVudCcpO1xuXG52YXIgTG9jYXRpb25TdG9yZSA9IHtcbiAgbG9hZDogZnVuY3Rpb24odXJsKSB7XG4gICAgcmV0dXJuIEVudmlyb25tZW50LmdldFNlcnZlckNvbmZpZygpLnRoZW4oKFNlcnZlckNvbmZpZyk9PiB7XG4gICAgICB2YXIgc2VydmVyUm9vdCA9IFNlcnZlckNvbmZpZy5UT01DQVRfVVJMO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmVxdWVzdFxuICAgICAgICAgIC5nZXQoc2VydmVyUm9vdCArIHVybClcbiAgICAgICAgICAuZW5kKChyZXMpID0+IHtcbiAgICAgICAgICAgIHZhciByZXBvcnQgPSBKU09OLnBhcnNlKHJlcy50ZXh0KS5yZXBvcnQ7XG4gICAgICAgICAgICByZXNvbHZlKHJlcG9ydC5sb2NhdGlvbnMpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgfSxcblxuICBsb2FkVGVzdERhdGE6IGZ1bmN0aW9uKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXNvbHZlKFtcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiAxLFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJBcmFwYWhvZSBCYXNpblwiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzI1LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vYXJhcGFob2ViYXNpbi5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImNvbG9yYWRvc2tpLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5jb2xvcmFkb3NraS5jb20vU25vd1JlcG9ydC9cIixcbiAgICAgICAgICBcImFtb3VudFwiOiAzLFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA1OjU1IEFNIE1EVFwiLFxuICAgICAgICAgIFwic291cmNlX3NlcVwiOiBcIk1cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDIsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkFyYXBhaG9lIEJhc2luXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTAvMjUvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogMjQsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly9hcmFwYWhvZWJhc2luLmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwiYXJhcGFob2ViYXNpbi5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuYXJhcGFob2ViYXNpbi5jb20vQUJhc2luL3Nub3ctY29uZGl0aW9ucy9kZWZhdWx0LmFzcHhcIixcbiAgICAgICAgICBcImFtb3VudFwiOiAzLFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA1OjM2IEFNIE1EVFwiLFxuICAgICAgICAgIFwic291cmNlX3NlcVwiOiBcIk1cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDMsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkFyYXBhaG9lIEJhc2luXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTAvMjUvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogNDgsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly9hcmFwYWhvZWJhc2luLmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwiY29sb3JhZG9za2kuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmNvbG9yYWRvc2tpLmNvbS9Tbm93UmVwb3J0L1wiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDUsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDU6NTUgQU0gTURUXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA0LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJBcmFwYWhvZSBCYXNpblwiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzI1LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDcyLFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vYXJhcGFob2ViYXNpbi5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImFyYXBhaG9lYmFzaW4uY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmFyYXBhaG9lYmFzaW4uY29tL0FCYXNpbi9zbm93LWNvbmRpdGlvbnMvZGVmYXVsdC5hc3B4XCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogNyxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwNTozNiBBTSBNRFRcIlxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNyxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiQmVhdmVyIENyZWVrXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTEvMjQvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogMjQsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly93d3cuc25vdy5jb20vZGlzY292ZXJvdXJyZXNvcnRzL2JlYXZlcmNyZWVrL2xhbmRpbmcuYXNweFwiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJzbm93LmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5zbm93LmNvbS9tb3VudGFpbmNvbmRpdGlvbnMvc25vd2FuZHdlYXRoZXJyZXBvcnRzLmFzcHhcIixcbiAgICAgICAgICBcImFtb3VudFwiOiAxLFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA0OjA2IFBNIE1EVFwiLFxuICAgICAgICAgIFwic291cmNlX3NlcVwiOiBcIk1cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDgsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkJlYXZlciBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjExLzI0LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDQ4LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd3d3LnNub3cuY29tL2Rpc2NvdmVyb3VycmVzb3J0cy9iZWF2ZXJjcmVlay9sYW5kaW5nLmFzcHhcIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwic25vdy5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuc25vdy5jb20vbW91bnRhaW5jb25kaXRpb25zL3Nub3dhbmR3ZWF0aGVycmVwb3J0cy5hc3B4XCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMSxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwNDowNiBQTSBNRFRcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDksXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkJlYXZlciBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjExLzI0LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDE2OCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3d3dy5zbm93LmNvbS9kaXNjb3Zlcm91cnJlc29ydHMvYmVhdmVyY3JlZWsvbGFuZGluZy5hc3B4XCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcInNub3cuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LnNub3cuY29tL21vdW50YWluY29uZGl0aW9ucy9zbm93YW5kd2VhdGhlcnJlcG9ydHMuYXNweFwiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDMsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDQ6MDYgUE0gTURUXCJcbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDQzLFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJXaW50ZXIgUGFya1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjExLzE3LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd3d3LndpbnRlcnBhcmtyZXNvcnQuY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJjb2xvcmFkb3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuY29sb3JhZG9za2kuY29tL1Nub3dSZXBvcnQvXCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMTAsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDE6MTYgUE0gTURUXCIsXG4gICAgICAgICAgXCJzb3VyY2Vfc2VxXCI6IFwiTVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNDQsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIldpbnRlciBQYXJrXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTEvMTcvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogNDgsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly93d3cud2ludGVycGFya3Jlc29ydC5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImNvbG9yYWRvc2tpLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5jb2xvcmFkb3NraS5jb20vU25vd1JlcG9ydC9cIixcbiAgICAgICAgICBcImFtb3VudFwiOiAyNCxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwMToxNiBQTSBNRFRcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDQ1LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJXb2xmIENyZWVrXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTAvMzAvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogMjQsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly93b2xmY3JlZWtza2kuY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJjb2xvcmFkb3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuY29sb3JhZG9za2kuY29tL1Nub3dSZXBvcnQvXCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogOCxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwOTo1NSBBTSBNRFRcIixcbiAgICAgICAgICBcInNvdXJjZV9zZXFcIjogXCJNXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA0NixcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiV29sZiBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzMwLzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd29sZmNyZWVrc2tpLmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwid29sZmNyZWVrc2tpLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy53b2xmY3JlZWtza2kuY29tL3Nub3cuYXNwXCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogOCxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwOTo1MyBBTSBNRFRcIixcbiAgICAgICAgICBcInNvdXJjZV9zZXFcIjogXCJNXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA0NyxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiV29sZiBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzMwLzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDQ4LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd29sZmNyZWVrc2tpLmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwiY29sb3JhZG9za2kuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmNvbG9yYWRvc2tpLmNvbS9Tbm93UmVwb3J0L1wiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDI0LFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA5OjU1IEFNIE1EVFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNDgsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIldvbGYgQ3JlZWtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMC8zMC8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiA0OCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3dvbGZjcmVla3NraS5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcIndvbGZjcmVla3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cud29sZmNyZWVrc2tpLmNvbS9zbm93LmFzcFwiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDI0LFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA5OjUzIEFNIE1EVFwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvY2F0aW9uU3RvcmU7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL3N0b3JlL0xvY2F0aW9uU3RvcmUuanNcbiAqKi8iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBEYXRlRm9ybWF0dGVyID0gcmVxdWlyZSgnLi4vdXRpbC9EYXRlRm9ybWF0dGVyJyk7XG52YXIgQW1vdW50Rm9ybWF0dGVyID0gcmVxdWlyZSgnLi4vdXRpbC9BbW91bnRGb3JtYXR0ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgaWR4OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgZGF0ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBhbW91bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgc291cmNlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNvdXJjZVVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbGxhcHNlSWQgPSAgdGhpcy5wcm9wcy5pZHggKyBcIkNvbGxhcHNlXCI7XG4gICAgdmFyIGhyZWYgPSBcIiNcIiArIGNvbGxhcHNlSWQ7XG4gICAgdmFyIGFsdFRleHQgPSB0aGlzLnByb3BzLm5hbWUgKyBcIiByZXBvcnQgZGV0YWlsc1wiO1xuICAgIHZhciBmb3JtYXR0ZWREYXRlID0gRGF0ZUZvcm1hdHRlci5mb3JtYXREYXRlU3RyaW5nKHRoaXMucHJvcHMuZGF0ZSk7XG4gICAgdmFyIGFtb3VudENhdGVnb3J5ID0gQW1vdW50Rm9ybWF0dGVyLmdldEFtb3VudENhdGVnb3J5KHRoaXMucHJvcHMuYW1vdW50LCAyNCk7XG4gICAgdmFyIGFtb3VudENsYXNzZXMgPSBcImNvbC14cy0xIGFtb3VudC1cIiArIGFtb3VudENhdGVnb3J5O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTFcIj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJjb2xsYXBzZWRcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgaHJlZj17IGhyZWYgfSAgdGl0bGU9eyBhbHRUZXh0IH0gYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgYXJpYS1jb250cm9scz17IGNvbGxhcHNlSWQgfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tY2hldnJvbi1kb3duXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTUgY29sLXMtN1wiPnsgdGhpcy5wcm9wcy5uYW1lIH08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyBhbW91bnRDbGFzc2VzIH0+eyB0aGlzLnByb3BzLmFtb3VudCB9XCI8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNCByZXBvcnQtZGF0ZVwiPnsgZm9ybWF0dGVkRGF0ZSB9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2gzPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZVwiIGlkPXsgY29sbGFwc2VJZCB9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMVwiPjwvZGl2PlxuICAgICAgICAgICAgICA8YSBocmVmPXsgdGhpcy5wcm9wcy5zb3VyY2VVcmwgfT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy01IGNvbC1zLTdcIj57IHRoaXMucHJvcHMuc291cmNlIH08L2Rpdj5cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xXCI+eyB0aGlzLnByb3BzLmFtb3VudCB9XCI8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiPnsgZm9ybWF0dGVkRGF0ZSB9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvY29tcG9uZW50L0xvY2F0aW9uUmVwb3J0Um93LnJlYWN0LmpzXG4gKiovIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0xvYWRpbmdJbmRpY2F0b3InLFxuICBwcm9wVHlwZXM6IHtcbiAgICBsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjbGFzc05hbWUgPSBcImFsZXJ0IGFsZXJ0LWluZm9cIjtcbiAgICBpZiAodGhpcy5wcm9wcy5sb2FkaW5nICE9PSB0cnVlKSB7XG4gICAgICBjbGFzc05hbWUgKz0gXCIgaGlkZGVuXCI7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwibG9hZGluZ0luZGljYXRvclwiIGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9IHJvbGU9XCJhbGVydFwiPkxvYWRpbmcuLi48L2Rpdj5cbiAgICApO1xuICB9XG59KTtcbi8vY2xhc3M9XCJhbGVydCBhbGVydC1pbmZvXCIgcm9sZT1cImFsZXJ0XCJcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvY29tcG9uZW50L0xvYWRpbmdJbmRpY2F0b3IucmVhY3QuanNcbiAqKi8iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxuYXYgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1maXhlZC10b3AgY2VudGVyLWJsb2NrXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5MYXRlc3QgMjQgSG91ciBSZXBvcnRzPC9oND5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L25hdj5cbiAgICApO1xuICB9LFxuXG4gIF9zb3J0UmVwb3J0OiBmdW5jdGlvbihldmVudCkge1xuICAgIGFsZXJ0KCdTb3J0aW5nIScpO1xuICAgIGNvbnNvbGUubG9nKCdUT0RPOiBzb3J0JywgZXZlbnQpO1xuICB9XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvY29tcG9uZW50L05hdkJhci5yZWFjdC5qc1xuICoqLyIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIERhdGVGb3JtYXR0ZXIgPSByZXF1aXJlKCcuLi91dGlsL0RhdGVGb3JtYXR0ZXInKTtcbnZhciBBbW91bnRGb3JtYXR0ZXIgPSByZXF1aXJlKCcuLi91dGlsL0Ftb3VudEZvcm1hdHRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBwcm9wVHlwZXM6IHtcbiAgICBpZHg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgbmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkYXRlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGFtb3VudDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBzb3VyY2U6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgc291cmNlVXJsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29sbGFwc2VJZCA9IHRoaXMucHJvcHMuaWR4ICsgXCJDb2xsYXBzZVwiO1xuICAgIHZhciBocmVmID0gXCIjXCIgKyBjb2xsYXBzZUlkO1xuICAgIHZhciBhbHRUZXh0ID0gdGhpcy5wcm9wcy5uYW1lICsgXCIgcmVwb3J0IGRldGFpbHNcIjtcbiAgICB2YXIgYW1vdW50Q2F0ZWdvcnkgPSBBbW91bnRGb3JtYXR0ZXIuZ2V0QW1vdW50Q2F0ZWdvcnkodGhpcy5wcm9wcy5hbW91bnQsIDI0KTtcbiAgICB2YXIgYW1vdW50Q2xhc3NlcyA9IFwiY29sLXhzLTIgYW1vdW50LVwiICsgYW1vdW50Q2F0ZWdvcnk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZ1wiPlxuICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJwYW5lbC10aXRsZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMVwiPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImV4cGFuZGVyLWxpbmsgY29sbGFwc2VkXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGhyZWY9eyBocmVmIH0gIHRpdGxlPXsgYWx0VGV4dCB9IGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGFyaWEtY29udHJvbHM9eyBjb2xsYXBzZUlkIH0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tZG93blwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy01IG5hbWVcIj57IHRoaXMucHJvcHMubmFtZSB9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgYW1vdW50Q2xhc3NlcyB9PnsgdGhpcy5wcm9wcy5hbW91bnQgfVwiPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTQgcmVwb3J0LWRhdGVcIj57IHRoaXMucHJvcHMuZGF0ZSB9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2gzPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZVwiIGlkPXsgY29sbGFwc2VJZCB9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgeyB0aGlzLnByb3BzLmNoaWxkcmVuIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy9jb21wb25lbnQvR3JvdXBSb3cucmVhY3QuanNcbiAqKi8iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBwcm9wVHlwZXM6IHtcbiAgICBkYXRlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGR1cmF0aW9uOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIGFtb3VudDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBzb3VyY2U6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgc291cmNlVXJsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZHVyYXRpb24gPSB0aGlzLl9mb3JtYXREdXJhdGlvbigpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xIGR1cmF0aW9uXCI+eyBkdXJhdGlvbiB9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNSBuYW1lXCI+XG4gICAgICAgICAgICA8YSBocmVmPXsgdGhpcy5wcm9wcy5zb3VyY2VVcmwgfT5cbiAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLnNvdXJjZSB9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTJcIj57IHRoaXMucHJvcHMuYW1vdW50IH1cIjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy00XCI+eyB0aGlzLnByb3BzLmRhdGUgfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcblxuICBfZm9ybWF0RHVyYXRpb246IGZ1bmN0aW9uKCkge1xuICAgIHN3aXRjaCAodGhpcy5wcm9wcy5kdXJhdGlvbikge1xuICAgICAgY2FzZSAoMCk6XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIGNhc2UgKDI0KTpcbiAgICAgIGNhc2UgKDQ4KTpcbiAgICAgIGNhc2UgKDcyKTpcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZHVyYXRpb24gKyAnaHInO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuICh0aGlzLnByb3BzLmR1cmF0aW9uIC8gMjQpICsgJyBkYXlzJztcbiAgICB9XG4gIH1cbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy9jb21wb25lbnQvRGV0YWlsUm93LnJlYWN0LmpzXG4gKiovIiwidmFyIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZm9ybWF0RGF0ZVN0cmluZzogZnVuY3Rpb24oZGF0ZVN0cmluZykge1xuICAgIHZhciBkYXRlID0gbW9tZW50KG5ldyBEYXRlKGRhdGVTdHJpbmcpKTtcbiAgICByZXR1cm4gZGF0ZS5jYWxlbmRhcigpO1xuICB9LFxuXG4gIGZvcm1hdFRvZGF5RGF0ZTogZnVuY3Rpb24oZGF0ZVN0cmluZykge1xuICAgIHZhciBkYXRlID0gbW9tZW50KG5ldyBEYXRlKGRhdGVTdHJpbmcpKTtcbiAgICByZXR1cm4gZGF0ZS5mb3JtYXQoJ2g6bW0gQScpO1xuICB9XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy91dGlsL0RhdGVGb3JtYXR0ZXIuanNcbiAqKi8iLCJ2YXIgTG9jYXRpb25IZWxwZXIgPSB7XG4gIG9yZGVyQnk6IGZ1bmN0aW9uKGRhdGFJbmRleCwgZ3JvdXBlZExvY2F0aW9ucywgb3JkZXIpIHtcbiAgICB2YXIgb3JkZXJJbmRleGVzID0gXy51bmlvbihbZGF0YUluZGV4XSwgXy5rZXlzKGdyb3VwZWRMb2NhdGlvbnNbMF0pKTtcbiAgICB2YXIgc29ydGVkID0gXy5zb3J0QnlBbGwoZ3JvdXBlZExvY2F0aW9ucywgb3JkZXJJbmRleGVzKTtcblxuICAgIGlmIChvcmRlciA9PT0gJ2Rlc2NlbmRpbmcnKSB7XG4gICAgICBzb3J0ZWQgPSBzb3J0ZWQucmV2ZXJzZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc29ydGVkO1xuICB9LFxuXG4gIG1hcDogZnVuY3Rpb24obG9jYXRpb25BcnJheSkge1xuICAgIHJldHVybiBfLnJlZHVjZShsb2NhdGlvbkFycmF5LCAocmVzdWx0LCBsb2NhdGlvbkRhdGEpID0+IHtcbiAgICAgIHZhciBncm91cGVkUmVwb3J0cyA9IF8uZmluZChyZXN1bHQsIHsgJ2xvY2F0aW9uJyA6IGxvY2F0aW9uRGF0YS5sb2NhdGlvbiB9KTtcbiAgICAgIGlmICghZ3JvdXBlZFJlcG9ydHMpIHtcbiAgICAgICAgZ3JvdXBlZFJlcG9ydHMgPSB7XG4gICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uRGF0YS5sb2NhdGlvbixcbiAgICAgICAgICBhbW91bnQ6IGxvY2F0aW9uRGF0YS5hbW91bnQsXG4gICAgICAgICAgcmVwb3J0czogW11cbiAgICAgICAgfTtcbiAgICAgICAgcmVzdWx0LnB1c2goZ3JvdXBlZFJlcG9ydHMpO1xuICAgICAgfVxuICAgICAgZ3JvdXBlZFJlcG9ydHMucmVwb3J0cy5wdXNoKGxvY2F0aW9uRGF0YSk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwgW10pO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvY2F0aW9uSGVscGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy91dGlsL0xvY2F0aW9uSGVscGVyLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBtb21lbnQ7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIm1vbWVudFwiXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRBbW91bnRDYXRlZ29yeTogZnVuY3Rpb24oYW1vdW50LCBkdXJhdGlvbikge1xuICAgIHZhciBkaXZpc29yLCB0aW1lQWRqdXN0ZWRBbW91bnQ7XG5cbiAgICBpZiAoIWFtb3VudCB8fCAhZHVyYXRpb24gfHwgYW1vdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gXCJub25lXCI7XG4gICAgfVxuXG4gICAgZGl2aXNvciA9IGR1cmF0aW9uLzI0O1xuICAgIHRpbWVBZGp1c3RlZEFtb3VudCA9IGFtb3VudC9kaXZpc29yO1xuXG4gICAgaWYgKHRpbWVBZGp1c3RlZEFtb3VudCA8IDYpIHtcbiAgICAgIHJldHVybiBcInNtYWxsXCI7XG4gICAgfVxuICAgIGlmICh0aW1lQWRqdXN0ZWRBbW91bnQgPj0gNiAmJiB0aW1lQWRqdXN0ZWRBbW91bnQgPCAxMikge1xuICAgICAgcmV0dXJuIFwibWVkaXVtXCI7XG4gICAgfVxuICAgIGlmICh0aW1lQWRqdXN0ZWRBbW91bnQgPj0gMTIgJiYgdGltZUFkanVzdGVkQW1vdW50IDwgMTgpIHtcbiAgICAgIHJldHVybiBcImxhcmdlXCI7XG4gICAgfVxuICAgIHJldHVybiBcInhsYXJnZVwiO1xuICB9XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy91dGlsL0Ftb3VudEZvcm1hdHRlci5qc1xuICoqLyIsInZhciByZXF1ZXN0ID0gcmVxdWlyZSgnc3VwZXJhZ2VudCcpO1xuXG52YXIgc2VydmVyQ29uZmlnO1xuXG52YXIgRW52aXJvbm1lbnQgPSB7XG4gIGdldFNlcnZlckNvbmZpZzogZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHNlcnZlckNvbmZpZykge1xuICAgICAgICByZXNvbHZlKHNlcnZlckNvbmZpZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0XG4gICAgICAgICAgLmdldCgnL2Vudmlyb25tZW50LmpzJylcbiAgICAgICAgICAuZW5kKChyZXMpID0+IHtcbiAgICAgICAgICAgIHZhciBlbnYgPSByZXMuYm9keTtcbiAgICAgICAgICAgIHNlcnZlckNvbmZpZyA9IGVudjtcblxuICAgICAgICAgICAgcmVzb2x2ZShlbnYpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgfSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRW52aXJvbm1lbnQ7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL2Vudi9FbnZpcm9ubWVudC5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6IndlYnBhY2tfYnVuZGxlLmpzIn0=