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
            canvas    : null,
            context   : null,
            map       : [],
            unitSize  : 1,
            unitDepth : 1,
            position  : { x : 0, y : 0 },
            camera    : {
                width    : 1,
                height   : 1,
                position : {
                    x : 1,
                    y : 1
                }
            }
        };

    // --------------------------------------------------------------------------------------------------------- MODULES

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

    // --------------------------------------------------------------------------------------------------------- PRIVATE

    function mergeConfig(config) {
        return mod.merge.deep(defaults, config);
    }

    // ------------------------------------------------------------------------------------------------------------ INIT

    function init(config) {
        CFG = mergeConfig(config);

        initModules(CFG);
        runModules();

        return {
            render : render,
            update : update
        }
    }

    // ---------------------------------------------------------------------------------------------------------- PUBLIC

    function render() {
        // mod.render.update(CFG);
        // mod.render.render();
    }


    function update(config) {
        CFG = mergeConfig(config);

        updateModules(CFG);
    }

    // ----------------------------------------------------------------------------------------------------- DEV RETURNS

    return {
        DEV           : DEV,
        configuration : CFG,
        appendModule  : appendModule,
        init          : init,
        modules       : mod
    };

})();
