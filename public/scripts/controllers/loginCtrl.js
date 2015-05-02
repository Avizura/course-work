angular.module('myApp')
  .controller('loginCtrl', function($scope, $http, $state, isAuth) {
    $scope.user = {
      login: "",
      password: "",
      email: ""
    };
    $scope.login = function() {
      $http.post("http://localhost:5000/user/login", $scope.user)
        .success(function(data) {
          if (data.isAuth) {//Если введены верные данные
            isAuth.value = 'true';
            isAuth.login = data.login;
            $state.go('charts');
          } else {
            isAuth.value = 'false';
            isAuth.login = '';
          }
            console.log(isAuth.value);
        })
    };
    $scope.logout = function() {
      $http.post("http://localhost:5000/user/logout")
        .success(function(data) {
            isAuth.value = 'false';
            isAuth.login = '';
            $state.go('home');
            console.log(data);
        })
    };
    $scope.start = function(){
      $scope.clicked = 'true';
    }
    $scope.signUp = function(){
      $state.go('registration');
    }
  })
