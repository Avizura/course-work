angular.module('myApp')
  .directive('login', function(isAuth){
    return  {
      template: '<div class="user-login">{{isAuth}}</div>',
      link: function(scope, element, attrs) {
        scope.isAuth = isAuth.login;
      }
    }
  });
