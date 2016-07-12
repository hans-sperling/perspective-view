;(function color(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var back  = {r: 150, g: 150, b: 150, a: 1},
        east  = {r: 159, g: 159, b: 159, a: 1},
        front = {r: 207, g: 207, b: 207, a: 1},
        north = {r: 127, g: 127, b: 127, a: 1},
        south = {r: 223, g: 223, b: 223, a: 1},
        space = {r: 255, g: 255, b: 255, a: 0},
        west  = {r: 191, g: 191, b: 191, a: 1};

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    function init(config) {
        update(config);
    }


    function run() {
        // Nothing to do yet
    }


    function update(config) {
        // Nothing to do yet

         debug();
    }

    // ----------------------------------------------------------------------------------------------------------- DEBUG

    function debug() {
        console.log('color.js: ', {
            back     : back,
            space    : space,
            front    : front,
            north    : north,
            east     : east,
            south    : south,
            west     : west,
            getBack  : getBack(),
            getSpace : getSpace(),
            getFront : getFront(),
            getNorth : getNorth(),
            getEast  : getEast(),
            getSouth : getSouth(),
            getWest  : getWest()
        });
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    function getBack() {
        return 'rgba('+
            back.r + ', ' +
            back.g + ', ' +
            back.b + ', ' +
            back.a + ')';
    }


    function getSpace() {
        return 'rgba('+
            space.r + ', ' +
            space.g + ', ' +
            space.b + ', ' +
            space.a + ')';
    }


    function getFront() {
        return 'rgba('+
            front.r + ', ' +
            front.g + ', ' +
            front.b + ', ' +
            front.a + ')';
    }


    function getNorth() {
        return 'rgba('+
            north.r + ', ' +
            north.g + ', ' +
            north.b + ', ' +
            north.a + ')';
    }


    function getEast() {
        return 'rgba('+
            east.r + ', ' +
            east.g + ', ' +
            east.b + ', ' +
            east.a + ')';
    }


    function getSouth() {
        return 'rgba('+
            south.r + ', ' +
            south.g + ', ' +
            south.b + ', ' +
            south.a + ')';
    }


    function getWest() {
        return 'rgba('+
            west.r + ', ' +
            west.g + ', ' +
            west.b + ', ' +
            west.a + ')';
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ color : {
        init     : init,
        run      : run,
        getBack  : getBack,
        getEast  : getEast,
        getFront : getFront,
        getNorth : getNorth,
        getSouth : getSouth,
        getSpace : getSpace,
        getWest  : getWest
    }});

})(window.PPV);
