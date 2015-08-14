(function ($) {
    var EditableField = function () {
        return {
            restrict: 'A',
            link: function (scope, $element, attrs, ctrl) {
                var $field = $element.find("input"),
                    $hidden = $element.find("span"),
                    $button = $element.find(".b-editable-field__icon"),
                    _setDisabled = function(){
                        $field.attr("readonly","readonly");
                        $element.removeClass("b-editable-field_editing");
                        isEditing = false;
                    };
                     isEditing = false;
                $button.on("click.editable", function (e) {
                    e.stopPropagation();
                    $field.removeAttr("readonly");
                    isEditing = true;
                    $element.addClass("b-editable-field_editing");
                    $field.focus();

                });
                angular.element(document).on("click", function(){
                    _setDisabled();
                });
                $field.on("keyup.editable keydown.editable keypress.editable change.editable input.editable paste.editable", function (e) {
                    $hidden.html($field.val());
                    e.stopPropagation();
                });
                $field.on("focus click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
            }
        };
    };

    angular.module('aledo.directives').directive('ngEditableField', [EditableField]);

})(jQuery);
