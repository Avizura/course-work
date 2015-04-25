angular.module('myApp')
  .controller('homeCtrl', function($scope){
    $scope.signIn = function(){
      $scope.clicked = 'true';
    }
  })
