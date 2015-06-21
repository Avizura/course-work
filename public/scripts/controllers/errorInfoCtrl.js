angular.module('myApp')
  .controller('errorInfoCtrl', function($rootScope, $scope, $state, $http, config) {
    $scope.star = "icon-star-empty";
    $scope.setStar = function() {
      if ($scope.star === "icon-star-empty") {
        $scope.star = "icon-star";
        $scope.starred = $scope.recent.error_id;
      } else {
        $scope.star = "icon-star-empty";
      }
    };
    $scope.getErrorInfo = function() {
      $http.post(config.serverAddress + '/errorInfo', $rootScope.recent)
        .success(function(data, status, headers, config) {
          console.log(data);
          $scope.errorInfo = data[0];
          console.log(data[0]);
          if ($scope.errorInfo.stacktrace)
            $scope.errorInfo.stacktrace = $scope.errorInfo.stacktrace.split(/\n/g);
          $scope.errorInfo.local_time = new Date($scope.errorInfo.local_time).toLocaleString('ru');
          console.log($scope.errorInfo.local_time);
          console.log($scope.errorInfo.stacktrace);
        });
    };
    $scope.moreFromVisitor = function() {
      $rootScope.visitor_id = $scope.errorInfo.visitor_id;
      $state.go('navbar.charts.fromVisitor');
    };
    $scope.getErrorInfo();
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      console.log('STATE HAS BEEN CHANGED MOTHEFUCKER');
      if ($scope.starred) {
        console.log('GO GO GO GO GO');
        $http.post(config.serverAddress + '/starred', {
            error_id: $scope.recent.error_id
          })
          .success(function(data, status) {
            console.log(data);
          });
      }
    });
  });
