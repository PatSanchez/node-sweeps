$(function(){
    function getWidthClasses(oldWidth, newWidth){
        if(oldWidth !== newWidth){
            if(newWidth >= 810){
                return "ssLayoutMedium ssLayoutLarge";
            }
            else if (newWidth >= 640){
                return "ssLayoutMedium";
            }
            else {
                return "";
            }
        }
    }
    var startingWidth = window.outerWidth;
    var oldWidth = 0;
    var startingWidthClasses = getWidthClasses(0, startingWidth);
    $('.ssAppContentArea').removeClass('ssLayoutMedium ssLayoutLarge').addClass(startingWidthClasses);
    $(window).resize(function(){
        var newWidth = window.outerWidth;
        var widthClasses = getWidthClasses(oldWidth, newWidth);
        $('.ssAppContentArea').removeClass('ssLayoutMedium ssLayoutLarge').addClass(widthClasses);
        oldWidth = newWidth;
    });
});