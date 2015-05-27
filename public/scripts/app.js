angular.module('myApp', ['ui.router', 'ngAnimate', 'mgcrea.ngStrap', 'highcharts-ng'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/user/login');
    // Now set up the states
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'homeCtrl'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html'
      })
      .state('login', {
        url: '/user/login',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
      })
      .state('registration', {
        url: '/user/registration',
        templateUrl: 'views/registration.html',
        controller: 'regCtrl'
      })
      .state('navbar', {
        abstract: true,
        templateUrl: 'views/navbar.html',
        controller: 'navbarCtrl'
      })
      .state('navbar.charts', {
        url: '/charts',
        templateUrl: 'views/charts.html',
        controller: 'chartsCtrl'
      })
      .state('navbar.charts.dashboard',{
        url: '/dashboard',
        templateUrl: 'views/charts-dashboard.html',
        controller: 'chartsDashboardCtrl'
      })
      .state('navbar.charts.recent', {
        url: '/recent',
        templateUrl: 'views/charts-recent.html',
        controller: 'chartsRecentCtrl'
      })
      .state('navbar.charts.daily', {
        url: '/daily',
        templateUrl: 'views/charts-daily.html',
        controller: 'chartsDailyCtrl'
      })
      .state('navbar.charts.users', {
        url: '/users',
        templateUrl: 'views/charts-users.html',
        controller: 'chartsUsersCtrl'
      });
  })
  .run(function($state, $rootScope, $http, isAuth, config) {
    $http.post(config.serverAddress+'/isAuth')
      .success(function(data, status, headers, config) {
        console.log(data);
        console.log(data.isAuth);
        isAuth.value = data.isAuth;
        if (data.isAuth == true) { //Если авторизован
          isAuth.login = data.login;
        } else {
          isAuth.login = '';
          $state.go('login');
        }
        console.log('isAuth on start');
        console.log(isAuth.value);
      })
      .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    // $rootScope.$state = $state;
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        // console.log("STATE");
        // console.log($state);
        if (isAuth.value == false) {
          if (toState.name === 'login' || toState.name === 'registration') {
            return;
          } else {
            event.preventDefault();
            $state.go('login');
            console.log('redirect');
            console.log($state);
          }
        }
        console.log('isAuth');
        console.log(isAuth.value);
      });
  })
