angular.module('myApp')
  .controller('regCtrl', function($scope, $http, $state, config, isAuth) {
    $scope.user = {
      login: "",
      password: "",
      email: ""
    };
    $scope.error = false;
    $scope.register = function() {
      $http.post(config.serverAddress + '/user/registration', $scope.user)
        .success(function(data) {
          console.log('on submit register');
          console.log(data);
          isAuth.value = data.isAuth;
          if (data.isAuth) { //Если введены верные данные
            isAuth.login = data.login;
            $state.go('navbar.charts.dashboard');
          } else {
            console.log('Wrong registration data!');
            isAuth.login = '';
            $scope.error = true;
          }
        });
    };
    $scope.signIn = function() {
      $state.go('login');
    }
  })
