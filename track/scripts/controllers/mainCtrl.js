angular.module('myApp')
  .controller('mainCtrl', function($scope){
    $scope.clock = function() {
      var d = new Date();
      var month_num = d.getMonth()
      var day = d.getDate();
      var hours = d.getHours();
      var minutes = d.getMinutes();
      var seconds = d.getSeconds();
      month=new Array("января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря");
      date_time = day + " " + month[month_num] + " " + d.getFullYear() +
        "" + hours + ":" + minutes + ":" + seconds;
      var element = document.getElementById("clock");
      element.innerHTML = date_time;
      console.log(element);
      setTimeout("clock()", 1000);
    }();
  })
