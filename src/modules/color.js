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
     * Returns the rgba-color string of the shadow shape of an object.
     *
     * @public
     * @returns {string}
     */
    function getShadow() {
        var color = CFG.color.shadowColor;

        return 'rgba('+
            color.r + ', ' +
            color.g + ', ' +
            color.b + ', ' +
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
        init      : init,
        run       : run,
        update    : update,
        getBack   : getBack,
        getEast   : getEast,
        getFront  : getFront,
        getNorth  : getNorth,
        getSouth  : getSouth,
        getShadow : getShadow,
        getSpace  : getSpace,
        getWest   : getWest
    }});
})(window.PPV);
