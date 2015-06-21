angular.module('myApp')
  .controller('chartsDailyCtrl', function($scope, $http, config) {
    $scope.exist = true;
    $scope.page = 0;
    $scope.itemsPerPage = 1000;
    $http.post(config.serverAddress + '/daily')
      .success(function(data, status, headers, config) {
        console.log('DAILY');
        console.log(data);
        if (data) {
          $scope.exist = true;
          // for(var i=0; i<data.length; ++i){
          //   data[i].error_date = new Date(data[i].error_date).toDateString('ru');
          // }
          $scope.daily = data;
        } else {
          scope.exist = false;
        }
      });
      $scope.selectedIcon = '';
      $scope.icons = [{
        value: '',
        label: 'Show All'
      }];
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
  });
