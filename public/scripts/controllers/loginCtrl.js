angular.module('myApp')
  .controller('loginCtrl', function($scope, $http, $state, config, isAuth) {
    $scope.user = {
      login: "",
      password: "",
      email: ""
    };
    $scope.error = false;
    $scope.login = function() {
      $scope.error = false;
      $http.post(config.serverAddress + '/user/login', $scope.user)
        .success(function(data) {
          isAuth.value = data.isAuth;
          if (data.isAuth) { //Если введены верные данные
            isAuth.login = data.login;
            $state.go('navbar.charts.dashboard');
          } else {
            console.log('Wrong login data!');
            isAuth.login = '';
            $scope.error = true;
          }
        })
        .error(function(data, status, headers, config) {});
    };
    $scope.logout = function() {
      $http.post(config.serverAddress + '/user/logout')
        .success(function(data) {
          isAuth.value = false;
          isAuth.login = '';
          $state.go('home');
          console.log(data);
        })
    };
    $scope.start = function() {
      $scope.clicked = true;
    };
    $scope.signUp = function() {
      $state.go('registration');
    };
  })
