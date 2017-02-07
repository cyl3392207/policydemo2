'use strict';

/* App Module */


var appmodule = angular.module('ms.site', ['ngCookies','ngRoute', 'ms.site.controllers',
  'ms.site.services', 'ms.site.directives', 'ms.site.filters', 'ui.bootstrap', 
 // 'ms.site.filters'
])
        .config(['$routeProvider',
          function ($routeProvider) {
              $routeProvider.
                when('/policy', {
                    templateUrl: '/pages/policydefinitions.html',
                    controller: 'PolicyCtrl'
                }).when('/policybuilder', {
                    templateUrl: '/pages/policybuilder.html',
                    controller: 'PolicyBuilderCtrl'
                }).otherwise({
                    redirectTo: '/policybuilder'
                })
          }])

appmodule.directive('datepickerPopup', function () {
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function (scope, element, attr, controller) {
            //remove the default formatter from the input directive to prevent conflict
            controller.$formatters.shift();
        }
    }
});

appmodule.run(function ($http, $cookies) {
    if ($cookies.token != null) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.token
    }
});