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

    function getBase() {
        return 'rgba('+
            CFG.color.back.r + ', ' +
            CFG.color.back.g + ', ' +
            CFG.color.back.b + ', ' +
            CFG.color.back.a + ')';
    }


    function getSpace() {
        return 'rgba('+
            CFG.color.space.r + ', ' +
            CFG.color.space.g + ', ' +
            CFG.color.space.b + ', ' +
            CFG.color.space.a + ')';
    }


    function getFront() {
        return 'rgba('+
            CFG.color.front.r + ', ' +
            CFG.color.front.g + ', ' +
            CFG.color.front.b + ', ' +
            CFG.color.front.a + ')';
    }


    function getNorth() {
        return 'rgba('+
            CFG.color.north.r + ', ' +
            CFG.color.north.g + ', ' +
            CFG.color.north.b + ', ' +
            CFG.color.north.a + ')';
    }


    function getEast() {
        return 'rgba('+
            CFG.color.east.r + ', ' +
            CFG.color.east.g + ', ' +
            CFG.color.east.b + ', ' +
            CFG.color.east.a + ')';
    }


    function getSouth() {
        return 'rgba('+
            CFG.color.south.r + ', ' +
            CFG.color.south.g + ', ' +
            CFG.color.south.b + ', ' +
            CFG.color.south.a + ')';
    }


    function getWest() {
        return 'rgba('+
            CFG.color.west.r + ', ' +
            CFG.color.west.g + ', ' +
            CFG.color.west.b + ', ' +
            CFG.color.west.a + ')';
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
