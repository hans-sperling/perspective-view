;(function color(ppv) {
    'use strict';

    var baseColor  = 'rgb(50, 50, 50)',
        spaceColor = 'rgba(255, 255, 255, 0)';

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

    // -----------------------------------------------------------------------------------------------------------------

    // Append module with public methods and properties
    ppv.appendModule({ color : {
        init          : init,
        run           : run,
        getBaseColor  : getBaseColor,
        getSpaceColor : getSpaceColor
    }});

})(window.PPV);