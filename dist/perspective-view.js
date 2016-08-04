/*! perspective-view - Delivers a simple javascript methods pool for rendering grid based (array) maps into a virtual, perspective, 3d top view with canvas. - Version: 1.4.1 */
function PerspectiveView(configuration) {
    return window.PPV.init(configuration);
}

window.PPV = (function() {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var mod      = {},
        CFG      = {},
        DEV      = {
            enable       : true,
            abortOnError : false,
            util         : {}
        },
        defaults = {
            colorModule : {},
            // ----------------------------------------------------------------------------------- Default configuration
            canvas    : null,
            context   : null,
            map       : [[1]],
            unitSize  : 100,
            unitDepth : 1.1,
            position  : { x : 0, y : 0},
            camera    : {
                width    : 800,
                height   : 600,
                position : {
                    x : 400,
                    y : 300
                }
            },
            render : {
                back        : false,
                camera      : false,
                front       : true,
                grid        : false,
                hiddenWalls : false,
                mode        : 'default',
                walls       : true,
                wireFrame   : false
            },
            color : {
                mode        : 'default',
                objectColor : {r: 200, g: 200, b: 200, a: 1},
                spaceColor  : {r: 255, g: 255, b: 255, a: 0},
                lighting    : {
                    back   : 0,
                    east   : -10,
                    height : 2,
                    front  : 10,
                    north  : -20,
                    south  : 0,
                    west   : -15
                }
            }
        };

    // --------------------------------------------------------------------------------------------------------- MODULES

    /**
     * Appends a given module object.
     *
     * @param   {object} module
     * @returns {void}
     */
    function appendModule(module) {
        var id;

        if (DEV.enable) {
            if ((!module) || (typeof module !== 'object')) {
                console.error('Parameter <module> is not a valid PerspectiveView module :: ', '{' , typeof module, '} :: ', module);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        for (id in module) {
            if (module.hasOwnProperty(id) && mod.hasOwnProperty(id)) {
                console.error('There already exists a module named \'' + id + '\'');
            }
            else {
                mod[id] = module[id];
            }
        }
    }


    /**
     * Initializes all appended modules. Will call all init methods of the appended modules with the given
     * configuration.
     *
     * @param   config
     * @returns {void}
     */
    function initModules(config) {
        var i;

        for (i in mod) {
            if (mod.hasOwnProperty(i)) {
                if (typeof mod[i].init === 'function') {
                    mod[i].init(config);
                }
            }
        }
    }


    /**
     * Calls all run methods of the appended modules.
     *
     * @returns {void}
     */
    function runModules() {
        var i;

        for (i in mod) {
            if (mod.hasOwnProperty(i)) {
                if (typeof mod[i].run === 'function') {
                    mod[i].run();
                }
            }
        }
    }


    /**
     * Updates all appended modules. Will call all update methods of the appended modules with the given configuration.
     *
     * @param   config
     * @returns {void}
     */
    function updateModules(config) {
        var i;

        for (i in mod) {
            if (mod.hasOwnProperty(i)) {
                if (typeof mod[i].update === 'function') {
                    mod[i].update(config);
                }
            }
        }
    }


    /**
     * Returns a requested module by the module.mode in the config.
     *
     * @param   {string} type - Type of module [color, render, map]
     * @returns {object}
     */
    function getModule(type) {
        if (type == 'color') {
            switch (CFG[type].mode) {
                case 'default':
                default:
                    return mod.color;
            }
        }

        return {};
    }

    // ------------------------------------------------------------------------------------------------------------ INIT

    /**
     * Initialize this app.
     *
     * @param   {object} config
     * @returns {{render: render, update: update}}
     */
    function init(config) {
        CFG = mod.merge.deep(defaults, config);

        // todo - Will be "decommented" if there are mor than only one color mode
        //if (CFG.color.mode.toLowerCase() === 'default') {
            CFG.colorModule = 'color';
        //}

        initModules(CFG);
        runModules();

        return {
            render    : render,
            update    : update,
            getConfig : getConfig
        }
    }

    // ---------------------------------------------------------------------------------------------------------- PUBLIC

    /**
     * Public method to render the map
     *
     * @public
     * @returns {void}
     */
    function render() {
        mod.render.render();
    }


    /**
     * Public method to update configuration
     *
     * @public
     * @param   {object} config
     * @returns {void}
     */
    function update(config) {
        CFG =  mod.merge.deep(CFG, config);

        updateModules(CFG);
    }

    function getConfig() {
        return CFG;
    }

    // ----------------------------------------------------------------------------------------------------- DEV RETURNS

    return {
        DEV           : DEV,
        configuration : CFG,
        appendModule  : appendModule,
        getModule     : getModule,
        init          : init,
        modules       : mod
    };
})();

;(function canvasHelper(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var context = {},
        canvas  = {},
        _config = {
            camera: {
                color: 'rgba(0, 255, 127, 0.5)',
                lineWidth: 1
            },
            grid: {
                color: 'rgba(0, 127, 255, 0.5)',
                lineWidth: 1
            },
            path: {
                color: 'rgba(255, 0, 127, 0.5)',
                fillcolor: '#fff',
                lineWidth: 1
            },
            point: {
                color: 'rgba(255, 127, 0, 0.5)',
                width: 5,
                height: 5
            }
        };

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    function init(config) {
        update(config);
    }


    function run() {
        // Nothing to do yet
    }


    function update(config) {
        canvas  = config.canvas;
        context = config.context;
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    function clean() {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }


    function drawCamera(camera) {
        var c  = { x : camera.position.x, y : camera.position.y},
            tl = { x : c.x - (camera.width / 2), y : c.y - (camera.height / 2)},
            tr = { x : c.x + (camera.width / 2), y : c.y - (camera.height / 2)},
            bl = { x : c.x - (camera.width / 2), y : c.y + (camera.height / 2)},
            br = { x : c.x + (camera.width / 2), y : c.y + (camera.height / 2)};

        context.save();

        context.strokeStyle = _config.camera.color;
        context.lineWidth   = _config.camera.lineWidth;

        context.rect(tl.x, tl.y, camera.width, camera.height);
        context.stroke();

        context.beginPath();
        context.moveTo(tl.x, tl.y);
        context.lineTo(c.x,  c.y);
        context.stroke();

        context.beginPath();
        context.moveTo(tr.x, tr.y);
        context.lineTo(c.x,  c.y);
        context.stroke();

        context.beginPath();
        context.moveTo(br.x, br.y);
        context.lineTo(c.x,  c.y);
        context.stroke();

        context.beginPath();
        context.moveTo(bl.x, bl.y);
        context.lineTo(c.x,  c.y);
        context.stroke();

        context.restore();
    }


    function drawCanvasGrid(camera, unitSize, shift) {
        var startX = (camera.position.x % unitSize)  - shift.x,
            startY = (camera.position.y % unitSize) - shift.y,
            x, y;

        context.save();
        context.strokeStyle = _config.grid.color;
        context.lineWidth   = _config.grid.lineWidth;

        context.beginPath();

        for (x = startX; x <= canvas.width; x += unitSize) {
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
        }

        for (y = startY; y <= canvas.height; y += unitSize) {
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
        }

        context.closePath();
        context.stroke();
        context.restore();
    }


    function drawCameraGrid(camera, unit, shift) {
        var cameraStartX = (camera.position.x - (camera.width  / 2)),
            cameraStartY = (camera.position.y - (camera.height / 2)),
            startX       = cameraStartX + (((cameraStartX % unit.width)+ unit.width - shift.x) % unit.width),
            stopX        = cameraStartX + camera.width,
            startY       = cameraStartY + (((cameraStartY % unit.height) + unit.height - shift.y) % unit.height),
            stopY        = cameraStartY + camera.height,
            x, y;

        context.save();
        context.strokeStyle = _config.grid.color;
        context.lineWidth   = _config.grid.lineWidth;

        context.beginPath();

        for (x = startX; x <= stopX; x += unit.width) {
            context.moveTo(x, cameraStartY);
            context.lineTo(x, stopY);
        }

        for (y = startY; y <= stopY; y += unit.height) {
            context.moveTo(cameraStartX, y);
            context.lineTo(stopX, y);
        }

        context.closePath();
        context.stroke();
        context.restore();
    }


    function drawPoint(x, y, width, height) {
        if (typeof width !== 'number') {
            width = _config.point.width;
        }

        if (typeof height !== 'number') {
            height = _config.point.height;
        }

        context.save();
        context.fillStyle = _config.point.color;
        context.fillRect(
            x - width/2,
            y - height/2,
            width,
            height
        );
        context.restore();
    }


    function drawPath(parameters) {
        var path = parameters.path,
            filled = parameters.filled || false,
            i, pathAmount = path.length;

        context.save();

        context.strokeStyle = _config.path.color;
        context.fillStyle   = _config.path.fillcolor;
        context.lineWidth   = _config.path.lineWidth;

        context.beginPath();
        context.moveTo(path[0].x, path[0].y);

        for (i = 1; i < pathAmount; i++) {
            context.lineTo(path[i].x, path[i].y);
        }

        context.closePath();
        context.stroke();

        if (!filled) {
            context.fill();
        }

        context.restore();
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ canvasHelper: {
        init           : init,
        clean          : clean,
        drawCamera     : drawCamera,
        drawCanvasGrid : drawCanvasGrid,
        drawCameraGrid : drawCameraGrid,
        drawPoint      : drawPoint,
        drawPath       : drawPath
    }});
})(window.PPV);

;(function merge(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    function init(config) {
        update(config);
    }


    function run() {
        // Nothing to do yet
    }


    function update(config) {
        // Nothing to do yet
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    function deep(target, src) {
        var array = Array.isArray(src);
        var dst = array && [] || {};

        if (array) {
            target = target || [];
            dst = dst.concat(target);
            src.forEach(function (e, i) {
                if (typeof dst[i] === 'undefined') {
                    dst[i] = e;
                }
                else if (typeof e === 'object') {
                    dst[i] = deep(target[i], e);
                }
                else {
                    if (target.indexOf(e) === -1) {
                        dst.push(e);
                    }
                }
            });
        }
        else {
            if (target && typeof target === 'object') {
                Object.keys(target).forEach(function (key) {
                    dst[key] = target[key];
                })
            }
            Object.keys(src).forEach(function (key) {
                if (typeof src[key] !== 'object' || !src[key]) {
                    dst[key] = src[key];
                }
                else {
                    if (!target[key]) {
                        dst[key] = src[key];
                    }
                    else {
                        dst[key] = deep(target[key], src[key]);
                    }
                }
            });
        }

        return dst;
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ merge: {
        init   : init,
        run    : run,
        update : update,
        deep   : deep
    }});
})(window.PPV);

/**
 * Function pool to check variables for there type.
 */

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Checks if the type of the given parameter is an array.
 *
 * @param  {*} value
 * @return {boolean}
 */
function isArray(value) {
    return Object.prototype.toString.call(value) == "[object Array]";
}

/**
 * Checks if the type of the given parameter is undefined.
 *
 * @param  {*} value
 * @return {boolean}
 */
function isUndefined(value) {
    return Object.prototype.toString.call(value) == "[object Undefined]";
}

/**
 * Checks if the type of the given parameter is null.
 *
 * @param  {*} value
 * @return {boolean}
 */
function isNull(value) {
    return Object.prototype.toString.call(value) == "[object Null]";
}

/**
 * Checks if the type of the given parameter is a string.
 *
 * @param  {*} value
 * @return {boolean}
 */
function isString(value) {
    return Object.prototype.toString.call(value) == "[object String]";
}

/**
 * Checks if the type of the given parameter is a number.
 *
 * @param  {*} value
 * @return {boolean}
 */
function isNumber(value) {
    return Object.prototype.toString.call(value) == "[object Number]";
}

/**
 * Checks if the type of the given parameter is a boolean.
 *
 * @param  {*} value
 * @return {boolean}
 */
function isBoolean(value) {
    return Object.prototype.toString.call(value) == "[object Boolean]";
}

/**
 * Checks if the type of the given parameter is an object.
 *
 * @param  {*} value
 * @return {boolean}
 */
function isObject(value) {
    return Object.prototype.toString.call(value) == "[object Object]";
}

/**
 * Checks if the type of the given parameter is a function.
 *
 * @param  {*} value
 * @return {boolean}
 */
function isFunction(value) {
    return Object.prototype.toString.call(value) == "[object Function]";
}

// ---------------------------------------------------------------------------------------------------------------------

Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

function timestamp() {
    return window.performance && window.performance.timeNow ? window.performance.timeNow() : new Date().getTime();
}
/**
 * Simple color module to provide a pseudo 3d lighting of an object
 */
;(function color(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var CFG      = {}, // Stores the global config
        lighting = {}; // Stores the lighting configuration

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
        CFG = config;

        lighting = CFG.color.lighting;
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    /**
     * Returns the rgba-color string of the base color computed with the given lightning percentage.
     *
     * @private
     * @param {number} lighting - Percentage number to compute with the base color
     * @returns {string} - 'rgba(r, g, b, a)'
     */
    function getColor(lighting) {
        var color = CFG.color.objectColor;

        return 'rgba('+
            Math.round(color.r + (2.55 * lighting)) + ', ' +
            Math.round(color.g + (2.55 * lighting)) + ', ' +
            Math.round(color.b + (2.55 * lighting)) + ', ' +
            color.a + ')';
    }


    /**
     * Returns the rgba-color string of the back shape of an object.
     *
     * @public
     * @returns {string}
     */
    function getBack() {
        return getColor(lighting.back);
    }


    /**
     * Returns the rgba-color string of the empty space shape .
     *
     * @public
     * @returns {string}
     */
    function getSpace() {
        var color = CFG.color.spaceColor;

        return 'rgba('+
            color.r + ', ' +
            color.g + ', ' +
            color.b + ', ' +
            color.a + ')';
    }


    /**
     * Returns the rgba-color string of the front shape of an object computed with a current given height.
     *
     * @public
     * @param {number} height
     * @returns {string}
     */
    function getFront(height) {
        return getColor(lighting.front + (height * lighting.height));
    }


    /**
     * Returns the rgba-color string of the north shape of an object.
     *
     * @public
     * @returns {string}
     */
    function getNorth() {
        return getColor(lighting.north);
    }


    /**
     * Returns the rgba-color string of the east shape of an object.
     *
     * @public
     * @returns {string}
     */
    function getEast() {
        return getColor(lighting.east);
    }


    /**
     * Returns the rgba-color string of the south shape of an object.
     *
     * @public
     * @returns {string}
     */
    function getSouth() {
        return getColor(lighting.south);
    }


    /**
     * Returns the rgba-color string of the west shape of an object.
     *
     * @public
     * @returns {string}
     */
    function getWest() {
        return getColor(lighting.west);
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ color : {
        init     : init,
        run      : run,
        update   : update,
        getBack  : getBack,
        getEast  : getEast,
        getFront : getFront,
        getNorth : getNorth,
        getSouth : getSouth,
        getSpace : getSpace,
        getWest  : getWest
    }});
})(window.PPV);

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
        var camera   = CFG.camera,
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
        // todo - Check if map[0] is an array
        return { x : Math.floor(renderMap[0].length / 2), y : Math.floor(renderMap.length / 2)};
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

        if (height == 0) {
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

        if (height == 0) {
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

            //mod_canvasHelper.drawCameraGrid(camera, newUnitSize, shift);
            mod_canvasHelper.drawCanvasGrid(camera, newUnitSize, shift);
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

        backPath  = getFrontPath(x, y, h1);
        frontPath = getFrontPath(x, y, h2);

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
