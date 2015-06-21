angular.module('myApp')
.directive('myPhoneRequired', function() {
  var isValid = function(str) {
    return str && /^\+[3,7]/.test(str) && !/\s/.test(str) && str.length === 11 && !/[a-zA-Z]/.test(str);
  };

  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      ngModelCtrl.$parsers.unshift(function(viewValue) {
        ngModelCtrl.$setValidity('phoneRequired', isValid(viewValue));
        return viewValue;
      });

      ngModelCtrl.$formatters.unshift(function(modelValue) {
        ngModelCtrl.$setValidity('phoneRequired', isValid(modelValue));
        return modelValue;
      });
    }
  };
});
