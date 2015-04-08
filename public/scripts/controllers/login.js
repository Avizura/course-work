angular.module('myApp')
  .controller('loginCtrl', function($scope, $http){
    $scope.user = {
      login: "",
      password: ""
    };
    $scope.submit = function(){
      $http.post("http://localhost:5000/user/login", $scope.user)
      .success(function(data){
        console.log(data);
      })
    }
  })
