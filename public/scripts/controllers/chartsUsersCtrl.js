angular.module('myApp')
  .controller('chartsUsersCtrl', function($scope, $http, config) {
    $scope.page = 0;
    $scope.itemsPerPage = 1000;
    $scope.reqUsers = function(filter) {
      $http.post(config.serverAddress + '/users', filter)
        .success(function(data, status, headers, config) {
          console.log('Users!');
          console.log(data);
          for (var i = 0; i < data.length; ++i) {
            data[i].timestamp = new Date(data[i].timestamp).toLocaleString('ru');
          }
          $scope.users = data;
        });
    }
    $scope.$watchGroup(['selectedIcon', 'selectedPeriod'], function() {
      $scope.reqUsers({
        selectedIcon: $scope.selectedIcon,
        selectedPeriod: $scope.selectedPeriod
      });
    });
  });
    // console.log('value changed!');
    // if ($scope.selectedIcon == '') {
    //   // $scope.reqRecent();
    // } else {
    //   $http.post(config.serverAddress + '/recent', {
    //       selectedIcon: $scope.selectedIcon
    //     })
    //     .success(function(data, status, headers, config) {
    //       console.log(data);
    //       for (var i = 0; i < data.length; ++i) {
    //         data[i].error_timestamp = new Date(data[i].error_timestamp).toLocaleString('ru');
    //       }
    //       $scope.recent = data;
    //     });
    // }
    // $scope.$watch('selectedPeriod', function() {
    //   if ($scope.selectedPeriod == '') {
    //     $scope.reqRecent();
    //   } else {
    //     $http.post(config.serverAddress + '/recent', {
    //         selectedIcon: $scope.selectedIcon,
    //         selectedPeriod: $scope.selectedPeriod
    //       })
    //       .success(function(data, status, headers, config) {
    //         console.log(data);
    //         for (var i = 0; i < data.length; ++i) {
    //           data[i].error_timestamp = new Date(data[i].error_timestamp).toLocaleString('ru');
    //         }
    //         $scope.recent = data;
    //       });
    //   }
    // });
