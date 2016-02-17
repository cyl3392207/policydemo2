'use strict';

/* Controllers */

var appControllers = angular.module('ms.site.controllers', ['ms.site.controllers.modal', 'ui.grid', 'ui.bootstrap']);


appControllers.controller('PolicyCtrl', ['$scope', '$modal', 'RestService','$location','$filter', function ($scope, $modal, RestService, $location,$filter) {
    RestService.getclient('subscription').query(function (items) {
        $scope.subs = items.value
        $scope.policies = []
        $scope.assignmentnumbers = []
        $scope.violationnumbers = []
        $scope.events = []
        $scope.loadingpolcy = true
        $scope.loadinglogs = true
        $scope.loadingassignments = true
        $scope.subs.forEach(function (sub) {
            $scope.policies[sub.subscriptionId] = []
            RestService.getclient('pd').query({ id: sub.subscriptionId }, function (items) {
                $scope.loadingpolcy = false
                items.value.forEach(function (item) {
                    if (item.properties.policyType == "Custom") {
                        $scope.assignmentnumbers[item.id] = 0
                        $scope.violationnumbers[item.id] = 0
                        $scope.events[item.id] = []
                        $scope.policies[sub.subscriptionId].push(item)
                    }

                })

                RestService.getclient('pa').query({ id: sub.subscriptionId }, function (assignments) {
                    $scope.loadingassignments = false
                    assignments.value.forEach(function (a) {
                        if ($scope.assignmentnumbers[a.properties.policyDefinitionId] == null) {
                            $scope.assignmentnumbers[a.properties.policyDefinitionId] = 1
                        } else {
                            $scope.assignmentnumbers[a.properties.policyDefinitionId] ++
                        }
                    })

                })
                var today = new Date()
                var span = new Date(new Date().setDate(today.getDate()- 10))
                RestService.getclient('events').query({ id: sub.subscriptionId, filter: "eventTimestamp ge '" + span.toJSON() + "' and eventTimestamp le '" + today.toJSON() + "'" }, function (events) {
                    $scope.loadinglogs = false
                    events.value.forEach(function(event){
                        if (event.subStatus.value == "Forbidden") {
                            var pattern = /\/subscriptions(\w|\d|\/|-|\.)+/i
                            var policy = event.properties.statusMessage.match(pattern)[0]
                            $scope.violationnumbers[policy]++
                            $scope.events[policy].push(event)
                        }
                    })
                })

            })
        })
    })

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
    $scope.viewAssignments = function (p) {
        var modalInstance = $modal.open({
            templateUrl: "/pages/policyassignmentmodal.html",
            size: 'lg',
            controller: "PolicyAssignmentModal",
            resolve: {
                detail: function () {
                    return p;
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

}])