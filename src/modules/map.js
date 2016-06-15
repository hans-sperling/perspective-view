;(function map(ppv) {
    'use strict';

    var map      = [],
        unitSize = { x : 1, y : 1 },
        defaults = {
            mapItem : 0
        };

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {
        map      = config.map;
        unitSize = config.unitSize;
    }


    function run() {

    }

    // -----------------------------------------------------------------------------------------------------------------

    function getUnitSize() {
        return unitSize;
    }


    function getMapArea(startX, startY, endX, endY) {
        var mapArea = [],
            a       = 0,
            b       = 0,
            x, y;

        for (y = startY; y < endY; y++, b++) {
            a          = 0;
            mapArea[b] = [];

            for (x = startX; x < endX; x++, a++) {
                if (y < 0 || x < 0 || y >= map.length || x >=  map[0].length) {
                    mapArea[b][a] = defaults.mapItem;
                }
                else {
                    mapArea[b][a] = map[y][x];
                }
            }
        }

        return mapArea;
    }

    // -----------------------------------------------------------------------------------------------------------------

    // Append module with public methods and properties
    ppv.appendModule({ map : {
        init        : init,
        run         : run,
        getMapArea  : getMapArea,
        getUnitSize : getUnitSize
    }});

})(window.PPV);