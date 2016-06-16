;(function color(ppv) {
    'use strict';

    var baseColor  = 'rgba(150, 150, 150, 0.5)',
        spaceColor = 'rgba(255, 255, 255, 0)',
        topColor   = 'rgba(255, 0, 0, 0.7)';

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {

    }


    function run() {

    }

    // -----------------------------------------------------------------------------------------------------------------

    function getBaseColor() {
        return baseColor;
    }


    function getSpaceColor() {
        return spaceColor;
    }

    function getTopColor() {
        return topColor;
    }

    // -----------------------------------------------------------------------------------------------------------------

    // Append module with public methods and properties
    ppv.appendModule({ color : {
        init          : init,
        run           : run,
        getBaseColor  : getBaseColor,
        getSpaceColor : getSpaceColor,
        getTopColor   : getTopColor
    }});

})(window.PPV);