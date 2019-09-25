const util = require('./util');

const _isString = util._isString;
const Jasmine2Reporter= require('./jasmine2reporter');
const Jasmine3Reporter= require('./jasmine3reporter');

/** Function: defaultPathBuilder
 * This function builds paths for a screenshot file. It is appended to the
 * constructors base directory and gets prependend with `.png` or `.json` when
 * storing a screenshot or JSON meta data file.
 *
 * Parameters:
 *     (Object) spec - The spec currently reported
 *     (Array) descriptions - The specs and their parent suites descriptions
 *     (Object) result - The result object of the current test spec.
 *     (Object) capabilities - WebDrivers capabilities object containing
 *                             in-depth information about the Selenium node
 *                             which executed the test case.
 *
 * Returns:
 *     (String) containing the built path
 */
function defaultPathBuilder(spec, descriptions, results, capabilities) {
    return util.generateGuid();
}

function jasmine2MetaDataBuilder(spec, descriptions, results, capabilities) {

    let isPassed = results.status === 'passed';
    let isPending = ['pending', 'disabled', 'excluded'].includes(results.status);
    let osInfo= capabilities.get("platform") || capabilities.get("platformName");
    let version =  capabilities.get("browserVersion") || capabilities.get("version");
    let metaData = {
        description: descriptions.join(' '),
        passed: isPassed,
        pending: isPending,
        os: osInfo,
        sessionId: capabilities.get('webdriver.remote.sessionid'),
        instanceId: process.pid,
        browser: {
            name: capabilities.get('browserName'),
            version: version
        }
    };

    if (isPassed) {
        metaData.message = (results.passedExpectations[0] || {}).message || 'Passed';
        metaData.trace = (results.passedExpectations[0] || {}).stack;
    } else if (isPending) {
        metaData.message = results.pendingReason || 'Pending';
    } else {

        if (results.failedExpectations[0].message) {
            metaData.message = results.failedExpectations.map(result => result.message);
        } else {
            metaData.message = 'Failed';
        }

        if (results.failedExpectations[0].stack) {
            metaData.trace = results.failedExpectations.map(result => result.stack);
        } else {
            metaData.trace = 'No Stack trace information';
        }
    }

    return metaData;
}


function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;
    else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;
    else if (a.timestamp > b.timestamp) return 1;

    return 0;
}


/** Class: ScreenshotReporter
 * Creates a new screenshot reporter using the given `options` object.
 *
 * For more information, please look at the README.md file.
 *
 * Parameters:
 *     (Object) options - Object with options as described below.
 *
 * Possible options:
 *     (String) baseDirectory - The path to the directory where screenshots are
 *                              stored. If not existing, it gets created.
 *                              Mandatory.
 *     (Function) pathBuilder - A function which returns a path for a screenshot
 *                              to be stored. Optional.
 *     (Function) jasmine2MetaDataBuilder - Function which returns an object literal
 *                                  containing meta data to store along with
 *                                  the screenshot. Optional.
 *     (Boolean) takeScreenShotsForSkippedSpecs - Do you want to capture a
 *                                                screenshot for a skipped spec?
 *                                                Optional (default: false).
 */
function ScreenshotReporter(options) {
    options = options || {};
    if (!options.baseDirectory || options.baseDirectory.length === 0) {
        throw new Error('Please pass a valid base directory to store the ' +
            'screenshots into.');
    } else {
        this.baseDirectory = options.baseDirectory;
    }

    if (typeof (options.cssOverrideFile) !== 'undefined' && _isString(options.cssOverrideFile)) {
        this.cssOverrideFile = options.cssOverrideFile;
    } else {
        this.cssOverrideFile = null;
    }

    if (typeof (options.screenshotsSubfolder) !== 'undefined' && _isString(options.screenshotsSubfolder)) {
        this.screenshotsSubfolder = options.screenshotsSubfolder;
    } else {
        this.screenshotsSubfolder = '';
    }

    if (typeof (options.jsonsSubfolder) !== 'undefined' && _isString(options.jsonsSubfolder)) {
        this.jsonsSubfolder = options.jsonsSubfolder;
    } else {
        this.jsonsSubfolder = '';
    }

    this.pathBuilder = options.pathBuilder || defaultPathBuilder;
    this.docTitle = options.docTitle || 'Test Results';
    this.docName = options.docName || 'report.html';
    this.jasmine2MetaDataBuilder = options.jasmine2MetaDataBuilder || jasmine2MetaDataBuilder;
    this.sortFunction = options.sortFunction || sortFunction;
    this.preserveDirectory = typeof options.preserveDirectory !== 'undefined' ? options.preserveDirectory : true;
    this.excludeSkippedSpecs = options.excludeSkippedSpecs || false;
    this.takeScreenShotsForSkippedSpecs =
        options.takeScreenShotsForSkippedSpecs || false;
    this.gatherBrowserLogs =
        options.gatherBrowserLogs || true;
    this.takeScreenShotsOnlyForFailedSpecs =
        options.takeScreenShotsOnlyForFailedSpecs || false;
    this.disableScreenshots = options.disableScreenshots || false;
    this.clientDefaults = options.clientDefaults || {};
    if (options.searchSettings) { //settings in earlier "format" there?
        this.clientDefaults.searchSettings = options.searchSettings;
    }
    if (options.columnSettings) {
        this.clientDefaults.columnSettings = options.columnSettings;
    }
    this.customCssInline = options.customCssInline;

    this.finalOptions = {
        excludeSkippedSpecs: this.excludeSkippedSpecs,
        takeScreenShotsOnlyForFailedSpecs: this.takeScreenShotsOnlyForFailedSpecs,
        takeScreenShotsForSkippedSpecs: this.takeScreenShotsForSkippedSpecs,
        disableScreenshots: this.disableScreenshots,
        pathBuilder: this.pathBuilder,
        sortFunction: this.sortFunction,
        baseDirectory: this.baseDirectory,
        screenshotsSubfolder: this.screenshotsSubfolder,
        docTitle: this.docTitle,
        docName: this.docName,
        cssOverrideFile: this.cssOverrideFile,
        prepareAssets: true,
        clientDefaults: this.clientDefaults,
        customCssInline: this.customCssInline
    };
    if (!this.preserveDirectory) {
        util.removeDirectory(this.finalOptions.baseDirectory);
    }
}

/**
 * Returns a reporter that complies with the new Jasmine 2.x custom_reporter.js spec:
 * http://jasmine.github.io/2.1/custom_reporter.html
 */
ScreenshotReporter.prototype.getJasmine2Reporter = function () {

    return new Jasmine2Reporter({screenshotReporter: this});

};

/**
 * Returns a reporter that complies with the new Jasmine 3.x custom_reporter.js spec:
 * https://jasmine.github.io/api/3.5/Reporter.html
 */
ScreenshotReporter.prototype.getJasmine3Reporter = function () {

    return new Jasmine3Reporter({screenshotReporter: this});

};


module.exports = ScreenshotReporter;
