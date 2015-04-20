angular.module('myApp')
  .controller('chartsCtrl', function() {
    var s = Snap(800, 600);
    console.log(s);
    // Lets create big circle in the middle:
    var bigCircle = s.circle(150, 150, 100);
    // By default its black, lets change its attributes
    bigCircle.attr({
    fill: "#bada55",
    stroke: "#000",
    strokeWidth: 5
    })
  })
