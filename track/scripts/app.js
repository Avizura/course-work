angular.module('myApp', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/home');
    //
    // Now set up the states
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html'
      })
      .state('about', {
        url: '/about/#asd',
        templateUrl: 'views/about.html',
        controller: 'aboutCtrl'
      })
      .state('interests', {
        url: '/interests',
        templateUrl: 'views/interests.html'
      })
      .state('study', {
        url: '/study',
        templateUrl: 'views/study.html'
      })
      .state('album', {
        url: '/album',
        templateUrl: 'views/album.html',
        controller: 'albumCtrl'
      })
      .state('feedback', {
        url: '/feedback',
        templateUrl: 'views/feedback.html',
        controller: 'feedbackCtrl'
      })
      .state('test', {
        url: '/test',
        templateUrl: 'views/test.html',
        controller: 'feedbackCtrl'
      });
  })
  .controller('appCtrl', function($scope) {
    // $scope.clock = function() {
    //   var d = new Date();
    //   var month_num = d.getMonth()
    //   var day = d.getDate();
    //   var hours = d.getHours();
    //   var minutes = d.getMinutes();
    //   var seconds = d.getSeconds();
    //   month = new Array("января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря");
    //   date_time = day + " " + month[month_num] + " " + d.getFullYear() + " Time: " + hours + ":" + minutes + ":" + seconds;
    //   var element = document.getElementById("clock");
    //   element.innerHTML = date_time;
    //   console.log(element);
    //   var a = eval('prosport');
    //   setTimeout("clock()", 1000);
    // };
    // $scope.clock();
  })
  .run(function($state, $rootScope) {
    $rootScope.$state = $state;
    console.log($state);
  })
