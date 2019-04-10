function PerspectiveView(configuration) {
    return window.PPV.init(configuration);
}

window.PPV = (function() {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var mod      = {},
        CFG      = {},
        DEV      = {
            enable       : true,
            abortOnError : false,
            util         : {}
        },
        defaults = {
            colorModule : {},
            // ----------------------------------------------------------------------------------- Default configuration
            canvas    : null,
            context   : null,
            map       : [[1]],
            unitSize  : 100,
            unitDepth : 1.1,
            position  : { x : 0, y : 0},
            camera    : {
                width    : 800,
                height   : 600,
                warped   : false,
                position : {
                    x : 400,
                    y : 300
                }
            },
            render : {
                back        : false,
                camera      : false,
                front       : true,
                grid        : false,
                hiddenWalls : false,
                mode        : 'default',
                walls       : true,
                wireFrame   : false
            },
            color : {
                mode        : 'default',
                // objectColor : {r: 200, g: 200, b: 200, a: 1},
                objectColor : {
                    north : { r: 200, g: 200, b: 200, a: 1 },
                    east  : { r: 200, g: 200, b: 200, a: 1 },
                    south : { r: 200, g: 200, b: 200, a: 1 },
                    west  : { r: 200, g: 200, b: 200, a: 1 },
                    front : { r: 100, g: 200, b: 200, a: 1 },
                    back  : { r: 200, g: 200, b: 200, a: 1 }
                },
                spaceColor  : {r: 255, g: 255, b: 255, a: 0},
                lighting    : {
                    back   : 0,
                    east   : -10,
                    height : 2,
                    front  : 10,
                    north  : -20,
                    south  : 0,
                    west   : -15
                }
            }
        };

    // --------------------------------------------------------------------------------------------------------- MODULES

    /**
     * Appends a given module object.
     *
     * @param   {object} module
     * @returns {void}
     */
    function appendModule(module) {
        var id;

        if (DEV.enable) {
            if ((!module) || (typeof module !== 'object')) {
                console.error('Parameter <module> is not a valid PerspectiveView module :: ', '{' , typeof module, '} :: ', module);
                if (DEV.abortOnError) { throw new Error('Script abort'); }
            }
        }

        for (id in module) {
            if (module.hasOwnProperty(id) && mod.hasOwnProperty(id)) {
                console.error('There already exists a module named \'' + id + '\'');
            }
            else {
                mod[id] = module[id];
            }
        }
    }


    /**
     * Initializes all appended modules. Will call all init methods of the appended modules with the given
     * configuration.
     *
     * @param   config
     * @returns {void}
     */
    function initModules(config) {
        var i;

        for (i in mod) {
            if (mod.hasOwnProperty(i)) {
                if (typeof mod[i].init === 'function') {
                    mod[i].init(config);
                }
            }
        }
    }


    /**
     * Calls all run methods of the appended modules.
     *
     * @returns {void}
     */
    function runModules() {
        var i;

        for (i in mod) {
            if (mod.hasOwnProperty(i)) {
                if (typeof mod[i].run === 'function') {
                    mod[i].run();
                }
            }
        }
    }


    /**
     * Updates all appended modules. Will call all update methods of the appended modules with the given configuration.
     *
     * @param   config
     * @returns {void}
     */
    function updateModules(config) {
        var i;

        for (i in mod) {
            if (mod.hasOwnProperty(i)) {
                if (typeof mod[i].update === 'function') {
                    mod[i].update(config);
                }
            }
        }
    }


    /**
     * Returns a requested module by the module.mode in the config.
     *
     * @param   {string} type - Type of module [color, render, map]
     * @returns {object}
     */
    function getModule(type) {
        if (type == 'color') {
            switch (CFG[type].mode) {
                case 'default':
                default:
                    return mod.color;
            }
        }

        return {};
    }

    // ------------------------------------------------------------------------------------------------------------ INIT

    /**
     * Initialize this app.
     *
     * @param   {object} config
     * @returns {{render: render, update: update}}
     */
    function init(config) {
        CFG = mod.merge.deep(defaults, config);

        // todo - Will be "decommented" if there are mor than only one color mode
        //if (CFG.color.mode.toLowerCase() === 'default') {
            CFG.colorModule = 'color';
        //}

        initModules(CFG);
        runModules();

        return {
            render    : render,
            update    : update,
            getConfig : getConfig
        }
    }

    // ---------------------------------------------------------------------------------------------------------- PUBLIC

    /**
     * Public method to render the map
     *
     * @public
     * @returns {void}
     */
    function render() {
        mod.render.render();
    }


    /**
     * Public method to update configuration
     *
     * @public
     * @param   {object} config
     * @returns {void}
     */
    function update(config) {
        CFG =  mod.merge.deep(CFG, config);

        updateModules(CFG);
    }

    function getConfig() {
        return CFG;
    }

    // ----------------------------------------------------------------------------------------------------- DEV RETURNS

    return {
        DEV           : DEV,
        configuration : CFG,
        appendModule  : appendModule,
        getModule     : getModule,
        init          : init,
        modules       : mod
    };
})();
