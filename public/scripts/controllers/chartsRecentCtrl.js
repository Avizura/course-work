angular.module('myApp')
  .config(function($dropdownProvider) {
    angular.extend($dropdownProvider.defaults, {
      html: true
    });
  })
  .controller('chartsRecentCtrl', function($rootScope, $scope, $state, $http, $sce, config) {
    $scope.exist = true;
    $scope.page = 0;
    $scope.itemsPerPage = 1000;
    $scope.getErrorInfo = function(info) {
      console.log(info);
      $rootScope.recent = info;
      $state.go('navbar.charts.errorInfo');
    };
    $scope.reqRecent = function(filter) {
      $http.post(config.serverAddress + '/recent', filter)
        .success(function(data, status, headers, config) {
          console.log('RECENT');
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
    $scope.reqRecent();
    //request for distinct urls
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
      $scope.reqRecent({
        selectedIcon: $scope.selectedIcon,
        selectedPeriod: $scope.selectedPeriod
      });
    });
  });
