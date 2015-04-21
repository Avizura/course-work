angular.module('myApp')
  .controller('loginCtrl', function($scope, $http, isAuth){
    $scope.user = {
      login: "",
      password: ""
    };
    $scope.login = function(){
      $http.post("http://localhost:5000/user/login", $scope.user)
      .success(function(data){
        isAuth.value = data;
        console.log(data);
      })
    };
    $scope.logout = function() {
      $http.post("http://localhost:5000/user/logout")
        .success(function(data) {
          isAuth.value = data;
          console.log(data);
        })
    };
  })
