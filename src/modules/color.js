;(function color(ppv) {
    'use strict';

    var backColor  = 'rgba(150, 150, 150, 0.5)',
        spaceColor = 'rgba(255, 255, 255, 1)',
        frontColor = 'rgba(255, 0, 0, 0.7)',
        northColor = 'rgba(127, 127, 127, 1)',
        eastColor  = 'rgba(159, 159, 159, 1)',
        southColor = 'rgba(223, 223, 223, 1)',
        westColor  = 'rgba(191, 191, 191, 1)';

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {

    }


    function run() {

    }

    // -----------------------------------------------------------------------------------------------------------------

    function getBackColor() {
        return backColor;
    }


    function getSpaceColor() {
        return spaceColor;
    }


    function getFrontColor() {
        return frontColor;
    }


    function getNorthColor() {
        return northColor;
    }


    function getEastColor() {
        return eastColor;
    }


    function getSouthColor() {
        return southColor;
    }


    function getWestColor() {
        return westColor;
    }

    // -----------------------------------------------------------------------------------------------------------------

    // Append module with public methods and properties
    ppv.appendModule({ color : {
        init          : init,
        run           : run,
        getBackColor  : getBackColor,
        getSpaceColor : getSpaceColor,
        getFrontColor : getFrontColor,
        getNorthColor : getNorthColor,
        getEastColor  : getEastColor,
        getSouthColor : getSouthColor,
        getWestColor  : getWestColor
    }});

})(window.PPV);