angular.module('myApp')
  .controller('logoutCtrl', function($scope, $http, isAuth){
    $scope.logout = function(){
      $http.post("http://localhost:5000/user/logout")
      .success(function(data){
        console.log(data);
        isAuth.value = data;
      })
    }
  })
