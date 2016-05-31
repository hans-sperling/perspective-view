/**
 *
 *
 * @namespace path_cube
 * @memberof PerspectiveView
 * @param {Object} window   - Global window object
 * @param {Object} document - Global document object
 * @param {Object} pv       - PerspectiveView with empty object fallback
 */
;(function(win, doc, pv) {
    'use strict';



    // ------------------------------------------------------------------------------------------------- Scope



    /**
     * Stores the private scope.
     *
     * @private
     * @ignore
     * @memberof! PerspectiveView.path_cube
     * @type {Object}
     */
    var priv = {},



    /**
     * Stores the public scope.
     *
     * @public
     * @ignore
     * @memberof! PerspectiveView.path_cube
     * @type {Object}
     */
    pub = {};



    // ----------------------------------------------------------------------------------------------- Private



    // ------------------------------------------------------------------------------------------------ Public



    /**
     * Initialize this module.
     *
     * @public
     * @memberof! PerspectiveView.path_cube
     * @function
     * @alias init
     * @return {void}
     */
    pub.init = function init() {

    };



    /**
     * Returns a list of xy-Objects. The edge coordinates of the cuboid shapes to be rendered.
     *
     * @public
     * @function
     * @alias getPathsAt
     * @memberof PerspectiveView.path_cube
     *
     * @param  {Object} mapPosition - XY-Position in the map array
     * @return {Array}
     */
    pub.getPathsAt = function(mapPosition, depth) {
        var vanishingPoint           = pv.getVanishingPoint(),
            unitSize                 = pv.getUnitSize(),
            depthFactor              = pv.getDepth(),
            absoluteTopLeftPositionX = Number(mapPosition.x * unitSize.x),
            absoluteTopLeftPositionY = Number(mapPosition.y * unitSize.y),
            objectDepth              = depth * depthFactor,
            pathlist                 = [],
            ground = {
                tlx: absoluteTopLeftPositionX,
                tly: absoluteTopLeftPositionY,
                trx: absoluteTopLeftPositionX + unitSize.x,
                try: absoluteTopLeftPositionY,
                brx: absoluteTopLeftPositionX + unitSize.x,
                bry: absoluteTopLeftPositionY + unitSize.y,
                blx: absoluteTopLeftPositionX,
                bly: absoluteTopLeftPositionY + unitSize.y
            },
            distance = {
                tlx: ground.tlx - vanishingPoint.x,
                tly: ground.tly - vanishingPoint.y,
                trx: ground.trx - vanishingPoint.x,
                try: ground.try - vanishingPoint.y,
                brx: ground.brx - vanishingPoint.x,
                bry: ground.bry - vanishingPoint.y,
                blx: ground.blx - vanishingPoint.x,
                bly: ground.bly - vanishingPoint.y
            },
            paths = {
                roof:  [],
                base:  [],
                north: [],
                east:  [],
                south: [],
                west:  []
            };

        // Compute paths
        paths.base = [
            {   x: ground.tlx,
                y: ground.tly },
            {   x: ground.trx,
                y: ground.try },
            {   x: ground.brx,
                y: ground.bry },
            {   x: ground.blx,
                y: ground.bly }
        ];
        paths.roof = [
            {   x: ground.tlx + (distance.tlx * (objectDepth)),
                y: ground.tly + (distance.tly * (objectDepth)) },
            {   x: ground.trx + (distance.trx * (objectDepth)),
                y: ground.try + (distance.try * (objectDepth)) },
            {   x: ground.brx + (distance.brx * (objectDepth)),
                y: ground.bry + (distance.bry * (objectDepth)) },
            {   x: ground.blx + (distance.blx * (objectDepth)),
                y: ground.bly + (distance.bly * (objectDepth)) }
        ];
        paths.north = [
            {   x: paths.base[0].x,
                y: paths.base[0].y },
            {   x: paths.base[1].x,
                y: paths.base[1].y },
            {   x: paths.roof[1].x,
                y: paths.roof[1].y },
            {   x: paths.roof[0].x,
                y: paths.roof[0].y }
        ];
        paths.east = [
            {   x: paths.base[1].x,
                y: paths.base[1].y },
            {   x: paths.base[2].x,
                y: paths.base[2].y },
            {   x: paths.roof[2].x,
                y: paths.roof[2].y },
            {   x: paths.roof[1].x,
                y: paths.roof[1].y }
        ];
        paths.south = [
            {   x: paths.base[2].x,
                y: paths.base[2].y },
            {   x: paths.base[3].x,
                y: paths.base[3].y },
            {   x: paths.roof[3].x,
                y: paths.roof[3].y },
            {   x: paths.roof[2].x,
                y: paths.roof[2].y }
        ];
        paths.west = [
            {   x: paths.base[3].x,
                y: paths.base[3].y },
            {   x: paths.base[0].x,
                y: paths.base[0].y },
            {   x: paths.roof[0].x,
                y: paths.roof[0].y },
            {   x: paths.roof[3].x,
                y: paths.roof[3].y }
        ];

        pathlist.push(paths.base);
        pathlist.push(paths.north);
        pathlist.push(paths.east);
        pathlist.push(paths.south);
        pathlist.push(paths.west);
        pathlist.push(paths.roof);

        return pathlist;
    };



    // ------------------------------------------------------------------------------------------------ Append



    pv.appendModule({path_cube: pub});



})(window, document, window.PERSPECTIVEVIEW);
