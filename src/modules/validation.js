/**
 * Revealing module for validation.
 *
 * @namespace validate
 * @memberof PerspectiveView
 * @param {Object} window   - Global window object
 * @param {Object} document - Global document object
 * @param {Object} pv       - PerspectiveView with empty object fallback
 */
;(function validate(win, doc, pv) {
    'use strict';



    // ------------------------------------------------------------------------------------------------- Scope



    /**
     * Stores the public scope.
     *
     * @public
     * @ignore
     * @memberof! PerspectiveView.validate
     * @type {Object}
     */
    var pub = {};



    // ------------------------------------------------------------------------------------------------ Public



    /**
     * Checks if the given value is a valid HTML canvas element.
     *
     * @memberof! PerspectiveView.validate
     * @function
     * @alias isHtmlCanvasElement
     * @param {*} value - Value to check for
     * @return {Boolean}
     */
    pub.isHtmlCanvasElement = function isHtmlCanvasElement(value) {
        return (this.isObject(value) && (typeof value.getContext === 'function'));
    };



    /**
     * Checks if the given value is a valid object.
     *
     * @function
     * @memberof! PerspectiveView.validate
     * @alias isObject
     * @param {*} value - Value to check for
     * @return {Boolean}
     */
    pub.isObject = function isObject(value) {
        return ((value) && (typeof value === 'object'));
    };



    /**
     * Checks if the given value is a number.
     * Value must be of type number.
     *
     * @function
     * @memberof! PerspectiveView.validate
     * @alias isNumber
     * @param {*} value - Value to check for
     * @return {Boolean}
     */
    pub.isNumber = function isNumber(value) {
        return (!isNaN(value) && (typeof value === 'number'));
    };



    /**
     * Checks if the given value is a valid size.
     * VValue must be of type number and must be greater or equal than zero.
     *
     * @function
     * @memberof! PerspectiveView.validate
     * @alias isSize
     * @param {*} value - Value to check for
     * @return {Boolean}
     */
    pub.isSize = function isSize(value) {
        return (this.isNumber(value) && (value >= 0));
    };



    /**
     * Checks if the given value is a valid coordinate.
     * Value must be of type object including properties x and y of type number and they must be greater or equal than zero.
     *
     * @function
     * @memberof! PerspectiveView.validate
     * @alias isCoordinate
     * @param {*} value - Value to check for
     * @return {Boolean}
     */
    pub.isCoordinate = function isCoordinate(value) {
        return ((this.isObject(value)) &&
        (this.isNumber(value.x)) &&
        (this.isNumber(value.y)));
    };



    /**
     * Checks if the given value is a valid cell.
     * Value must be of type object including properties x and y of type number and they must be greater or equal than zero.
     *
     * @function
     * @memberof! PerspectiveView.validate
     * @alias isCell
     * @param {*} value - Value to check for
     * @return {Boolean}
     */
    pub.isCell = function isCell(value) {
        return ((this.isObject(value)) &&
        (this.isNumber(value.x)) &&
        (this.isNumber(value.x)));
    };



    /**
     * Checks if the given value is an array
     *
     * @function
     * @memberof! PerspectiveView.validate
     * @alias isArray
     * @param {*} value - Value to check for
     * @return {Boolean}
     */
    pub.isArray = function isArray(value) {
        return ((typeof value === 'object'));
    };



    /**
     * Checks if the given value is a valid map.
     *
     * @function
     * @memberof! PerspectiveView.validate
     * @alias isMap
     * @param {*} value - Value to check for
     * @return {Boolean}
     */
    pub.isMap = function isMap(value) {
        return (this.isArray(value) && value.length > 0 && this.isArray(value[0]) && value[0].length > 0);
    };



    /**
     * Checks if the given value is a string.
     *
     * @function
     * @memberof! PerspectiveView.validate
     * @alias isString
     * @param {*} value - Value to check for
     * @return {Boolean}
     */
    pub.isString= function isString(value) {
        return ((typeof value === 'string'));
    };



    /**
     * Checks if the given value is a valid rendering mode.
     *
     * @function
     * @memberof! PerspectiveView.validate
     * @alias isRenderMode
     * @param {*} value - Value to check for
     * @return {Boolean}
     */
    pub.isRenderMode = function isRenderMode(value) {
        return (this.isString(value) && (
            (value === 'flat') ||
            (value === 'specified')  ||
            (value === 'unitary')
        ));
    };



    // ------------------------------------------------------------------------------------------------ Append



    pv.appendDevUtility({validate: pub});



})(window, document, window.PERSPECTIVEVIEW || {});
