angular.module('myApp')
  .controller('chartsUsersCtrl', function($scope, $http, config) {
    $scope.exist = true;
    $scope.page = 0;
    $scope.itemsPerPage = 1000;
    $scope.reqUsers = function(filter) {
      $http.post(config.serverAddress + '/users', filter)
        .success(function(data, status, headers, config) {
          console.log('Users!');
          console.log(data);
          if (data) {
            $scope.exist = true;
            for (var i = 0; i < data.length; ++i) {
              data[i].timestamp = new Date(data[i].timestamp).toLocaleString('ru');
            }
            $scope.users = data;
          } else {
            $scope.exist = false;
          }
        });
    };
    $scope.selectedPeriod = '';
    $scope.periods = [{
      value: '',
      label: 'All Time'
    }, {
      value: '168',
      label: 'Week'
    }, {
      value: '24',
      label: '24 hours'
    }, {
      value: '12',
      label: '12 hours'
    }, {
      value: '6',
      label: '6 hours'
    }, {
      value: '2',
      label: '2 hours'
    }, {
      value: '1',
      label: '1 hour'
    }];
    $scope.$watchGroup(['selectedIcon', 'selectedPeriod'], function() {
      $scope.reqUsers({
        selectedIcon: $scope.selectedIcon,
        selectedPeriod: $scope.selectedPeriod
      });
    });
  });
