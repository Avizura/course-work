angular.module('myApp')
  .directive('myNameRequired', function() {
    var isValid = function(str) {
      return str && !/\d/.test(str) && str.match(/\s/g)!==null && str.match(/\s/g).length === 2;
    };

    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        ngModelCtrl.$parsers.unshift(function(viewValue) {
          ngModelCtrl.$setValidity('nameRequired', isValid(viewValue));
          return viewValue;
        });

        ngModelCtrl.$formatters.unshift(function(modelValue) {
          ngModelCtrl.$setValidity('nameRequired', isValid(modelValue));
          return modelValue;
        });
      }
    };
  });
