/**
 * Map module to provide basic map operation for rendering.
 */
;(function map(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var CFG       = {},             // Stores the global config
        map       = [],             // Stores the map
        size      = {x : 0, y : 0}, // Stores the size of the map in px
        dimension = {x : 0, y : 0}, // Stores the x- and y-amount of the map - amount of tiles in the map
        tile      = {x : 0, y : 0}, // Stores the current position on the map as tile
        defaults  = {
            mapItem : 0             // Default value for cells with no content
        };

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    /**
     * Initializes this module - will be called at the beginning from the app. Updates the module with the given config.
     *
     * @public
     * @param {object} config
     * @return {void}
     */
    function init(config) {
        update(config);
    }


    /**
     * Will be called from app if all other modules has been loaded.
     *
     * @public
     * @return {void}
     */
    function run() {
        // Nothing to do yet
    }


    /**
     * Updates this module, will be called on init and on general updating the app.
     *
     * @public
     * @pram {object} config
     * @return {void}
     */
    function update(config) {
        CFG       = config;
        map       = config.map;
        dimension = getDimension();
        size      = getSize(dimension);
        tile      = getPositionTile(CFG.position);
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    /**
     * Returns the part of the map as array of the given position which is visible in the camera plus the given buffer
     * tiles.
     *
     * @param {object} position - X/Y position object
     * @param {number} buffer   - Tiles around the visible part - Could be useful
     * @returns {Array}
     */
    function getArea(position, buffer) {
        var canvas   = CFG.canvas,
            camera   = CFG.camera,
            unitSize = CFG.unitSize,
            tile     = getPositionTile(position),

            sizeX    = Math.ceil(((camera.width / 2) / unitSize)),
            sizeY    = Math.ceil(((camera.height / 2) / unitSize)),

            startX   = tile.x - sizeX - buffer,
            stopX    = tile.x + sizeX + buffer,
            startY   = tile.y - sizeY - buffer,
            stopY    = tile.y + sizeY + buffer,

            area     = [],
            a, b, x, y;

        /**/
        if (camera.warped) {
            var widthOffset  = ((canvas.width  - camera.width)  / 2),
                heightOffset = ((canvas.height - camera.height) / 2);

            startX = tile.x - Math.ceil((camera.position.x - widthOffset)  / unitSize) - buffer;
            startY = tile.y - Math.ceil((camera.position.y - heightOffset) / unitSize) - buffer;
            stopX  = tile.x + Math.ceil((camera.width  - camera.position.x)  / unitSize) + buffer;
            stopY  = tile.y + Math.ceil((camera.height - camera.position.y)  / unitSize) + buffer;
        }
            console.log(tile.x, tile.y);
            console.log(startX, startY);
            console.log(stopX, stopY);
        /**/

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


    /**
     * Returns the sizes of the map in tiles.
     *
     * @returns {{x: number, y: number}}
     */
    function getDimension() {
        // todo - check if map[0] is an array
        return {
            x : map[0].length,
            y : map.length
        };
    }


    /**
     * Returns the sizes of the map in px.
     *
     * @param  {object} dimension
     * @returns {{x: number, y: number}}
     */
    function getSize(dimension) {
        return {
            x : CFG.unitSize * dimension.x,
            y : CFG.unitSize * dimension.y
        };
    }


    /**
     * Returns the tile in the map of the given position.
     *
     * @param {object} position - X/Y position in px
     * @returns {{x: number, y: number}}
     */
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
        getSize          : getSize,
        getPositionTile  : getPositionTile
    }});
})(window.PPV);
