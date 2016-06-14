;(function location(ppv) {
    'use strict';

    var unitSize       = { x : 1, y : 1},
        unitScale      = 1,
        vanishingPoint = { x : 1, y : 1};

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {
        unitSize       = config.unitSize;
        unitScale      = config.unitScale;
        vanishingPoint = config.vanishingPoint;
    }


    function run() {

    }

    // -----------------------------------------------------------------------------------------------------------------

    function getVanishingTile() {
        var tile = {};

        if (unitSize.x > 0 && unitSize.y > 0 && unitScale > 0) {
            tile.x = Math.floor(Number(vanishingPoint.x) / (unitSize.x * unitScale));
            tile.y = Math.floor(Number(vanishingPoint.y) / (unitSize.y * unitScale));
        }

        console.log(tile);
        return tile;

    }

    // -----------------------------------------------------------------------------------------------------------------

    // Append module with public methods and properties
    ppv.appendModule({ location : {
        init             : init,
        run              : run,
        getVanishingTile : getVanishingTile
    }});

})(window.PPV);