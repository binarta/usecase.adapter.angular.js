angular.module('angular.usecase.adapter', [])
    .factory('usecaseAdapterFactory', function() {
        return function($scope, onSuccess, callbacks, reportType) {
            return {
                start:function() {
                    $scope.working = true;
                },
                stop:function() {
                    $scope.working = false;
                },
                reset:function() {
                    delete $scope.errorClassFor;
                    delete $scope.violations;
                    if (reportType == 'complex') $scope.violationParams = {};
                },
                rejected:function(violations) {
                    $scope.errorClassFor = {};
                    $scope.violations = {};
                    function exposeViolationParamsFor(k) {
                        $scope.violationParams[k] = {};
                        violations[k].forEach(function(it) {
                            $scope.violationParams[k][it.label] = it.params;
                        });
                    }

                    Object.keys(violations).forEach(function (k) {
                        $scope.errorClassFor[k] = violations[k] ? 'error' : '';
                        $scope.violations[k] = violations[k];
                        if (reportType == 'complex') exposeViolationParamsFor(k)
                    });
                    if(callbacks && callbacks.rejected) callbacks.rejected(violations);
                },
                success:onSuccess
            };
        };
    });