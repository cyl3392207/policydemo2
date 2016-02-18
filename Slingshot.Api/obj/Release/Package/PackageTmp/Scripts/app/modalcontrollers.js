'use strict';

/* Controllers */

var appControllers = angular.module('ms.site.controllers.modal',['ms.site.services']);

appControllers.controller('PolicyDefinitionModal', ['$scope','$modalInstance','detail', function ($scope, $modalInstance, detail) {
    $scope.detail = detail
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]).
controller('PolicyAssignmentModal', ['$scope', '$modalInstance', 'detail','RestService', function ($scope, $modalInstance, detail,RestService) {
    $scope.detail = detail
    var subId = detail.id.substring(15, 51);
    $scope.assignments = []
    $scope.scopes = []
    $scope.pa = {properties:{policyDefinitionId: detail.id}, name:guid() }
    $scope.scopes.push({id:("/subscriptions/" + subId),name:("/subscriptions/" + subId)})
    RestService.getclient('pa').query({ id: subId }, function (items) {
        items.value.forEach(function (a) {
            if (a.properties.policyDefinitionId == detail.id) {
                $scope.assignments.push(a)
            }
        })
        
    })

    RestService.getclient('rg').query({ id: subId }, function (items) {
        items.value.forEach(function (a) {
            $scope.scopes.push(a)
        })
    })
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };

    $scope.addassignment = function () {
        //RestService.getclient
        RestService.getclient('pa').update({ id: $scope.pa.properties.scope.substring(15, $scope.pa.properties.scope.length), name: $scope.pa.name }, $scope.pa, function (data) {
            $scope.assignments.push(data)
        })
    }
    $scope.deleteassignment = function (p) {
        RestService.getclient('pa').delete({ id: p.properties.scope.substring(15, p.properties.scope.length), name: p.name }, function (data) {
            $scope.assignments.pop(p)
        })
    }
}]).
controller('PolicyLogModalCtrl', ['$scope', '$modalInstance', 'detail', 'RestService', function ($scope, $modalInstance, detail, RestService) {
    $scope.detail = detail
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]).
controller('NewPolicyModalCtrl', ['$scope', '$modalInstance', 'subs', '$filter','RestService', function ($scope, $modalInstance, subs, $filter, RestService) {
    $scope.subs = subs
    $scope.policy = { properties: {}}
    $scope.ok = function () {
        var selectedsubs = $filter('filter')($scope.subs, { selected: true }, true)
        var policy = angular.copy($scope.policy)
        policy.properties.policyRule = angular.fromJson($scope.policy.properties.policyRule)
        selectedsubs.forEach(function (s) {
            RestService.getclient('pd').update({ id: s.subscriptionId, name: policy.name }, policy, function (data) {
                $modalInstance.close(data)
            }), function (data) {
                alert(angular.toJson(data))
            }
        })
    }
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]).controller('ConfirmModalCtrl', ['$scope', 'UserService', '$modalInstance', function ($scope, UserService, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close()
    };
    $scope.cancel = function () {
        $modalInstance.dismiss()
    };
}]).controller('GalleryModalCtrl', ['$scope', '$http', '$modalInstance', function ($scope, $http, $modalInstance) {

    var gallery = ["https://raw.githubusercontent.com/cyl3392207/msblogs/master/policyexamples/templates/tag-policy.json",
        "https://raw.githubusercontent.com/cyl3392207/msblogs/master/policyexamples/templates/storage-account-type-policy.json",
        "https://raw.githubusercontent.com/cyl3392207/msblogs/master/policyexamples/templates/service-curation.json"
        , "https://raw.githubusercontent.com/cyl3392207/msblogs/master/policyexamples/templates/vm-location-policy.json",
        "https://raw.githubusercontent.com/cyl3392207/msblogs/master/policyexamples/templates/redis-ssl-only-policy.json",
        "https://raw.githubusercontent.com/cyl3392207/msblogs/master/policyexamples/templates/sku-white-list-per-resource-type.json"
    ]
    $scope.items = []
    gallery.forEach(function (url) {
        $http.get(url).success(function (data, status, headers, config) {
            
            var parameters = data.parameters
            var title = data.title
            var description = data.description
          
            $scope.items.push({ data:data, title: title, description: description, parameters: parameters })
        })
    })
    $scope.preview = function (policy) {
        if (policy == null) {
            return ""
        }
        var data = policy.data
        var rule = angular.toJson(data.policyRule,true)
        policy.parameters.forEach(function (p) {
            if (p.type != "array") {
                rule = rule.replaceAll("[parameters('" + p.name + "')]", p.value)
            } else {
                rule = rule.replaceAll("\"[parameters('" + p.name + "')]\"", p.value)
            }
        })
        return rule
    }
    
    $scope.ok = function () {
        $modalInstance.close()
    };
    $scope.cancel = function () {
        $modalInstance.dismiss()
    };
}])

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

