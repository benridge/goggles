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
	    var showBlankSlate = _.keys(this.state.groupedLocations).length === 0 && this.state.loading === false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDVkZDNmNzE4YTg5OTBiOTE1OTciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luaXQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiUmVhY3RcIiIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9MYXRlc3RSZXBvcnQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvVG9kYXlSZXBvcnQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3VwZXJhZ2VudFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIl9cIiIsIndlYnBhY2s6Ly8vLi9zcmMvc3RvcmUvTG9jYXRpb25TdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L0xvY2F0aW9uUmVwb3J0Um93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnQvTG9hZGluZ0luZGljYXRvci5yZWFjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L05hdkJhci5yZWFjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L0dyb3VwUm93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnQvRGV0YWlsUm93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL0RhdGVGb3JtYXR0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvTG9jYXRpb25IZWxwZXIuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9tZW50XCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvQW1vdW50Rm9ybWF0dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9lbnYvRW52aXJvbm1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FB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SUFBSSxrQkFBa0IsR0FBRyxFQUFFLEVBQUU7T0FDdkQsT0FBTyxPQUFPLENBQUM7TUFDaEI7S0FDRCxPQUFPLFFBQVEsQ0FBQztJQUNqQjtFQUNGLEM7Ozs7OztBQ3RCRCxLQUFJLE9BQU8sR0FBRyxtQkFBTyxDQUFDLENBQVksQ0FBQyxDQUFDOztBQUVwQyxLQUFJLFlBQVksQ0FBQzs7QUFFakIsS0FBSSxXQUFXLEdBQUc7QUFDbEIsR0FBRSxlQUFlLEVBQUUsV0FBVyxDQUFDOztLQUUzQixPQUFPLElBQUksT0FBTyxDQUFDLFNBQUMsT0FBTyxFQUFFLE1BQU0sSUFBTTtPQUN2QyxJQUFJLFlBQVksRUFBRTtTQUNoQixPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkIsTUFBTTtTQUNMLE9BQU87WUFDSixHQUFHLENBQUMsaUJBQWlCLENBQUM7WUFDdEIsR0FBRyxDQUFDLFNBQUMsR0FBRyxJQUFNO2FBQ2IsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztBQUMvQixhQUFZLFlBQVksR0FBRyxHQUFHLENBQUM7O2FBRW5CLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNkLENBQUMsQ0FBQztRQUNOO1FBQ0EsQ0FBQyxDQUFDO0lBQ047QUFDSCxFQUFDLENBQUM7O0FBRUYsT0FBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLEMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAwNWRkM2Y3MThhODk5MGI5MTU5N1xuICoqLyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgTGF0ZXN0UmVwb3J0ID0gcmVxdWlyZSgnLi9wYWdlL0xhdGVzdFJlcG9ydC5yZWFjdCcpO1xudmFyIFRvZGF5UmVwb3J0ID0gcmVxdWlyZSgnLi9wYWdlL1RvZGF5UmVwb3J0LnJlYWN0Jyk7XG5cblJlYWN0LnJlbmRlcihcbiAgPFRvZGF5UmVwb3J0IC8+LFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHluYW1pYy1jb250ZW50Jylcbik7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL2luaXQucmVhY3QuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFJlYWN0O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJSZWFjdFwiXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBMb2NhdGlvblN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmUvTG9jYXRpb25TdG9yZScpO1xuXG52YXIgTG9jYXRpb25SZXBvcnRSb3cgPSByZXF1aXJlKCcuLy4uL2NvbXBvbmVudC9Mb2NhdGlvblJlcG9ydFJvdy5yZWFjdCcpO1xudmFyIExvYWRpbmdJbmRpY2F0b3IgPSByZXF1aXJlKCcuLy4uL2NvbXBvbmVudC9Mb2FkaW5nSW5kaWNhdG9yLnJlYWN0Jyk7XG52YXIgTmF2QmFyID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvTmF2QmFyLnJlYWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0xhdGVzdFJlcG9ydCcsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvY2F0aW9uczogW10sXG4gICAgICBsb2FkaW5nOiB0cnVlXG4gICAgfTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgTG9jYXRpb25TdG9yZS5sb2FkKCcvRmluZHBvd1JlcG9ydC9pbmRleC5qc29uP3Nub3dSZXBvcnRUeXBlPWxhdGVzdCcpXG4gICAgICAudGhlbigobG9jYXRpb25zKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGxvY2F0aW9uczogbG9jYXRpb25zLFxuICAgICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGFibGUgPSB0aGlzLl9nZXRUYWJsZSgpO1xuICAgIHZhciBibGFua1NsYXRlID0gdGhpcy5fZ2V0QmxhbmtTbGF0ZSgpO1xuICAgIHZhciBoZWFkZXIgPSB0aGlzLl9nZXRIZWFkZXIoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwicmVwb3J0LWNvbnRhaW5lclwiPlxuXG4gICAgICAgIDxMb2FkaW5nSW5kaWNhdG9yIGxvYWRpbmc9eyB0aGlzLnN0YXRlLmxvYWRpbmd9IC8+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwXCI+XG4gICAgICAgICAgPGRpdiBpZD1cInJlcG9ydC10aXRsZVwiIGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtaXRlbSBhY3RpdmVcIj5MYXRlc3QgMjQgSG91ciBSZXBvcnRzPC9kaXY+XG4gICAgICAgICAgeyBibGFua1NsYXRlIH1cbiAgICAgICAgICB7IGhlYWRlciB9XG4gICAgICAgICAgeyB0YWJsZSB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcblxuICBfZ2V0VGFibGU6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmxvY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgbG9jYXRpb25zID0gdGhpcy5fZ2V0TG9jYXRpb25zKCk7XG4gICAgICByZXR1cm4geyBsb2NhdGlvbnMgfTtcbiAgICB9XG4gIH0sXG5cbiAgX2dldEJsYW5rU2xhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBibGFua1NsYXRlQ2xhc3NOYW1lcyA9IFwiXCI7XG4gICAgdmFyIHNob3dCbGFua1NsYXRlID0gdGhpcy5zdGF0ZS5sb2NhdGlvbnMubGVuZ3RoID09PSAwICYmIHRoaXMuc3RhdGUubG9hZGluZyA9PT0gZmFsc2U7XG4gICAgaWYgKHNob3dCbGFua1NsYXRlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtaXRlbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgYmxhbmtTbGF0ZUNsYXNzTmFtZXMgfT5cbiAgICAgICAgICAgIE5vIHJlcG9ydHMgeWV0IGZvciB0b2RheS5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICBfZ2V0SGVhZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXNweT1cImFmZml4XCIgZGF0YS1vZmZzZXQtdG9wPVwiNTBcIiBjbGFzc05hbWU9XCJyZXBvcnQtY29sdW1uLWhlYWRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtaXRlbS1pbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTFcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTUgY29sLXMtN1wiIG9uQ2xpY2s9e3RoaXMuX3NvcnRSZXBvcnR9PkxvY2F0aW9uPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xXCIgb25DbGljaz17dGhpcy5fc29ydFJlcG9ydH0+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy00XCIgb25DbGljaz17dGhpcy5fc29ydFJlcG9ydH0+RGF0ZTwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG5cbiAgX2dldExvY2F0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8ubWFwKHRoaXMuc3RhdGUubG9jYXRpb25zLCAobG9jYXRpb25EYXRhLCBpbmRleCkgID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtIGxvY2F0aW9uLXJvd1wiPlxuICAgICAgICAgIDxMb2NhdGlvblJlcG9ydFJvd1xuICAgICAgICAgICAga2V5PXsgaW5kZXggfVxuICAgICAgICAgICAgaWR4PXsgaW5kZXggfVxuICAgICAgICAgICAgbmFtZT17IGxvY2F0aW9uRGF0YS5sb2NhdGlvbiB9XG4gICAgICAgICAgICBkYXRlPXsgbG9jYXRpb25EYXRhLnNvdXJjZV9kYXRlIH1cbiAgICAgICAgICAgIGFtb3VudD17IGxvY2F0aW9uRGF0YS5hbW91bnQgfVxuICAgICAgICAgICAgc291cmNlPXsgbG9jYXRpb25EYXRhLnNvdXJjZV9uYW1lIH1cbiAgICAgICAgICAgIHNvdXJjZVVybD17IGxvY2F0aW9uRGF0YS51cmwgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvcGFnZS9MYXRlc3RSZXBvcnQucmVhY3QuanNcbiAqKi8iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBMb2NhdGlvblN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmUvTG9jYXRpb25TdG9yZScpO1xuXG52YXIgR3JvdXBSb3cgPSByZXF1aXJlKCcuLy4uL2NvbXBvbmVudC9Hcm91cFJvdy5yZWFjdCcpO1xudmFyIERldGFpbFJvdyA9IHJlcXVpcmUoJy4vLi4vY29tcG9uZW50L0RldGFpbFJvdy5yZWFjdCcpO1xudmFyIExvYWRpbmdJbmRpY2F0b3IgPSByZXF1aXJlKCcuLy4uL2NvbXBvbmVudC9Mb2FkaW5nSW5kaWNhdG9yLnJlYWN0Jyk7XG52YXIgRGF0ZUZvcm1hdHRlciA9IHJlcXVpcmUoJy4uL3V0aWwvRGF0ZUZvcm1hdHRlcicpO1xudmFyIExvY2F0aW9uSGVscGVyID0gcmVxdWlyZSgnLi4vdXRpbC9Mb2NhdGlvbkhlbHBlcicpO1xuXG52YXIgY29sdW1uU2l6ZUNzc01hcCA9IHtcbiAgJ2R1cmF0aW9uJzogJ2NvbC14cy0xJyxcbiAgJ25hbWUnOiAnY29sLXhzLTUnLFxuICAnYW1vdW50JzogJ2NvbC14cy0yJyxcbiAgJ2RhdGUnOiAnY29sLXhzLTQnXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUb2RheVJlcG9ydCcsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdyb3VwZWRMb2NhdGlvbnM6IFtdLFxuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIG9yZGVyOiB7XG4gICAgICAgIGRhdGFJbmRleDogJ2xvY2F0aW9uJyxcbiAgICAgICAgZGlyZWN0aW9uOiAnYXNjZW5kaW5nJ1xuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIExvY2F0aW9uU3RvcmUubG9hZCgnL0ZpbmRwb3dSZXBvcnQvaW5kZXguanNvbj9zbm93UmVwb3J0VHlwZT10b2RheScpXG4gICAgICAgICAgICAgICAgIC50aGVuKHRoaXMuX29uTG9jYXRpb25zTG9hZGVkKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0YWJsZSA9IHRoaXMuX2dldFRhYmxlKCk7XG4gICAgdmFyIGJsYW5rU2xhdGUgPSB0aGlzLl9nZXRCbGFua1NsYXRlKCk7XG4gICAgdmFyIGhlYWRlciA9IHRoaXMuX2dldEhlYWRlcigpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9XCJyZXBvcnQtY29udGFpbmVyXCI+XG5cbiAgICAgICAgPExvYWRpbmdJbmRpY2F0b3IgbG9hZGluZz17IHRoaXMuc3RhdGUubG9hZGluZ30gLz5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtZ3JvdXBcIj5cbiAgICAgICAgICA8ZGl2IGlkPVwicmVwb3J0LXRpdGxlXCIgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtIGFjdGl2ZVwiPlRvZGF5J3MgUmVwb3J0czwvZGl2PlxuICAgICAgICAgIHsgYmxhbmtTbGF0ZSB9XG4gICAgICAgICAgeyBoZWFkZXIgfVxuICAgICAgICAgIHsgdGFibGUgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG5cbiAgX2dldFRhYmxlOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5ncm91cGVkTG9jYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiAgdGhpcy5fZ2V0TG9jYXRpb25zKCk7XG4gICAgfVxuICB9LFxuXG4gIF9nZXRCbGFua1NsYXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmxhbmtTbGF0ZUNsYXNzTmFtZXMgPSBcIlwiO1xuICAgIHZhciBzaG93QmxhbmtTbGF0ZSA9IF8ua2V5cyh0aGlzLnN0YXRlLmdyb3VwZWRMb2NhdGlvbnMpLmxlbmd0aCA9PT0gMCAmJiB0aGlzLnN0YXRlLmxvYWRpbmcgPT09IGZhbHNlO1xuICAgIGlmIChzaG93QmxhbmtTbGF0ZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGJsYW5rU2xhdGVDbGFzc05hbWVzIH0+XG4gICAgICAgICAgICBObyByZXBvcnRzIHlldCBmb3IgdG9kYXkuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgX2dldEhlYWRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtLWluZm8gY29sdW1uLWhlYWRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY29sdW1uU2l6ZUNzc01hcC5kdXJhdGlvbiB9PjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY29sdW1uU2l6ZUNzc01hcC5uYW1lIH0+PGEgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLl9zb3J0UmVwb3J0fT5Mb2NhdGlvbjwvYT48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbHVtblNpemVDc3NNYXAuYW1vdW50IH0+PGEgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLl9zb3J0UmVwb3J0fT5BbW91bnQ8L2E+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb2x1bW5TaXplQ3NzTWFwLmRhdGUgfT5MYXN0IFVwZGF0ZWQ8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIF9nZXRMb2NhdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnJlZHVjZSh0aGlzLnN0YXRlLmdyb3VwZWRMb2NhdGlvbnMsIChyZXN1bHQsIGdyb3VwZWRMb2NhdGlvbikgPT4ge1xuICAgICAgdmFyIGdyb3VwUm93RGF0YSA9IGdyb3VwZWRMb2NhdGlvbi5yZXBvcnRzWzBdO1xuICAgICAgdmFyIGRldGFpbFJvd3MgPSB0aGlzLl9nZXREZXRhaWxSb3dzKGdyb3VwZWRMb2NhdGlvbi5yZXBvcnRzKTtcbiAgICAgIHZhciBmb3JtYXR0ZWREYXRlID0gRGF0ZUZvcm1hdHRlci5mb3JtYXRUb2RheURhdGUoZ3JvdXBSb3dEYXRhLnNvdXJjZV9kYXRlKTtcbiAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICA8R3JvdXBSb3dcbiAgICAgICAgICBrZXk9eyBncm91cFJvd0RhdGEuUk9XX05VTSB9XG4gICAgICAgICAgaWR4PXsgZ3JvdXBSb3dEYXRhLlJPV19OVU0gfVxuICAgICAgICAgIG5hbWU9eyBncm91cFJvd0RhdGEubG9jYXRpb24gfVxuICAgICAgICAgIGRhdGU9eyBmb3JtYXR0ZWREYXRlIH1cbiAgICAgICAgICBhbW91bnQ9eyBncm91cFJvd0RhdGEuYW1vdW50IH1cbiAgICAgICAgICBzb3VyY2U9eyBncm91cFJvd0RhdGEuc291cmNlX25hbWUgfVxuICAgICAgICAgIHNvdXJjZVVybD17IGdyb3VwUm93RGF0YS51cmwgfVxuICAgICAgICA+XG4gICAgICAgICAgeyBkZXRhaWxSb3dzIH1cbiAgICAgICAgPC9Hcm91cFJvdz5cbiAgICAgICk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIFtdKTtcbiAgfSxcblxuICBfZ2V0RGV0YWlsUm93czogZnVuY3Rpb24oZGV0YWlsUm93RGF0YUFycmF5KSB7XG4gICAgdmFyIGR1cmF0aW9uO1xuICAgIHZhciBwcmV2RHVyYXRpb24gPSAwO1xuICAgIHZhciBmb3JtYXR0ZWREYXRlO1xuICAgIHJldHVybiBfLnJlZHVjZShkZXRhaWxSb3dEYXRhQXJyYXksIChyZXN1bHQsIGRldGFpbFJvd0RhdGEpID0+IHtcbiAgICAgIGR1cmF0aW9uID0gZGV0YWlsUm93RGF0YS5kdXJhdGlvbiAhPT0gcHJldkR1cmF0aW9uID8gZGV0YWlsUm93RGF0YS5kdXJhdGlvbiA6IDA7XG4gICAgICBwcmV2RHVyYXRpb24gPSBkZXRhaWxSb3dEYXRhLmR1cmF0aW9uO1xuICAgICAgZm9ybWF0dGVkRGF0ZSA9IERhdGVGb3JtYXR0ZXIuZm9ybWF0VG9kYXlEYXRlKGRldGFpbFJvd0RhdGEuc291cmNlX2RhdGUpO1xuXG5cbiAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICA8RGV0YWlsUm93XG4gICAgICAgICAga2V5PXsgZGV0YWlsUm93RGF0YS5ST1dfTlVNIH1cbiAgICAgICAgICBkYXRlPXsgZm9ybWF0dGVkRGF0ZSB9XG4gICAgICAgICAgZHVyYXRpb249eyBkdXJhdGlvbiB9XG4gICAgICAgICAgYW1vdW50PXsgZGV0YWlsUm93RGF0YS5hbW91bnQgfVxuICAgICAgICAgIHNvdXJjZT17IGRldGFpbFJvd0RhdGEuc291cmNlX25hbWUgfVxuICAgICAgICAgIHNvdXJjZVVybD17IGRldGFpbFJvd0RhdGEudXJsIH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIFtdKTtcbiAgfSxcblxuICBfb25Mb2NhdGlvbnNMb2FkZWQ6IGZ1bmN0aW9uKGxvY2F0aW9ucykge1xuICAgIHZhciBncm91cGVkTG9jYXRpb25zID0gTG9jYXRpb25IZWxwZXIubWFwKGxvY2F0aW9ucyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBncm91cGVkTG9jYXRpb25zOiBncm91cGVkTG9jYXRpb25zLFxuICAgICAgbG9hZGluZzogZmFsc2VcbiAgICB9KTtcbiAgfSxcblxuICBfc29ydFJlcG9ydDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgZGlyZWN0aW9uLCBkYXRhSW5kZXg7XG4gICAgaWYgKGV2ZW50LnRhcmdldC50ZXh0Q29udGVudCA9PT0gJ0Ftb3VudCcpIHtcbiAgICAgIGRhdGFJbmRleCA9ICdhbW91bnQnO1xuICAgICAgZGlyZWN0aW9uID0gJ2Rlc2NlbmRpbmcnO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0LnRleHRDb250ZW50ID09PSAnTG9jYXRpb24nKSB7XG4gICAgICBkYXRhSW5kZXggPSAnbG9jYXRpb24nO1xuICAgICAgZGlyZWN0aW9uID0gJ2FzY2VuZGluZyc7XG4gICAgfVxuICAgIHZhciBncm91cGVkTG9jYXRpb25zID0gTG9jYXRpb25IZWxwZXIub3JkZXJCeShkYXRhSW5kZXgsIHRoaXMuc3RhdGUuZ3JvdXBlZExvY2F0aW9ucywgZGlyZWN0aW9uKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZ3JvdXBlZExvY2F0aW9uczogZ3JvdXBlZExvY2F0aW9ucyxcbiAgICAgIG9yZGVyOiB7XG4gICAgICAgIGRhdGFJbmRleDogZGF0YUluZGV4LFxuICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvblxuICAgICAgfVxuICAgIH0pO1xuXG4gIH1cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL3BhZ2UvVG9kYXlSZXBvcnQucmVhY3QuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHN1cGVyYWdlbnQ7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInN1cGVyYWdlbnRcIlxuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiX1wiXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHJlcXVlc3QgPSByZXF1aXJlKCdzdXBlcmFnZW50Jyk7XG52YXIgRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuLi9lbnYvRW52aXJvbm1lbnQnKTtcblxudmFyIExvY2F0aW9uU3RvcmUgPSB7XG4gIGxvYWQ6IGZ1bmN0aW9uKHVybCkge1xuICAgIHJldHVybiBFbnZpcm9ubWVudC5nZXRTZXJ2ZXJDb25maWcoKS50aGVuKChTZXJ2ZXJDb25maWcpPT4ge1xuICAgICAgdmFyIHNlcnZlclJvb3QgPSBTZXJ2ZXJDb25maWcuVE9NQ0FUX1VSTDtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlcXVlc3RcbiAgICAgICAgICAuZ2V0KHNlcnZlclJvb3QgKyB1cmwpXG4gICAgICAgICAgLmVuZCgocmVzKSA9PiB7XG4gICAgICAgICAgICB2YXIgcmVwb3J0ID0gSlNPTi5wYXJzZShyZXMudGV4dCkucmVwb3J0O1xuICAgICAgICAgICAgcmVzb2x2ZShyZXBvcnQubG9jYXRpb25zKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH0sXG5cbiAgbG9hZFRlc3REYXRhOiBmdW5jdGlvbih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVzb2x2ZShbXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogMSxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiQXJhcGFob2UgQmFzaW5cIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMC8yNS8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiAyNCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL2FyYXBhaG9lYmFzaW4uY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJjb2xvcmFkb3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuY29sb3JhZG9za2kuY29tL1Nub3dSZXBvcnQvXCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMyxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwNTo1NSBBTSBNRFRcIixcbiAgICAgICAgICBcInNvdXJjZV9zZXFcIjogXCJNXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiAyLFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJBcmFwYWhvZSBCYXNpblwiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzI1LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vYXJhcGFob2ViYXNpbi5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImFyYXBhaG9lYmFzaW4uY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmFyYXBhaG9lYmFzaW4uY29tL0FCYXNpbi9zbm93LWNvbmRpdGlvbnMvZGVmYXVsdC5hc3B4XCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMyxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwNTozNiBBTSBNRFRcIixcbiAgICAgICAgICBcInNvdXJjZV9zZXFcIjogXCJNXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiAzLFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJBcmFwYWhvZSBCYXNpblwiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzI1LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDQ4LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vYXJhcGFob2ViYXNpbi5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImNvbG9yYWRvc2tpLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5jb2xvcmFkb3NraS5jb20vU25vd1JlcG9ydC9cIixcbiAgICAgICAgICBcImFtb3VudFwiOiA1LFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA1OjU1IEFNIE1EVFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNCxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiQXJhcGFob2UgQmFzaW5cIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMC8yNS8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiA3MixcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL2FyYXBhaG9lYmFzaW4uY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJhcmFwYWhvZWJhc2luLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5hcmFwYWhvZWJhc2luLmNvbS9BQmFzaW4vc25vdy1jb25kaXRpb25zL2RlZmF1bHQuYXNweFwiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDcsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDU6MzYgQU0gTURUXCJcbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDcsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkJlYXZlciBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjExLzI0LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd3d3LnNub3cuY29tL2Rpc2NvdmVyb3VycmVzb3J0cy9iZWF2ZXJjcmVlay9sYW5kaW5nLmFzcHhcIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwic25vdy5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuc25vdy5jb20vbW91bnRhaW5jb25kaXRpb25zL3Nub3dhbmR3ZWF0aGVycmVwb3J0cy5hc3B4XCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMSxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwNDowNiBQTSBNRFRcIixcbiAgICAgICAgICBcInNvdXJjZV9zZXFcIjogXCJNXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA4LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJCZWF2ZXIgQ3JlZWtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMS8yNC8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiA0OCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3d3dy5zbm93LmNvbS9kaXNjb3Zlcm91cnJlc29ydHMvYmVhdmVyY3JlZWsvbGFuZGluZy5hc3B4XCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcInNub3cuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LnNub3cuY29tL21vdW50YWluY29uZGl0aW9ucy9zbm93YW5kd2VhdGhlcnJlcG9ydHMuYXNweFwiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDEsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDQ6MDYgUE0gTURUXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA5LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJCZWF2ZXIgQ3JlZWtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMS8yNC8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiAxNjgsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly93d3cuc25vdy5jb20vZGlzY292ZXJvdXJyZXNvcnRzL2JlYXZlcmNyZWVrL2xhbmRpbmcuYXNweFwiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJzbm93LmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5zbm93LmNvbS9tb3VudGFpbmNvbmRpdGlvbnMvc25vd2FuZHdlYXRoZXJyZXBvcnRzLmFzcHhcIixcbiAgICAgICAgICBcImFtb3VudFwiOiAzLFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA0OjA2IFBNIE1EVFwiXG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA0MyxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiV2ludGVyIFBhcmtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMS8xNy8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiAyNCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3d3dy53aW50ZXJwYXJrcmVzb3J0LmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwiY29sb3JhZG9za2kuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmNvbG9yYWRvc2tpLmNvbS9Tbm93UmVwb3J0L1wiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDEwLFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDAxOjE2IFBNIE1EVFwiLFxuICAgICAgICAgIFwic291cmNlX3NlcVwiOiBcIk1cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDQ0LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJXaW50ZXIgUGFya1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjExLzE3LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDQ4LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd3d3LndpbnRlcnBhcmtyZXNvcnQuY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJjb2xvcmFkb3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuY29sb3JhZG9za2kuY29tL1Nub3dSZXBvcnQvXCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMjQsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDE6MTYgUE0gTURUXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA0NSxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiV29sZiBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzMwLzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd29sZmNyZWVrc2tpLmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwiY29sb3JhZG9za2kuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmNvbG9yYWRvc2tpLmNvbS9Tbm93UmVwb3J0L1wiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDgsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDk6NTUgQU0gTURUXCIsXG4gICAgICAgICAgXCJzb3VyY2Vfc2VxXCI6IFwiTVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNDYsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIldvbGYgQ3JlZWtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMC8zMC8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiAyNCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3dvbGZjcmVla3NraS5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcIndvbGZjcmVla3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cud29sZmNyZWVrc2tpLmNvbS9zbm93LmFzcFwiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDgsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDk6NTMgQU0gTURUXCIsXG4gICAgICAgICAgXCJzb3VyY2Vfc2VxXCI6IFwiTVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNDcsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIldvbGYgQ3JlZWtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMC8zMC8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiA0OCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3dvbGZjcmVla3NraS5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImNvbG9yYWRvc2tpLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5jb2xvcmFkb3NraS5jb20vU25vd1JlcG9ydC9cIixcbiAgICAgICAgICBcImFtb3VudFwiOiAyNCxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwOTo1NSBBTSBNRFRcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDQ4LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJXb2xmIENyZWVrXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTAvMzAvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogNDgsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly93b2xmY3JlZWtza2kuY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJ3b2xmY3JlZWtza2kuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LndvbGZjcmVla3NraS5jb20vc25vdy5hc3BcIixcbiAgICAgICAgICBcImFtb3VudFwiOiAyNCxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwOTo1MyBBTSBNRFRcIlxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2NhdGlvblN0b3JlO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy9zdG9yZS9Mb2NhdGlvblN0b3JlLmpzXG4gKiovIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgRGF0ZUZvcm1hdHRlciA9IHJlcXVpcmUoJy4uL3V0aWwvRGF0ZUZvcm1hdHRlcicpO1xudmFyIEFtb3VudEZvcm1hdHRlciA9IHJlcXVpcmUoJy4uL3V0aWwvQW1vdW50Rm9ybWF0dGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIHByb3BUeXBlczoge1xuICAgIGlkeDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGRhdGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgYW1vdW50OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIHNvdXJjZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzb3VyY2VVcmw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb2xsYXBzZUlkID0gIHRoaXMucHJvcHMuaWR4ICsgXCJDb2xsYXBzZVwiO1xuICAgIHZhciBocmVmID0gXCIjXCIgKyBjb2xsYXBzZUlkO1xuICAgIHZhciBhbHRUZXh0ID0gdGhpcy5wcm9wcy5uYW1lICsgXCIgcmVwb3J0IGRldGFpbHNcIjtcbiAgICB2YXIgZm9ybWF0dGVkRGF0ZSA9IERhdGVGb3JtYXR0ZXIuZm9ybWF0RGF0ZVN0cmluZyh0aGlzLnByb3BzLmRhdGUpO1xuICAgIHZhciBhbW91bnRDYXRlZ29yeSA9IEFtb3VudEZvcm1hdHRlci5nZXRBbW91bnRDYXRlZ29yeSh0aGlzLnByb3BzLmFtb3VudCwgMjQpO1xuICAgIHZhciBhbW91bnRDbGFzc2VzID0gXCJjb2wteHMtMSBhbW91bnQtXCIgKyBhbW91bnRDYXRlZ29yeTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInBhbmVsLXRpdGxlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xXCI+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiY29sbGFwc2VkXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGhyZWY9eyBocmVmIH0gIHRpdGxlPXsgYWx0VGV4dCB9IGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGFyaWEtY29udHJvbHM9eyBjb2xsYXBzZUlkIH0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tZG93blwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy01IGNvbC1zLTdcIj57IHRoaXMucHJvcHMubmFtZSB9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgYW1vdW50Q2xhc3NlcyB9PnsgdGhpcy5wcm9wcy5hbW91bnQgfVwiPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTQgcmVwb3J0LWRhdGVcIj57IGZvcm1hdHRlZERhdGUgfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9oMz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sbGFwc2VcIiBpZD17IGNvbGxhcHNlSWQgfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTFcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPGEgaHJlZj17IHRoaXMucHJvcHMuc291cmNlVXJsIH0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNSBjb2wtcy03XCI+eyB0aGlzLnByb3BzLnNvdXJjZSB9PC9kaXY+XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMVwiPnsgdGhpcy5wcm9wcy5hbW91bnQgfVwiPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTRcIj57IGZvcm1hdHRlZERhdGUgfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL2NvbXBvbmVudC9Mb2NhdGlvblJlcG9ydFJvdy5yZWFjdC5qc1xuICoqLyIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdMb2FkaW5nSW5kaWNhdG9yJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgbG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1pbmZvXCI7XG4gICAgaWYgKHRoaXMucHJvcHMubG9hZGluZyAhPT0gdHJ1ZSkge1xuICAgICAgY2xhc3NOYW1lICs9IFwiIGhpZGRlblwiO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cImxvYWRpbmdJbmRpY2F0b3JcIiBjbGFzc05hbWU9eyBjbGFzc05hbWUgfSByb2xlPVwiYWxlcnRcIj5Mb2FkaW5nLi4uPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG4vL2NsYXNzPVwiYWxlcnQgYWxlcnQtaW5mb1wiIHJvbGU9XCJhbGVydFwiXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL2NvbXBvbmVudC9Mb2FkaW5nSW5kaWNhdG9yLnJlYWN0LmpzXG4gKiovIiwidmFyIFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bmF2IGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItZml4ZWQtdG9wIGNlbnRlci1ibG9ja1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lci1mbHVpZFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+TGF0ZXN0IDI0IEhvdXIgUmVwb3J0czwvaDQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9uYXY+XG4gICAgKTtcbiAgfSxcblxuICBfc29ydFJlcG9ydDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBhbGVydCgnU29ydGluZyEnKTtcbiAgICBjb25zb2xlLmxvZygnVE9ETzogc29ydCcsIGV2ZW50KTtcbiAgfVxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL2NvbXBvbmVudC9OYXZCYXIucmVhY3QuanNcbiAqKi8iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBEYXRlRm9ybWF0dGVyID0gcmVxdWlyZSgnLi4vdXRpbC9EYXRlRm9ybWF0dGVyJyk7XG52YXIgQW1vdW50Rm9ybWF0dGVyID0gcmVxdWlyZSgnLi4vdXRpbC9BbW91bnRGb3JtYXR0ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgaWR4OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgZGF0ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBhbW91bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgc291cmNlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNvdXJjZVVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbGxhcHNlSWQgPSB0aGlzLnByb3BzLmlkeCArIFwiQ29sbGFwc2VcIjtcbiAgICB2YXIgaHJlZiA9IFwiI1wiICsgY29sbGFwc2VJZDtcbiAgICB2YXIgYWx0VGV4dCA9IHRoaXMucHJvcHMubmFtZSArIFwiIHJlcG9ydCBkZXRhaWxzXCI7XG4gICAgdmFyIGFtb3VudENhdGVnb3J5ID0gQW1vdW50Rm9ybWF0dGVyLmdldEFtb3VudENhdGVnb3J5KHRoaXMucHJvcHMuYW1vdW50LCAyNCk7XG4gICAgdmFyIGFtb3VudENsYXNzZXMgPSBcImNvbC14cy0yIGFtb3VudC1cIiArIGFtb3VudENhdGVnb3J5O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTFcIj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJleHBhbmRlci1saW5rIGNvbGxhcHNlZFwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBocmVmPXsgaHJlZiB9ICB0aXRsZT17IGFsdFRleHQgfSBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWNvbnRyb2xzPXsgY29sbGFwc2VJZCB9PlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLWRvd25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNSBuYW1lXCI+eyB0aGlzLnByb3BzLm5hbWUgfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGFtb3VudENsYXNzZXMgfT57IHRoaXMucHJvcHMuYW1vdW50IH1cIjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy00IHJlcG9ydC1kYXRlXCI+eyB0aGlzLnByb3BzLmRhdGUgfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9oMz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sbGFwc2VcIiBpZD17IGNvbGxhcHNlSWQgfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHlcIj5cbiAgICAgICAgICAgIHsgdGhpcy5wcm9wcy5jaGlsZHJlbiB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvY29tcG9uZW50L0dyb3VwUm93LnJlYWN0LmpzXG4gKiovIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgZGF0ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkdXJhdGlvbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBhbW91bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgc291cmNlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNvdXJjZVVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGR1cmF0aW9uID0gdGhpcy5fZm9ybWF0RHVyYXRpb24oKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMSBkdXJhdGlvblwiPnsgZHVyYXRpb24gfTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTUgbmFtZVwiPlxuICAgICAgICAgICAgPGEgaHJlZj17IHRoaXMucHJvcHMuc291cmNlVXJsIH0+XG4gICAgICAgICAgICAgIHsgdGhpcy5wcm9wcy5zb3VyY2UgfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0yXCI+eyB0aGlzLnByb3BzLmFtb3VudCB9XCI8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiPnsgdGhpcy5wcm9wcy5kYXRlIH08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG5cbiAgX2Zvcm1hdER1cmF0aW9uOiBmdW5jdGlvbigpIHtcbiAgICBzd2l0Y2ggKHRoaXMucHJvcHMuZHVyYXRpb24pIHtcbiAgICAgIGNhc2UgKDApOlxuICAgICAgICByZXR1cm4gJyc7XG4gICAgICBjYXNlICgyNCk6XG4gICAgICBjYXNlICg0OCk6XG4gICAgICBjYXNlICg3Mik6XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmR1cmF0aW9uICsgJ2hyJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wcy5kdXJhdGlvbiAvIDI0KSArICcgZGF5cyc7XG4gICAgfVxuICB9XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvY29tcG9uZW50L0RldGFpbFJvdy5yZWFjdC5qc1xuICoqLyIsInZhciBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGZvcm1hdERhdGVTdHJpbmc6IGZ1bmN0aW9uKGRhdGVTdHJpbmcpIHtcbiAgICB2YXIgZGF0ZSA9IG1vbWVudChuZXcgRGF0ZShkYXRlU3RyaW5nKSk7XG4gICAgcmV0dXJuIGRhdGUuY2FsZW5kYXIoKTtcbiAgfSxcblxuICBmb3JtYXRUb2RheURhdGU6IGZ1bmN0aW9uKGRhdGVTdHJpbmcpIHtcbiAgICB2YXIgZGF0ZSA9IG1vbWVudChuZXcgRGF0ZShkYXRlU3RyaW5nKSk7XG4gICAgcmV0dXJuIGRhdGUuZm9ybWF0KCdoOm1tIEEnKTtcbiAgfVxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvdXRpbC9EYXRlRm9ybWF0dGVyLmpzXG4gKiovIiwidmFyIExvY2F0aW9uSGVscGVyID0ge1xuICBvcmRlckJ5OiBmdW5jdGlvbihkYXRhSW5kZXgsIGdyb3VwZWRMb2NhdGlvbnMsIG9yZGVyKSB7XG4gICAgdmFyIG9yZGVySW5kZXhlcyA9IF8udW5pb24oW2RhdGFJbmRleF0sIF8ua2V5cyhncm91cGVkTG9jYXRpb25zWzBdKSk7XG4gICAgdmFyIHNvcnRlZCA9IF8uc29ydEJ5QWxsKGdyb3VwZWRMb2NhdGlvbnMsIG9yZGVySW5kZXhlcyk7XG5cbiAgICBpZiAob3JkZXIgPT09ICdkZXNjZW5kaW5nJykge1xuICAgICAgc29ydGVkID0gc29ydGVkLnJldmVyc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvcnRlZDtcbiAgfSxcblxuICBtYXA6IGZ1bmN0aW9uKGxvY2F0aW9uQXJyYXkpIHtcbiAgICByZXR1cm4gXy5yZWR1Y2UobG9jYXRpb25BcnJheSwgKHJlc3VsdCwgbG9jYXRpb25EYXRhKSA9PiB7XG4gICAgICB2YXIgZ3JvdXBlZFJlcG9ydHMgPSBfLmZpbmQocmVzdWx0LCB7ICdsb2NhdGlvbicgOiBsb2NhdGlvbkRhdGEubG9jYXRpb24gfSk7XG4gICAgICBpZiAoIWdyb3VwZWRSZXBvcnRzKSB7XG4gICAgICAgIGdyb3VwZWRSZXBvcnRzID0ge1xuICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbkRhdGEubG9jYXRpb24sXG4gICAgICAgICAgYW1vdW50OiBsb2NhdGlvbkRhdGEuYW1vdW50LFxuICAgICAgICAgIHJlcG9ydHM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHJlc3VsdC5wdXNoKGdyb3VwZWRSZXBvcnRzKTtcbiAgICAgIH1cbiAgICAgIGdyb3VwZWRSZXBvcnRzLnJlcG9ydHMucHVzaChsb2NhdGlvbkRhdGEpO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIFtdKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2NhdGlvbkhlbHBlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvdXRpbC9Mb2NhdGlvbkhlbHBlci5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gbW9tZW50O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJtb21lbnRcIlxuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0QW1vdW50Q2F0ZWdvcnk6IGZ1bmN0aW9uKGFtb3VudCwgZHVyYXRpb24pIHtcbiAgICB2YXIgZGl2aXNvciwgdGltZUFkanVzdGVkQW1vdW50O1xuXG4gICAgaWYgKCFhbW91bnQgfHwgIWR1cmF0aW9uIHx8IGFtb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFwibm9uZVwiO1xuICAgIH1cblxuICAgIGRpdmlzb3IgPSBkdXJhdGlvbi8yNDtcbiAgICB0aW1lQWRqdXN0ZWRBbW91bnQgPSBhbW91bnQvZGl2aXNvcjtcblxuICAgIGlmICh0aW1lQWRqdXN0ZWRBbW91bnQgPCA2KSB7XG4gICAgICByZXR1cm4gXCJzbWFsbFwiO1xuICAgIH1cbiAgICBpZiAodGltZUFkanVzdGVkQW1vdW50ID49IDYgJiYgdGltZUFkanVzdGVkQW1vdW50IDwgMTIpIHtcbiAgICAgIHJldHVybiBcIm1lZGl1bVwiO1xuICAgIH1cbiAgICBpZiAodGltZUFkanVzdGVkQW1vdW50ID49IDEyICYmIHRpbWVBZGp1c3RlZEFtb3VudCA8IDE4KSB7XG4gICAgICByZXR1cm4gXCJsYXJnZVwiO1xuICAgIH1cbiAgICByZXR1cm4gXCJ4bGFyZ2VcIjtcbiAgfVxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvdXRpbC9BbW91bnRGb3JtYXR0ZXIuanNcbiAqKi8iLCJ2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcblxudmFyIHNlcnZlckNvbmZpZztcblxudmFyIEVudmlyb25tZW50ID0ge1xuICBnZXRTZXJ2ZXJDb25maWc6IGZ1bmN0aW9uKCkge1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChzZXJ2ZXJDb25maWcpIHtcbiAgICAgICAgcmVzb2x2ZShzZXJ2ZXJDb25maWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWVzdFxuICAgICAgICAgIC5nZXQoJy9lbnZpcm9ubWVudC5qcycpXG4gICAgICAgICAgLmVuZCgocmVzKSA9PiB7XG4gICAgICAgICAgICB2YXIgZW52ID0gcmVzLmJvZHk7XG4gICAgICAgICAgICBzZXJ2ZXJDb25maWcgPSBlbnY7XG5cbiAgICAgICAgICAgIHJlc29sdmUoZW52KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIH0pO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVudmlyb25tZW50O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy9lbnYvRW52aXJvbm1lbnQuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJ3ZWJwYWNrX2J1bmRsZS5qcyJ9