angular.module('myApp')
  .controller('chartsCtrl', function($scope, $state, $http, config) {
    // $scope.chartsData = false;
    $state.go('navbar.charts.dashboard');
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
  });
