angular.module('myApp')
  .controller('chartsStarredCtrl', function($scope, $state, $http, $sce, config) {
    $scope.exist = true;
    $scope.page = 0;
    $scope.itemsPerPage = 1000;
    $scope.reqStarred = function(filter) {
      $http.post(config.serverAddress + '/getStarred', filter)
        .success(function(data, status, headers, config) {
          console.log('STARRED');
          console.log(data);
          if (data) {
            $scope.exist = true;
            for (var i = 0; i < data.length; ++i) {
              data[i].error_timestamp = new Date(data[i].error_timestamp).toLocaleString('ru');
            }
            $scope.starred = data;
          } else {
            $scope.exist = false;
          }
        });
    };
    $scope.reqStarred();
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
