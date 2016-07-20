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
            map       : [[1]],
            unitSize  : 100,
            unitDepth : 1.1,
            position  : { x : 0, y : 0},
            camera    : {
                width    : 800,
                height   : 600,
                position : {
                    x : 400,
                    y : 300
                }
            },
            render : {
                mode      : 'normal', // flat, normal, uniform
                wireFrame : false,
                grid      : false,
                camera    : false
            },
            color : {
                back  : {r: 150, g: 150, b: 150, a: 0},
                east  : {r: 159, g: 159, b: 159, a: 1},
                front : {r: 207, g: 207, b: 207, a: 1},
                north : {r: 127, g: 127, b: 127, a: 1},
                south : {r: 223, g: 223, b: 223, a: 1},
                space : {r: 255, g: 255, b: 255, a: 0},
                west  : {r: 191, g: 191, b: 191, a: 1}
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

    // ------------------------------------------------------------------------------------------------------------ INIT

    function init(config) {
        CFG = mod.merge.deep(defaults, config);

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
        mod.render.render();
    }


    function update(config) {
        CFG =  mod.merge.deep(CFG, config);

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
