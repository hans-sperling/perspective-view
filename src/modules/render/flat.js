/**
 *
 *
 * @namespace render_flat
 * @memberof PerspectiveView
 * @param {Object} window   - Global window object
 * @param {Object} document - Global document object
 * @param {Object} pv       - PerspectiveView
 * @param {Object} renderer - PerspectiveView.render
 * @param {Object} path     - PerspectiveView.path
 */
;(function render_flat(win, doc, pv, render, path) {
    'use strict';



    // ------------------------------------------------------------------------------------------------- Scope



    /**
     * Stores the private scope.
     *
     * @private
     * @ignore
     * @memberof! PerspectiveView.render_flat
     * @type {Object}
     */
    var priv = {},



    /**
     * Stores the public scope.
     *
     * @public
     * @ignore
     * @memberof! PerspectiveView.render_flat
     * @type {Object}
     */
    pub = {};



    // ----------------------------------------------------------------------------------------------- Private


    /**
     * Stores the order of to rendered map items.
     *
     * @private
     * @memberof! PerspectiveView.render_flat
     * @function
     * @alias getRenderOrder
     * @type {Array}
     */
    priv.renderOrder = [];



    /**
     * Returns an array of the ordered map items.
     *
     * @private
     * @memberof! PerspectiveView.render_flat
     * @function
     * @alias getRenderOrder
     * @return {Array}
     */
    priv.getRenderOrder = function() {
        var map       = pv.getMap(),
            yAmount   = map.length,
            xAmount   = map[0].length,
            orderlist = [],
            x, y;

        // The map will be rendered in reversed order, so the orderlist has also to be determent in reversed order
        for(y = (yAmount - 1); y >= 0; y--) {
            for(x = (xAmount - 1); x >= 0; x--) {
                orderlist.push({ x: x, y: y });
            }
        }

        return orderlist;
    };



    /**
     *
     * @returns {Object}
     */
    priv.getMapData = function() {
        var map               = pv.getMap(),
            renderOrder       = priv.getRenderOrder(),
            renderOrderAmount = renderOrder.length,
            mapData           = [],
            colors, paths, position, shapeData, shapeAmount, i, j;

        //renderOrder.reverse();

        for (i = 0; i < renderOrderAmount; i++) {
            position = renderOrder[i];

            if (map[position.y][position.x] > 0) {
                paths  = path.getFlatShapePathAt(position);
                colors = [
                    { r: 63, g: 127, b: 255 }
                ];
                shapeAmount = Math.min(paths.length, colors.length);
                shapeData    = [];

                for (j = 0; j < shapeAmount; j++) {
                    shapeData.push({
                        path: paths[j],
                        color: 'rgb(' + colors[j].r + ',' + colors[j].g + ',' + colors[j].b + ')'
                    });
                }

                mapData.push({
                    shapes:   shapeData,
                    position: position,
                    depth:    0
                });
            }
            else {
                mapData.push(null);
            }
        }

        return mapData;
    };


    // ------------------------------------------------------------------------------------------------ Public



    /**
     * Initialize this module.
     *
     * @public
     * @memberof! PerspectiveView.render_flat
     * @function
     * @alias init
     * @return {void}
     */
    pub.init = function() {

    };



    /**
     * Public API render method
     *
     * @public
     * @memberof! PerspectiveView.render_flat
     * @function
     * @alias render
     * @return {void}
     */
    pub.render = function() {
        var mapData = priv.getMapData();

        render.render({
            map: mapData
        });
    };



    /**
     * Updates the order of rendered items.
     *
     * @public
     * @memberof! PerspectiveView.render_flat
     * @function
     * @alias updateRenderOrder
     * @return {void}
     */
    pub.updateRenderOrder = function() {
        priv.renderOrder = priv.getRenderOrder();
    };



    // ------------------------------------------------------------------------------------------------ Append



    pv.appendModule({render_flat: pub});



})(window, document, window.PERSPECTIVEVIEW, window.PERSPECTIVEVIEW.getModule('render'), window.PERSPECTIVEVIEW.getModule('path'));
