/**
 * Revealing module for rendering maps with specified heights.
 *
 * @namespace render_specified
 * @memberof PerspectiveView
 * @param {Object} window   - Global window object
 * @param {Object} document - Global document object
 * @param {Object} pv       - PerspectiveView
 * @param {Object} renderer - PerspectiveView.render
 * @param {Object} path     - PerspectiveView.path
 */
;(function(win, doc, pv, render, path, color) {
    'use strict';



    // ------------------------------------------------------------------------------------------------- Scope



    /**
     * Stores the private scope.
     *
     * @private
     * @ignore
     * @memberof! PerspectiveView.render_specified
     * @type {Object}
     */
    var priv = {},



    /**
     * Stores the public scope.
     *
     * @public
     * @ignore
     * @memberof! PerspectiveView.render_specified
     * @type {Object}
     */
    pub = {};



    // ----------------------------------------------------------------------------------------------- Private



    /**
     * Stores the order of to rendered map items.
     *
     * @private
     * @memberof! PerspectiveView.render_specified
     * @function
     * @alias getRenderOrder
     * @type {Array}
     */
    priv.renderOrder = [];



    /**
     * Returns an array of the ordered map items.
     *
     * @private
     * @memberof! PerspectiveView.render_specified
     * @function
     * @alias getRenderOrder
     * @return {Array}
     */
    priv.getRenderOrder = function() {
        var map           = pv.getMap(),
            vanishingCell = pv.getVanishingCell(),
            mapAmountX    = map[0].length,
            mapAmountY    = map.length,
            orderX        = [],
            orderY        = [],
            orderlist     = [],
            x, y;

        // Get reversed x render order
        for (x = vanishingCell.x; x < mapAmountX; x++) {
            orderX.push(x);
        }

        for (x = vanishingCell.x-1; x >= 0 ; x--) {
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
                orderlist.push({
                    x: orderX[x],
                    y: orderY[y]
                });
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
            vanishingCell     = pv.getVanishingCell(),
            renderOrder       = priv.getRenderOrder(),
            renderOrderAmount = renderOrder.length,
            mapData           = { map: [], world: [] },
            shapeData         = [],
            depth, colors, paths, position, shapeAmount, i, j;

        for (i = 0; i < renderOrderAmount; i++) {
            position = renderOrder[i];
            depth    = map[position.y][position.x];

            if (depth > 0) {
                paths  = path.getCuboidPathsAt(position, depth);
                colors = color.getObjectColor();
                shapeAmount = Math.min(paths.length, colors.length);
                shapeData    = [];

                // Check if north shape has to be rendered
                if (position.y > vanishingCell.y) {
                    shapeData.push({
                        path: paths[1],
                        color: 'rgb(' + colors[1].r + ',' + colors[1].g + ',' + colors[1].b + ')'
                    });
                }

                // Check if east shape has to be rendered
                if (position.x < vanishingCell.x) {
                    shapeData.push({
                        path: paths[2],
                        color: 'rgb(' + colors[2].r + ',' + colors[2].g + ',' + colors[2].b + ')'
                    });
                }

                // Check if south shape has to be rendered
                if (vanishingCell.y > position.y) {
                    shapeData.push({
                        path: paths[3],
                        color: 'rgb(' + colors[3].r + ',' + colors[3].g + ',' + colors[3].b + ')'
                    });
                }

                // Check if west shape has to be rendered
                if (vanishingCell.x < position.x) {
                    shapeData.push({
                        path: paths[4],
                        color: 'rgb(' + colors[4].r + ',' + colors[4].g + ',' + colors[4].b + ')'
                    });
                }

                // Roof shape has to be rendered always at last
                shapeData.push({
                    path: paths[5],
                    color: 'rgb(' + colors[5].r + ',' + colors[5].g + ',' + colors[5].b + ')'
                });

                mapData.map.push({
                    shapes:   shapeData,
                    position: position,
                    depth:    depth
                });
            }
            else {
                mapData.map.push(null);
            }
        }

        colors = color.getWorldColor();
        shapeData = [{
            color: 'rgb(' + colors[0].r + ',' + colors[0].g + ',' + colors[0].b + ')'
        }];

        mapData.world.push({
            shapes: shapeData
        });

        return mapData;
    };


    // ------------------------------------------------------------------------------------------------ Public



    /**
     * Initialize this module.
     *
     * @public
     * @memberof! PerspectiveView.render_specified
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
     * @memberof! PerspectiveView.render_specified
     * @function
     * @alias render
     * @return {void}
     */
    pub.render = function() {
        var mapData   = priv.getMapData();

        render.render({
            world: mapData.world,
            map:   mapData.map
        });
    };



    /**
     * Updates the order of rendered items.
     *
     * @public
     * @memberof! PerspectiveView.render_specified
     * @function
     * @alias updateRenderOrder
     * @return {void}
     */
    pub.updateRenderOrder = function() {
        priv.renderOrder = priv.getRenderOrder();
    };



    // ------------------------------------------------------------------------------------------------ Append



    pv.appendModule({render_specified: pub});



})(window, document, window.PERSPECTIVEVIEW, window.PERSPECTIVEVIEW.getModule('render'), window.PERSPECTIVEVIEW.getModule('path'), window.PERSPECTIVEVIEW.getModule('color'));
