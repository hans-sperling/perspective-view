;(function location(ppv) {
    'use strict';

    var unitSize       = 10,
        unitShift      = { x : 0, y : 0 },
        vanishingPoint = { x : 1, y : 1},
        currentTile    = { x : 1, y : 1},
        vanishingTile  = { x : 1, y : 1};

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {
        unitSize       = config.unitSize;
        unitShift      = config.unitShift;
        vanishingPoint = config.vanishingPoint;
        currentTile    = config.currentTile;

        vanishingTile = currentTile;
    }


    function run() {

    }

    // -----------------------------------------------------------------------------------------------------------------

    function update() {

    }


    function getGridPosition() {
        return currentTile;
    }


    function getVanishingTile() {
        return vanishingTile;
    }

    // -----------------------------------------------------------------------------------------------------------------

    // Append module with public methods and properties
    ppv.appendModule({ location : {
        init             : init,
        run              : run,
        update           : update,
        getVanishingTile : getVanishingTile,
        getGridPosition  :  getGridPosition
    }});

})(window.PPV);