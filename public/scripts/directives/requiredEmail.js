angular.module('myApp')
  .directive('requiredEmail', function () {
    var isValid = function(str){
      return str && str.indexOf('.') - str.indexOf('@') > 2 && str.indexOf('@') > -1 && str.length-2 > str.indexOf('.');
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
