angular.module('myApp')
  .controller('loginCtrl', function($scope, $http, $state, config, isAuth) {
    $scope.user = {
      login: "",
      password: "",
      email: ""
    };
    $scope.error = false;
    if(isAuth.signed){
      $scope.clicked = true;
    }
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
    $scope.start = function() {
      $scope.clicked = true;
      isAuth.signed = true;
    };
    $scope.signUp = function() {
      $state.go('registration');
    };
  })
