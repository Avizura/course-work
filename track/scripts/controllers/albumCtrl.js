angular.module("myApp")
  .filter('slice', function() {
    return function(arr, start, end) {
      return arr.slice(start, end);
    };
  })
  .controller("albumCtrl", function($scope) {
    $scope.page = 0;
    if(window.innerHeight > 900){
      $scope.itemsPerPage = 4;
    }
    else {
      $scope.itemsPerPage = 2;
    }
    $scope.images = [{
      url: "/images/1.jpg"
    }, {
      url: "/images/2.jpg"
    }, {
      url: "/images/3.jpg"
    }, {
      url: "/images/4.jpg"
    }, {
      url: "/images/30.jpg"
    }, {
      url: "/images/35.jpg"
    }, {
      url: "/images/37.jpg"
    }, {
      url: "/images/39.jpg"
    }];
    $scope.next = function() {
      $scope.page++;
      if ($scope.page > Math.ceil($scope.images.length / $scope.itemsPerPage)-1)
        $scope.page = 0;
    }
    $scope.prev = function() {
      $scope.page--;
      if ($scope.page < 0) {
        $scope.page = Math.ceil($scope.images.length / $scope.itemsPerPage)-1;
      }
    }
  })
