'use strict';

/* Directives */
var appDirectives = angular.module('ms.site.directives',[]);


var IDCARD_REGEXP = /(^\d{17}(\d|X)$)/;
var INTEGER_REGEXP = /^\-?\d+$/;
var MONEY_REGEXP = /^\d+(\.\d{1,2})?$/;

function validateidenttiycard(id) {
    var arr = id.split(''), sum = 0, vc = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    for (var i = 0; i < 17; i++) sum += vc[i] * parseInt(arr[i]);
    return ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'][sum % 11];
}

appDirectives.directive('idcard', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            elm.on("keyup", function (event) {
                var viewValue = elm.val()
                
                if (scope.lastlength!=18 &&viewValue.length == 17) {
                    elm.val(viewValue + validateidenttiycard(viewValue))
                    ctrl.$setViewValue(elm.val())
                }
                scope.lastlength = elm.val().length
            })
            ctrl.$validators.integercheck = function (modelValue, viewValue) {        
                if (IDCARD_REGEXP.test(viewValue)) {
                    // it is valid
                    return true;
                }
                // it is invalid
                return false;
            };
            ctrl.$validators.idcardcheck = function (modelValue, viewValue) {
              
                if (viewValue == null)
                    return true
                if (validateidenttiycard(viewValue) != viewValue[17])
                    return false
                // it is invalid
               
                return true;
            };
        }
    };
});
appDirectives.directive('integer', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.integercheck = function (modelValue, viewValue) {        
                if (viewValue==null || viewValue==""||INTEGER_REGEXP.test(viewValue)) {
                    // it is valid
                    return true;
                }
                // it is invalid
                return false;
            };

        }
    };
});
appDirectives.directive('currency', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.currencycheck = function (modelValue, viewValue) {
                if (viewValue==null || viewValue==""|| MONEY_REGEXP.test(viewValue)) {
                    // it is valid
                    
                    return true;
                }
                // it is invalid
                return false;
            };

        }
    };
})
appDirectives.directive('compare', function () {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: "=compare"
        },
        link: function (scope, elm, attrs, ctrl) {
          

            ctrl.$validators.compareTo = function (modelValue) {
                
                    return scope.otherModelValue == null || modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ctrl.$validate();
                });

        }
    };
})
appDirectives.directive('exportTable', function () {
    return {
        restrict: 'A',
        templateUrl: '/pages/shared/export_table.html',
        scope: {
            tableName: '=',
            amountName: '@',
            cols: '=',
            rows: '=',
            summary: '=',
            orderBy: '=',
            tips: '='
        },
        controller: ['$scope', '$filter', '$window', function ($scope, $filter, $window) {
            // Print html table.
            $scope.print = function () {
                $window.print();
            };

            // Export table as excel.
            $scope.export = function () {
                var now = $filter('date')(new Date(), 'yyyyMMddHHmmss');
                var selected = [];

                // Handle summary row.
                var summaryRow = {};

                $scope.cols.forEach(function (col, idx) {
                    if (col.visible) {
                        selected.push('`' + col.name + '` AS `' + col.displayName + '`');
                        
                        if (idx == 0) {
                            summaryRow[col.name] = '合计';
                        } else {
                            summaryRow[col.name] = $scope.summary[col.name] != null ? $scope.summary[col.name].toFixed(2) : ' ';
                        }
                    }
                });

                var dataSet = angular.copy($scope.rows);
                dataSet.push(summaryRow);

                alasql('SELECT ' + selected.join() + ' INTO XLSX("' + $scope.tableName + '_' + now + '.xlsx") FROM ?', [dataSet]);
            };
        }]
    };
})
appDirectives.directive('enterFocusNext', function () {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {
            elem.bind('keydown', function (e) {
                var code = e.keyCode || e.which;
                if (code === 13) {
                    e.preventDefault();

                    // Focus marker.
                    var partsId = attrs.id.match(/fm(\d+)/);
                    var currentId = parseInt(partsId[1]);

                    var nextEle = angular.element(document.querySelector('#fm' + (currentId + 1)));
                    nextEle.focus();
                    nextEle.select();
                }
            });
        }
    }
});