angular.module('myApp')
  .controller('aboutCtrl', function($scope) {
    var element_to_scroll_to = document.getElementById('asd');
    element_to_scroll_to.scrollIntoView();
    $scope.forError = function() {
      $scope.qwerty = eval('gfd');
      console.log($scope.qwerty);
    };
    $scope.forError();
    $scope.a = 'ReferenceError: dsaqw is not defined
    at eval (eval at <anonymous> (http://localhost:4000/:46:19), <anonymous>:1:1)
    at http://localhost:4000/:46:19';
  });
