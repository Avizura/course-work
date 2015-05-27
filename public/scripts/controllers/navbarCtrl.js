angular.module('myApp')
  .config(function($dropdownProvider) {
    angular.extend($dropdownProvider.defaults, {
      html: true
    });
  })
  .controller('navbarCtrl', function($scope, $http, $state, $sce, config, isAuth) {
    $scope.login = isAuth.login;
    $scope.feedback = false;
    $scope.feedbackType = 'Feedback';
    $scope.dropdown = [{
      "text": $sce.trustAsHtml("<span class = \"glyphicon glyphicon-cog\"></span>&nbsp Account"),
      "href": '#anotherAction'
    }, {
      "text": $sce.trustAsHtml("<span class = \"glyphicon glyphicon-upload\"></span>&nbsp Upgrade"),
      "href": '#anotherAction'
    }, {
      "text": $sce.trustAsHtml("<span class = \"glyphicon glyphicon-book\"></span>&nbsp Docs"),
      "href": '#anotherAction'
    }, {
      divider: true
    }, {
      "text": $sce.trustAsHtml("<span class = \"glyphicon glyphicon-log-out\"></span>&nbsp Sign out"),
      "click": 'logout()'
    }];
    $scope.logout = function() {
      $http.post(config.serverAddress + '/user/logout')
        .success(function(data, status, headers, config) {
          isAuth.value = false;
          isAuth.login = '';
          $state.go('home');
          console.log(data);
        });
    };
    $scope.feedbackClick = function() {
      $scope.feedback = !$scope.feedback;
      console.log('feedback');
      console.log($scope.feedback);
    };
    $scope.feedbackSubmit = function() {
      console.log($scope.feedbackType);
      console.log($scope.text);
      $http.post(config.serverAddress + '/feedback', {
        feedbackType: $scope.feedbackType,
        text: $scope.text
      });
      $scope.feedback = false;
    };
    $scope.feedbackCancel = function() {
      $scope.feedback = false;
    };
    $scope.feedbackTypes = [{
      name: 'Feedback'
    }, {
      name: 'Support Request'
    }];
  });
