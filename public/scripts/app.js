angular.module('myApp', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.otherwise('/home');
    // Now set up the states
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html'
      })
      .state('registration', {
        url: '/user/registration',
        templateUrl: 'views/registration.html',
        controller: 'regCtrl'
      })
      .state('login', {
        url: '/user/login',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
      });
  })
  .run(function($state, $rootScope, $http, isAuth) {
    $http.post('http://localhost:5000/isAuth')
      .success(function(data, status, headers, config) {
        isAuth.value = data;
        console.log(data);
      })
      .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });


    $rootScope.$state = $state;
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        if (isAuth.value === 'false') {
          if (toState.name === 'login') {
            return;
          } else {
            $state.go('login');
          }
        }
        console.log(isAuth.value);
      });
  })
