angular.module('myApp')
  .controller('fromVisitorCtrl', function($rootScope, $scope, $state, $http, config) {
    $scope.exist = true;
    $scope.getFromVisitor = function() {
      console.log('NNNNNNNNNNNNNNNNNN');
      console.log($rootScope.visitor_id);
      $http.post(config.serverAddress + '/fromVisitor', {
          visitor_id: $rootScope.visitor_id
        })
        .success(function(data, status, headers, config) {
          console.log(data);
          if (data) {
            $scope.exist = true;
            for (var i = 0; i < data.length; ++i) {
              data[i].error_timestamp = new Date(data[i].error_timestamp).toLocaleString('ru');
            }
            $scope.recent = data;
          } else {
            $scope.exist = false;
          }
        });
    };

    $scope.getFromVisitor();
    // $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //   console.log('STATE HAS BEEN CHANGED MOTHEFUCKER');
    //   if ($scope.starred) {
    //     console.log('GO GO GO GO GO');
    //     $http.post(config.serverAddress + '/starred', {
    //         error_id: $scope.recent.error_id
    //       })
    //       .success(function(data, status) {
    //         console.log(data);
    //       });
    //   }
    // });
  });
