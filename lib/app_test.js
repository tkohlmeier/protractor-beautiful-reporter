describe('unit tests', function () {
    beforeEach(function () {
        module("reportingApp");
    });
    var $controller;
    var $rootScope;
    beforeEach(inject(function(_$controller_,_$rootScope_){
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));
    describe('sorting the list of users', function () {
        it('sorts in descending order by default', function () {
            expect(angular).toBeDefined();
            // your test assertion goes here

        });
    });
});
