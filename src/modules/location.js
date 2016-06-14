;(function location(ppv) {
    'use strict';

    var unitSize       = { x : 1, y : 1},
        vanishingPoint = { x : 1, y : 1};

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {
        unitSize       = config.unitSize;
        vanishingPoint = config.vanishingPoint;
    }

    // -----------------------------------------------------------------------------------------------------------------

    function getVanishingTile() {
        var tile = {};

        if (unitSize.x > 0 && unitSize.y > 0) {
            tile.x = Math.floor(Number(vanishingPoint.x) / unitSize.x);
            tile.y = Math.floor(Number(vanishingPoint.y) / unitSize.y);
        }

        return tile;
    }

    // -----------------------------------------------------------------------------------------------------------------

    // Append module with public methods and properties
    ppv.appendModule({ location : {
        init             : init,
        getVanishingTile : getVanishingTile
    }});

    // -----------------------------------------------------------------------------------------------------------------

})(window.PPV);