var app = angular.module('reportingApp', []);

app.controller('ScreenshotReportController', function ($scope) {
    $scope.searchSettings = {
        description: '',
        passed: true,
        failed: true,
        pending: true,
        withLog: true,
    };

    $scope.inlineScreenshots = false;
    this.showSmartStackTraceHighlight = true;

    this.chooseAllTypes = function () {
        $scope.searchSettings.passed = true;
        $scope.searchSettings.failed = true;
        $scope.searchSettings.pending = true;
        $scope.searchSettings.withLog = true;
    };

    this.getParent = function (str) {
        var arr = str.split('|');
        str = "";
        for (var i = arr.length - 1; i > 0; i--) {
            str += arr[i] + " > ";
        }
        return str.slice(0, -3);
    };


    this.getShortDescription = function (str) {
        return str.split('|')[0];
    };


    this.nToBr = function (str) {
        return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    };


    this.convertTimestamp = function (timestamp) {
        var d = new Date(timestamp),
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),
            dd = ('0' + d.getDate()).slice(-2),
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),
            ampm = 'AM',
            time;

        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh == 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

        return time;
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {passCount++};
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {pendingCount++};
        }
        return pendingCount;
    };


    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {failCount++}
        }
        return failCount;
    };

    this.applySmartHighlight = function (line) {
        if (this.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
    };


    this.results =[
    {
        "description": "should fail as greeting text is different|angularjs homepage",
        "passed": false,
        "os": "MAC",
        "sessionId": "0e1d5434-12c7-4ec1-961b-4c775357eecb",
        "browser": {
            "name": "chrome",
            "version": "57.0.2987.133"
        },
        "message": "Expected 'Hello Julie!' to equal 'Hello Julie hello!'.",
        "trace": "Error: Expected 'Hello Julie!' to equal 'Hello Julie hello!'.\n    at new jasmine.ExpectationResult (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/minijasminenode/lib/jasmine-1.3.1.js:137:32)\n    at .toEqual (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/minijasminenode/lib/jasmine-1.3.1.js:1339:29)\n    at /Users/evilweed/protractor-beautiful-reporter/examples/node_modules/protractor/jasminewd/index.js:87:34\n    at /Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/goog/base.js:1178:15\n    at webdriver.promise.ControlFlow.runInNewFrame_ (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:1438:20)\n    at notify (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:328:12)\n    at notifyAll (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:297:7)\n    at fulfill (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:402:7)\n    at /Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/goog/base.js:1178:15\n    at webdriver.promise.ControlFlow.runInNewFrame_ (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:1438:20)",
        "browserLogs": [],
        "screenShotFile": "images/should fail as greeting text is different-angularjs homepage.png"
    },
    {
        "description": "should greet the named user|angularjs homepage",
        "passed": true,
        "os": "MAC",
        "sessionId": "0e1d5434-12c7-4ec1-961b-4c775357eecb",
        "browser": {
            "name": "chrome",
            "version": "57.0.2987.133"
        },
        "message": "Passed.",
        "browserLogs": []
    },
    {
        "description": "should contain log and pretty stack trace|angularjs homepage",
        "passed": false,
        "os": "MAC",
        "sessionId": "0e1d5434-12c7-4ec1-961b-4c775357eecb",
        "browser": {
            "name": "chrome",
            "version": "57.0.2987.133"
        },
        "message": "UnknownError: unknown error: Runtime.evaluate threw exception: SyntaxError: Unexpected token throw\n  (Session info: chrome=57.0.2987.133)\n  (Driver info: chromedriver=2.29.461585 (0be2cd95f834e9ee7c46bcc7cf405b483f5ae83b),platform=Mac OS X 10.11.5 x86_64) (WARNING: The server did not provide any stacktrace information)\nCommand duration or timeout: 10 milliseconds\nBuild info: version: '3.3.1', revision: '5234b32', time: '2017-03-10 09:04:52 -0800'\nSystem info: host: 'iMac-mczernow.local', ip: '192.168.0.114', os.name: 'Mac OS X', os.arch: 'x86_64', os.version: '10.11.5', java.version: '1.8.0_121'\nDriver info: org.openqa.selenium.chrome.ChromeDriver\nCapabilities [{applicationCacheEnabled=false, rotatable=false, mobileEmulationEnabled=false, networkConnectionEnabled=false, chrome={chromedriverVersion=2.29.461585 (0be2cd95f834e9ee7c46bcc7cf405b483f5ae83b), userDataDir=/var/folders/h5/6wmqsrbd0bqf348fzbmr9fh80000gp/T/.org.chromium.Chromium.xWZzYf}, takesHeapSnapshot=true, pageLoadStrategy=normal, databaseEnabled=false, handlesAlerts=true, hasTouchScreen=false, version=57.0.2987.133, platform=MAC, browserConnectionEnabled=false, nativeEvents=true, acceptSslCerts=true, locationContextEnabled=true, webStorageEnabled=true, browserName=chrome, takesScreenshot=true, javascriptEnabled=true, cssSelectorsEnabled=true, unexpectedAlertBehaviour=}]\nSession ID: 5839e603530e2a7bdf8f914fc6feae4e",
        "trace": "UnknownError: unknown error: Runtime.evaluate threw exception: SyntaxError: Unexpected token throw\n  (Session info: chrome=57.0.2987.133)\n  (Driver info: chromedriver=2.29.461585 (0be2cd95f834e9ee7c46bcc7cf405b483f5ae83b),platform=Mac OS X 10.11.5 x86_64) (WARNING: The server did not provide any stacktrace information)\nCommand duration or timeout: 10 milliseconds\nBuild info: version: '3.3.1', revision: '5234b32', time: '2017-03-10 09:04:52 -0800'\nSystem info: host: 'iMac-mczernow.local', ip: '192.168.0.114', os.name: 'Mac OS X', os.arch: 'x86_64', os.version: '10.11.5', java.version: '1.8.0_121'\nDriver info: org.openqa.selenium.chrome.ChromeDriver\nCapabilities [{applicationCacheEnabled=false, rotatable=false, mobileEmulationEnabled=false, networkConnectionEnabled=false, chrome={chromedriverVersion=2.29.461585 (0be2cd95f834e9ee7c46bcc7cf405b483f5ae83b), userDataDir=/var/folders/h5/6wmqsrbd0bqf348fzbmr9fh80000gp/T/.org.chromium.Chromium.xWZzYf}, takesHeapSnapshot=true, pageLoadStrategy=normal, databaseEnabled=false, handlesAlerts=true, hasTouchScreen=false, version=57.0.2987.133, platform=MAC, browserConnectionEnabled=false, nativeEvents=true, acceptSslCerts=true, locationContextEnabled=true, webStorageEnabled=true, browserName=chrome, takesScreenshot=true, javascriptEnabled=true, cssSelectorsEnabled=true, unexpectedAlertBehaviour=}]\nSession ID: 5839e603530e2a7bdf8f914fc6feae4e\n    at new bot.Error (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/atoms/error.js:109:18)\n    at Object.bot.response.checkResponse (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/atoms/response.js:106:9)\n    at /Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/webdriver.js:275:20\n    at /Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/goog/base.js:1178:15\n    at webdriver.promise.ControlFlow.runInNewFrame_ (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:1438:20)\n    at notify (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:328:12)\n    at notifyAll (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:297:7)\n    at fulfill (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:402:7)\n    at /Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:1305:10\n    at /Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/goog/base.js:1178:15\n==== async task ====\nWebDriver.executeScript()\n    at webdriver.WebDriver.schedule (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/webdriver.js:266:15)\n    at webdriver.WebDriver.executeScript (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/webdriver.js:415:15)\n    at Protractor.to.(anonymous function) [as executeScript] (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/protractor/lib/protractor.js:42:25)\n    at .<anonymous> (/Users/evilweed/protractor-beautiful-reporter/examples/specs/example_spec.js:26:17)\n    at /Users/evilweed/protractor-beautiful-reporter/examples/node_modules/protractor/jasminewd/index.js:54:12\n    at webdriver.promise.ControlFlow.runInNewFrame_ (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:1438:20)\n    at webdriver.promise.ControlFlow.runEventLoop_ (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/selenium-webdriver/lib/webdriver/promise.js:1303:8)\n    at ontimeout (timers.js:365:14)\n    at tryOnTimeout (timers.js:237:5)\n==== async task ====\n    at .<anonymous> (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/protractor/jasminewd/index.js:53:12)\n    at .<anonymous> (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/minijasminenode/lib/async-callback.js:45:37)\n    at jasmine.Block.execute (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/minijasminenode/lib/jasmine-1.3.1.js:1168:17)\n    at jasmine.Queue.next_ (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/minijasminenode/lib/jasmine-1.3.1.js:2200:31)\n    at Timeout._onTimeout (/Users/evilweed/protractor-beautiful-reporter/examples/node_modules/minijasminenode/lib/jasmine-1.3.1.js:2190:18)\n    at ontimeout (timers.js:365:14)\n    at tryOnTimeout (timers.js:237:5)\n    at Timer.listOnTimeout (timers.js:207:5)",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "console-api 357:40 \"This is some kind of warning!\"",
                "timestamp": 1492030847231,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "console-api 357:40 \"This is some kind of warning!\"",
                "timestamp": 1492030847262,
                "type": ""
            }
        ],
        "screenShotFile": "images/should contain log and pretty stack trace-angularjs homepage.png"
    },
    {
        "description": "should list todos|todo list|angularjs homepage",
        "passed": true,
        "os": "MAC",
        "sessionId": "0e1d5434-12c7-4ec1-961b-4c775357eecb",
        "browser": {
            "name": "chrome",
            "version": "57.0.2987.133"
        },
        "message": "Passed.",
        "browserLogs": []
    },
    {
        "description": "should display first todo with proper text|todo list|angularjs homepage",
        "passed": true,
        "os": "MAC",
        "sessionId": "0e1d5434-12c7-4ec1-961b-4c775357eecb",
        "browser": {
            "name": "chrome",
            "version": "57.0.2987.133"
        },
        "message": "Passed.",
        "browserLogs": []
    },
    {
        "description": "should add a todo|todo list|angularjs homepage",
        "passed": true,
        "os": "MAC",
        "sessionId": "0e1d5434-12c7-4ec1-961b-4c775357eecb",
        "browser": {
            "name": "chrome",
            "version": "57.0.2987.133"
        },
        "message": "Passed.",
        "browserLogs": []
    }
];
});

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    filtered.push(item);
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    filtered.push(item);
                } else if (searchSettings.pending && item.pending || hasLog) {
                    filtered.push(item);
                }

            }
        }

        return filtered;
    };
});