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
        size      = getSize(dimension);
        tile      = getTile(position);

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
        //buffer   = 1;
        ////////////////////////////

        var tile = getTile(position),
            tl   = { x : tile.x - Math.floor((CFG.camera.width / 2) / CFG.unitSize) - buffer,    y : tile.y - Math.floor((CFG.camera.height / 2) / CFG.unitSize) - buffer},
            br   = { x : tile.x + Math.ceil((CFG.camera.width / 2) / CFG.unitSize) + buffer - 1, y : tile.y + Math.ceil((CFG.camera.height / 2) / CFG.unitSize) + buffer - 1},
            area = [],
            a = 0, b = 0, x, y;

        for (y = tl.y; y <= br.y; y++, b++) {
            a       = 0;
            area[b] = [];

            for (x = tl.x; x <= br.x; x++, a++) {
                if (y < 0 || x < 0 || y >= map.length || x >=  map[0].length) {
                    area[b][a] = defaults.mapItem;
                }
                else {
                    area[b][a] = map[y][x];
                }
            }
        }

        //*
        for (y=0;y<area[0].length;y++) {
            var row = '';
            for (x=0;x<area.length;x++) {
                row += area[y][x] + ', ';
            }
            console.log(row);
        }
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


    function getTile(position) {
        return {
            x : Math.ceil(position.x / CFG.unitSize),
            y : Math.ceil(position.y / CFG.unitSize)
        };
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ map : {
        init         : init,
        run          : run,
        update       : update,
        getArea      : getArea,
        getDimension : getDimension,
        getPosition  : getPosition,
        getSize      : getSize,
        getTile      : getTile
    }});

})(window.PPV);
