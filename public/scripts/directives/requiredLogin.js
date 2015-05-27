angular.module('myApp')
  .directive('requiredLogin', function () {
    var isValid = function(str){
      return str && str.length <= 16;
    };

    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelCtrl){
        ngModelCtrl.$parsers.unshift(function(viewValue) {
          ngModelCtrl.$setValidity('emailRequired', isValid(viewValue));
          return viewValue;
        });

        ngModelCtrl.$formatters.unshift(function(modelValue) {
          ngModelCtrl.$setValidity('emailRequired', isValid(modelValue));
          return modelValue;
        });
      }
    };
  });
