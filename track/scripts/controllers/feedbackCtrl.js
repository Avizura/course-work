angular.module('myApp')
  .controller('feedbackCtrl', function($scope) {
    $scope.formSubmit = function() {
      if ($scope.myForm.$valid === false) {
        var attr = $scope.myForm.$error[Object.keys($scope.myForm.$error)[0]][0]['$name'];
        var el = $('[name=' + attr + ']').focus();
        console.log("loldx");
      }
    }
  })
