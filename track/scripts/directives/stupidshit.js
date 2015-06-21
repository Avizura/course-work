angular.module('myApp')
  .directive('someShit', function(){
    function print() {
      var interests = document.getElementById("interests");
      for(i=0; i<arguments.length; ++i){
        var newEl = document.createElement('li');
        newEl.innerHTML = arguments[i];
        interests.appendChild(newEl);
      }
    }
    print('lol', 'test');
  })
