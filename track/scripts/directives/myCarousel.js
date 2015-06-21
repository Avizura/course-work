angular.module('myApp')
  .directive('myCarousel',function(){
    return {
      templateUrl: 'views/myCarousel.html',
      link: function(scope,element,attrs){
        console.log($, element, $('.carousel'));
        $('.carousel').carousel({
          interval: 3000
        });
      }
    }
  })
