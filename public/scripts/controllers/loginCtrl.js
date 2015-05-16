angular.module('myApp')
  .controller('loginCtrl', function($scope, $http, $state, isAuth) {
    $scope.user = {
      login: "",
      password: "",
      email: ""
    };
    $scope.login = function() {
      $http.post("http://192.168.0.168:5000/user/login", $scope.user)
        .success(function(data) {
          isAuth.value = data.isAuth;
          if (data.isAuth) {//Если введены верные данные
            isAuth.login = data.login;
            $state.go('navbar.charts');
          } else {
            console.log('Wrong login data!');
            isAuth.login = '';
          }
        })
    };
    $scope.logout = function() {
      $http.post("http://192.168.0.168:5000/user/logout")
        .success(function(data) {
            isAuth.value = false;
            isAuth.login = '';
            $state.go('home');
            console.log(data);
        })
    };
    $scope.start = function(){
      $scope.clicked = true;
    };
    $scope.signUp = function(){
      $state.go('registration');
    };
  })
