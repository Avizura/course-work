angular.module('myApp')
  .controller('regCtrl', function($scope, $http, $state){
    $scope.user = {
      login: "",
      password: ""
    };
    $scope.submit = function(){
      $http.post("http://localhost:5000/user/registration", $scope.user)
      .success(function(data){
        $state.go('login');
      })
    }
  })
