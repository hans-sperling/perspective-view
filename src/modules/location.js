;(function location(ppv) {
    'use strict';

    var unitSize       = 10,
        unitShift      = { x : 0, y : 0 },
        vanishingPoint = { x : 1, y : 1},
        currentTile    = { x : 1, y : 1};

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {
        unitSize       = config.unitSize;
        unitShift      = config.unitShift;
        vanishingPoint = config.vanishingPoint;
        currentTile    = config.currentTile;

    }


    function run() {

    }

    // -----------------------------------------------------------------------------------------------------------------

    function update() {

    }


    function getGridPosition() {
        return { x : 4, y : 4 };
    }


    function getVanishingTile() {
        var tile = {};

        if (unitSize > 0) {
            tile.x = Math.floor(Number(vanishingPoint.x) / (unitSize + unitShift.x));
            tile.y = Math.floor(Number(vanishingPoint.y) / (unitSize + unitShift.y));
        }
        else {
            if (ppv.DEV.enable) {
                console.error('Property <unitSize> is lower than 0 :: ', 'unitSize{' , typeof unitSize, '} :: ', unitSize);
                if (ppv.DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        return tile;
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