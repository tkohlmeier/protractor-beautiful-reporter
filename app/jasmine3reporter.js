const util = require('./util');
const path = require('path');

class Jasmine3Reporter {

    constructor({screenshotReporter}) {
        this._screenshotReporter = screenshotReporter;
        this._suiteNames = [];
        this._times = [];
    }

    suiteStarted(result) {
        this._suiteNames.push(result.description);
    }

    suiteDone() {
        this._suiteNames.pop();
    }

    specStarted() {
        this._times.push(util.nowString());
    }

    async specDone(result,done) {
        await this._asyncSpecDone(result,this._times.pop());
        done();
    }

    async _asyncSpecDone(result, start) {
        // Don't report if it's skipped and we don't need it
        if (['pending', 'disabled', 'excluded'].includes(result.status) && this._screenshotReporter.excludeSkippedSpecs) {
            return;
        }
        result.started = start;
        result.stopped = util.nowString();

        await this._gatherBrowserLogs(result);
        await this._takeScreenShotAndAddMetaData(result);
    }

    async _gatherBrowserLogs(result) {

        if (!this._screenshotReporter.gatherBrowserLogs) {
            return;
        }

        const capabilities = await browser.getCapabilities();
        const browserName = capabilities.get('browserName');

        /* Skip incompatible browsers. */
        if (browserName == null || !browserName.toLowerCase().match(/chrome/)) {
            return;
        }

        result.browserLogs = await browser.manage().logs().get('browser');

    }

    async _takeScreenShotAndAddMetaData(result) {

        const capabilities = await browser.getCapabilities();
        let suite = this._buildSuite();

        let descriptions = util.gatherDescriptions(
            suite,
            [result.description]
        );

        let baseName = this._screenshotReporter.pathBuilder(
            null,
            descriptions,
            result,
            capabilities
        );

        let metaData = this._screenshotReporter.jasmine2MetaDataBuilder(
            null,
            descriptions,
            result,
            capabilities
        );

        let screenShotFileName = path.basename(baseName + '.png');
        let screenShotFilePath = path.join(path.dirname(baseName + '.png'), this._screenshotReporter.screenshotsSubfolder);

        let metaFile = baseName + '.json';
        let screenShotPath = path.join(this._screenshotReporter.baseDirectory, screenShotFilePath, screenShotFileName);
        let metaDataPath = path.join(this._screenshotReporter.baseDirectory, metaFile);
        let jsonPartsPath = path.join(this._screenshotReporter.baseDirectory, path.dirname(metaFile), this._screenshotReporter.jsonsSubfolder, path.basename(metaFile));

        metaData.browserLogs = [];

        let considerScreenshot = !this._screenshotReporter.disableScreenshots && !(this._screenshotReporter.takeScreenShotsOnlyForFailedSpecs && result.status === 'passed')

        if (considerScreenshot) {
            metaData.screenShotFile = path.join(this._screenshotReporter.screenshotsSubfolder, screenShotFileName);
        }

        if (result.browserLogs) {
            metaData.browserLogs = result.browserLogs
        }

        metaData.timestamp = new Date(result.started).getTime();
        metaData.duration = new Date(result.stopped) - new Date(result.started);

        let testWasExecuted = ! (['pending','disabled','excluded'].includes(result.status));
        if (testWasExecuted && considerScreenshot) {
            try {
                console.log("jas3 screen");
                const png = await browser.takeScreenshot();
                util.storeScreenShot(png, screenShotPath);
            }
            catch(ex) {
                if(ex['name'] === 'NoSuchWindowError') {
                    console.warn('Protractor-beautiful-reporter could not take the screenshot because target window is already closed');
                }else {
                    console.error(ex);
                    console.error('Protractor-beautiful-reporter could not take the screenshot');
                }
                metaData.screenShotFile = void 0;
            }
        }

        util.storeMetaData(metaData, jsonPartsPath, descriptions);
        util.addMetaData(metaData, metaDataPath, this._screenshotReporter.finalOptions);
        this._screenshotReporter.finalOptions.prepareAssets = false; // signal to utils not to write all files again

    }

    // Enabling backwards-compat.  Construct Jasmine v1 style spec.suite.
    _buildSuite() {

        const buildSuite = (suiteNames, i) => {
            if (i < 0) {
                return null;
            }
            return {
                description: suiteNames[i],
                parentSuite: buildSuite(suiteNames, i - 1)
            };
        };

        return buildSuite(this._suiteNames, this._suiteNames.length);

    }

}

module.exports = Jasmine3Reporter;
