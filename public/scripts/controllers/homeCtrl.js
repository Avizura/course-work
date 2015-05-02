angular.module('myApp')
  .controller('homeCtrl', function($scope){
    $scope.start = function(){
      $state.go('login');
    }
  })
