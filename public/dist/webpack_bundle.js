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
	      expandAll: false,
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
	    var glyphiconDirection = 'glyphicon-chevron-right';
	    if (this.state.expandAll === true) {
	      glyphiconDirection = 'glyphicon-chevron-down';
	    }
	    return (
	      React.createElement("div", {className: "list-group-item-info column-header"}, 
	        React.createElement("div", {className: "row"}, 
	          React.createElement("div", {className:  columnSizeCssMap.expander + ' expander-cell'}, 
	            React.createElement("a", {href: "#", onClick:  this._onExpandAll}, React.createElement("span", {className:  'glyphicon ' + glyphiconDirection}))
	          ), 
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
	          sourceUrl:  groupRowData.url, 
	          initExpanded:  this.state.expandAll
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
	  },
	
	  _onExpandAll: function() {
	      this.setState({
	        expandAll: !this.state.expandAll
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
	      expanded: this.props.initExpanded
	    };
	  },
	
	  componentWillReceiveProps: function(newProps) {
	    this.setState({
	      expanded: newProps.initExpanded
	    });
	  },
	
	  propTypes: {
	    idx: React.PropTypes.number,
	    name: React.PropTypes.string,
	    date: React.PropTypes.string,
	    amount: React.PropTypes.number,
	    source: React.PropTypes.string,
	    sourceUrl: React.PropTypes.string,
	    initExpanded: React.PropTypes.bool
	  },
	
	  render: function() {
	    var collapseId = this.props.idx + "Collapse";
	    var href = "#" + collapseId;
	    var altText = this.props.name + " report details";
	    var amountCategory = AmountFormatter.getAmountCategory(this.props.amount, 24);
	    var amountClasses = "col-xs-2 amount-" + amountCategory;
	    var linkCollapseCls = this.state.expanded ? '' : 'collapsed';
	    var collapsedContentCls = this.state.expanded ? 'collapse in' : 'collapse';
	    var glyphicon = this.state.expanded ? 'glyphicon-chevron-down' : 'glyphicon-chevron-right';
	    var ariaExpanded = this.state.expanded.toString();
	    //fixes an apparent bug in bootstrap collapse that doesn't remove height of 0 if collapsed manually and then dom is updated
	    var collapsedStyle = {
	      height: this.state.expanded ? 'inherit' : '0'
	    };
	
	    return (
	      React.createElement("div", {className: "panel panel-default"}, 
	        React.createElement("div", {className: "panel-heading"}, 
	          React.createElement("h3", {className: "panel-title"}, 
	            React.createElement("a", {className: 'expander-link ' + linkCollapseCls, 
	              "data-toggle": "collapse", 
	              href: href, 
	              title: altText, 
	              "aria-expanded": ariaExpanded, 
	              "aria-controls": collapseId, 
	              onClick:  this._onExpand
	            }, 
	              React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-xs-1 expander-cell"}, 
	                  React.createElement("span", {className:  'glyphicon ' + glyphicon})
	                ), 
	                React.createElement("div", {className: "col-xs-5 name"},  this.props.name), 
	                React.createElement("div", {className: "col-xs-2 duration"}), 
	                React.createElement("div", {className: amountClasses },  this.props.amount, "\""), 
	                React.createElement("div", {className: "col-xs-2 report-date"},  this.props.date)
	              )
	            )
	          )
	        ), 
	        React.createElement("div", {className: collapsedContentCls, id: collapseId, "aria-expanded": ariaExpanded, style: collapsedStyle }, 
	          React.createElement("div", {className: "panel-body"}, 
	             this.props.children
	          )
	        )
	      )
	    );
	  },
	
	  _onExpand: function() {
	    this.setState({
	      expanded: !this.state.expanded
	    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDg0NjgyZjNlYTlkNmJjM2QyYWIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luaXQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiUmVhY3RcIiIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9MYXRlc3RSZXBvcnQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvVG9kYXlSZXBvcnQucmVhY3QuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3VwZXJhZ2VudFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIl9cIiIsIndlYnBhY2s6Ly8vLi9zcmMvc3RvcmUvTG9jYXRpb25TdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L0xvY2F0aW9uUmVwb3J0Um93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnQvTG9hZGluZ0luZGljYXRvci5yZWFjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L05hdkJhci5yZWFjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L0dyb3VwUm93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnQvRGV0YWlsUm93LnJlYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL0RhdGVGb3JtYXR0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvTG9jYXRpb25IZWxwZXIuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9tZW50XCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvQW1vdW50Rm9ybWF0dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9lbnYvRW52aXJvbm1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FB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Q0FBQyxpQkFBaUIsQ0FBQztZQUN0QixHQUFHLENBQUMsU0FBQyxHQUFHLElBQU07YUFDYixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0FBQy9CLGFBQVksWUFBWSxHQUFHLEdBQUcsQ0FBQzs7YUFFbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsQ0FBQyxDQUFDO1FBQ047UUFDQSxDQUFDLENBQUM7SUFDTjtBQUNILEVBQUMsQ0FBQzs7QUFFRixPQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDQ4NDY4MmYzZWE5ZDZiYzNkMmFiXG4gKiovIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBMYXRlc3RSZXBvcnQgPSByZXF1aXJlKCcuL3BhZ2UvTGF0ZXN0UmVwb3J0LnJlYWN0Jyk7XG52YXIgVG9kYXlSZXBvcnQgPSByZXF1aXJlKCcuL3BhZ2UvVG9kYXlSZXBvcnQucmVhY3QnKTtcblxuUmVhY3QucmVuZGVyKFxuICA8VG9kYXlSZXBvcnQgLz4sXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkeW5hbWljLWNvbnRlbnQnKVxuKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvaW5pdC5yZWFjdC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gUmVhY3Q7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIlJlYWN0XCJcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgnc3VwZXJhZ2VudCcpO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIExvY2F0aW9uU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZS9Mb2NhdGlvblN0b3JlJyk7XG5cbnZhciBMb2NhdGlvblJlcG9ydFJvdyA9IHJlcXVpcmUoJy4vLi4vY29tcG9uZW50L0xvY2F0aW9uUmVwb3J0Um93LnJlYWN0Jyk7XG52YXIgTG9hZGluZ0luZGljYXRvciA9IHJlcXVpcmUoJy4vLi4vY29tcG9uZW50L0xvYWRpbmdJbmRpY2F0b3IucmVhY3QnKTtcbnZhciBOYXZCYXIgPSByZXF1aXJlKCcuLy4uL2NvbXBvbmVudC9OYXZCYXIucmVhY3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTGF0ZXN0UmVwb3J0JyxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9jYXRpb25zOiBbXSxcbiAgICAgIGxvYWRpbmc6IHRydWVcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBMb2NhdGlvblN0b3JlLmxvYWQoJy9GaW5kcG93UmVwb3J0L2luZGV4Lmpzb24/c25vd1JlcG9ydFR5cGU9bGF0ZXN0JylcbiAgICAgIC50aGVuKChsb2NhdGlvbnMpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnMsXG4gICAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0YWJsZSA9IHRoaXMuX2dldFRhYmxlKCk7XG4gICAgdmFyIGJsYW5rU2xhdGUgPSB0aGlzLl9nZXRCbGFua1NsYXRlKCk7XG4gICAgdmFyIGhlYWRlciA9IHRoaXMuX2dldEhlYWRlcigpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9XCJyZXBvcnQtY29udGFpbmVyXCI+XG5cbiAgICAgICAgPExvYWRpbmdJbmRpY2F0b3IgbG9hZGluZz17IHRoaXMuc3RhdGUubG9hZGluZ30gLz5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtZ3JvdXBcIj5cbiAgICAgICAgICA8ZGl2IGlkPVwicmVwb3J0LXRpdGxlXCIgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtIGFjdGl2ZVwiPkxhdGVzdCAyNCBIb3VyIFJlcG9ydHM8L2Rpdj5cbiAgICAgICAgICB7IGJsYW5rU2xhdGUgfVxuICAgICAgICAgIHsgaGVhZGVyIH1cbiAgICAgICAgICB7IHRhYmxlIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIF9nZXRUYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubG9jYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBsb2NhdGlvbnMgPSB0aGlzLl9nZXRMb2NhdGlvbnMoKTtcbiAgICAgIHJldHVybiB7IGxvY2F0aW9ucyB9O1xuICAgIH1cbiAgfSxcblxuICBfZ2V0QmxhbmtTbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJsYW5rU2xhdGVDbGFzc05hbWVzID0gXCJcIjtcbiAgICB2YXIgc2hvd0JsYW5rU2xhdGUgPSB0aGlzLnN0YXRlLmxvY2F0aW9ucy5sZW5ndGggPT09IDAgJiYgdGhpcy5zdGF0ZS5sb2FkaW5nID09PSBmYWxzZTtcbiAgICBpZiAoc2hvd0JsYW5rU2xhdGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyBibGFua1NsYXRlQ2xhc3NOYW1lcyB9PlxuICAgICAgICAgICAgTm8gcmVwb3J0cyB5ZXQgZm9yIHRvZGF5LlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIF9nZXRIZWFkZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtc3B5PVwiYWZmaXhcIiBkYXRhLW9mZnNldC10b3A9XCI1MFwiIGNsYXNzTmFtZT1cInJlcG9ydC1jb2x1bW4taGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtLWluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMVwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNSBjb2wtcy03XCIgb25DbGljaz17dGhpcy5fc29ydFJlcG9ydH0+TG9jYXRpb248L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTFcIiBvbkNsaWNrPXt0aGlzLl9zb3J0UmVwb3J0fT48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTRcIiBvbkNsaWNrPXt0aGlzLl9zb3J0UmVwb3J0fT5EYXRlPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcblxuICBfZ2V0TG9jYXRpb25zOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy5tYXAodGhpcy5zdGF0ZS5sb2NhdGlvbnMsIChsb2NhdGlvbkRhdGEsIGluZGV4KSAgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW0gbG9jYXRpb24tcm93XCI+XG4gICAgICAgICAgPExvY2F0aW9uUmVwb3J0Um93XG4gICAgICAgICAgICBrZXk9eyBpbmRleCB9XG4gICAgICAgICAgICBpZHg9eyBpbmRleCB9XG4gICAgICAgICAgICBuYW1lPXsgbG9jYXRpb25EYXRhLmxvY2F0aW9uIH1cbiAgICAgICAgICAgIGRhdGU9eyBsb2NhdGlvbkRhdGEuc291cmNlX2RhdGUgfVxuICAgICAgICAgICAgYW1vdW50PXsgbG9jYXRpb25EYXRhLmFtb3VudCB9XG4gICAgICAgICAgICBzb3VyY2U9eyBsb2NhdGlvbkRhdGEuc291cmNlX25hbWUgfVxuICAgICAgICAgICAgc291cmNlVXJsPXsgbG9jYXRpb25EYXRhLnVybCB9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0pO1xuICB9XG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy9wYWdlL0xhdGVzdFJlcG9ydC5yZWFjdC5qc1xuICoqLyIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIExvY2F0aW9uU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZS9Mb2NhdGlvblN0b3JlJyk7XG5cbnZhciBHcm91cFJvdyA9IHJlcXVpcmUoJy4vLi4vY29tcG9uZW50L0dyb3VwUm93LnJlYWN0Jyk7XG52YXIgRGV0YWlsUm93ID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvRGV0YWlsUm93LnJlYWN0Jyk7XG52YXIgTG9hZGluZ0luZGljYXRvciA9IHJlcXVpcmUoJy4vLi4vY29tcG9uZW50L0xvYWRpbmdJbmRpY2F0b3IucmVhY3QnKTtcbnZhciBEYXRlRm9ybWF0dGVyID0gcmVxdWlyZSgnLi4vdXRpbC9EYXRlRm9ybWF0dGVyJyk7XG52YXIgTG9jYXRpb25IZWxwZXIgPSByZXF1aXJlKCcuLi91dGlsL0xvY2F0aW9uSGVscGVyJyk7XG5cbnZhciBjb2x1bW5TaXplQ3NzTWFwID0ge1xuICAnZXhwYW5kZXInOiAnY29sLXhzLTEnLFxuICAnZHVyYXRpb24nOiAnY29sLXhzLTInLFxuICAnbmFtZSc6ICdjb2wteHMtNScsXG4gICdhbW91bnQnOiAnY29sLXhzLTInLFxuICAnZGF0ZSc6ICdjb2wteHMtMidcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1RvZGF5UmVwb3J0JyxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXhwYW5kQWxsOiBmYWxzZSxcbiAgICAgIGdyb3VwZWRMb2NhdGlvbnM6IFtdLFxuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIG9yZGVyOiB7XG4gICAgICAgIGRhdGFJbmRleDogJ2xvY2F0aW9uJyxcbiAgICAgICAgZGlyZWN0aW9uOiAnYXNjZW5kaW5nJ1xuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIExvY2F0aW9uU3RvcmUubG9hZCgnL0ZpbmRwb3dSZXBvcnQvaW5kZXguanNvbj9zbm93UmVwb3J0VHlwZT10b2RheScpXG4gICAgICAgICAgICAgICAgIC50aGVuKHRoaXMuX29uTG9jYXRpb25zTG9hZGVkKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0YWJsZSA9IHRoaXMuX2dldFRhYmxlKCk7XG4gICAgdmFyIGJsYW5rU2xhdGUgPSB0aGlzLl9nZXRCbGFua1NsYXRlKCk7XG4gICAgdmFyIGhlYWRlciA9IHRoaXMuX2dldEhlYWRlcigpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9XCJyZXBvcnQtY29udGFpbmVyXCI+XG5cbiAgICAgICAgPExvYWRpbmdJbmRpY2F0b3IgbG9hZGluZz17IHRoaXMuc3RhdGUubG9hZGluZ30gLz5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtZ3JvdXBcIj5cbiAgICAgICAgICA8ZGl2IGlkPVwicmVwb3J0LXRpdGxlXCIgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtIGFjdGl2ZVwiPlRvZGF5J3MgUmVwb3J0czwvZGl2PlxuICAgICAgICAgIHsgYmxhbmtTbGF0ZSB9XG4gICAgICAgICAgeyBoZWFkZXIgfVxuICAgICAgICAgIHsgdGFibGUgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG5cbiAgX2dldFRhYmxlOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5ncm91cGVkTG9jYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiAgdGhpcy5fZ2V0TG9jYXRpb25zKCk7XG4gICAgfVxuICB9LFxuXG4gIF9nZXRCbGFua1NsYXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmxhbmtTbGF0ZUNsYXNzTmFtZXMgPSBcIlwiO1xuICAgIHZhciBzaG93QmxhbmtTbGF0ZSA9IF8ua2V5cyh0aGlzLnN0YXRlLmdyb3VwZWRMb2NhdGlvbnMpLmxlbmd0aCA9PT0gMCAmJiB0aGlzLnN0YXRlLmxvYWRpbmcgPT09IGZhbHNlO1xuICAgIGlmIChzaG93QmxhbmtTbGF0ZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGJsYW5rU2xhdGVDbGFzc05hbWVzIH0+XG4gICAgICAgICAgICBObyByZXBvcnRzIHlldCBmb3IgdG9kYXkuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgX2dldEhlYWRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdseXBoaWNvbkRpcmVjdGlvbiA9ICdnbHlwaGljb24tY2hldnJvbi1yaWdodCc7XG4gICAgaWYgKHRoaXMuc3RhdGUuZXhwYW5kQWxsID09PSB0cnVlKSB7XG4gICAgICBnbHlwaGljb25EaXJlY3Rpb24gPSAnZ2x5cGhpY29uLWNoZXZyb24tZG93bic7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImxpc3QtZ3JvdXAtaXRlbS1pbmZvIGNvbHVtbi1oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbHVtblNpemVDc3NNYXAuZXhwYW5kZXIgKyAnIGV4cGFuZGVyLWNlbGwnIH0+XG4gICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9eyB0aGlzLl9vbkV4cGFuZEFsbCB9PjxzcGFuIGNsYXNzTmFtZT17ICdnbHlwaGljb24gJyArIGdseXBoaWNvbkRpcmVjdGlvbiB9Pjwvc3Bhbj48L2E+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb2x1bW5TaXplQ3NzTWFwLm5hbWUgfT48YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuX3NvcnRSZXBvcnR9PkxvY2F0aW9uPC9hPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY29sdW1uU2l6ZUNzc01hcC5kdXJhdGlvbiB9PjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY29sdW1uU2l6ZUNzc01hcC5hbW91bnQgfT48YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuX3NvcnRSZXBvcnR9PkFtb3VudDwvYT48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbHVtblNpemVDc3NNYXAuZGF0ZSB9PlVwZGF0ZWQ8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIF9nZXRMb2NhdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnJlZHVjZSh0aGlzLnN0YXRlLmdyb3VwZWRMb2NhdGlvbnMsIChyZXN1bHQsIGdyb3VwZWRMb2NhdGlvbikgPT4ge1xuICAgICAgdmFyIGdyb3VwUm93RGF0YSA9IGdyb3VwZWRMb2NhdGlvbi5yZXBvcnRzWzBdO1xuICAgICAgdmFyIGRldGFpbFJvd3MgPSB0aGlzLl9nZXREZXRhaWxSb3dzKGdyb3VwZWRMb2NhdGlvbi5yZXBvcnRzKTtcbiAgICAgIHZhciBmb3JtYXR0ZWREYXRlID0gRGF0ZUZvcm1hdHRlci5mb3JtYXRUb2RheURhdGUoZ3JvdXBSb3dEYXRhLnNvdXJjZV9kYXRlKTtcbiAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICA8R3JvdXBSb3dcbiAgICAgICAgICBrZXk9eyBncm91cFJvd0RhdGEuUk9XX05VTSB9XG4gICAgICAgICAgaWR4PXsgZ3JvdXBSb3dEYXRhLlJPV19OVU0gfVxuICAgICAgICAgIG5hbWU9eyBncm91cFJvd0RhdGEubG9jYXRpb24gfVxuICAgICAgICAgIGRhdGU9eyBmb3JtYXR0ZWREYXRlIH1cbiAgICAgICAgICBhbW91bnQ9eyBncm91cFJvd0RhdGEuYW1vdW50IH1cbiAgICAgICAgICBzb3VyY2U9eyBncm91cFJvd0RhdGEuc291cmNlX25hbWUgfVxuICAgICAgICAgIHNvdXJjZVVybD17IGdyb3VwUm93RGF0YS51cmwgfVxuICAgICAgICAgIGluaXRFeHBhbmRlZD17IHRoaXMuc3RhdGUuZXhwYW5kQWxsIH1cbiAgICAgICAgPlxuICAgICAgICAgIHsgZGV0YWlsUm93cyB9XG4gICAgICAgIDwvR3JvdXBSb3c+XG4gICAgICApO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCBbXSk7XG4gIH0sXG5cbiAgX2dldERldGFpbFJvd3M6IGZ1bmN0aW9uKGRldGFpbFJvd0RhdGFBcnJheSkge1xuICAgIHZhciBkdXJhdGlvbjtcbiAgICB2YXIgcHJldkR1cmF0aW9uID0gMDtcbiAgICB2YXIgZm9ybWF0dGVkRGF0ZTtcbiAgICByZXR1cm4gXy5yZWR1Y2UoZGV0YWlsUm93RGF0YUFycmF5LCAocmVzdWx0LCBkZXRhaWxSb3dEYXRhKSA9PiB7XG4gICAgICBkdXJhdGlvbiA9IGRldGFpbFJvd0RhdGEuZHVyYXRpb24gIT09IHByZXZEdXJhdGlvbiA/IGRldGFpbFJvd0RhdGEuZHVyYXRpb24gOiAwO1xuICAgICAgcHJldkR1cmF0aW9uID0gZGV0YWlsUm93RGF0YS5kdXJhdGlvbjtcbiAgICAgIGZvcm1hdHRlZERhdGUgPSBEYXRlRm9ybWF0dGVyLmZvcm1hdFRvZGF5RGF0ZShkZXRhaWxSb3dEYXRhLnNvdXJjZV9kYXRlKTtcblxuXG4gICAgICByZXN1bHQucHVzaChcbiAgICAgICAgPERldGFpbFJvd1xuICAgICAgICAgIGtleT17IGRldGFpbFJvd0RhdGEuUk9XX05VTSB9XG4gICAgICAgICAgZGF0ZT17IGZvcm1hdHRlZERhdGUgfVxuICAgICAgICAgIGR1cmF0aW9uPXsgZHVyYXRpb24gfVxuICAgICAgICAgIGFtb3VudD17IGRldGFpbFJvd0RhdGEuYW1vdW50IH1cbiAgICAgICAgICBzb3VyY2U9eyBkZXRhaWxSb3dEYXRhLnNvdXJjZV9uYW1lIH1cbiAgICAgICAgICBzb3VyY2VVcmw9eyBkZXRhaWxSb3dEYXRhLnVybCB9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCBbXSk7XG4gIH0sXG5cbiAgX29uTG9jYXRpb25zTG9hZGVkOiBmdW5jdGlvbihsb2NhdGlvbnMpIHtcbiAgICB2YXIgZ3JvdXBlZExvY2F0aW9ucyA9IExvY2F0aW9uSGVscGVyLm1hcChsb2NhdGlvbnMpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZ3JvdXBlZExvY2F0aW9uczogZ3JvdXBlZExvY2F0aW9ucyxcbiAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgfSk7XG4gIH0sXG5cbiAgX3NvcnRSZXBvcnQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGRpcmVjdGlvbiwgZGF0YUluZGV4O1xuICAgIGlmIChldmVudC50YXJnZXQudGV4dENvbnRlbnQgPT09ICdBbW91bnQnKSB7XG4gICAgICBkYXRhSW5kZXggPSAnYW1vdW50JztcbiAgICAgIGRpcmVjdGlvbiA9ICdkZXNjZW5kaW5nJztcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldC50ZXh0Q29udGVudCA9PT0gJ0xvY2F0aW9uJykge1xuICAgICAgZGF0YUluZGV4ID0gJ2xvY2F0aW9uJztcbiAgICAgIGRpcmVjdGlvbiA9ICdhc2NlbmRpbmcnO1xuICAgIH1cbiAgICB2YXIgZ3JvdXBlZExvY2F0aW9ucyA9IExvY2F0aW9uSGVscGVyLm9yZGVyQnkoZGF0YUluZGV4LCB0aGlzLnN0YXRlLmdyb3VwZWRMb2NhdGlvbnMsIGRpcmVjdGlvbik7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGdyb3VwZWRMb2NhdGlvbnM6IGdyb3VwZWRMb2NhdGlvbnMsXG4gICAgICBvcmRlcjoge1xuICAgICAgICBkYXRhSW5kZXg6IGRhdGFJbmRleCxcbiAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb25cbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBfb25FeHBhbmRBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGV4cGFuZEFsbDogIXRoaXMuc3RhdGUuZXhwYW5kQWxsXG4gICAgICB9KTtcbiAgfVxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvcGFnZS9Ub2RheVJlcG9ydC5yZWFjdC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gc3VwZXJhZ2VudDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwic3VwZXJhZ2VudFwiXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJfXCJcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcbnZhciBFbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4uL2Vudi9FbnZpcm9ubWVudCcpO1xuXG52YXIgTG9jYXRpb25TdG9yZSA9IHtcbiAgbG9hZDogZnVuY3Rpb24odXJsKSB7XG4gICAgcmV0dXJuIEVudmlyb25tZW50LmdldFNlcnZlckNvbmZpZygpLnRoZW4oKFNlcnZlckNvbmZpZyk9PiB7XG4gICAgICB2YXIgc2VydmVyUm9vdCA9IFNlcnZlckNvbmZpZy5UT01DQVRfVVJMO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmVxdWVzdFxuICAgICAgICAgIC5nZXQoc2VydmVyUm9vdCArIHVybClcbiAgICAgICAgICAuZW5kKChyZXMpID0+IHtcbiAgICAgICAgICAgIHZhciByZXBvcnQgPSBKU09OLnBhcnNlKHJlcy50ZXh0KS5yZXBvcnQ7XG4gICAgICAgICAgICByZXNvbHZlKHJlcG9ydC5sb2NhdGlvbnMpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgfSxcblxuICBsb2FkVGVzdERhdGE6IGZ1bmN0aW9uKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXNvbHZlKFtcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiAxLFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJBcmFwYWhvZSBCYXNpblwiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzI1LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vYXJhcGFob2ViYXNpbi5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImNvbG9yYWRvc2tpLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5jb2xvcmFkb3NraS5jb20vU25vd1JlcG9ydC9cIixcbiAgICAgICAgICBcImFtb3VudFwiOiAzLFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA1OjU1IEFNIE1EVFwiLFxuICAgICAgICAgIFwic291cmNlX3NlcVwiOiBcIk1cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDIsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkFyYXBhaG9lIEJhc2luXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTAvMjUvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogMjQsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly9hcmFwYWhvZWJhc2luLmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwiYXJhcGFob2ViYXNpbi5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuYXJhcGFob2ViYXNpbi5jb20vQUJhc2luL3Nub3ctY29uZGl0aW9ucy9kZWZhdWx0LmFzcHhcIixcbiAgICAgICAgICBcImFtb3VudFwiOiAzLFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA1OjM2IEFNIE1EVFwiLFxuICAgICAgICAgIFwic291cmNlX3NlcVwiOiBcIk1cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDMsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkFyYXBhaG9lIEJhc2luXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTAvMjUvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogNDgsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly9hcmFwYWhvZWJhc2luLmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwiY29sb3JhZG9za2kuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmNvbG9yYWRvc2tpLmNvbS9Tbm93UmVwb3J0L1wiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDUsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDU6NTUgQU0gTURUXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA0LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJBcmFwYWhvZSBCYXNpblwiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzI1LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDcyLFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vYXJhcGFob2ViYXNpbi5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImFyYXBhaG9lYmFzaW4uY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmFyYXBhaG9lYmFzaW4uY29tL0FCYXNpbi9zbm93LWNvbmRpdGlvbnMvZGVmYXVsdC5hc3B4XCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogNyxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwNTozNiBBTSBNRFRcIlxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNyxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiQmVhdmVyIENyZWVrXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTEvMjQvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogMjQsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly93d3cuc25vdy5jb20vZGlzY292ZXJvdXJyZXNvcnRzL2JlYXZlcmNyZWVrL2xhbmRpbmcuYXNweFwiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJzbm93LmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5zbm93LmNvbS9tb3VudGFpbmNvbmRpdGlvbnMvc25vd2FuZHdlYXRoZXJyZXBvcnRzLmFzcHhcIixcbiAgICAgICAgICBcImFtb3VudFwiOiAxLFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA0OjA2IFBNIE1EVFwiLFxuICAgICAgICAgIFwic291cmNlX3NlcVwiOiBcIk1cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDgsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkJlYXZlciBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjExLzI0LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDQ4LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd3d3LnNub3cuY29tL2Rpc2NvdmVyb3VycmVzb3J0cy9iZWF2ZXJjcmVlay9sYW5kaW5nLmFzcHhcIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwic25vdy5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuc25vdy5jb20vbW91bnRhaW5jb25kaXRpb25zL3Nub3dhbmR3ZWF0aGVycmVwb3J0cy5hc3B4XCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMSxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwNDowNiBQTSBNRFRcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDksXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkJlYXZlciBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjExLzI0LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDE2OCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3d3dy5zbm93LmNvbS9kaXNjb3Zlcm91cnJlc29ydHMvYmVhdmVyY3JlZWsvbGFuZGluZy5hc3B4XCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcInNub3cuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LnNub3cuY29tL21vdW50YWluY29uZGl0aW9ucy9zbm93YW5kd2VhdGhlcnJlcG9ydHMuYXNweFwiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDMsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDQ6MDYgUE0gTURUXCJcbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDQzLFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJXaW50ZXIgUGFya1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjExLzE3LzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd3d3LndpbnRlcnBhcmtyZXNvcnQuY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJjb2xvcmFkb3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuY29sb3JhZG9za2kuY29tL1Nub3dSZXBvcnQvXCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogMTAsXG4gICAgICAgICAgXCJzb3VyY2VfZGF0ZVwiOiBcIjAzLzIzLzIwMTUgMDE6MTYgUE0gTURUXCIsXG4gICAgICAgICAgXCJzb3VyY2Vfc2VxXCI6IFwiTVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNDQsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIldpbnRlciBQYXJrXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTEvMTcvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogNDgsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly93d3cud2ludGVycGFya3Jlc29ydC5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcImNvbG9yYWRvc2tpLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy5jb2xvcmFkb3NraS5jb20vU25vd1JlcG9ydC9cIixcbiAgICAgICAgICBcImFtb3VudFwiOiAyNCxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwMToxNiBQTSBNRFRcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJST1dfTlVNXCI6IDQ1LFxuICAgICAgICAgIFwibG9jYXRpb25cIjogXCJXb2xmIENyZWVrXCIsXG4gICAgICAgICAgXCJzdGFydF9kYXRlXCI6IFwiMTAvMzAvMjAxMFwiLFxuICAgICAgICAgIFwiZHVyYXRpb25cIjogMjQsXG4gICAgICAgICAgXCJob21lX3VybFwiOiBcImh0dHA6Ly93b2xmY3JlZWtza2kuY29tL1wiLFxuICAgICAgICAgIFwic291cmNlX25hbWVcIjogXCJjb2xvcmFkb3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cuY29sb3JhZG9za2kuY29tL1Nub3dSZXBvcnQvXCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogOCxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwOTo1NSBBTSBNRFRcIixcbiAgICAgICAgICBcInNvdXJjZV9zZXFcIjogXCJNXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA0NixcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiV29sZiBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzMwLzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDI0LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd29sZmNyZWVrc2tpLmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwid29sZmNyZWVrc2tpLmNvbVwiLFxuICAgICAgICAgIFwidXJsXCI6IFwiaHR0cDovL3d3dy53b2xmY3JlZWtza2kuY29tL3Nub3cuYXNwXCIsXG4gICAgICAgICAgXCJhbW91bnRcIjogOCxcbiAgICAgICAgICBcInNvdXJjZV9kYXRlXCI6IFwiMDMvMjMvMjAxNSAwOTo1MyBBTSBNRFRcIixcbiAgICAgICAgICBcInNvdXJjZV9zZXFcIjogXCJNXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiUk9XX05VTVwiOiA0NyxcbiAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiV29sZiBDcmVla1wiLFxuICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBcIjEwLzMwLzIwMTBcIixcbiAgICAgICAgICBcImR1cmF0aW9uXCI6IDQ4LFxuICAgICAgICAgIFwiaG9tZV91cmxcIjogXCJodHRwOi8vd29sZmNyZWVrc2tpLmNvbS9cIixcbiAgICAgICAgICBcInNvdXJjZV9uYW1lXCI6IFwiY29sb3JhZG9za2kuY29tXCIsXG4gICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmNvbG9yYWRvc2tpLmNvbS9Tbm93UmVwb3J0L1wiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDI0LFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA5OjU1IEFNIE1EVFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIlJPV19OVU1cIjogNDgsXG4gICAgICAgICAgXCJsb2NhdGlvblwiOiBcIldvbGYgQ3JlZWtcIixcbiAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogXCIxMC8zMC8yMDEwXCIsXG4gICAgICAgICAgXCJkdXJhdGlvblwiOiA0OCxcbiAgICAgICAgICBcImhvbWVfdXJsXCI6IFwiaHR0cDovL3dvbGZjcmVla3NraS5jb20vXCIsXG4gICAgICAgICAgXCJzb3VyY2VfbmFtZVwiOiBcIndvbGZjcmVla3NraS5jb21cIixcbiAgICAgICAgICBcInVybFwiOiBcImh0dHA6Ly93d3cud29sZmNyZWVrc2tpLmNvbS9zbm93LmFzcFwiLFxuICAgICAgICAgIFwiYW1vdW50XCI6IDI0LFxuICAgICAgICAgIFwic291cmNlX2RhdGVcIjogXCIwMy8yMy8yMDE1IDA5OjUzIEFNIE1EVFwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvY2F0aW9uU3RvcmU7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vc3JjL3N0b3JlL0xvY2F0aW9uU3RvcmUuanNcbiAqKi8iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBEYXRlRm9ybWF0dGVyID0gcmVxdWlyZSgnLi4vdXRpbC9EYXRlRm9ybWF0dGVyJyk7XG52YXIgQW1vdW50Rm9ybWF0dGVyID0gcmVxdWlyZSgnLi4vdXRpbC9BbW91bnRGb3JtYXR0ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgaWR4OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgZGF0ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBhbW91bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgc291cmNlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNvdXJjZVVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbGxhcHNlSWQgPSAgdGhpcy5wcm9wcy5pZHggKyBcIkNvbGxhcHNlXCI7XG4gICAgdmFyIGhyZWYgPSBcIiNcIiArIGNvbGxhcHNlSWQ7XG4gICAgdmFyIGFsdFRleHQgPSB0aGlzLnByb3BzLm5hbWUgKyBcIiByZXBvcnQgZGV0YWlsc1wiO1xuICAgIHZhciBmb3JtYXR0ZWREYXRlID0gRGF0ZUZvcm1hdHRlci5mb3JtYXREYXRlU3RyaW5nKHRoaXMucHJvcHMuZGF0ZSk7XG4gICAgdmFyIGFtb3VudENhdGVnb3J5ID0gQW1vdW50Rm9ybWF0dGVyLmdldEFtb3VudENhdGVnb3J5KHRoaXMucHJvcHMuYW1vdW50LCAyNCk7XG4gICAgdmFyIGFtb3VudENsYXNzZXMgPSBcImNvbC14cy0xIGFtb3VudC1cIiArIGFtb3VudENhdGVnb3J5O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTFcIj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJjb2xsYXBzZWRcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgaHJlZj17IGhyZWYgfSAgdGl0bGU9eyBhbHRUZXh0IH0gYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgYXJpYS1jb250cm9scz17IGNvbGxhcHNlSWQgfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tY2hldnJvbi1kb3duXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTUgY29sLXMtN1wiPnsgdGhpcy5wcm9wcy5uYW1lIH08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9eyBhbW91bnRDbGFzc2VzIH0+eyB0aGlzLnByb3BzLmFtb3VudCB9XCI8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNCByZXBvcnQtZGF0ZVwiPnsgZm9ybWF0dGVkRGF0ZSB9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2gzPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZVwiIGlkPXsgY29sbGFwc2VJZCB9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMVwiPjwvZGl2PlxuICAgICAgICAgICAgICA8YSBocmVmPXsgdGhpcy5wcm9wcy5zb3VyY2VVcmwgfT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy01IGNvbC1zLTdcIj57IHRoaXMucHJvcHMuc291cmNlIH08L2Rpdj5cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xXCI+eyB0aGlzLnByb3BzLmFtb3VudCB9XCI8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNFwiPnsgZm9ybWF0dGVkRGF0ZSB9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvY29tcG9uZW50L0xvY2F0aW9uUmVwb3J0Um93LnJlYWN0LmpzXG4gKiovIiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0xvYWRpbmdJbmRpY2F0b3InLFxuICBwcm9wVHlwZXM6IHtcbiAgICBsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjbGFzc05hbWUgPSBcImFsZXJ0IGFsZXJ0LWluZm9cIjtcbiAgICBpZiAodGhpcy5wcm9wcy5sb2FkaW5nICE9PSB0cnVlKSB7XG4gICAgICBjbGFzc05hbWUgKz0gXCIgaGlkZGVuXCI7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwibG9hZGluZ0luZGljYXRvclwiIGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9IHJvbGU9XCJhbGVydFwiPkxvYWRpbmcuLi48L2Rpdj5cbiAgICApO1xuICB9XG59KTtcbi8vY2xhc3M9XCJhbGVydCBhbGVydC1pbmZvXCIgcm9sZT1cImFsZXJ0XCJcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvY29tcG9uZW50L0xvYWRpbmdJbmRpY2F0b3IucmVhY3QuanNcbiAqKi8iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxuYXYgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1maXhlZC10b3AgY2VudGVyLWJsb2NrXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5MYXRlc3QgMjQgSG91ciBSZXBvcnRzPC9oND5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L25hdj5cbiAgICApO1xuICB9LFxuXG4gIF9zb3J0UmVwb3J0OiBmdW5jdGlvbihldmVudCkge1xuICAgIGFsZXJ0KCdTb3J0aW5nIScpO1xuICAgIGNvbnNvbGUubG9nKCdUT0RPOiBzb3J0JywgZXZlbnQpO1xuICB9XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvY29tcG9uZW50L05hdkJhci5yZWFjdC5qc1xuICoqLyIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEFtb3VudEZvcm1hdHRlciA9IHJlcXVpcmUoJy4uL3V0aWwvQW1vdW50Rm9ybWF0dGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cGFuZGVkOiB0aGlzLnByb3BzLmluaXRFeHBhbmRlZFxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV3UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGV4cGFuZGVkOiBuZXdQcm9wcy5pbml0RXhwYW5kZWRcbiAgICB9KTtcbiAgfSxcblxuICBwcm9wVHlwZXM6IHtcbiAgICBpZHg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgbmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkYXRlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGFtb3VudDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBzb3VyY2U6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgc291cmNlVXJsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGluaXRFeHBhbmRlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb2xsYXBzZUlkID0gdGhpcy5wcm9wcy5pZHggKyBcIkNvbGxhcHNlXCI7XG4gICAgdmFyIGhyZWYgPSBcIiNcIiArIGNvbGxhcHNlSWQ7XG4gICAgdmFyIGFsdFRleHQgPSB0aGlzLnByb3BzLm5hbWUgKyBcIiByZXBvcnQgZGV0YWlsc1wiO1xuICAgIHZhciBhbW91bnRDYXRlZ29yeSA9IEFtb3VudEZvcm1hdHRlci5nZXRBbW91bnRDYXRlZ29yeSh0aGlzLnByb3BzLmFtb3VudCwgMjQpO1xuICAgIHZhciBhbW91bnRDbGFzc2VzID0gXCJjb2wteHMtMiBhbW91bnQtXCIgKyBhbW91bnRDYXRlZ29yeTtcbiAgICB2YXIgbGlua0NvbGxhcHNlQ2xzID0gdGhpcy5zdGF0ZS5leHBhbmRlZCA/ICcnIDogJ2NvbGxhcHNlZCc7XG4gICAgdmFyIGNvbGxhcHNlZENvbnRlbnRDbHMgPSB0aGlzLnN0YXRlLmV4cGFuZGVkID8gJ2NvbGxhcHNlIGluJyA6ICdjb2xsYXBzZSc7XG4gICAgdmFyIGdseXBoaWNvbiA9IHRoaXMuc3RhdGUuZXhwYW5kZWQgPyAnZ2x5cGhpY29uLWNoZXZyb24tZG93bicgOiAnZ2x5cGhpY29uLWNoZXZyb24tcmlnaHQnO1xuICAgIHZhciBhcmlhRXhwYW5kZWQgPSB0aGlzLnN0YXRlLmV4cGFuZGVkLnRvU3RyaW5nKCk7XG4gICAgLy9maXhlcyBhbiBhcHBhcmVudCBidWcgaW4gYm9vdHN0cmFwIGNvbGxhcHNlIHRoYXQgZG9lc24ndCByZW1vdmUgaGVpZ2h0IG9mIDAgaWYgY29sbGFwc2VkIG1hbnVhbGx5IGFuZCB0aGVuIGRvbSBpcyB1cGRhdGVkXG4gICAgdmFyIGNvbGxhcHNlZFN0eWxlID0ge1xuICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLmV4cGFuZGVkID8gJ2luaGVyaXQnIDogJzAnXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInBhbmVsLXRpdGxlXCI+XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9eydleHBhbmRlci1saW5rICcgKyBsaW5rQ29sbGFwc2VDbHN9XG4gICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIlxuICAgICAgICAgICAgICBocmVmPXsgaHJlZiB9XG4gICAgICAgICAgICAgIHRpdGxlPXsgYWx0VGV4dCB9XG4gICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9eyBhcmlhRXhwYW5kZWQgfVxuICAgICAgICAgICAgICBhcmlhLWNvbnRyb2xzPXsgY29sbGFwc2VJZCB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eyB0aGlzLl9vbkV4cGFuZCB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMSBleHBhbmRlci1jZWxsXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9eyAnZ2x5cGhpY29uICcgKyBnbHlwaGljb24gfT48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtNSBuYW1lXCI+eyB0aGlzLnByb3BzLm5hbWUgfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTIgZHVyYXRpb25cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGFtb3VudENsYXNzZXMgfT57IHRoaXMucHJvcHMuYW1vdW50IH1cIjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTIgcmVwb3J0LWRhdGVcIj57IHRoaXMucHJvcHMuZGF0ZSB9PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvaDM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbGxhcHNlZENvbnRlbnRDbHMgfSBpZD17IGNvbGxhcHNlSWQgfSBhcmlhLWV4cGFuZGVkPXsgYXJpYUV4cGFuZGVkIH0gc3R5bGU9eyBjb2xsYXBzZWRTdHlsZSB9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgeyB0aGlzLnByb3BzLmNoaWxkcmVuIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIF9vbkV4cGFuZDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBleHBhbmRlZDogIXRoaXMuc3RhdGUuZXhwYW5kZWRcbiAgICB9KTtcbiAgfVxufSk7XG5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy9jb21wb25lbnQvR3JvdXBSb3cucmVhY3QuanNcbiAqKi8iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBwcm9wVHlwZXM6IHtcbiAgICBkYXRlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGR1cmF0aW9uOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIGFtb3VudDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBzb3VyY2U6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgc291cmNlVXJsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZHVyYXRpb24gPSB0aGlzLl9mb3JtYXREdXJhdGlvbigpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xIGV4cGFuZGVyLWNlbGxcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy01IG5hbWVcIj5cbiAgICAgICAgICAgIDxhIGhyZWY9eyB0aGlzLnByb3BzLnNvdXJjZVVybCB9PlxuICAgICAgICAgICAgICB7IHRoaXMucHJvcHMuc291cmNlIH1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMiBkdXJhdGlvblwiPnsgZHVyYXRpb24gfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0yXCI+eyB0aGlzLnByb3BzLmFtb3VudCB9XCI8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMlwiPnsgdGhpcy5wcm9wcy5kYXRlIH08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG5cbiAgX2Zvcm1hdER1cmF0aW9uOiBmdW5jdGlvbigpIHtcbiAgICBzd2l0Y2ggKHRoaXMucHJvcHMuZHVyYXRpb24pIHtcbiAgICAgIGNhc2UgKDApOlxuICAgICAgICByZXR1cm4gJyc7XG4gICAgICBjYXNlICgyNCk6XG4gICAgICBjYXNlICg0OCk6XG4gICAgICBjYXNlICg3Mik6XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmR1cmF0aW9uICsgJ2hyJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wcy5kdXJhdGlvbiAvIDI0KSArICcgZGF5cyc7XG4gICAgfVxuICB9XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvY29tcG9uZW50L0RldGFpbFJvdy5yZWFjdC5qc1xuICoqLyIsInZhciBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGZvcm1hdERhdGVTdHJpbmc6IGZ1bmN0aW9uKGRhdGVTdHJpbmcpIHtcbiAgICB2YXIgZGF0ZSA9IG1vbWVudChuZXcgRGF0ZShkYXRlU3RyaW5nKSk7XG4gICAgcmV0dXJuIGRhdGUuY2FsZW5kYXIoKTtcbiAgfSxcblxuICBmb3JtYXRUb2RheURhdGU6IGZ1bmN0aW9uKGRhdGVTdHJpbmcpIHtcbiAgICB2YXIgZGF0ZSA9IG1vbWVudChuZXcgRGF0ZShkYXRlU3RyaW5nKSk7XG4gICAgcmV0dXJuIGRhdGUuZm9ybWF0KCdoOm1tIEEnKTtcbiAgfVxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvdXRpbC9EYXRlRm9ybWF0dGVyLmpzXG4gKiovIiwidmFyIExvY2F0aW9uSGVscGVyID0ge1xuICBvcmRlckJ5OiBmdW5jdGlvbihkYXRhSW5kZXgsIGdyb3VwZWRMb2NhdGlvbnMsIG9yZGVyKSB7XG4gICAgdmFyIG9yZGVySW5kZXhlcyA9IF8udW5pb24oW2RhdGFJbmRleF0sIF8ua2V5cyhncm91cGVkTG9jYXRpb25zWzBdKSk7XG4gICAgdmFyIHNvcnRlZCA9IF8uc29ydEJ5QWxsKGdyb3VwZWRMb2NhdGlvbnMsIG9yZGVySW5kZXhlcyk7XG5cbiAgICBpZiAob3JkZXIgPT09ICdkZXNjZW5kaW5nJykge1xuICAgICAgc29ydGVkID0gc29ydGVkLnJldmVyc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvcnRlZDtcbiAgfSxcblxuICBtYXA6IGZ1bmN0aW9uKGxvY2F0aW9uQXJyYXkpIHtcbiAgICByZXR1cm4gXy5yZWR1Y2UobG9jYXRpb25BcnJheSwgKHJlc3VsdCwgbG9jYXRpb25EYXRhKSA9PiB7XG4gICAgICB2YXIgZ3JvdXBlZFJlcG9ydHMgPSBfLmZpbmQocmVzdWx0LCB7ICdsb2NhdGlvbicgOiBsb2NhdGlvbkRhdGEubG9jYXRpb24gfSk7XG4gICAgICBpZiAoIWdyb3VwZWRSZXBvcnRzKSB7XG4gICAgICAgIGdyb3VwZWRSZXBvcnRzID0ge1xuICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbkRhdGEubG9jYXRpb24sXG4gICAgICAgICAgYW1vdW50OiBsb2NhdGlvbkRhdGEuYW1vdW50LFxuICAgICAgICAgIHJlcG9ydHM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHJlc3VsdC5wdXNoKGdyb3VwZWRSZXBvcnRzKTtcbiAgICAgIH1cbiAgICAgIGdyb3VwZWRSZXBvcnRzLnJlcG9ydHMucHVzaChsb2NhdGlvbkRhdGEpO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIFtdKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2NhdGlvbkhlbHBlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvdXRpbC9Mb2NhdGlvbkhlbHBlci5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gbW9tZW50O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJtb21lbnRcIlxuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0QW1vdW50Q2F0ZWdvcnk6IGZ1bmN0aW9uKGFtb3VudCwgZHVyYXRpb24pIHtcbiAgICB2YXIgZGl2aXNvciwgdGltZUFkanVzdGVkQW1vdW50O1xuXG4gICAgaWYgKCFhbW91bnQgfHwgIWR1cmF0aW9uIHx8IGFtb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFwibm9uZVwiO1xuICAgIH1cblxuICAgIGRpdmlzb3IgPSBkdXJhdGlvbi8yNDtcbiAgICB0aW1lQWRqdXN0ZWRBbW91bnQgPSBhbW91bnQvZGl2aXNvcjtcblxuICAgIGlmICh0aW1lQWRqdXN0ZWRBbW91bnQgPCA2KSB7XG4gICAgICByZXR1cm4gXCJzbWFsbFwiO1xuICAgIH1cbiAgICBpZiAodGltZUFkanVzdGVkQW1vdW50ID49IDYgJiYgdGltZUFkanVzdGVkQW1vdW50IDwgMTIpIHtcbiAgICAgIHJldHVybiBcIm1lZGl1bVwiO1xuICAgIH1cbiAgICBpZiAodGltZUFkanVzdGVkQW1vdW50ID49IDEyICYmIHRpbWVBZGp1c3RlZEFtb3VudCA8IDE4KSB7XG4gICAgICByZXR1cm4gXCJsYXJnZVwiO1xuICAgIH1cbiAgICByZXR1cm4gXCJ4bGFyZ2VcIjtcbiAgfVxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9zcmMvdXRpbC9BbW91bnRGb3JtYXR0ZXIuanNcbiAqKi8iLCJ2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcblxudmFyIHNlcnZlckNvbmZpZztcblxudmFyIEVudmlyb25tZW50ID0ge1xuICBnZXRTZXJ2ZXJDb25maWc6IGZ1bmN0aW9uKCkge1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChzZXJ2ZXJDb25maWcpIHtcbiAgICAgICAgcmVzb2x2ZShzZXJ2ZXJDb25maWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWVzdFxuICAgICAgICAgIC5nZXQoJy9lbnZpcm9ubWVudC5qcycpXG4gICAgICAgICAgLmVuZCgocmVzKSA9PiB7XG4gICAgICAgICAgICB2YXIgZW52ID0gcmVzLmJvZHk7XG4gICAgICAgICAgICBzZXJ2ZXJDb25maWcgPSBlbnY7XG5cbiAgICAgICAgICAgIHJlc29sdmUoZW52KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIH0pO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVudmlyb25tZW50O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL3NyYy9lbnYvRW52aXJvbm1lbnQuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJ3ZWJwYWNrX2J1bmRsZS5qcyJ9