angular.module('myApp')
  .config(function($dropdownProvider) {
    angular.extend($dropdownProvider.defaults, {
      html: true
    });
  })
  .controller('navbarCtrl', function($scope, $http, $state, $sce, config, isAuth) {
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
      $http.post(config.serverAddress+'/user/logout')
        .success(function(data) {
          isAuth.value = false;
          isAuth.login = '';
          $state.go('home');
          console.log(data);
        })
    };
    $scope.login = isAuth.login;
  });
