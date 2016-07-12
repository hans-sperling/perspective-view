;(function map(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var CFG       = {},
        map       = [],             // Stores the map
        size      = {x : 0, y : 0}, // Stores the size of the map in px
        dimension = {x : 0, y : 0}, // Stores the x- and y-amount of the map - amount of tiles in the map
        position  = {x : 0, y : 0}, // Stores the current position on the map in px
        tile      = {x : 0, y : 0}, // Stores the current position on the map as tile
        defaults  = {
            mapItem : 0
        };

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    function init(config) {
        update(config);
    }


    function run() {
        // Nothing to do yet
    }


    function update(config) {
        CFG = config;
        map = config.map;

        dimension = getDimension();
        position  = getPosition();
        size      = getSize();
        tile      = getTile();

        //debug();
    }

    // ----------------------------------------------------------------------------------------------------------- DEBUG

    function debug() {
        console.log('map.js: ', {
            dimension : dimension,
            position  : position,
            size      : size,
            tile      : tile
        });

    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    function getArea(positions) {
        var position = {x:0,y:0};
        var mapArea = [],
            a       = 0,
            b       = 0,
            x, y;

        for (y = positions.startY; y <= positions.endY; y++, b++) {
            a          = 0;
            mapArea[b] = [];

            for (x = positions.startX; x <= positions.endX; x++, a++) {
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


    function getDimension() {
        return {
            x : map[0].length,
            y : map.length
        };
    }


    function getSize() {
        var dim = getDimension();

        return {
            x : CFG.unitSize * dim.x,
            y : CFG.unitSize * dim.y
        };
    }


    function getPosition() {
        return {
            x : CFG.position.x,
            y : CFG.position.y
        };
    }


    function getTile() {
        var pos = getPosition();

        return {
            x : Math.ceil(pos.x / CFG.unitSize),
            y : Math.ceil(pos.y / CFG.unitSize)
        };
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ map : {
        init         : init,
        run          : run,
        getArea      : getArea,
        getDimension : getDimension,
        getPosition  : getPosition,
        getSize      : getSize,
        getTile      : getTile
    }});

})(window.PPV);