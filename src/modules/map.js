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
        size      = getSize(dimension);
        tile      = getPositionTile(position);

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

    function getArea(position, buffer) {

        ////////////////////////////
        //position = { x : 50, y : 50};
        //buffer   = 0;
        ////////////////////////////

        var camera       = CFG.camera,
            unitSize     = CFG.unitSize,
            positionTile = getPositionTile(position),
            sizeX        = Math.ceil((camera.width / 2) / unitSize),
            sizeY        = Math.ceil((camera.height / 2) / unitSize),
            startX       = positionTile.x - sizeX - buffer,
            stopX        = positionTile.x + sizeX + buffer,
            startY       = positionTile.y - sizeY - buffer,
            stopY        = positionTile.y + sizeY + buffer,
            area         = [],
            a = 0, b = 0, x, y;

        for (y = startY; y <= stopY; y++, b++) {
            a       = 0;
            area[b] = [];

            for (x = startX; x <= stopX; x++, a++) {
                if (y < 0 || x < 0 || y >= map.length || x >=  map[0].length) {
                    area[b][a] = defaults.mapItem;
                }
                else {
                    area[b][a] = map[y][x];
                }
            }
        }

        /*
        console.group('Area');
        for (y=0;y<area[0].length;y++) {
            var row = '';
            for (x=0;x<area.length;x++) {
                row += area[y][x] + '  ';
            }
            console.log(row);
        }
        console.groupEnd();
        /**/

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


        // todo - usefull?
    /*
    function getVanishingTile() {
    }
    */

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
        //getVanishingTile : getVanishingTile
    }});

})(window.PPV);
