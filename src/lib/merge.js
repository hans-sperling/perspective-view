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
