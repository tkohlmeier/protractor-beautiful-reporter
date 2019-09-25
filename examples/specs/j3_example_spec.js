var PageObject = require('./PageObject.js');

describe('angularjs homepage', function () {
    var page;

    beforeEach(function () {
        page = new PageObject();
        browser.get('https://www.angularjs.org');
    });

    it('should fail as greeting text is different', function (done) {
        page.yourNameInputField.sendKeys('Julie').then(function(){
            page.greetingText.getText().then(function(text){
                expect(text).toEqual('Hello Julie hello!');
            });

        });
    });

    it('should greet the named user', function () {
        page.yourNameInputField.sendKeys('Julie');
        expect(page.greetingText.getText()).toEqual('Hello Julie!');
    });

    it('should contain log and pretty stack trace', function () {
        browser.executeScript("console.warn('This is some kind of warning!');");
        browser.executeScript("console.info('This is some kind of information!');");
        browser.executeScript("console.error('This is some kind of warning!');");

        browser.executeScript("arguments[0].addEventListener('click', function() { return throw new TypeError('type error'); })", page.addButton);
        page.addButton.click();

        page.yourNameInputField.sendKeys('Julie');
        expect(page.greetingText.getText()).toEqual('Hello Julie hello!');
    });

});
