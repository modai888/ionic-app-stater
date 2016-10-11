/*jshint sub:true*/
;(function() {
  "use strict";

  //
  // A directive that can be used on an input or textarea element to indicate the form field associated with the input.
  // This is then used to highlight the label (using CSS classes) when the field becomes 'valid' or 'invalid'.
  //
  // The design of this directive was inspired by the fus-messages directive: github.com/fusionalliance/fus-messages
  //

  appModule('app.util').directive('formField', function () {
    return {
      restrict: 'A',
      require: ['^form'],
      scope: true,
      link: function (scope, element, attrs, ctrls, transclude) {

        scope.inputModel = scope.$eval(attrs['formField']);
        var unwatch = scope.$watchCollection(getFieldStatus, changeCssClasses);

        var parent = element.parent();

        element.bind('focus',function () {
          parent.addClass('has-focus');
        }).bind('blur', function () {
          parent.removeClass('has-focus');
          // clear form errors when a form field gets the focus
        }).bind('focus', function () {
          var form = getForm();

          if (form.parent && form.parent.error && Object.keys(form.parent.error).length > 0) {
            form.parent.error = {};
            scope.$apply();
          }
        });

        scope.$on('$destroy', function () {
          unwatch();
        });

        function getForm() {
          return ctrls[0];
        }

        // get the field status depending on whether the input is dirty or when the form has been submitted, etc.
        function getFieldStatus () {
          var formController = getForm();
          if (formController.$submitted || scope.inputModel.$dirty) {
            if (scope.inputModel.$invalid) {
              return 'I';
            }
            if (scope.inputModel.$valid) {
              return 'V';
            }
          }

          return undefined;
        }

        function changeCssClasses(state) {
          if (state == 'I') {
            parent.addClass('has-error');
            parent.removeClass('valid-lr');
          } else if (state == 'V') {
            parent.removeClass('has-error');
            parent.addClass('valid-lr');
          } else {
            parent.removeClass('has-error');
            parent.removeClass('valid-lr');
          }
        }

      }
    };
  });

}());