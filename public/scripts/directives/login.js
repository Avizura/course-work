angular.module('myApp')
  .directive('login', function(isAuth){
    return  {
      template: '<div class="user-login">{{isAuth}}</div>',
      // template: '<div class="user-login">Avizura</div>',
      link: function(scope, element, attrs) {
        scope.isAuth = isAuth.login;
      }
    }
  });
