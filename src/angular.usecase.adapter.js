angular.module('angular.usecase.adapter', [])
    .factory('usecaseAdapterFactory', function() {
        return function($scope, onSuccess, callbacks) {
            return {
                start:function() {
                    $scope.working = true;
                },
                stop:function() {
                    $scope.working = false;
                },
                reset:function() {
                    $scope.errorClassFor = {};
                    $scope.violations = {};
                },
                rejected:function(violations) {
                    Object.keys(violations).forEach(function (k) {
                        $scope.errorClassFor[k] = violations[k] ? 'error' : '';
                        $scope.violations[k] = violations[k];
                    });
                    if(callbacks.rejected) callbacks.rejected(violations);
                },
                success:onSuccess
            };
        };
    });