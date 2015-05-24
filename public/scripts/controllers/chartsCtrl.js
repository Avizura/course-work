angular.module('myApp')
  .controller('chartsCtrl', function($scope, $state, $http, config) {
    $scope.clicked = true;
    $scope.chartsData = false;
    $http.post(config.serverAddress + '/recentUrls')
      .success(function(urls, status, headers, config) {
        console.log(urls);
        for (var i = 0; i < urls.length; ++i) {
          $scope.icons.push({
            value: urls[i].error_url,
            label: urls[i].error_url
          });
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
