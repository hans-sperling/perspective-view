;(function lightingColor(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var CFG = {};

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    function init(config) {
        update(config);
    }


    function run() {
        // Nothing to do yet
    }


    function update(config) {
        CFG = config;
    }

    // --------------------------------------------------------------------------------------------------------- METHODS


    function getColor(lighting) {
        var color = CFG.color.lightingColor.color;

        return 'rgba('+
            Math.round(color.r * lighting) + ', ' +
            Math.round(color.g * lighting) + ', ' +
            Math.round(color.b * lighting) + ', ' +
            color.a + ')';
    }


    function getBase() {
        var lighting = CFG.color.lightingColor.lighting.base;

        return getColor(lighting);
    }


    function getSpace() {
        var lighting = CFG.color.lightingColor.lighting.space;

        return getColor(lighting);
    }


    function getFront() {
        var lighting = CFG.color.lightingColor.lighting.front;

        return getColor(lighting);
    }


    function getNorth() {
        var lighting = CFG.color.lightingColor.lighting.north;

        return getColor(lighting);
    }


    function getEast() {
        var lighting = CFG.color.lightingColor.lighting.east;

        return getColor(lighting);
    }


    function getSouth() {
        var lighting = CFG.color.lightingColor.lighting.south;

        return getColor(lighting);
    }


    function getWest() {
        var lighting = CFG.color.lightingColor.lighting.west;

        return getColor(lighting);
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ lightingColor : {
        init     : init,
        run      : run,
        update   : update,
        getBase  : getBase,
        getEast  : getEast,
        getFront : getFront,
        getNorth : getNorth,
        getSouth : getSouth,
        getSpace : getSpace,
        getWest  : getWest
    }});
})(window.PPV);
