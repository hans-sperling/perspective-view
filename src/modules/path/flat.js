/**
 *
 *
 * @namespace path_flat
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
     * @memberof! PerspectiveView.path_flat
     * @type {Object}
     */
    var priv = {},



    /**
     * Stores the public scope.
     *
     * @public
     * @ignore
     * @memberof! PerspectiveView.path_flat
     * @type {Object}
     */
    pub = {};



    // ----------------------------------------------------------------------------------------------- Private



    // ------------------------------------------------------------------------------------------------ Public



    /**
     * Initialize this module.
     *
     * @public
     * @memberof! PerspectiveView.path_flat
     * @function
     * @alias init
     * @return {void}
     */
    pub.init = function init() {

    };


    /**
     * @public
     * @memberof! PerspectiveView.path_flat
     * @function
     * @alias getPathsAt
     */
    pub.getPathsAt = function(mapPosition) {
        var unitSize                 = pv.getUnitSize(),
            absoluteTopLeftPositionX = Number(mapPosition.x * unitSize.x),
            absoluteTopLeftPositionY = Number(mapPosition.y * unitSize.y),
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
            shape = [
                {
                    x: ground.tlx,
                    y: ground.tly
                }, {
                    x: ground.trx,
                    y: ground.try
                }, {
                    x: ground.brx,
                    y: ground.bry
                }, {
                    x: ground.blx,
                    y: ground.bly
                }
            ];

        return [shape];
    };



    // ------------------------------------------------------------------------------------------------ Append



    pv.appendModule({path_flat: pub});



})(window, document, window.PERSPECTIVEVIEW);
