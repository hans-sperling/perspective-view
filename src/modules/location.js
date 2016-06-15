;(function location(ppv) {
    'use strict';

    var unitSize       = { x : 1, y : 1 },
        unitScale      = 1,
        unitShift      = { x : 0, y : 0 },
        vanishingPoint = { x : 1, y : 1},
        currentTile    = { x : 1, y : 1};

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {
        unitSize       = config.unitSize;
        unitScale      = config.unitScale;
        unitShift      = config.unitShift;
        vanishingPoint = config.vanishingPoint;
        currentTile    = config.currentTile;
    }


    function run() {
        console.log(getMapLocation());
    }

    // -----------------------------------------------------------------------------------------------------------------

    function update() {

    }


    function getMapLocation() {
        /*
           Immer wenn man die Karte so weit verschoben hat, wie unitScale * unitSize groß ist, muss ein tile hinzu
           oder abgezogen werden.
         */

        return {
            tile  : { x : 4, y : 4 },
            shift : { x : 0, y : 0 }
        };
    }


    function getVanishingTile() {
        var tile = {};

        if (unitSize.x > 0 && unitSize.y > 0 && unitScale > 0) {
            tile.x = Math.floor(Number(vanishingPoint.x) / ((unitSize.x * unitScale) + unitShift.x));
            tile.y = Math.floor(Number(vanishingPoint.y) / ((unitSize.y * unitScale) + unitShift.y));
        }
        else {
            if (ppv.DEV.enable) {
                console.error('Property <unitSize.x>, <unitSize.y> or <unitScale> is lower than 0 :: ',
                    'unitSize.x{' , typeof unitSize.x, '} :: ', unitSize.x,
                    'unitSize.y{' , typeof unitSize.y, '} :: ', unitSize.y,
                    'unitScale{' , typeof unitScale, '} :: ', unitScale);
                if (ppv.DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        //console.log(tile);
        return tile;
    }

    // -----------------------------------------------------------------------------------------------------------------

    // Append module with public methods and properties
    ppv.appendModule({ location : {
        init             : init,
        run              : run,
        update           : update,
        getVanishingTile : getVanishingTile,
        getMapLocation   : getMapLocation
    }});

})(window.PPV);