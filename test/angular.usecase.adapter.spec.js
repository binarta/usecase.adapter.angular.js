describe('angular.usecase.adapter.js', function () {
    var scope, payload;

    beforeEach(module('angular.usecase.adapter'));
    beforeEach(function () {
        scope = {};
        payload = 'payload';
    });

    describe('usecaseAdapterFactory', function () {
        var handler, completed, adapter, callbacks;

        function onSuccess(payload) {
            completed = payload;
        }

        beforeEach(inject(function (usecaseAdapterFactory) {
            completed = undefined;
            callbacks = {
                rejected:function(rejections) {
                    this.capturedRejections = rejections;
                }
            };
            adapter = usecaseAdapterFactory(scope, onSuccess, callbacks);
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

            it('test', function() {
                expect(scope.violationParams).toBeUndefined();
            });

            describe('when rejected', function() {
                var violations = {
                    "field-with-violations": ["violation"]
                };
                beforeEach(function() {
                    adapter.rejected(violations);
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

                it('trigger callback', function() {
                    expect(callbacks.capturedRejections).toEqual(violations);
                });
            });
        });

        it('success handler', function () {
            adapter.success(payload);
            expect(completed).toEqual(payload);
        });

        describe('when no callback is defined', function() {
            beforeEach(inject(function (usecaseAdapterFactory) {
                adapter = usecaseAdapterFactory(scope, onSuccess, undefined);
                adapter.reset();
                adapter.rejected({
                    "field-with-violations": ["violation"]
                });
            }));

            it('violations can be retrieved', function () {
                expect(scope.violations['field-with-no-violations']).toEqual(undefined);
                expect(scope.violations['field-with-violations']).toEqual(['violation']);
            });
        });

        describe('with complex reporting enabled', function() {
            beforeEach(inject(function(usecaseAdapterFactory) {
                adapter = usecaseAdapterFactory(scope, onSuccess, null, 'complex');
            }));

            describe('given adapter reset', function() {
                beforeEach(function() {
                    adapter.reset();
                });

                it('violation parmams are initialized', function() {
                    expect(scope.violationParams).toEqual({});
                });

                describe('when rejected', function() {
                    beforeEach(function() {
                        adapter.rejected({
                            "field-with-violations": [{label:"violation", params:{extra:"info"}}]
                        });
                    });

                    it('test', function() {
                        expect(scope.violationParams["field-with-violations"].violation).toEqual({extra:'info'})
                    })
                });
            });
        });
    });
});
