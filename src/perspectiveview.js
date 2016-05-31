/**
 * To create an instance of PerspectiveView
 *
 * @namespace PerspectiveView
 * @constructor
 * @returns {window.PERSPECTIVEVIEW}
 */
function PerspectiveView() {
    return window.PERSPECTIVEVIEW;
}



/**
 * @ignore
 */
window.PERSPECTIVEVIEW = (function() {
    'use strict';



    // --------------------------------------------------------------------------------------------- CONSTANTS



    /**
     * Contains the settings for developing mode
     * If DEY.enable = true all parameters of all method will be validated and repeats logging outputs.
     *
     * @private
     * @alias DEV
     * @memberof PerspectiveView
     * @type {Object}
     * @property {Boolean} abortOnError - Script will abort if an error occurs
     */
    var DEV = {
        enable:       true,
        abortOnError: false,
        util: {}
    };



    // ------------------------------------------------------------------------------------------------- Scope



    /**
     * Stores the private scope.
     *
     * @private
     * @ignore
     * @memberof PerspectiveView
     * @type {Object}
     */
    var priv = {},



    /**
     * Stores a scope for modules.
     *
     * @private
     * @ignore
     * @memberof PerspectiveView
     * @type {Object}
     */
    mod = {},



    /**
     * Stores the public scope.
     *
     * @public
     * @ignore
     * @memberof PerspectiveView
     * @type {Object}
     */
    pub = {};



    // ---------------------------------------------------------------------------------------------- Defaults



    /**
     * Stores the default values for the properties.
     *
     * @private
     * @alias defaults
     * @memberof PerspectiveView
     * @type {Object}
     */
    priv.defaults = {
        canvas: {},
        context: {},
        depth: 0.05,
        map: [[0]],
        renderMode: 'flat',
        unit: {
            size: {
                x:  32,
                y: 32
            }
        },
        vanishingCell: {
            x: 0,
            y: 0
        },
        vanishingPoint: {
            x: 16,
            y: 16
        }
    };



    // ----------------------------------------------------------------------------------------------- Private



    /**
     * Stores the necessary HTML canvas element to set by user.
     *
     * @private
     * @alias canvas
     * @memberof PerspectiveView
     * @type {Object}
     */
    priv.canvas = {};



    /**
     * Stores the context of the HTML canvas element.
     * This property will be set per default as a 2d-context, when the canvas element will be set by user.
     *
     * @private
     * @alias context
     * @memberof PerspectiveView
     * @type {Object}
     */
    priv.context = {};



    /**
     * Stores the map or just a part of the users map.
     * A map is a 2d array containing number values. A zero marks a free/accessible unit/tile, a number higher than zero
     * is a blocked unit/tile and will rendered as a cuboid where the number declares the depth (size on virtual
     * z-axis).
     *
     * @private
     * @alias map
     * @memberof PerspectiveView
     * @type {Array}
     */
    priv.map = [];



    /**
     *
     * @type {string}
     */
    priv.renderMode = '';



    /**
     * Stores the size of an unit and the depth factor.
     *
     * @private
     * @alias unit
     * @memberof PerspectiveView
     * @type {Object}
     * @property {Object} unit.size   - Size object
     * @property {Number} unit.size.x - Width (size on x-axis) in px
     * @property {Number} unit.size.y - Height (size on y-axis) in px
     */
    priv.unit = {
        size: {
            x: 0,
            y: 0
        }
    };



    /**
     * Stores the current cell in which the vanishing point is located.
     *
     * @private
     * @alias vanishingCell
     * @memberof PerspectiveView
     * @type {Object}
     * @property {Number} x - Cell on x-axis in units/tiles.
     * @property {Number} y - Cell on y-axis in units/tiles.
     */
    priv.vanishingCell = {
        x: 0,
        y: 0
    };



    /**
     * Stores the coordinate of the vanishing point needs to draw perspective objects.
     *
     * @private
     * @alias vanishingPoint
     * @memberof PerspectiveView
     * @type {Object}
     * @property {Number} x - Position on x-axis in px
     * @property {Number} y - Position on y-axis in px
     */
    priv.vanishingPoint = {
        x: 0,
        y: 0
    };



    priv.render = {};



    // ------------------------------------------------------------------------------------------------ Public



    /**
     * Constructor, will be called if a new instance of PerspectiveView has been initialized.
     * Sets the default values.
     *
     * @public
     * @function
     * @memberof PerspectiveView
     * @return {void}
     */
    pub.init = function init() {
        // Set default values
        pub.setDepth(priv.defaults.depth);
        pub.setMap(priv.defaults.map);
        pub.setRenderMode(priv.defaults.renderMode);
        pub.setUnitSize(priv.defaults.unit.size.x, priv.defaults.unit.size.y);
        pub.setVanishingPoint(priv.defaults.vanishingPoint);
    };



    /**
     * Sets the con
     *
     * @public
     * @function
     * @alias setCanvas
     * @memberof PerspectiveView
     * @param {Object} canvas - HTML canvas element
     * @param {Object} canvas - HTML canvas element
     * @return {void}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // Get HTML canvas element
     * var canvas = document.getElementById('myCanvas');
     *
     * // Set canvas as new canvas
     * pv.setCanvas(canvas);
     */
    pub.setCanvas = function setCanvas(canvas) {
        if (DEV.enable) {
            if (!DEV.util.validate.isHtmlCanvasElement(canvas)) {
                console.error('Parameter <canvas> is not a valid HTML canvas element :: ', '{' , typeof canvas, '} :: ', canvas);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        priv.canvas = canvas;

        // Set the context as 2d per default
        pub.setContext(canvas.getContext("2d"));
    };



    /**
     * Sets te entire configuration or just one part.
     *
     * @public
     * @function
     * @alias setConfig
     * @memberof PerspectiveView
     * @param {Object} configuration - Complete configuration object
     * @return {void}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // Set a valid config
     * pv.setConfig({
     *     canvas: document.getElementById('myCanvas'),
     *     depth: 005,
     *     map: [
     *         [1, 1, 1, 1, 1],
     *         [1, 0, 0, 0, 1],
     *         [1, 0, 1, 1, 1],
     *         [1, 0, 0, 0, 1],
     *         [1, 1, 1, 1, 1]
     *     ],
     *     renderMode: 'flat',
     *     unitSize: {
     *         x: 50,
     *         y: 50
     *     },
     *     vanishingPoint: {
     *         x: 225,
     *         y: 175
     *     }
     * });
     */
    pub.setConfig = function setConfig(configuration) {
        var config = typeof configuration === 'object' ? configuration : {};

        if (typeof config.canvas !== 'undefined') {
            pub.setCanvas(config.canvas);
        }

        if (typeof config.context !== 'undefined') {
            pub.setContext(config.context);
        }

        if (typeof config.depth !== 'undefined') {
            pub.setDepth(config.depth);
        }

        if (typeof config.map !== 'undefined') {
            pub.setMap(config.map);
        }

        if (typeof config.renderMode !== 'undefined') {
            pub.setRenderMode(config.renderMode);
        }

        if (typeof config.unitSize === 'object') {
            pub.setUnitSize(config.unitSize.x, config.unitSize.y);
        }

        if (typeof config.vanishingPoint === 'object') {
            pub.setVanishingPoint(config.vanishingPoint);
        }
    };



    /**
     * Sets the HTML canvas element the map manipulations should be rendered to.
     * Automatically the context is set as 2d.
     *
     * @public
     * @function
     * @alias setContext
     * @memberof PerspectiveView
     * @param {Object} context - Context of the HTML canvas element
     * @return {void}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // Get HTML canvas element and its context
     * var myCanvas = document.getElementById('myCanvas');
     * var context  = myCanvas.getContext('2d');
     *
     * // Set context as new context
     * pv.setContext(context);
     */
    pub.setContext = function setContext(context) {
        if (DEV.enable) {
            if (!DEV.util.validate.isObject(context)) {
                console.error('Parameter <context> is not a valid context of an HTML canvas element :: ', '{' , typeof context, '} :: ', context);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        priv.context = context;
    };



    /**
     * Sets the depth factor.
     *
     * @public
     * @memberof PerspectiveView
     * @function
     * @alias setDepth
     * @param {Number} depth - Depth (size on virtual z-axis) of an unit/tile as factor
     * @return {void}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // Depth of a tile
     * var depth = 0.05;
     *
     * // Set depth as new depth
     * pv.setDepth(depth);
     */
    pub.setDepth = function setDepth(depth) {
        if (DEV.enable) {
            if (!DEV.util.validate.isSize(depth)) {
                console.error('Parameter <depth> is not a valid depth factor :: ', '{' , typeof depth, '} :: ', depth);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        priv.depth = Number(depth);

    };



    /**
     * Sets the configuration for developing mode.
     *
     * @public
     * @memberof PerspectiveView
     * @function
     * @alias setDevelopment
     * @param {Object}  configuration              - Configuration
     * @param {Boolean} configuration.enable       - Enables the developing mode
     * @param {Boolean} configuration.abortOnError - Aborting the script if an error occurs
     * @return {void}
     */
    pub.setDevelopment = function setDevelopment(configuration) {
        var config = typeof configuration === 'object' ? configuration : {};

        if (typeof config.enable !== 'undefined') {
            DEV.enable = config.enable;
        }

        if (typeof config.abortOnError !== 'undefined') {
            DEV.abortOnError = config.abortOnError;
        }
    };



    /**
     * Sets the map or just a part of the map.
     * A valid map must be a 2d array of numbers, where zero will not be rendered and all numbers greater than zero
     * will be rendered as a cuboid.
     *
     * @public
     * @function
     * @alias setMap
     * @memberof PerspectiveView
     * @param {Array} map
     * @return {void}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // Simple map 5 x 5 units/tiles
     * var map = [
     *     [1, 1, 1, 1, 1],
     *     [1, 0, 0, 0, 1],
     *     [1, 0, 1, 1, 1],
     *     [1, 0, 0, 0, 1],
     *     [1, 1, 1, 1, 1]
     * ];
     *
     * // Set map as new map
     * pv.setMap(map);
     */
    pub.setMap = function setMap(map) {
        if (DEV.enable) {
            if (!DEV.util.validate.isMap(map)) {
                console.error('Parameter <map> is not a valid map :: ', '{' , typeof map, '} :: ', map);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        priv.map = map;
    };



    /**
     * Sets the type/mode of rendering.
     * Value must be a string in lower cases. Valid modes: [flat]
     *
     * @public
     * @function
     * @alias setRenderMode
     * @memberof PerspectiveView
     * @param {String} mode
     * @return {void}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // Mode to be set as rendering mode. Should be written in lower cases!
     * var mode = 'flat';
     *
     * // Set mode as new render mode
     * pv.setRenderMode(mode);
     */
    pub.setRenderMode = function setRenderMode(mode) {
        if (DEV.enable) {
            if (!DEV.util.validate.isRenderMode(mode)) {
                console.error('Parameter <mode> is not a valid rendering mode :: ', '{' , typeof mode, '} :: ', mode);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        priv.renderMode = mode.toString().toLowerCase();

        // Update render functionality
        priv.render = pub.getModule('render_' + priv.renderMode);

        //priv.render.init();
    };



    /**
     * Sets the size an unit. A unit is usually the size of a common tile.
     *
     * @public
     * @function
     * @alias setUnitSize
     * @memberof PerspectiveView
     * @param {Number} x - Width (size on x-axis) of an unit/tile in px
     * @param {Number} y - Height (size on y-axis) of an unit/tile in px
     * @return {void}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // Sizes of a tile
     * var x = 50;   // px
     * var y = 50;   // px
     *
     * // Set x and y as new unit size
     * pv.setUnitSize(x, y);
     */
    pub.setUnitSize = function setUnitSize(x, y) {
        if (DEV.enable) {
            if (!DEV.util.validate.isSize(x)) {
                console.error('Parameter <x> is not a valid width :: ', '{' , typeof x, '} :: ', x);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }

            if (!DEV.util.validate.isSize(y)) {
                console.error('Parameter <y> is not a valid height :: ', '{' , typeof y, '} :: ', y);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        priv.unit.size.x = Number(x);
        priv.unit.size.y = Number(y);
    };



    /**
     * Sets the vanishing point to which refers to the perspective view, like architectural drawing.
     *
     * @public
     * @function
     * @alias setVanishingPoint
     * @memberof PerspectiveView
     * @param {Object} coordinate
     * @param {Number} coordinate.x - Coordinate on x-axis in px
     * @param {Number} coordinate.y - Coordinate on y-axis in px
     * @return {void}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // Coordinate to be set as vanishing point
     * var coordinate = {
     *     x: 225; // px
     *     y: 175; // px
     * };
     *
     * // Set coordinate as new vanishing point
     * pv.setVanishingPoint(coordinate);
     */
    pub.setVanishingPoint = function setVanishingPoint(coordinate) {
        if (DEV.enable) {
            if (!DEV.util.validate.isCoordinate(coordinate)) {
                console.error('Parameter <coordinate> is not a valid coordinate :: ', '{' , typeof coordinate, '} :: ', coordinate);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        coordinate.x = Number(coordinate.x);
        coordinate.y = Number(coordinate.y);

        priv.vanishingPoint.x = coordinate.x;
        priv.vanishingPoint.y = coordinate.y;

        priv.vanishingCell = pub.getVanishingCell();

        priv.render.init();
    };



    /**
     * Returns the HTML canvas element.
     *
     * @public
     * @function
     * @alias getCanvas
     * @memberof PerspectiveView
     * @return {Object}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // ...
     *
     * // Get canvas element
     * pv.getCanvas(); // Returns <canvas>
     */
    pub.getCanvas = function getCanvas() {
        return priv.canvas;
    };



    /**
     * Returns an object of the current configuration.
     *
     * @public
     * @function
     * @alias getConfig
     * @memberof PerspectiveView
     * @return {Object}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // ...
     *
     * // Get config object
     * pv.getConfig();
     * // Returns {
     * //     canvas:  <canvas>,
     * //     context: {...},
     * //     depth:   0.05,
     * //     map:     [[1, 1, 1, 1, 1],
     * //               [1, 0, 0, 0, 1],
     * //               [1, 0, 1, 1, 1],
     * //               [1, 0, 0, 0, 1],
     * //               [1, 1, 1, 1, 1]],
     * //     renderMode: 'flat',
     * //     unitSize: {
     * //         x: 50,
     * //         y: 50
     * //     },
     * //     vanishingCell: {
     * //         x: 4,
     * //         y: 3
     * //     },
     * //     vanishingPoint: {
     * //         x: 225,
     * //         y: 175
     * //     }
     * // }
     */
    pub.getConfig = function getConfig() {
        return {
            canvas:         pub.getCanvas(),
            context:        pub.getContext(),
            map:            pub.getMap(),
            renderMode:     pub.getRenderMode(),
            unitSize:       pub.getUnitSize(),
            vanishingPoint: pub.getVanishingPoint(),
            vanishingCell:  pub.getVanishingCell()
        };
    };



    /**
     * Returns the context of the HTML canvas element.
     *
     * @public
     * @function
     * @alias getContext
     * @memberof PerspectiveView
     * @return {Object}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // ...
     *
     * // Get context object
     * pv.getContext(); // Returns context of <canvas>
     */
    pub.getContext = function getContext() {
        return priv.context;
    };



    /**
     * Returns the depth factor.
     *
     * @public
     * @memberof PerspectiveView
     * @function
     * @alias getDepth
     * @return {Object}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // ...
     *
     * // Get depth factor
     * pv.getDepth(); // Returns 0.05
     */
    pub.getDepth = function getDepth() {
        return priv.depth;
    };



    /**
     * Returns the map array.
     *
     * @public
     * @function
     * @alias getMap
     * @memberof PerspectiveView
     * @return {Array}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // ...
     *
     * // Get map array
     * pv.getMap();
     * // Returns [
     * //     [1, 1, 1, 1, 1],
     * //     [1, 0, 0, 0, 1],
     * //     [1, 0, 1, 1, 1],
     * //     [1, 0, 0, 0, 1],
     * //     [1, 1, 1, 1, 1]
     * // ]
     */
    pub.getMap = function getMap() {
        return priv.map;
    };



    /**
     * Returns the content of the map at the given position.
     *
     * @public
     * @function
     * @alias getMapAt
     * @memberof PerspectiveView
     * @return {*}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // ...
     *
     * // Get map array
     * pv.getMapAt({
     *     x: 1,
     *     y: 2
     * });
     *
     * // Returns 0 (Number)
     */
    pub.getMapAt = function getMapAt(position) {
        if (DEV.enable) {
            if (!DEV.util.validate.isCoordinate(position)) {
                console.error('Parameter <position> is not a valid coordinate :: ', '{' , typeof position, '} :: ', position);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        return priv.map[position.y][position.x];
    };



    /**
     * Returns the rendering mode as string.
     *
     * @public
     * @function
     * @alias getRenderMode
     * @memberof PerspectiveView
     * @return {String}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // ...
     *
     * // Get render mode
     * pv.getRenderMode(); // Returns 'flat'
     */
    pub.getRenderMode = function getRenderMode() {
        return priv.renderMode;
    };



    /**
     * Returns the size of a unit/tile.
     *
     * @public
     * @memberof PerspectiveView
     * @function
     * @alias getUnitSize
     * @return {Object}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // ...
     *
     * // Get size object of a unit
     * pv.getUnitSize(); // Returns {x: 50, y: 50}
     */
    pub.getUnitSize = function getUnitSize() {
        return {
            x: priv.unit.size.x,
            y: priv.unit.size.y
        };
    };



    /**
     * Returns the current vanishing cell of the given coordinate.
     *
     * @public
     * @function
     * @alias getVanishingCell
     * @memberof PerspectiveView
     * @return {Object}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // Sizes of a tile
     * var x = 50;   // px
     * var y = 50;   // px
     *
     * // Set the size of a unit/tile
     * pv.setUnitSize(x, y);
     *
     * // Coordinate to be set as vanishing point
     * var coordinate = {
     *     x: 225; // px
     *     y: 175; // px
     * };
     *
     * // Set coordinate as new vanishing point
     * pv.setVanishingPoint(coordinate);
     *
     * // Get vanishing cell
     * getVanishingCell(); // Returns { x: 4, y: 3 }
     */
    pub.getVanishingCell = function getVanishingCell() {
        var cell = {};

        if (priv.unit.size.x > 0 && priv.unit.size.y > 0) {
            cell.x = Math.floor(Number(priv.vanishingPoint.x) / priv.unit.size.x);
            cell.y = Math.floor(Number(priv.vanishingPoint.y) / priv.unit.size.y);
        }

        return cell;
    };



    /**
     * Returns the vanishing point.
     *
     * @public
     * @function
     * @alias getVanishingPoint
     * @memberof PerspectiveView
     * @return {{x: Number, y: Number}}
     *
     * @example
     * // Creates an instance of PerspectiveView
     * var pv = newPerspectiveView();
     *
     * // ...
     *
     * // Get vanishing point
     * getVanishingPoint(); // Returns { x: 225, y: 175 }
     */
    pub.getVanishingPoint = function getVanishingPoint() {
        return {
            x: priv.vanishingPoint.x,
            y: priv.vanishingPoint.y
        };
    };



    /**
     * Provides an interface for appending modules.
     *
     * @public
     * @function
     * @memberof PerspectiveView
     * @alias appendModule
     * @param  {Object} module - Module object to be appended
     * @return {void}
     */
    pub.appendModule = function appendModule(module) {
        var id;

        if (DEV.enable) {
            if ((!module) || (typeof module !== 'object')) {
                console.error('Parameter <module> is not a valid PerspectiveView module :: ', '{' , typeof module, '} :: ', module);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        for (id in module) {
            if (mod.hasOwnProperty(id)) {
                console.error('There already exists an module named \'' + id + '\'');
            }
            else {
                mod[id] = module[id];
            }
        }
    };



    /**
     * Provides an interface for appending development utilities.
     *
     * @public
     * @function
     * @memberof PerspectiveView
     * @alias appendDevUtility
     * @param  {Object} module - Module object to be appended
     * @return {void}
     */
    pub.appendDevUtility = function appendDevUtility(module) {
        var id;

        if (DEV.enable) {
            if ((!module) || (typeof module !== 'object')) {
                console.error('Parameter <module> is not a valid PerspectiveView dev utility :: ', '{' , typeof module, '} :: ', module);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        for (id in module) {
            if (DEV.util.hasOwnProperty(id)) {
                console.error('There already exists an module named \'' + id + '\'');
            }
            else {
                DEV.util[id] = module[id];
            }
        }
    };



    /**
     * Returns a requested module.
     *
     * @public
     * @function
     * @memberof PerspectiveView
     * @alias getModule
     * @param  {String} moduleId - The name/id of the requested module
     * @return {Object}
     */
    pub.getModule = function getModule(moduleId) {
        var id;

        for (id in mod) {
            if (id === moduleId) {
                return mod[id];
            }
        }

        return {};
    };



    /**
     * Returns a requested development utility.
     *
     * @public
     * @function
     * @memberof PerspectiveView
     * @alias getDevUtility
     * @param  {String} moduleId - The name/id of the requested module
     * @return {Object}
     */
    pub.getDevUtility = function getDevUtility(moduleId) {
        var id;

        for (id in DEV.util) {
            if (id === moduleId && DEV.util.hasOwnProperty(id)) {
                return DEV.util[id];
            }
        }

        return {};
    };



    /**
     * Renders rhe current state
     *
     * @public
     * @memberof PerspectiveView
     * @function
     * @alias render
     * @return {Object}
     */
    pub.render = function render() {
        priv.render.render();
    };



    // ------------------------------------------------------------------------------------------------ Return



    return pub;



})();
