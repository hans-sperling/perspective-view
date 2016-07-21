;(function color(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var CFG      = {},
        lighting = {};

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    function init(config) {
        update(config);
    }


    function run() {
        // Nothing to do yet
    }


    function update(config) {
        CFG = config;

        lighting = CFG.color.lighting;
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


    function getBack() {
        return getColor(lighting.back);
    }


    function getSpace() {
        var color = CFG.color.spaceColor;

        return 'rgba('+
            color.r + ', ' +
            color.g + ', ' +
            color.b + ', ' +
            color.a + ')';
    }


    function getFront(h) {
        return getColor(lighting.front + (h * lighting.height));
    }


    function getNorth() {
        return getColor(lighting.north);
    }


    function getEast() {
        return getColor(lighting.east);
    }


    function getSouth() {
        return getColor(lighting.south);
    }


    function getWest() {
        return getColor(lighting.west);
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ color : {
        init     : init,
        run      : run,
        update   : update,
        getBack  : getBack,
        getEast  : getEast,
        getFront : getFront,
        getNorth : getNorth,
        getSouth : getSouth,
        getSpace : getSpace,
        getWest  : getWest
    }});
})(window.PPV);
