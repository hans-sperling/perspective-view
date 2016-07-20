;(function color(ppv) {
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
        var color = CFG.color.objectColor;

        return 'rgba('+
            Math.round(color.r + (2.55 * lighting)) + ', ' +
            Math.round(color.g + (2.55 * lighting)) + ', ' +
            Math.round(color.b + (2.55 * lighting)) + ', ' +
            color.a + ')';
    }


    function getBase() {
        var lighting = CFG.color.lighting.base;

        return getColor(lighting);
    }


    function getSpace() {
        var color = CFG.color.lightingColor.spaceColor;

        return 'rgba('+
            color.r + ', ' +
            color.g + ', ' +
            color.b + ', ' +
            color.a + ')';
    }


    function getFront(h) {
        var lighting = CFG.color.lighting.front + (h * CFG.color.lighting.height);

        return getColor(lighting);
    }


    function getNorth() {
        var lighting = CFG.color.lighting.north;

        return getColor(lighting);
    }


    function getEast() {
        var lighting = CFG.color.lighting.east;

        return getColor(lighting);
    }


    function getSouth() {
        var lighting = CFG.color.lighting.south;

        return getColor(lighting);
    }


    function getWest() {
        var lighting = CFG.color.lighting.west;

        return getColor(lighting);
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ color : {
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
