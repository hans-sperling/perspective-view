/**
 *
 *
 * @namespace render
 * @memberof PerspectiveView
 * @param {Object} window   - Global window object
 * @param {Object} document - Global document object
 * @param {Object} pv       - PerspectiveView
 */
;(function render(win, doc, pv) {
    'use strict';



    // ------------------------------------------------------------------------------------------------- Scope



    /**
     * Stores the private scope.
     *
     * @private
     * @ignore
     * @memberof! PerspectiveView.render
     * @type {Object}
     */
    var priv = {},



    /**
     * Stores the public scope.
     *
     * @public
     * @ignore
     * @memberof! PerspectiveView.render
     * @type {Object}
     */
    pub = {};



    // ----------------------------------------------------------------------------------------------- Private



    /**
     * Draws a stroked, filled, closed and colored shape at the canvas.
     *
     * @private
     * @memberof! PerspectiveView.render
     * @function
     * @alias drawShape
     * @param {Array}  path  - List of XY-Coordinates
     * @param {String} color - Color of the drawn shape
     * @return {void}
     */
    priv.drawShape = function(path, color) {
        var context     = pv.getContext(),
            pathCounter = path.length;

        context.save();

        context.strokeStyle = color;
        context.fillStyle   = color;
        context.lineWidth   = 1;

        context.beginPath();
        context.moveTo(path[0].x, path[0].y);

        while(pathCounter--) {
            context.lineTo(path[pathCounter].x, path[pathCounter].y);
        }

        context.closePath();
        context.stroke();
        context.fill();

        context.restore();
    };



    /**
     *
     */
    priv.drawObject = function(object) {
        var shapeCounter = object.shapes.length,
            currentShape = null;

        while (shapeCounter--) {
            currentShape = object.shapes[shapeCounter];

            if (currentShape === null || currentShape === 0) { continue; }

            priv.drawShape(currentShape.path, currentShape.color);
        }
    };



    /**
     * Handles the rendering of the map
     *
     * @private
     * @memberof! PerspectiveView.render
     * @function
     * @alias renderMap
     * @param {Array} objects
     * @return {void}
     */
    priv.renderMap = function(objects) {
        var objectCounter = objects.length,
            currentObject = null;

    // todo: hier muss noch die canvas color gerendert werden. Dies ist die World-Color
        while (objectCounter--) {
            currentObject = objects[objectCounter];

            if (currentObject === null || currentObject === 0) { continue; }

            priv.drawObject(currentObject);
        }
    };



    priv.renderWorld = function(objects) {
        var objectCounter = objects.length,
            currentObject = null;

        $(pv.getCanvas()).css('background', objects[0].shapes[0].color);


    };



    // ------------------------------------------------------------------------------------------------ Public



    /**
     * Initialize this module.
     *
     * @public
     * @memberof! PerspectiveView.render
     * @function
     * @alias init
     * @return {void}
     */
    pub.init = function init() {

    };



    /**
     * Public API render method
     *
     * @public
     * @memberof! PerspectiveView.render
     * @function
     * @alias render
     * @param {Object} renderData
     */
    pub.render = function render(renderData) {
        priv.renderMap(renderData.map);
        priv.renderWorld(renderData.world);
    };



    // ------------------------------------------------------------------------------------------------ Append



    pv.appendModule({render: pub});



})(window, document, window.PERSPECTIVEVIEW);
