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
	  'expander': 'col-xs-1',
	  'duration': 'col-xs-2',
	  'name': 'col-xs-5',
	  'amount': 'col-xs-2',
	  'date': 'col-xs-2'
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
	          React.createElement("div", {className:  columnSizeCssMap.expander + ' expander-cell'}), 
	          React.createElement("div", {className:  columnSizeCssMap.name}, React.createElement("a", {href: "#", onClick: this._sortReport}, "Location")), 
	          React.createElement("div", {className:  columnSizeCssMap.duration}), 
	          React.createElement("div", {className:  columnSizeCssMap.amount}, React.createElement("a", {href: "#", onClick: this._sortReport}, "Amount")), 
	          React.createElement("div", {className:  columnSizeCssMap.date}, "Updated")
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
	var AmountFormatter = __webpack_require__(15);
	
	module.exports = React.createClass({displayName: "exports",
	
	  getInitialState: function() {
	    return {
	      glyphicon: 'glyphicon-chevron-right'
	    };
	  },
	
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
	            React.createElement("a", {className: "expander-link collapsed", 
	              "data-toggle": "collapse", 
	              href: href, 
	              title: altText, 
	              "aria-expanded": "false", 
	              "aria-controls": collapseId, 
	              onClick:  this._onExpand
	            }, 
	              React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-xs-1 expander-cell"}, 
	                  React.createElement("span", {className:  'glyphicon ' + this.state.glyphicon})
	                ), 
	                React.createElement("div", {className: "col-xs-5 name"},  this.props.name), 
	                React.createElement("div", {className: "col-xs-2 duration"}), 
	                React.createElement("div", {className: amountClasses },  this.props.amount, "\""), 
	                React.createElement("div", {className: "col-xs-2 report-date"},  this.props.date)
	              )
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
	  },
	
	  _onExpand: function() {
	    if (this.state.glyphicon === 'glyphicon-chevron-right') {
	      this.setState({
	        glyphicon: 'glyphicon-chevron-down'
	      });
	    } else {
	      this.setState({
	        glyphicon: 'glyphicon-chevron-right'
	      });
	    }
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
	        React.createElement("div", {className: "col-xs-1 expander-cell"}), 
	          React.createElement("div", {className: "col-xs-5 name"}, 
	            React.createElement("a", {href:  this.props.sourceUrl}, 
	               this.props.source
	            )
	          ), 
	        React.createElement("div", {className: "col-xs-2 duration"}, duration ), 
	        React.createElement("div", {className: "col-xs-2"},  this.props.amount, "\""), 
	        React.createElement("div", {className: "col-xs-2"},  this.props.date)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTk5N2I5OTczNWUyMzY1OWQzNDEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luaXQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiUmVhY3RcIiIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9MYXRlc3RSZXBvcnQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvVG9kYXlSZXBvcnQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3VwZXJhZ2VudFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIl9cIiIsIndlYnBhY2s6Ly8vLi9zcmMvc3RvcmUvTG9jYXRpb25TdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L0xvY2F0aW9uUmVwb3J0Um93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnQvTG9hZGluZ0luZGljYXRvci5yZWFjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L05hdkJhci5yZWFjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L0dyb3VwUm93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnQvRGV0YWlsUm93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL0RhdGVGb3JtYXR0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvTG9jYXRpb25IZWxwZXIuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9tZW50XCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvQW1vdW50Rm9ybWF0dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9lbnYvRW52aXJvbm1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FB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Q0FBQyxTQUFDLEdBQUcsSUFBTTthQUNiLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFDL0IsYUFBWSxZQUFZLEdBQUcsR0FBRyxDQUFDOzthQUVuQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDZCxDQUFDLENBQUM7UUFDTjtRQUNBLENBQUMsQ0FBQztJQUNOO0FBQ0gsRUFBQyxDQUFDOztBQUVGLE9BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMTk5N2I5OTczNWUyMzY1OWQzNDFcbiAqKi8iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIExhdGVzdFJlcG9ydCA9IHJlcXVpcmUoJy4vcGFnZS9MYXRlc3RSZXBvcnQucmVhY3QnKTtcbnZhciBUb2RheVJlcG9ydCA9IHJlcXVpcmUoJy4vcGFnZS9Ub2RheVJlcG9ydC5yZWFjdCcpO1xuXG5SZWFjdC5yZW5kZXIoXG4gIDxUb2RheVJlcG9ydCAvPixcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2R5bmFtaWMtY29udGVudCcpXG4pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy9pbml0LnJlYWN0LmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBSZWFjdDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiUmVhY3RcIlxuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdzdXBlcmFnZW50Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgTG9jYXRpb25TdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3JlL0xvY2F0aW9uU3RvcmUnKTtcblxudmFyIExvY2F0aW9uUmVwb3J0Um93ID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvTG9jYXRpb25SZXBvcnRSb3cucmVhY3QnKTtcbnZhciBMb2FkaW5nSW5kaWNhdG9yID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvTG9hZGluZ0luZGljYXRvci5yZWFjdCcpO1xudmFyIE5hdkJhciA9IHJlcXVpcmUoJy4vLi4vY29tcG9uZW50L05hdkJhci5yZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdMYXRlc3RSZXBvcnQnLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2NhdGlvbnM6IFtdLFxuICAgICAgbG9hZGluZzogdHJ1ZVxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIExvY2F0aW9uU3RvcmUubG9hZCgnL0ZpbmRwb3dSZXBvcnQvaW5kZXguanNvbj9zbm93UmVwb3J0VHlwZT1sYXRlc3QnKVxuICAgICAgLnRoZW4oKGxvY2F0aW9ucykgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBsb2NhdGlvbnM6IGxvY2F0aW9ucyxcbiAgICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRhYmxlID0gdGhpcy5fZ2V0VGFibGUoKTtcbiAgICB2YXIgYmxhbmtTbGF0ZSA9IHRoaXMuX2dldEJsYW5rU2xhdGUoKTtcbiAgICB2YXIgaGVhZGVyID0gdGhpcy5fZ2V0SGVhZGVyKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cInJlcG9ydC1jb250YWluZXJcIj5cblxuICAgICAgICA8TG9hZGluZ0luZGljYXRvciBsb2FkaW5nPXsgdGhpcy5zdGF0ZS5sb2FkaW5nfSAvPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1ncm91cFwiPlxuICAgICAgICAgIDxkaXYgaWQ9XCJyZXBvcnQtdGl0bGVcIiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW0gYWN0aXZlXCI+TGF0ZXN0IDI0IEhvdXIgUmVwb3J0czwvZGl2PlxuICAgICAgICAgIHsgYmxhbmtTbGF0ZSB9XG4gICAgICAgICAgeyBoZWFkZXIgfVxuICAgICAgICAgIHsgdGFibGUgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG5cbiAgX2dldFRhYmxlOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5sb2NhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGxvY2F0aW9ucyA9IHRoaXMuX2dldExvY2F0aW9ucygpO1xuICAgICAgcmV0dXJuIHsgbG9jYXRpb25zIH07XG4gICAgfVxuICB9LFxuXG4gIF9nZXRCbGFua1NsYXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmxhbmtTbGF0ZUNsYXNzTmFtZXMgPSBcIlwiO1xuICAgIHZhciBzaG93QmxhbmtTbGF0ZSA9IHRoaXMuc3RhdGUubG9jYXRpb25zLmxlbmd0aCA9PT0gMCAmJiB0aGlzLnN0YXRlLmxvYWRpbmcgPT09IGZhbHNlO1xuICAgIGlmIChzaG93QmxhbmtTbGF0ZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGJsYW5rU2xhdGVDbGFzc05hbWVzIH0+XG4gICAgICAgICAgICBObyByZXBvcnRzIHlldCBmb3IgdG9kYXkuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgX2dldEhlYWRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS1zcHk9XCJhZmZpeFwiIGRhdGEtb2Zmc2V0LXRvcD1cIjUwXCIgY2xhc3NOYW1lPVwicmVwb3J0LWNvbHVtbi1oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW0taW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy01IGNvbC1zLTdcIiBvbkNsaWNrPXt0aGlzLl9zb3J0UmVwb3J0fT5Mb2NhdGlvbjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMVwiIG9uQ2xpY2s9e3RoaXMuX3NvcnRSZXBvcnR9PjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiIG9uQ2xpY2s9e3RoaXMuX3NvcnRSZXBvcnR9PkRhdGU8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIF9nZXRMb2NhdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLm1hcCh0aGlzLnN0YXRlLmxvY2F0aW9ucywgKGxvY2F0aW9uRGF0YSwgaW5kZXgpICA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtaXRlbSBsb2NhdGlvbi1yb3dcIj5cbiAgICAgICAgICA8TG9jYXRpb25SZXBvcnRSb3dcbiAgICAgICAgICAgIGtleT17IGluZGV4IH1cbiAgICAgICAgICAgIGlkeD17IGluZGV4IH1cbiAgICAgICAgICAgIG5hbWU9eyBsb2NhdGlvbkRhdGEubG9jYXRpb24gfVxuICAgICAgICAgICAgZGF0ZT17IGxvY2F0aW9uRGF0YS5zb3VyY2VfZGF0ZSB9XG4gICAgICAgICAgICBhbW91bnQ9eyBsb2NhdGlvbkRhdGEuYW1vdW50IH1cbiAgICAgICAgICAgIHNvdXJjZT17IGxvY2F0aW9uRGF0YS5zb3VyY2VfbmFtZSB9XG4gICAgICAgICAgICBzb3VyY2VVcmw9eyBsb2NhdGlvbkRhdGEudXJsIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL3BhZ2UvTGF0ZXN0UmVwb3J0LnJlYWN0LmpzXG4gKiovIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgTG9jYXRpb25TdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3JlL0xvY2F0aW9uU3RvcmUnKTtcblxudmFyIEdyb3VwUm93ID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvR3JvdXBSb3cucmVhY3QnKTtcbnZhciBEZXRhaWxSb3cgPSByZXF1aXJlKCcuLy4uL2NvbXBvbmVudC9EZXRhaWxSb3cucmVhY3QnKTtcbnZhciBMb2FkaW5nSW5kaWNhdG9yID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvTG9hZGluZ0luZGljYXRvci5yZWFjdCcpO1xudmFyIERhdGVGb3JtYXR0ZXIgPSByZXF1aXJlKCcuLi91dGlsL0RhdGVGb3JtYXR0ZXInKTtcbnZhciBMb2NhdGlvbkhlbHBlciA9IHJlcXVpcmUoJy4uL3V0aWwvTG9jYXRpb25IZWxwZXInKTtcblxudmFyIGNvbHVtblNpemVDc3NNYXAgPSB7XG4gICdleHBhbmRlcic6ICdjb2wteHMtMScsXG4gICdkdXJhdGlvbic6ICdjb2wteHMtMicsXG4gICduYW1lJzogJ2NvbC14cy01JyxcbiAgJ2Ftb3VudCc6ICdjb2wteHMtMicsXG4gICdkYXRlJzogJ2NvbC14cy0yJ1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVG9kYXlSZXBvcnQnLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBncm91cGVkTG9jYXRpb25zOiBbXSxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBvcmRlcjoge1xuICAgICAgICBkYXRhSW5kZXg6ICdsb2NhdGlvbicsXG4gICAgICAgIGRpcmVjdGlvbjogJ2FzY2VuZGluZydcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBMb2NhdGlvblN0b3JlLmxvYWQoJy9GaW5kcG93UmVwb3J0L2luZGV4Lmpzb24/c25vd1JlcG9ydFR5cGU9dG9kYXknKVxuICAgICAgICAgICAgICAgICAudGhlbih0aGlzLl9vbkxvY2F0aW9uc0xvYWRlZCk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGFibGUgPSB0aGlzLl9nZXRUYWJsZSgpO1xuICAgIHZhciBibGFua1NsYXRlID0gdGhpcy5fZ2V0QmxhbmtTbGF0ZSgpO1xuICAgIHZhciBoZWFkZXIgPSB0aGlzLl9nZXRIZWFkZXIoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwicmVwb3J0LWNvbnRhaW5lclwiPlxuXG4gICAgICAgIDxMb2FkaW5nSW5kaWNhdG9yIGxvYWRpbmc9eyB0aGlzLnN0YXRlLmxvYWRpbmd9IC8+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwXCI+XG4gICAgICAgICAgPGRpdiBpZD1cInJlcG9ydC10aXRsZVwiIGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtaXRlbSBhY3RpdmVcIj5Ub2RheSdzIFJlcG9ydHM8L2Rpdj5cbiAgICAgICAgICB7IGJsYW5rU2xhdGUgfVxuICAgICAgICAgIHsgaGVhZGVyIH1cbiAgICAgICAgICB7IHRhYmxlIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIF9nZXRUYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZ3JvdXBlZExvY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gIHRoaXMuX2dldExvY2F0aW9ucygpO1xuICAgIH1cbiAgfSxcblxuICBfZ2V0QmxhbmtTbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJsYW5rU2xhdGVDbGFzc05hbWVzID0gXCJcIjtcbiAgICB2YXIgc2hvd0JsYW5rU2xhdGUgPSBfLmtleXModGhpcy5zdGF0ZS5ncm91cGVkTG9jYXRpb25zKS5sZW5ndGggPT09IDAgJiYgdGhpcy5zdGF0ZS5sb2FkaW5nID09PSBmYWxzZTtcbiAgICBpZiAoc2hvd0JsYW5rU2xhdGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyBibGFua1NsYXRlQ2xhc3NOYW1lcyB9PlxuICAgICAgICAgICAgTm8gcmVwb3J0cyB5ZXQgZm9yIHRvZGF5LlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIF9nZXRIZWFkZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtaXRlbS1pbmZvIGNvbHVtbi1oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbHVtblNpemVDc3NNYXAuZXhwYW5kZXIgKyAnIGV4cGFuZGVyLWNlbGwnIH0+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb2x1bW5TaXplQ3NzTWFwLm5hbWUgfT48YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuX3NvcnRSZXBvcnR9PkxvY2F0aW9uPC9hPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY29sdW1uU2l6ZUNzc01hcC5kdXJhdGlvbiB9PjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY29sdW1uU2l6ZUNzc01hcC5hbW91bnQgfT48YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuX3NvcnRSZXBvcnR9PkFtb3VudDwvYT48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbHVtblNpemVDc3NNYXAuZGF0ZSB9PlVwZGF0ZWQ8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIF9nZXRMb2NhdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnJlZHVjZSh0aGlzLnN0YXRlLmdyb3VwZWRMb2NhdGlvbnMsIChyZXN1bHQsIGdyb3VwZWRMb2NhdGlvbikgPT4ge1xuICAgICAgdmFyIGdyb3VwUm93RGF0YSA9IGdyb3VwZWRMb2NhdGlvbi5yZXBvcnRzWzBdO1xuICAgICAgdmFyIGRldGFpbFJvd3MgPSB0aGlzLl9nZXREZXRhaWxSb3dzKGdyb3VwZWRMb2NhdGlvbi5yZXBvcnRzKTtcbiAgICAgIHZhciBmb3JtYXR0ZWREYXRlID0gRGF0ZUZvcm1hdHRlci5mb3JtYXRUb2RheURhdGUoZ3JvdXBSb3dEYXRhLnNvdXJjZV9kYXRlKTtcbiAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICA8R3JvdXBSb3dcbiAgICAgICAgICBrZXk9eyBncm91cFJvd0RhdGEuUk9XX05VTSB9XG4gICAgICAgICAgaWR4PXsgZ3JvdXBSb3dEYXRhLlJPV19OVU0gfVxuICAgICAgICAgIG5hbWU9eyBncm91cFJvd0RhdGEubG9jYXRpb24gfVxuICAgICAgICAgIGRhdGU9eyBmb3JtYXR0ZWREYXRlIH1cbiAgICAgICAgICBhbW91bnQ9eyBncm91cFJvd0RhdGEuYW1vdW50IH1cbiAgICAgICAgICBzb3VyY2U9eyBncm91cFJvd0RhdGEuc291cmNlX25hbWUgfVxuICAgICAgICAgIHNvdXJjZVVybD17IGdyb3VwUm93RGF0YS51cmwgfVxuICAgICAgICA+XG4gICAgICAgICAgeyBkZXRhaWxSb3dzIH1cbiAgICAgICAgPC9Hcm91cFJvdz5cbiAgICAgICk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIFtdKTtcbiAgfSxcblxuICBfZ2V0RGV0YWlsUm93czogZnVuY3Rpb24oZGV0YWlsUm93RGF0YUFycmF5KSB7XG4gICAgdmFyIGR1cmF0aW9uO1xuICAgIHZhciBwcmV2RHVyYXRpb24gPSAwO1xuICAgIHZhciBmb3JtYXR0ZWREYXRlO1xuICAgIHJldHVybiBfLnJlZHVjZShkZXRhaWxSb3dEYXRhQXJyYXksIChyZXN1bHQsIGRldGFpbFJvd0RhdGEpID0+IHtcbiAgICAgIGR1cmF0aW9uID0gZGV0YWlsUm93RGF0YS5kdXJhdGlvbiAhPT0gcHJldkR1cmF0aW9uID8gZGV0YWlsUm93RGF0YS5kdXJhdGlvbiA6IDA7XG4gICAgICBwcmV2RHVyYXRpb24gPSBkZXRhaWxSb3dEYXRhLmR1cmF0aW9uO1xuICAgICAgZm9ybWF0dGVkRGF0ZSA9IERhdGVGb3JtYXR0ZXIuZm9ybWF0VG9kYXlEYXRlKGRldGFpbFJvd0RhdGEuc291cmNlX2RhdGUpO1xuXG5cbiAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICA8RGV0YWlsUm93XG4gICAgICAgICAga2V5PXsgZGV0YWlsUm93RGF0YS5ST1dfTlVNIH1cbiAgICAgICAgICBkYXRlPXsgZm9ybWF0dGVkRGF0ZSB9XG4gICAgICAgICAgZHVyYXRpb249eyBkdXJhdGlvbiB9XG4gICAgICAgICAgYW1vdW50PXsgZGV0YWlsUm93RGF0YS5hbW91bnQgfVxuICAgICAgICAgIHNvdXJjZT17IGRldGFpbFJvd0RhdGEuc291cmNlX25hbWUgfVxuICAgICAgICAgIHNvdXJjZVVybD17IGRldGFpbFJvd0RhdGEudXJsIH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIFtdKTtcbiAgfSxcblxuICBfb25Mb2NhdGlvbnNMb2FkZWQ6IGZ1bmN0aW9uKGxvY2F0aW9ucykge1xuICAgIHZhciBncm91cGVkTG9jYXRpb25zID0gTG9jYXRpb25IZWxwZXIubWFwKGxvY2F0aW9ucyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBncm91cGVkTG9jYXRpb25zOiBncm91cGVkTG9jYXRpb25zLFxuICAgICAgbG9hZGluZzogZmFsc2VcbiAgICB9KTtcbiAgfSxcblxuICBfc29ydFJlcG9ydDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgZGlyZWN0aW9uLCBkYXRhSW5kZXg7XG4gICAgaWYgKGV2ZW50LnRhcmdldC50ZXh0Q29udGVudCA9PT0gJ0Ftb3VudCcpIHtcbiAgICAgIGRhdGFJbmRleCA9ICdhbW91bnQnO1xuICAgICAgZGlyZWN0aW9uID0gJ2Rlc2NlbmRpbmcnO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0LnRleHRDb250ZW50ID09PSAnTG9jYXRpb24nKSB7XG4gICAgICBkYXRhSW5kZXggPSAnbG9jYXRpb24nO1xuICAgICAgZGlyZWN0aW9uID0gJ2FzY2VuZGluZyc7XG4gICAgfVxuICAgIHZhciBncm91cGVkTG9jYXRpb25zID0gTG9jYXRpb25IZWxwZXIub3JkZXJCeShkYXRhSW5kZXgsIHRoaXMuc3RhdGUuZ3JvdXBlZExvY2F0aW9ucywgZGlyZWN0aW9uKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZ3JvdXBlZExvY2F0aW9uczogZ3JvdXBlZExvY2F0aW9ucyxcbiAgICAgIG9yZGVyOiB7XG4gICAgICAgIGRhdGFJbmRleDogZGF0YUluZGV4LFxuICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvblxuICAgICAgfVxuICAgIH0pO1xuXG4gIH1cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL3BhZ2UvVG9kYXlSZXBvcnQucmVhY3QuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHN1cGVyYWdlbnQ7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInN1cGVyYWdlbnRcIlxuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiX1wiXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHJlcXVlc3QgPSByZXF1aXJlKCdzdXBlcmFnZW50Jyk7XG52YXIgRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuLi9lbnYvRW52aXJvbm1lbnQnKTtcblxudmFyIExvY2F0aW9uU3RvcmUgPSB7XG4gIGxvYWQ6IGZ1bmN0aW9uKHVybCkge1xuICAgIHJldHVybiBFbnZpcm9ubWVudC5nZXRTZXJ2ZXJDb25maWcoKS50aGVuKChTZXJ2ZXJDb25maWcpPT4ge1xuICAgICAgdmFyIHNlcnZlclJvb3QgPSBTZXJ2ZXJDb25maWcuVE9NQ0FUX1VSTDtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlcXVlc3RcbiAgICAgICAgICAuZ2V0KHNlcnZlclJvb3QgKyB1cmwpXG4gICAgICAgICAgLmVuZCgocmVzKSA9PiB7XG4gICAgICAgICAgICB2YXIgcmVwb3J0ID0gSlNPTi5wYXJzZShyZXMudGV4dCkucmVwb3J0O1xuICAgICAgICAgICAgcmVzb2x2ZShyZXBvcnQubG9jYXRpb25zKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH0sXG5cbiAgbG9hZFRlc3REYXRhOiBmdW5jdGlvbih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVzb2x2ZShbXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogMSxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiQXJhcGFob2UgQmFzaW5cIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMC8yNS8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiAyNCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL2FyYXBhaG9lYmFzaW4uY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJjb2xvcmFkb3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuY29sb3JhZG9za2kuY29tL1Nub3dSZXBvcnQvXCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMyxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwNTo1NSBBTSBNRFRcIixcbiAgICAgICAgICBcInNvdXJjZV9zZXFcIjogXCJNXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiAyLFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJBcmFwYWhvZSBCYXNpblwiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzI1LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vYXJhcGFob2ViYXNpbi5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImFyYXBhaG9lYmFzaW4uY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmFyYXBhaG9lYmFzaW4uY29tL0FCYXNpbi9zbm93LWNvbmRpdGlvbnMvZGVmYXVsdC5hc3B4XCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMyxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwNTozNiBBTSBNRFRcIixcbiAgICAgICAgICBcInNvdXJjZV9zZXFcIjogXCJNXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiAzLFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJBcmFwYWhvZSBCYXNpblwiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzI1LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDQ4LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vYXJhcGFob2ViYXNpbi5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImNvbG9yYWRvc2tpLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5jb2xvcmFkb3NraS5jb20vU25vd1JlcG9ydC9cIixcbiAgICAgICAgICBcImFtb3VudFwiOiA1LFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA1OjU1IEFNIE1EVFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNCxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiQXJhcGFob2UgQmFzaW5cIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMC8yNS8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiA3MixcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL2FyYXBhaG9lYmFzaW4uY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJhcmFwYWhvZWJhc2luLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5hcmFwYWhvZWJhc2luLmNvbS9BQmFzaW4vc25vdy1jb25kaXRpb25zL2RlZmF1bHQuYXNweFwiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDcsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDU6MzYgQU0gTURUXCJcbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDcsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkJlYXZlciBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjExLzI0LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd3d3LnNub3cuY29tL2Rpc2NvdmVyb3VycmVzb3J0cy9iZWF2ZXJjcmVlay9sYW5kaW5nLmFzcHhcIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwic25vdy5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuc25vdy5jb20vbW91bnRhaW5jb25kaXRpb25zL3Nub3dhbmR3ZWF0aGVycmVwb3J0cy5hc3B4XCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMSxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwNDowNiBQTSBNRFRcIixcbiAgICAgICAgICBcInNvdXJjZV9zZXFcIjogXCJNXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA4LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJCZWF2ZXIgQ3JlZWtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMS8yNC8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiA0OCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3d3dy5zbm93LmNvbS9kaXNjb3Zlcm91cnJlc29ydHMvYmVhdmVyY3JlZWsvbGFuZGluZy5hc3B4XCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcInNub3cuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LnNub3cuY29tL21vdW50YWluY29uZGl0aW9ucy9zbm93YW5kd2VhdGhlcnJlcG9ydHMuYXNweFwiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDEsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDQ6MDYgUE0gTURUXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA5LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJCZWF2ZXIgQ3JlZWtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMS8yNC8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiAxNjgsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly93d3cuc25vdy5jb20vZGlzY292ZXJvdXJyZXNvcnRzL2JlYXZlcmNyZWVrL2xhbmRpbmcuYXNweFwiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJzbm93LmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5zbm93LmNvbS9tb3VudGFpbmNvbmRpdGlvbnMvc25vd2FuZHdlYXRoZXJyZXBvcnRzLmFzcHhcIixcbiAgICAgICAgICBcImFtb3VudFwiOiAzLFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA0OjA2IFBNIE1EVFwiXG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA0MyxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiV2ludGVyIFBhcmtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMS8xNy8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiAyNCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3d3dy53aW50ZXJwYXJrcmVzb3J0LmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwiY29sb3JhZG9za2kuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmNvbG9yYWRvc2tpLmNvbS9Tbm93UmVwb3J0L1wiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDEwLFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDAxOjE2IFBNIE1EVFwiLFxuICAgICAgICAgIFwic291cmNlX3NlcVwiOiBcIk1cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDQ0LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJXaW50ZXIgUGFya1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjExLzE3LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDQ4LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd3d3LndpbnRlcnBhcmtyZXNvcnQuY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJjb2xvcmFkb3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuY29sb3JhZG9za2kuY29tL1Nub3dSZXBvcnQvXCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMjQsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDE6MTYgUE0gTURUXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA0NSxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiV29sZiBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzMwLzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd29sZmNyZWVrc2tpLmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwiY29sb3JhZG9za2kuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmNvbG9yYWRvc2tpLmNvbS9Tbm93UmVwb3J0L1wiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDgsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDk6NTUgQU0gTURUXCIsXG4gICAgICAgICAgXCJzb3VyY2Vfc2VxXCI6IFwiTVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNDYsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIldvbGYgQ3JlZWtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMC8zMC8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiAyNCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3dvbGZjcmVla3NraS5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcIndvbGZjcmVla3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cud29sZmNyZWVrc2tpLmNvbS9zbm93LmFzcFwiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDgsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDk6NTMgQU0gTURUXCIsXG4gICAgICAgICAgXCJzb3VyY2Vfc2VxXCI6IFwiTVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNDcsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIldvbGYgQ3JlZWtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMC8zMC8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiA0OCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3dvbGZjcmVla3NraS5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImNvbG9yYWRvc2tpLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5jb2xvcmFkb3NraS5jb20vU25vd1JlcG9ydC9cIixcbiAgICAgICAgICBcImFtb3VudFwiOiAyNCxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwOTo1NSBBTSBNRFRcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDQ4LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJXb2xmIENyZWVrXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTAvMzAvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogNDgsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly93b2xmY3JlZWtza2kuY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJ3b2xmY3JlZWtza2kuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LndvbGZjcmVla3NraS5jb20vc25vdy5hc3BcIixcbiAgICAgICAgICBcImFtb3VudFwiOiAyNCxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwOTo1MyBBTSBNRFRcIlxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2NhdGlvblN0b3JlO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy9zdG9yZS9Mb2NhdGlvblN0b3JlLmpzXG4gKiovIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgRGF0ZUZvcm1hdHRlciA9IHJlcXVpcmUoJy4uL3V0aWwvRGF0ZUZvcm1hdHRlcicpO1xudmFyIEFtb3VudEZvcm1hdHRlciA9IHJlcXVpcmUoJy4uL3V0aWwvQW1vdW50Rm9ybWF0dGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIHByb3BUeXBlczoge1xuICAgIGlkeDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGRhdGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgYW1vdW50OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIHNvdXJjZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzb3VyY2VVcmw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb2xsYXBzZUlkID0gIHRoaXMucHJvcHMuaWR4ICsgXCJDb2xsYXBzZVwiO1xuICAgIHZhciBocmVmID0gXCIjXCIgKyBjb2xsYXBzZUlkO1xuICAgIHZhciBhbHRUZXh0ID0gdGhpcy5wcm9wcy5uYW1lICsgXCIgcmVwb3J0IGRldGFpbHNcIjtcbiAgICB2YXIgZm9ybWF0dGVkRGF0ZSA9IERhdGVGb3JtYXR0ZXIuZm9ybWF0RGF0ZVN0cmluZyh0aGlzLnByb3BzLmRhdGUpO1xuICAgIHZhciBhbW91bnRDYXRlZ29yeSA9IEFtb3VudEZvcm1hdHRlci5nZXRBbW91bnRDYXRlZ29yeSh0aGlzLnByb3BzLmFtb3VudCwgMjQpO1xuICAgIHZhciBhbW91bnRDbGFzc2VzID0gXCJjb2wteHMtMSBhbW91bnQtXCIgKyBhbW91bnRDYXRlZ29yeTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInBhbmVsLXRpdGxlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xXCI+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiY29sbGFwc2VkXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGhyZWY9eyBocmVmIH0gIHRpdGxlPXsgYWx0VGV4dCB9IGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGFyaWEtY29udHJvbHM9eyBjb2xsYXBzZUlkIH0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tZG93blwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy01IGNvbC1zLTdcIj57IHRoaXMucHJvcHMubmFtZSB9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgYW1vdW50Q2xhc3NlcyB9PnsgdGhpcy5wcm9wcy5hbW91bnQgfVwiPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTQgcmVwb3J0LWRhdGVcIj57IGZvcm1hdHRlZERhdGUgfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9oMz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sbGFwc2VcIiBpZD17IGNvbGxhcHNlSWQgfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTFcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPGEgaHJlZj17IHRoaXMucHJvcHMuc291cmNlVXJsIH0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNSBjb2wtcy03XCI+eyB0aGlzLnByb3BzLnNvdXJjZSB9PC9kaXY+XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMVwiPnsgdGhpcy5wcm9wcy5hbW91bnQgfVwiPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTRcIj57IGZvcm1hdHRlZERhdGUgfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL2NvbXBvbmVudC9Mb2NhdGlvblJlcG9ydFJvdy5yZWFjdC5qc1xuICoqLyIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdMb2FkaW5nSW5kaWNhdG9yJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgbG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1pbmZvXCI7XG4gICAgaWYgKHRoaXMucHJvcHMubG9hZGluZyAhPT0gdHJ1ZSkge1xuICAgICAgY2xhc3NOYW1lICs9IFwiIGhpZGRlblwiO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cImxvYWRpbmdJbmRpY2F0b3JcIiBjbGFzc05hbWU9eyBjbGFzc05hbWUgfSByb2xlPVwiYWxlcnRcIj5Mb2FkaW5nLi4uPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG4vL2NsYXNzPVwiYWxlcnQgYWxlcnQtaW5mb1wiIHJvbGU9XCJhbGVydFwiXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL2NvbXBvbmVudC9Mb2FkaW5nSW5kaWNhdG9yLnJlYWN0LmpzXG4gKiovIiwidmFyIFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bmF2IGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItZml4ZWQtdG9wIGNlbnRlci1ibG9ja1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lci1mbHVpZFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+TGF0ZXN0IDI0IEhvdXIgUmVwb3J0czwvaDQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9uYXY+XG4gICAgKTtcbiAgfSxcblxuICBfc29ydFJlcG9ydDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBhbGVydCgnU29ydGluZyEnKTtcbiAgICBjb25zb2xlLmxvZygnVE9ETzogc29ydCcsIGV2ZW50KTtcbiAgfVxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL2NvbXBvbmVudC9OYXZCYXIucmVhY3QuanNcbiAqKi8iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBBbW91bnRGb3JtYXR0ZXIgPSByZXF1aXJlKCcuLi91dGlsL0Ftb3VudEZvcm1hdHRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBnbHlwaGljb246ICdnbHlwaGljb24tY2hldnJvbi1yaWdodCdcbiAgICB9O1xuICB9LFxuXG4gIHByb3BUeXBlczoge1xuICAgIGlkeDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGRhdGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgYW1vdW50OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIHNvdXJjZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzb3VyY2VVcmw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb2xsYXBzZUlkID0gdGhpcy5wcm9wcy5pZHggKyBcIkNvbGxhcHNlXCI7XG4gICAgdmFyIGhyZWYgPSBcIiNcIiArIGNvbGxhcHNlSWQ7XG4gICAgdmFyIGFsdFRleHQgPSB0aGlzLnByb3BzLm5hbWUgKyBcIiByZXBvcnQgZGV0YWlsc1wiO1xuICAgIHZhciBhbW91bnRDYXRlZ29yeSA9IEFtb3VudEZvcm1hdHRlci5nZXRBbW91bnRDYXRlZ29yeSh0aGlzLnByb3BzLmFtb3VudCwgMjQpO1xuICAgIHZhciBhbW91bnRDbGFzc2VzID0gXCJjb2wteHMtMiBhbW91bnQtXCIgKyBhbW91bnRDYXRlZ29yeTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInBhbmVsLXRpdGxlXCI+XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJleHBhbmRlci1saW5rIGNvbGxhcHNlZFwiXG4gICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIlxuICAgICAgICAgICAgICBocmVmPXsgaHJlZiB9XG4gICAgICAgICAgICAgIHRpdGxlPXsgYWx0VGV4dCB9XG4gICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiXG4gICAgICAgICAgICAgIGFyaWEtY29udHJvbHM9eyBjb2xsYXBzZUlkIH1cbiAgICAgICAgICAgICAgb25DbGljaz17IHRoaXMuX29uRXhwYW5kIH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xIGV4cGFuZGVyLWNlbGxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17ICdnbHlwaGljb24gJyArIHRoaXMuc3RhdGUuZ2x5cGhpY29uIH0+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTUgbmFtZVwiPnsgdGhpcy5wcm9wcy5uYW1lIH08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0yIGR1cmF0aW9uXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyBhbW91bnRDbGFzc2VzIH0+eyB0aGlzLnByb3BzLmFtb3VudCB9XCI8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0yIHJlcG9ydC1kYXRlXCI+eyB0aGlzLnByb3BzLmRhdGUgfTwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L2gzPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZVwiIGlkPXsgY29sbGFwc2VJZCB9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgeyB0aGlzLnByb3BzLmNoaWxkcmVuIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIF9vbkV4cGFuZDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZ2x5cGhpY29uID09PSAnZ2x5cGhpY29uLWNoZXZyb24tcmlnaHQnKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZ2x5cGhpY29uOiAnZ2x5cGhpY29uLWNoZXZyb24tZG93bidcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZ2x5cGhpY29uOiAnZ2x5cGhpY29uLWNoZXZyb24tcmlnaHQnXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvY29tcG9uZW50L0dyb3VwUm93LnJlYWN0LmpzXG4gKiovIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgZGF0ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkdXJhdGlvbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBhbW91bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgc291cmNlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNvdXJjZVVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGR1cmF0aW9uID0gdGhpcy5fZm9ybWF0RHVyYXRpb24oKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMSBleHBhbmRlci1jZWxsXCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNSBuYW1lXCI+XG4gICAgICAgICAgICA8YSBocmVmPXsgdGhpcy5wcm9wcy5zb3VyY2VVcmwgfT5cbiAgICAgICAgICAgICAgeyB0aGlzLnByb3BzLnNvdXJjZSB9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTIgZHVyYXRpb25cIj57IGR1cmF0aW9uIH08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMlwiPnsgdGhpcy5wcm9wcy5hbW91bnQgfVwiPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTJcIj57IHRoaXMucHJvcHMuZGF0ZSB9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIF9mb3JtYXREdXJhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgc3dpdGNoICh0aGlzLnByb3BzLmR1cmF0aW9uKSB7XG4gICAgICBjYXNlICgwKTpcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgY2FzZSAoMjQpOlxuICAgICAgY2FzZSAoNDgpOlxuICAgICAgY2FzZSAoNzIpOlxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5kdXJhdGlvbiArICdocic7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMuZHVyYXRpb24gLyAyNCkgKyAnIGRheXMnO1xuICAgIH1cbiAgfVxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL2NvbXBvbmVudC9EZXRhaWxSb3cucmVhY3QuanNcbiAqKi8iLCJ2YXIgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBmb3JtYXREYXRlU3RyaW5nOiBmdW5jdGlvbihkYXRlU3RyaW5nKSB7XG4gICAgdmFyIGRhdGUgPSBtb21lbnQobmV3IERhdGUoZGF0ZVN0cmluZykpO1xuICAgIHJldHVybiBkYXRlLmNhbGVuZGFyKCk7XG4gIH0sXG5cbiAgZm9ybWF0VG9kYXlEYXRlOiBmdW5jdGlvbihkYXRlU3RyaW5nKSB7XG4gICAgdmFyIGRhdGUgPSBtb21lbnQobmV3IERhdGUoZGF0ZVN0cmluZykpO1xuICAgIHJldHVybiBkYXRlLmZvcm1hdCgnaDptbSBBJyk7XG4gIH1cbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL3V0aWwvRGF0ZUZvcm1hdHRlci5qc1xuICoqLyIsInZhciBMb2NhdGlvbkhlbHBlciA9IHtcbiAgb3JkZXJCeTogZnVuY3Rpb24oZGF0YUluZGV4LCBncm91cGVkTG9jYXRpb25zLCBvcmRlcikge1xuICAgIHZhciBvcmRlckluZGV4ZXMgPSBfLnVuaW9uKFtkYXRhSW5kZXhdLCBfLmtleXMoZ3JvdXBlZExvY2F0aW9uc1swXSkpO1xuICAgIHZhciBzb3J0ZWQgPSBfLnNvcnRCeUFsbChncm91cGVkTG9jYXRpb25zLCBvcmRlckluZGV4ZXMpO1xuXG4gICAgaWYgKG9yZGVyID09PSAnZGVzY2VuZGluZycpIHtcbiAgICAgIHNvcnRlZCA9IHNvcnRlZC5yZXZlcnNlKCk7XG4gICAgfVxuICAgIHJldHVybiBzb3J0ZWQ7XG4gIH0sXG5cbiAgbWFwOiBmdW5jdGlvbihsb2NhdGlvbkFycmF5KSB7XG4gICAgcmV0dXJuIF8ucmVkdWNlKGxvY2F0aW9uQXJyYXksIChyZXN1bHQsIGxvY2F0aW9uRGF0YSkgPT4ge1xuICAgICAgdmFyIGdyb3VwZWRSZXBvcnRzID0gXy5maW5kKHJlc3VsdCwgeyAnbG9jYXRpb24nIDogbG9jYXRpb25EYXRhLmxvY2F0aW9uIH0pO1xuICAgICAgaWYgKCFncm91cGVkUmVwb3J0cykge1xuICAgICAgICBncm91cGVkUmVwb3J0cyA9IHtcbiAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb25EYXRhLmxvY2F0aW9uLFxuICAgICAgICAgIGFtb3VudDogbG9jYXRpb25EYXRhLmFtb3VudCxcbiAgICAgICAgICByZXBvcnRzOiBbXVxuICAgICAgICB9O1xuICAgICAgICByZXN1bHQucHVzaChncm91cGVkUmVwb3J0cyk7XG4gICAgICB9XG4gICAgICBncm91cGVkUmVwb3J0cy5yZXBvcnRzLnB1c2gobG9jYXRpb25EYXRhKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCBbXSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTG9jYXRpb25IZWxwZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL3V0aWwvTG9jYXRpb25IZWxwZXIuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IG1vbWVudDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwibW9tZW50XCJcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEFtb3VudENhdGVnb3J5OiBmdW5jdGlvbihhbW91bnQsIGR1cmF0aW9uKSB7XG4gICAgdmFyIGRpdmlzb3IsIHRpbWVBZGp1c3RlZEFtb3VudDtcblxuICAgIGlmICghYW1vdW50IHx8ICFkdXJhdGlvbiB8fCBhbW91bnQgPT09IDApIHtcbiAgICAgIHJldHVybiBcIm5vbmVcIjtcbiAgICB9XG5cbiAgICBkaXZpc29yID0gZHVyYXRpb24vMjQ7XG4gICAgdGltZUFkanVzdGVkQW1vdW50ID0gYW1vdW50L2Rpdmlzb3I7XG5cbiAgICBpZiAodGltZUFkanVzdGVkQW1vdW50IDwgNikge1xuICAgICAgcmV0dXJuIFwic21hbGxcIjtcbiAgICB9XG4gICAgaWYgKHRpbWVBZGp1c3RlZEFtb3VudCA+PSA2ICYmIHRpbWVBZGp1c3RlZEFtb3VudCA8IDEyKSB7XG4gICAgICByZXR1cm4gXCJtZWRpdW1cIjtcbiAgICB9XG4gICAgaWYgKHRpbWVBZGp1c3RlZEFtb3VudCA+PSAxMiAmJiB0aW1lQWRqdXN0ZWRBbW91bnQgPCAxOCkge1xuICAgICAgcmV0dXJuIFwibGFyZ2VcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwieGxhcmdlXCI7XG4gIH1cbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL3V0aWwvQW1vdW50Rm9ybWF0dGVyLmpzXG4gKiovIiwidmFyIHJlcXVlc3QgPSByZXF1aXJlKCdzdXBlcmFnZW50Jyk7XG5cbnZhciBzZXJ2ZXJDb25maWc7XG5cbnZhciBFbnZpcm9ubWVudCA9IHtcbiAgZ2V0U2VydmVyQ29uZmlnOiBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoc2VydmVyQ29uZmlnKSB7XG4gICAgICAgIHJlc29sdmUoc2VydmVyQ29uZmlnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3RcbiAgICAgICAgICAuZ2V0KCcvZW52aXJvbm1lbnQuanMnKVxuICAgICAgICAgIC5lbmQoKHJlcykgPT4ge1xuICAgICAgICAgICAgdmFyIGVudiA9IHJlcy5ib2R5O1xuICAgICAgICAgICAgc2VydmVyQ29uZmlnID0gZW52O1xuXG4gICAgICAgICAgICByZXNvbHZlKGVudik7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB9KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbnZpcm9ubWVudDtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvZW52L0Vudmlyb25tZW50LmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoid2VicGFja19idW5kbGUuanMifQ==