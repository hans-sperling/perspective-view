;(function map(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var CFG       = {},
        map       = [],             // Stores the map
        area      = [],             // Stores the map part to be rendered
        size      = {x : 0, y : 0}, // Stores the size of the map in px
        dimension = {x : 0, y : 0}, // Stores the x- and y-amount of the map - amount of tiles in the map
        position  = {x : 0, y : 0}, // Stores the current position on the map in px
        tile      = {x : 0, y : 0}, // Stores the current position on the map as tile
        defaults  = {
            mapItem : 0             // Default value for cells with no content
        };

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    function init(config) {
        update(config);
    }


    function run() {
        // Nothing to do yet
    }


    function update(config) {
        CFG       = config;
        map       = config.map;
        dimension = getDimension();
        position  = getPosition();
        size      = getSize(dimension);
        tile      = getPositionTile(position);
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    function getArea(position, buffer) {
        var camera       = CFG.camera,
            unitSize     = CFG.unitSize,
            positionTile = getPositionTile(position),
            sizeX        = Math.ceil(((camera.width / 2) / unitSize)),
            sizeY        = Math.ceil(((camera.height / 2) / unitSize)),
            startX       = positionTile.x - sizeX - buffer,
            stopX        = positionTile.x + sizeX + buffer,
            startY       = positionTile.y - sizeY - buffer,
            stopY        = positionTile.y + sizeY + buffer,
            a, b, x, y;

        for (y = startY, b = 0; y <= stopY; y++, b++) {
            area[b] = [];

            for (x = startX, a = 0; x <= stopX; x++, a++) {
                if (y < 0 || x < 0 || y >= map.length || x >=  map[0].length) {
                    area[b][a] = defaults.mapItem;
                }
                else {
                    area[b][a] = map[y][x];
                }
            }
        }

        return area;
    }


    function getDimension() {
        return {
            x : map[0].length,
            y : map.length
        };
    }


    function getSize(dimension) {
        return {
            x : CFG.unitSize * dimension.x,
            y : CFG.unitSize * dimension.y
        };
    }


    function getPosition() {
        return {
            x : CFG.position.x,
            y : CFG.position.y
        };
    }


    function getPositionTile(position) {
        return {
            x : Math.floor(position.x / CFG.unitSize),
            y : Math.floor(position.y / CFG.unitSize)
        };
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ map : {
        init             : init,
        run              : run,
        update           : update,
        getArea          : getArea,
        getDimension     : getDimension,
        getPosition      : getPosition,
        getSize          : getSize,
        getPositionTile  : getPositionTile
    }});
})(window.PPV);
