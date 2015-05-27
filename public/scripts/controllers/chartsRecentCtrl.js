angular.module('myApp')
  .config(function($dropdownProvider) {
    angular.extend($dropdownProvider.defaults, {
      html: true
    });
  })
  .controller('chartsRecentCtrl', function($scope, $http, $sce, config) {
    $scope.exist = true;
    $scope.page = 0;
    $scope.itemsPerPage = 1000;
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
          }
          else {
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
    $scope.$watchGroup(['selectedIcon', 'selectedPeriod'], function() {
      $scope.reqRecent({
        selectedIcon: $scope.selectedIcon,
        selectedPeriod: $scope.selectedPeriod
      });
    });
  });
