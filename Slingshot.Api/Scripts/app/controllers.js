﻿'use strict';

/* Controllers */

var appControllers = angular.module('ms.site.controllers', ['ms.site.controllers.modal', 'ui.grid', 'ui.bootstrap']);


appControllers.controller('PolicyCtrl', ['$scope', '$modal', 'RestService','$location','$filter', function ($scope, $modal, RestService, $location,$filter) {
    Initialize($scope, $modal, RestService, $location, $filter)

    $scope.viewJson = function (p) {
        var modalInstance = $modal.open({
            templateUrl: "/pages/policydetailmodal.html",
            size: 'lg',
            controller: "PolicyDefinitionModal",
            resolve: {
                detail: function () {
                    return p;
                }
            }
        });
        modalInstance.result.then(function () {
        
        })

    }
    $scope.viewAssignments = function (p,sub) {
        var modalInstance = $modal.open({
            templateUrl: "/pages/policyassignmentmodal.html",
            size: 'lg',
            controller: "PolicyAssignmentModal",
            resolve: {
                detail: function () {
                    return p;
                },
                sub: function () {
                    return sub;
                }
            }
        });
        modalInstance.result.then(function () {

        })
    }
    $scope.viewLogs = function (p) {
        var modalInstance = $modal.open({
            templateUrl: "/pages/policylogmodal.html",
            size: 'lg',
            controller: "PolicyLogModalCtrl",
            resolve: {
                detail: function () {
                    return $scope.events[p.id];
                }
            }
        });
        modalInstance.result.then(function () {

        })
    }
    $scope.addPolicy = function () {
        var modalInstance = $modal.open({
            templateUrl: "/pages/newpolicymodal.html",
            size: 'lg',
            controller: "NewPolicyModalCtrl",
            resolve: {
                subs: function () {
                    return $scope.subs;
                }
            }
        });
        modalInstance.result.then(function () {

        })
    }
    $scope.deletepd = function (p) {
        var modalInstance = $modal.open({
            templateUrl: "/pages/confirmmodal.html",
            size: 'lg',
            controller: "ConfirmModalCtrl"
        });
        modalInstance.result.then(function () {
            var subId = p.id.substring(15, 51);
            RestService.getclient('pd').delete({ id: subId, name: p.name }, function (data) { }
            , function (data) {
                alert(angular.toJson(data,true))               
            })
        })
    }
    $scope.gallery = function () {
        var modalInstance = $modal.open({
            templateUrl: "/pages/gallerymodal.html",
            size: 'lg',
            controller: "GalleryModalCtrl"
        });
        modalInstance.result.then(function () {

        })
    }

}]).controller('PolicyBuilderCtrl', ['$scope', '$modal', 'RestService', '$location', '$filter', function ($scope, $modal, RestService, $location, $filter) {
    Initialize($scope, $modal, RestService, $location, $filter)
    $('#builder').queryBuilder({
        plugins: ['not-group', 'sortable'],
        filters: filters
    });
    $scope.generatedpolicy = {}
    $scope.then = {}
    $scope.result = {}
    $scope.then.details = []
    $scope.filters = filters
    var updatecallback = function (e, rule, error, value) {
        $scope.result = $('#builder').queryBuilder('getRules');
        if (!$.isEmptyObject($scope.result)) {
            $scope.$applyAsync(function () {
                $scope.generatedpolicy = convertToPolicyDefnitionRule($scope.result, $scope.then);
                })
            }
        }
    $scope.addtoappend = function () {
        var array = /\[[^parameter]*\]/
        var object = /\{*\}/
        var isarrayorobject = array.exec($scope.valuetoadd) != null || object.exec($scope.valuetoadd)!=null
        var arrayvalue = null
        try{
            $scope.then.details.push({ field: $scope.fieldtoadd, value: isarrayorobject? JSON.parse($scope.valuetoadd) : $scope.valuetoadd })
        } catch (err) {
            alert("invalid charactor in " + $scope.valuetoadd)
        }
        $scope.fieldtoadd = $scope.valuetoadd = null
    }
    $scope.resetappend = function () {
        $scope.then.details = []
    }

    $('#builder').on('afterUpdateRuleValue.queryBuilder', updatecallback);
    $('#builder').on('afterUpdateGroupCondition.queryBuilder', updatecallback);
    $('#builder').on('afterApplyRuleFlags.queryBuilder', updatecallback);
    $('#builder').on('afterUpdateRuleFilter.queryBuilder', updatecallback);
    $('#builder').on('afterUpdateRuleOperator.queryBuilder', updatecallback);
    $('#builder').on('afterMove.queryBuilder', updatecallback);
    $('#builder').on('AfterChangeNot.queryBuilder', updatecallback);

    $scope.loadpolicy = function (p) {
        var policyrule = p.properties.policyRule
        var rules = convertToRules(policyrule)
        $scope.then.effect = policyrule.then.effect.toLowerCase()
        $scope.then.details = policyrule.then.details
        var fields = jsonPath(p.properties.policyRule, "$..field")

        for (k in fields) {
            if ($.inArray(fields[k], $scope.filters) == -1) {
                try {
                    var newfilter = {
                        id: fields[k].toLowerCase(),
                        label: fields[k],
                        type: 'string',
                        operators: operators
                    }
                    $('#builder').queryBuilder('addFilter', newfilter);
                    $scope.filters.push(newfilter)
                } catch (ee) {

                }
       
            }
        }
      
        $('#builder').queryBuilder('setRules', rules);
  
    }



}])

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};
function Initialize($scope, $modal, RestService, $location, $filter) {
    RestService.getclient('subscription').query(function (items) {
        $scope.subs = items.value
        RestService.getclient('userinfo').query(function (user) {
            appInsights.setAuthenticatedUserContext(user.upn)
        })
      
        $scope.policies = []
        $scope.assignmentnumbers = []
        $scope.violationnumbers = []
        $scope.events = []
        $scope.loadingpolicy = true
        $scope.loadinglogs = true
        $scope.loadingassignments = true
        $scope.subs.forEach(function (sub) {
            $scope.policies[sub.subscriptionId] = []
            RestService.getclient('pd').query({ id: sub.subscriptionId }, function (items) {
                $scope.loadingpolicy = false
                items.value.forEach(function (item) {

                    $scope.assignmentnumbers[item.id] = 0
                    $scope.violationnumbers[item.id] = 0
                    $scope.events[item.id] = []
                    $scope.policies[sub.subscriptionId].push(item)


                })

                RestService.getclient('pa').query({ id: sub.subscriptionId }, function (assignments) {
                    $scope.loadingassignments = false
                    assignments.value.forEach(function (a) {
                        if ($scope.assignmentnumbers[a.properties.policyDefinitionId] == null) {
                            $scope.assignmentnumbers[a.properties.policyDefinitionId] = 1
                        } else {
                            $scope.assignmentnumbers[a.properties.policyDefinitionId]++
                        }
                    })

                })
                var today = new Date()
                var span = new Date(new Date().setDate(today.getDate() - 10))
                /*
                RestService.getclient('events').query({ id: sub.subscriptionId, filter: "eventTimestamp ge '" + span.toJSON() + "' and eventTimestamp le '" + today.toJSON() + "'" }, function (events) {
                    $scope.loadinglogs = false
                    events.value.forEach(function (event) {
                        if (event.subStatus.value == "Forbidden") {
                            var pattern = /\/subscriptions(\w|\d|\/|-|\.)+/i
                            var policy = event.properties.statusMessage.match(pattern)[0]
                            $scope.violationnumbers[policy]++
                            $scope.events[policy].push(event)
                        }
                    })
                })
                */
            })
        })
    })
}