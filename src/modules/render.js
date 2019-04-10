;(function render(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var mod_Map          = null,
        mod_Color        = null,
        mod_canvasHelper = null,
        CFG              = {},
        renderMap        = [],
        renderOrder      = [],
        buffer           = 0;

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    /**
     * Initializes this module - will be called at the beginning from the app. Updates the module with the given config.
     *
     * @public
     * @param {object} config
     * @return {void}
     */
    function init(config) {
        mod_Map          = ppv.modules.map;
        mod_Color        = ppv.getModule('color');
        mod_canvasHelper = ppv.modules.canvasHelper;

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
        CFG         = config;

        // todo - Optimize - Get mapArea only if the position has changed and a new position tile has been reached
        renderMap   = mod_Map.getArea(CFG.position, buffer);
        renderOrder = getRenderOrder(renderMap);
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    /**
     * Fast way to clean the complete canvas.
     *
     * @private
     * @return {void}
     */
    function cleanCanvas() {
        CFG.context.save();
        CFG.context.setTransform(1, 0, 0, 1, 0, 0);
        CFG.context.clearRect(0, 0, CFG.canvas.width, CFG.canvas.height);
        CFG.context.restore();
    }


    /**
     * Returns the vanishing tile - Regular value is the middle tile of the renderMap.
     *
     * @returns {{x: number, y: number}}
     */
    function getVanishingTile() {
        var position = CFG.camera.position,
            unitSize = CFG.unitSize,
            x = Math.ceil(position.x / unitSize),
            y = Math.ceil(position.y / unitSize);

        return { x : x, y : y };
    }


    /**
     * Returns the shift of a (front) tile in px depended on a given height in px.
     *
     * @private
     * @param   {number} height
     * @returns {{x: number, y: number}}
     */
    function getShiftByHeight(height) {
        var position    = CFG.position,
            unitSize    = CFG.unitSize,
            newUnitSize = getUnitSizeByHeight(height),
            baseShift   = {
                x : (position.x % unitSize),
                y : (position.y % unitSize)
            };

        if (height === 0) {
            return baseShift;
        }
        else {
            return {
                x : Math.round(baseShift.x + ((newUnitSize - unitSize) / (unitSize / baseShift.x))),
                y : Math.round(baseShift.y + ((newUnitSize - unitSize) / (unitSize / baseShift.y)))
            };
        }
    }


    /**
     * Returns the size of an unit by a given height.
     *
     * @private
     * @param   {number} height
     * @returns {number}
     */
    function getUnitSizeByHeight(height) {
        var unitSize  = CFG.unitSize,
            unitDepth = CFG.unitDepth;

        if (height === 0) {
            return unitSize;
        }
        else {
            return Math.round(unitSize + (Math.round(((unitSize * unitDepth) - unitSize)) * height));
        }
    }

    // ------------------------------------------------------------------------------------------------ RENDER

    /**
     * Main method to render the map
     *
     * @public
     * @returns {void}
     */
    function render() {
        var camera            = CFG.camera,
            renderOrderAmount = renderOrder.length,
            item, i, x, y;

        cleanCanvas();


        for (i = renderOrderAmount - 1; i >= 0; i--) {
            x    = renderOrder[i].x;
            y    = renderOrder[i].y;
            item = renderMap[y][x];

            if (CFG.render.mode.toLowerCase() === 'flat') {
                if (isNumber(item) && item > 0 || isArray(item)) {
                    renderShape(getFrontPath(x, y, 0), mod_Color.getFront(0));
                }
            }
            else if (CFG.render.mode.toLowerCase() === 'uniform') {
                if (isNumber(item) && item > 0 || isArray(item)) {
                    renderObject(x, y, 0, 1);
                }
            }
            else { // if (CFG.render.mode.toLowerCase() === 'default') {
                if (isNumber(item) && item > 0) {
                    renderObject(x, y, 0, item);
                }
                else if (isArray(item) && item.length >= 2) {
                    renderObject(x, y, item[0], item[1]);
                }
            }
        }

        if (CFG.render.grid) {
            var shift       = getShiftByHeight(0),
                newUnitSize = getUnitSizeByHeight(0);

            mod_canvasHelper.drawCanvasGrid(camera, newUnitSize, shift);
            //mod_canvasHelper.drawCameraGrid(camera, newUnitSize, shift);
        }

        if (CFG.render.camera) {
            mod_canvasHelper.drawCamera(camera);
        }
    }


    /**
     * Renders one object at the given tile position and from given height h1 to given height h2.
     *
     * @param   {number} x  - X position of the tile
     * @param   {number} y  - Y position of the tile
     * @param   {number} h1 - Smaller height to start from
     * @param   {number} h2 - Higher height to end with
     * @returns {void}
     */
    function renderObject(x, y, h1, h2) {
        var vanishingTile = getVanishingTile(),
            backPath, frontPath,
            eastPath, westPath, southPath, northPath;

        backPath   = getFrontPath(x, y, h1);
        frontPath  = getFrontPath(x, y, h2);

        if (CFG.render.back) {
            renderShape(backPath, mod_Color.getBack());
        }

        if (CFG.render.walls) {
            if (CFG.render.wireFrame || CFG.render.hiddenWalls || x < vanishingTile.x) {
                eastPath = getEastPath(backPath, frontPath);
                renderShape(eastPath, mod_Color.getEast());
            }
            if (CFG.render.wireFrame || CFG.render.hiddenWalls || x > vanishingTile.x) {
                westPath = getWestPath(backPath, frontPath);
                renderShape(westPath, mod_Color.getWest());
            }
            if (CFG.render.wireFrame || CFG.render.hiddenWalls || y < vanishingTile.y) {
                southPath = getSouthPath(backPath, frontPath);
                renderShape(southPath, mod_Color.getSouth());
            }
            if (CFG.render.wireFrame || CFG.render.hiddenWalls || y > vanishingTile.y) {
                northPath = getNorthPath(backPath, frontPath);
                renderShape(northPath, mod_Color.getNorth());
            }
        }

        if (CFG.render.front) {
            renderShape(frontPath, mod_Color.getFront(h2));
        }
    }


    /**
     * Renders a shape given bei its path and color. Through config your could choose to fill the shape or not.
     *
     * @param   {Array} path
     * @param   {string} color - rgb-color-sting
     * @returns {void}
     */
    function renderShape(path, color) {
        var i = 0;

        CFG.context.beginPath();
        CFG.context.moveTo(path[i].x, path[i].y);

        CFG.context.fillStyle   = color;
        CFG.context.strokeStyle = color;

        for (i = 1; i < path.length; i++) {
            CFG.context.lineTo(path[i].x, path[i].y);
        }

        CFG.context.closePath();
        CFG.context.stroke();

        if (!CFG.render.wireFrame) {
            CFG.context.fill();
        }
    }


    /**
     * Returns the order of tiles to render.
     *
     * @param   {Array} map
     * @returns {Array}
     */
    function getRenderOrder(map) {
        var vanishingCell = getVanishingTile(),
            mapAmountX    = map[0].length,
            mapAmountY    = map.length,
            orderX        = [],
            orderY        = [],
            order         = [],
            x, y;

        // Get reversed x render order
        for (x = vanishingCell.x; x < mapAmountX; x++) {
            orderX.push(x);
        }

        for (x = vanishingCell.x - 1; x >= 0 ; x--) {
            orderX.push(x);
        }

        // Get reversed y render order
        for (y = vanishingCell.y; y < mapAmountY; y++) {
            orderY.push(y);
        }

        for (y = vanishingCell.y - 1; y >= 0 ; y--) {
            orderY.push(y);
        }

        // Merge the x and y render order
        for (y = 0; y < mapAmountY; y++) {
            for (x = 0; x < mapAmountX; x++) {
                order.push({
                    x: orderX[x],
                    y: orderY[y]
                });
            }
        }

        return order;
    }

    // ------------------------------------------------------------------------------------------------- Paths

    /**
     * Returns the path/edges of a back/front shape depended on a given height
     *
     * @private
     * @param   {number} x - x position of the shape
     * @param   {number} y - y position of the shape
     * @param   {number} h - height of the shape
     * @returns {{x: number, y: number}[]}
     */
    function getFrontPath(x, y, h) {
        var vanishingTile = getVanishingTile(),
            shift         = getShiftByHeight(h),
            unitSize      = getUnitSizeByHeight(h),
            camPosition   = CFG.camera.position,
            shiftX        = shift.x,
            shiftY        = shift.y,
            startX        = camPosition.x + ((x - vanishingTile.x) * unitSize) - shiftX,
            startY        = camPosition.y + ((y - vanishingTile.y) * unitSize) - shiftY,
            stopX         = startX + unitSize,
            stopY         = startY + unitSize;

        return [
            { x : startX, y : startY },
            { x : stopX,  y : startY },
            { x : stopX,  y : stopY  },
            { x : startX, y : stopY  }
        ];
    }



    /**
     * Returns the path/edges of the north shape depended on a given back- and front path/edges/shape
     *
     * @private
     * @param   {object} backPath
     * @param   {object} frontPath
     * @returns {Array} - List of x/y positions
     */
    function getNorthPath(backPath, frontPath) {
        return [
            { x : backPath[0].x,  y : backPath[0].y  },
            { x : backPath[1].x,  y : backPath[1].y  },
            { x : frontPath[1].x, y : frontPath[1].y },
            { x : frontPath[0].x, y : frontPath[0].y }
        ];
    }


    /**
     * Returns the path/edges of the east shape depended on a given back- and front path/edges/shape
     *
     * @private
     * @param   {object} backPath
     * @param   {object} frontPath
     * @returns {Array} - List of x/y positions
     */
    function getEastPath(backPath, frontPath) {
        return [
            { x : frontPath[1].x, y : frontPath[1].y },
            { x : backPath[1].x,  y : backPath[1].y  },
            { x : backPath[2].x,  y : backPath[2].y  },
            { x : frontPath[2].x, y : frontPath[2].y }
        ];
    }


    /**
     * Returns the path/edges of the south shape depended on a given back- and front path/edges/shape
     *
     * @private
     * @param   {object} backPath
     * @param   {object} frontPath
     * @returns {Array} - List of x/y positions
     */
    function getSouthPath(backPath, frontPath) {
        return [
            { x : frontPath[3].x, y : frontPath[3].y },
            { x : backPath[3].x,  y : backPath[3].y  },
            { x : backPath[2].x,  y : backPath[2].y  },
            { x : frontPath[2].x, y : frontPath[2].y }
        ];
    }


    /**
     * Returns the path/edges of the west shape depended on a given back- and front path/edges/shape
     *
     * @private
     * @param   {object} backPath
     * @param   {object} frontPath
     * @returns {Array} - List of x/y positions
     */
    function getWestPath(backPath, frontPath) {
        return [
            { x : frontPath[0].x, y : frontPath[0].y },
            { x : backPath[0].x,  y : backPath[0].y  },
            { x : backPath[3].x,  y : backPath[3].y  },
            { x : frontPath[3].x, y : frontPath[3].y }
        ];
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ render : {
        init   : init,
        run    : run,
        update : update,
        render : render
    }});
})(window.PPV);
