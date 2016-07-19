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
