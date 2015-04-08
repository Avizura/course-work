angular.module('myApp', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/home');
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
  .run(function($state, $rootScope) {
    $rootScope.$state = $state;
    console.log($state);
  })
