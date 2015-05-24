angular.module('myApp')
  .controller('chartsDailyCtrl', function($scope, $http, config) {
    $scope.page = 0;
    $scope.itemsPerPage = 1000;
    $http.post(config.serverAddress + '/daily')
      .success(function(data, status, headers, config) {
        console.log('DAILY');
        console.log(data);
        for(var i=0; i<data.length; ++i){
          data[i].error_date = new Date(data[i].error_date).toDateString('ru');
        }
        $scope.daily = data;
      });
  });
