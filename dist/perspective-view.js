/*! perspective-view - Delivers a simple javascript methods pool for rendering grid based (array) maps into a virtual, perspective, 3d top view with canvas. - Version: 1.1.2 */
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
                mode      : 'normal', // flat, normal, uniform
                wireFrame : false,
                grid      : false,
                camera    : false
            }
        };

    // --------------------------------------------------------------------------------------------------------- MODULES

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

    // ------------------------------------------------------------------------------------------------------------ INIT

    function init(config) {
        CFG = mod.merge.deep(defaults, config);

        initModules(CFG);
        runModules();

        return {
            render : render,
            update : update
        }
    }

    // ---------------------------------------------------------------------------------------------------------- PUBLIC

    function render() {
        // mod.render.update(CFG);
        mod.render.render();
    }


    function update(config) {
        CFG =  mod.merge.deep(CFG, config);

        updateModules(CFG);
    }

    // ----------------------------------------------------------------------------------------------------- DEV RETURNS

    return {
        DEV           : DEV,
        configuration : CFG,
        appendModule  : appendModule,
        init          : init,
        modules       : mod
    };

})();

;(function canvasHelper(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    /**
     * Stores the context of the canvas.
     *
     * @private
     * @memberof canvasHelper
     * @type {object}
     */
    var _context = {},


    /**
     * Stores the canvas element in which the helpers are rendered.
     *
     * @private
     * @memberof canvasHelper
     * @type {object}
     */
    _canvas  = {},


    /**
     * Stores the config for all helpers.
     *
     * @private
     * @memberof canvasHelper
     * @type     {object}
     * @property {object} camera           - Config of the camera helper
     * @property {string} camera.color     - Color of the camera lines
     * @property {number} camera.lineWidth - Line width of the camera lines
     * @property {object} grid             - Config of the grid helper
     * @property {string} grid.color       - Color of the grid lines
     * @property {number} grid.lineWidth   - Line width of the grid lines
     */
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
        _canvas  = config.canvas;
        _context = config.context;
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    function clean() {
        _context.save();
        _context.setTransform(1, 0, 0, 1, 0, 0);
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        _context.restore();
    }


    function drawCamera(camera) {
        var c  = { x : camera.position.x, y : camera.position.y},
            tl = { x : c.x - (camera.width / 2), y : c.y - (camera.height / 2)},
            tr = { x : c.x + (camera.width / 2), y : c.y - (camera.height / 2)},
            bl = { x : c.x - (camera.width / 2), y : c.y + (camera.height / 2)},
            br = { x : c.x + (camera.width / 2), y : c.y + (camera.height / 2)};

        _context.save();

        _context.strokeStyle = _config.camera.color;
        _context.lineWidth   = _config.camera.lineWidth;


        _context.rect(tl.x, tl.y, camera.width, camera.height);
        _context.stroke();

        _context.beginPath();
        _context.moveTo(tl.x, tl.y);
        _context.lineTo(c.x,  c.y);
        _context.stroke();

        _context.beginPath();
        _context.moveTo(tr.x, tr.y);
        _context.lineTo(c.x,  c.y);
        _context.stroke();

        _context.beginPath();
        _context.moveTo(br.x, br.y);
        _context.lineTo(c.x,  c.y);
        _context.stroke();

        _context.beginPath();
        _context.moveTo(bl.x, bl.y);
        _context.lineTo(c.x,  c.y);
        _context.stroke();


        _context.restore();
    }



    function drawCanvasGrid(camera, unitSize, shift) {
        var startX = (camera.position.x % unitSize)  - shift.x,
            startY = (camera.position.y % unitSize) - shift.y,
            x, y;

        _context.save();
        _context.strokeStyle = _config.grid.color;
        _context.lineWidth   = _config.grid.lineWidth;

        _context.beginPath();

        for (x = startX; x <= _canvas.width; x += unitSize) {
            _context.moveTo(x, 0);
            _context.lineTo(x, _canvas.height);
        }

        for (y = startY; y <= _canvas.height; y += unitSize) {
            _context.moveTo(0, y);
            _context.lineTo(_canvas.width, y);
        }

        _context.closePath();
        _context.stroke();
        _context.restore();
    }


    function drawCameraGrid(camera, unit, shift) {
        var cameraStartX = (camera.position.x - (camera.width  / 2)),
            cameraStartY = (camera.position.y - (camera.height / 2)),
            startX       = cameraStartX + (((cameraStartX % unit.width)+ unit.width - shift.x) % unit.width),
            stopX        = cameraStartX + camera.width,
            startY       = cameraStartY + (((cameraStartY % unit.height) + unit.height - shift.y) % unit.height),
            stopY        = cameraStartY + camera.height,
            x, y;

        _context.save();
        _context.strokeStyle = _config.grid.color;
        _context.lineWidth   = _config.grid.lineWidth;

        _context.beginPath();

        for (x = startX; x <= stopX; x += unit.width) {
            _context.moveTo(x, cameraStartY);
            _context.lineTo(x, stopY);
        }

        for (y = startY; y <= stopY; y += unit.height) {
            _context.moveTo(cameraStartX, y);
            _context.lineTo(stopX, y);
        }

        _context.closePath();
        _context.stroke();
        _context.restore();
    }


    function drawPoint(x, y, width, height) {
        if (typeof width !== 'number') {
            width = _config.point.width;
        }

        if (typeof height !== 'number') {
            height = _config.point.height;
        }

        _context.save();
        _context.fillStyle = _config.point.color;
        _context.fillRect(
            x - width/2,
            y - height/2,
            width,
            height
        );
        _context.restore();
    }


    function drawPath(parameters) {
        var path = parameters.path,
            filled = parameters.filled || false,
            i, pathAmount = path.length;

        _context.save();

        _context.strokeStyle = _config.path.color;
        _context.fillStyle   = _config.path.fillcolor;
        _context.lineWidth   = _config.path.lineWidth;

        _context.beginPath();
        _context.moveTo(path[0].x, path[0].y);

        for (i = 1; i < pathAmount; i++) {
            _context.lineTo(path[i].x, path[i].y);
        }

        _context.closePath();
        _context.stroke();

        if (!filled) {
            _context.fill();
        }

        _context.restore();
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

;(function color(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var back  = {r: 150, g: 150, b: 150, a: 1},
        east  = {r: 159, g: 159, b: 159, a: 1},
        front = {r: 207, g: 207, b: 207, a: 1},
        north = {r: 127, g: 127, b: 127, a: 1},
        south = {r: 223, g: 223, b: 223, a: 1},
        space = {r: 255, g: 255, b: 255, a: 0},
        west  = {r: 191, g: 191, b: 191, a: 1};

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

    function getBase() {
        return 'rgba('+
            back.r + ', ' +
            back.g + ', ' +
            back.b + ', ' +
            back.a + ')';
    }


    function getSpace() {
        return 'rgba('+
            space.r + ', ' +
            space.g + ', ' +
            space.b + ', ' +
            space.a + ')';
    }


    function getFront() {
        return 'rgba('+
            front.r + ', ' +
            front.g + ', ' +
            front.b + ', ' +
            front.a + ')';
    }


    function getNorth() {
        return 'rgba('+
            north.r + ', ' +
            north.g + ', ' +
            north.b + ', ' +
            north.a + ')';
    }


    function getEast() {
        return 'rgba('+
            east.r + ', ' +
            east.g + ', ' +
            east.b + ', ' +
            east.a + ')';
    }


    function getSouth() {
        return 'rgba('+
            south.r + ', ' +
            south.g + ', ' +
            south.b + ', ' +
            south.a + ')';
    }


    function getWest() {
        return 'rgba('+
            west.r + ', ' +
            west.g + ', ' +
            west.b + ', ' +
            west.a + ')';
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ color : {
        init     : init,
        run      : run,
        update   : update,
        getBase  : getBase,
        getEast  : getEast,
        getFront : getFront,
        getNorth : getNorth,
        getSouth : getSouth,
        getSpace : getSpace,
        getWest  : getWest
    }});
})(window.PPV);

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

    function init(config) {
        mod_Map          = ppv.modules.map;
        mod_Color        = ppv.modules.color;
        mod_canvasHelper = ppv.modules.canvasHelper;

        update(config);
    }


    function run() {
        // Nothing to do yet
    }


    function update(config) {
        CFG         = config;
        renderMap   = mod_Map.getArea(CFG.position, buffer);
        renderOrder = getRenderOrder(renderMap);
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    function cleanCanvas() {
        CFG.context.save();
        CFG.context.setTransform(1, 0, 0, 1, 0, 0);
        CFG.context.clearRect(0, 0, CFG.canvas.width, CFG.canvas.height);
        CFG.context.restore();
    }


    function getVanishingTile() {
        return { x : Math.floor(renderMap[0].length / 2), y : Math.floor(renderMap.length / 2)};
    }


    function getShiftByHeight(h) {
        var position    = CFG.position,
            unitSize    = CFG.unitSize,
            newUnitSize = getUnitSizeByHeight(h),
            baseShift   = {
                x : (position.x % unitSize),
                y : (position.y % unitSize)
            };

        if (h == 0) {
            return baseShift;
        }
        else {
            return {
                x : Math.round(baseShift.x + ((newUnitSize - unitSize) / (unitSize / baseShift.x))),
                y : Math.round(baseShift.y + ((newUnitSize - unitSize) / (unitSize / baseShift.y)))
            };
        }
    }


    function getUnitSizeByHeight(h) {
        var unitSize  = CFG.unitSize,
            unitDepth = CFG.unitDepth;

        if (h == 0) {
            return unitSize;
        }
        else {
            return Math.round(unitSize + (Math.round(((unitSize * unitDepth) - unitSize)) * h));
        }
    }


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
                    renderShape(getFrontPath(x, y, 0), mod_Color.getFront());
                }
            }
            else if (CFG.render.mode.toLowerCase() === 'uniform') {
                if (isNumber(item) && item > 0 || isArray(item)) {
                    renderObject(x, y, 0, 1);
                }
            }
            else { // if (CFG.render.mode.toLowerCase() === 'normal') {
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


    function renderObject(x, y, h1, h2) {
        var vanishingTile     = getVanishingTile(),
            backPath, frontPath,
            eastPath, westPath, southPath, northPath;

        backPath  = getFrontPath(x, y, h1);
        frontPath = getFrontPath(x, y, h2);

        if (CFG.render.wireFrame || x < vanishingTile.x) {
            eastPath = getEastPath(backPath, frontPath);
            renderShape(eastPath, mod_Color.getEast());
        }
        if (CFG.render.wireFrame || x > vanishingTile.x) {
            westPath = getWestPath(backPath, frontPath);
            renderShape(westPath, mod_Color.getWest());
        }

        if (CFG.render.wireFrame || y < vanishingTile.y) {
            southPath = getSouthPath(backPath, frontPath);
            renderShape(southPath, mod_Color.getSouth());
        }
        if (CFG.render.wireFrame || y > vanishingTile.y) {
            northPath = getNorthPath(backPath, frontPath);
            renderShape(northPath, mod_Color.getNorth());
        }

        renderShape(frontPath, mod_Color.getFront());
    }


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


    function getNorthPath(backPath, frontPath) {
        return [
            { x : backPath[0].x,  y : backPath[0].y  },
            { x : backPath[1].x,  y : backPath[1].y  },
            { x : frontPath[1].x, y : frontPath[1].y },
            { x : frontPath[0].x, y : frontPath[0].y }
        ];
    }


    function getEastPath(backPath, frontPath) {
        return [
            { x : frontPath[1].x, y : frontPath[1].y },
            { x : backPath[1].x,  y : backPath[1].y  },
            { x : backPath[2].x,  y : backPath[2].y  },
            { x : frontPath[2].x, y : frontPath[2].y }
        ];
    }


    function getSouthPath(backPath, frontPath) {
        return [
            { x : frontPath[3].x, y : frontPath[3].y },
            { x : backPath[3].x,  y : backPath[3].y  },
            { x : backPath[2].x,  y : backPath[2].y  },
            { x : frontPath[2].x, y : frontPath[2].y }
        ];
    }


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
