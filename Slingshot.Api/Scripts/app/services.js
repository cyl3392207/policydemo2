'use strict';

/* Services */

var appServices = angular.module('ms.site.services', ['ngResource', 'ngCookies']);


appServices.factory('Constants', ['$resource','$filter',
  function ($resource,$filter) {

      var dic = new Array();
    
      function getlist(type) {
          if (dic[type] == undefined) {
              var resouce = $resource('/data/' + type + '.json', {}, {
              })
              dic[type] = resouce.query();
          }
          return dic[type];
      }

      return {
          list: function (type) {
             return getlist(type)
          },
          filter: function (id, type) {
              if (dic[type] == undefined) {
                  var resouce = $resource('/data/' + type + '.json', {}, {
                  })
                  resouce.query(function (list) {
                      return $filter(resultlist, "{id:" + id + "}")

                  });
              }
       
          }
      }
   
  }]).factory('UserService', ['$http', '$rootScope', '$resource', '$window', '$cookies', function ($http, $rootScope, $resource, $window, $cookies) {

      var user = null;
      if ($cookies.user != null) {
          try {
              user = angular.fromJson($cookies.user);
          }catch(e){
              $cookies.user=null
          }
          
      }
      var resouce = $resource('/api/Users/:userId', { userId:'@id'}, {
      })
     
      var rst = {
          getcurrentuser: function () {
              return user;
          },
          login: function (username, password,success,fail) {
              var loginData = "grant_type=password&username=" + username + "&password=" + password;

              $http.post("/token",loginData).success(function (data) {
                  // Cache the access token in session storage.
                  $cookies.token= data.access_token;
                  $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.token
                  $http.get("/api/Account/info").success(function (data) {
                      user = data
                      $cookies.user= angular.toJson(user);
                      //$rootScope.user = user;
                      //$rootScope.$broadcast('user_changed', user);
                      $window.location.reload()
                  }).error(function () {
                      $cookies.user = null;
                  })
                  success()
              }).error(function () {
                  fail()
              })
          },
          logout: function () {
              user = null;
              $cookies.user = null;
              $rootScope.user = user;
              $rootScope.$broadcast('user_changed', user);
              $window.location.reload()
          },
          list: function () {
              return  resouce.query()
          },
          create: function (newuser){
              return resouce.save(newuser)
          },
          remove: function (userId,done) {
              return resouce.remove({ userId: userId }, function (data) {
                 done()
              })
          }
      };
       
      return rst;
  }]).factory('RestService', ['$http', '$resource', function ($http, $resource) {
      var clients = []
      clients['subscription'] = $resource('/api/subscriptions/:id?api-version=2014-04-01-preview', { id: '@id' }, { 'update': { method: 'PUT' }, 'query': { isArray: false } })
      clients['pd'] = $resource('/api/subscriptions/:id/providers/Microsoft.Authorization/policyDefinitions/:name?api-version=2015-10-01-preview', { id: '@id',name:'@name' }, { 'update': { method: 'PUT' }, 'query': { isArray: false } })
      clients['pa'] = $resource('/api/subscriptions/:id/providers/Microsoft.Authorization/policyAssignments/:name?api-version=2015-10-01-preview', { id: '@id', name: '@name' }, { 'update': { method: 'PUT' }, 'query': { isArray: false } })


      //https://msdn.microsoft.com/en-us/library/azure/dn931934.aspx
      clients['events'] = $resource('/api/subscriptions/:id/providers/microsoft.insights/eventtypes/management/values?api-version=2015-04-01&$filter=:filter', { id: '@id', filter: 'filter' }, { 'update': { method: 'PUT' }, 'query': { isArray: false, headers: {'Accept':'application/json'} } })
      clients['rg'] = $resource('/api/subscriptions/:id/resourceGroups/:name?api-version=2015-11-01', { id: '@id', name: '@name' }, { 'update': { method: 'PUT' }, 'query': { isArray: false } })
      return {
          getclient: function(resoucename){
              return clients[resoucename]
          }

      }
      
  }])