describe('angular.usecase.adapter.js', function () {
    var scope, payload;

    beforeEach(module('angular.usecase.adapter'));
    beforeEach(function () {
        scope = {};
        payload = 'payload';
    });

    describe('usecaseAdapterFactory', function () {
        var handler, completed, adapter;

        function onSuccess(payload) {
            completed = payload;
        }

        beforeEach(inject(function (usecaseAdapterFactory) {
            completed = undefined;
            adapter = usecaseAdapterFactory(scope, onSuccess);
        }));

        it('toggle working status', function () {
            adapter.start();
            expect(scope.working).toEqual(true);
            adapter.stop();
            expect(scope.working).toEqual(false);
        });

        describe('given adapter reset', function() {
            beforeEach(function() {
                adapter.reset();
            });

            describe('when rejected', function() {
                beforeEach(function() {
                    adapter.rejected({
                        "field-with-violations": ["violation"]
                    });
                });

                it('error classes can be retrieved', function () {
                    expect(scope.errorClassFor['field-with-no-violations']).toEqual(undefined);
                    expect(scope.errorClassFor['field-with-violations']).toEqual('error');
                });

                it('violations can be retrieved', function () {
                    expect(scope.violations['field-with-no-violations']).toEqual(undefined);
                    expect(scope.violations['field-with-violations']).toEqual(['violation']);
                });

                it('reset rejections', function () {
                    adapter.reset();
                    expect(scope.errorClassFor).toEqual({});
                    expect(scope.violations).toEqual({});
                });
            });
        });

        it('success handler', function () {
            adapter.success(payload);
            expect(completed).toEqual(payload);
        });
    });
});
