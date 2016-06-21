function PerspectiveView(configuration) {
    return window.PPV.public(configuration);
}

window.PPV = (function() {
    'use strict';

    var mod      = {},
        cfg      = {},
        DEV      = {
            enable       : true,
            abortOnError : false,
            util         : {}
        },
        defaults = {
            canvas         : null,
            context        : null,
            map            : [],
            unitSize       : 20,
            unitShift      : { x : 0, y : 0 },
            camera   : {
                width    : 1,
                height   : 1,
                position : {
                    x : 1,
                    y : 1
                }
            }
        };

    // -----------------------------------------------------------------------------------------------------------------

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

    // -----------------------------------------------------------------------------------------------------------------

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


    function init(config) {
        cfg = mod.merge.deep(defaults, config);

        initModules(cfg);
        runModules();

        return {
            render : render
        }
    }

    // -----------------------------------------------------------------------------------------------------------------

    function render() {
        mod.render.update();
        mod.render.render();
    }

    // -----------------------------------------------------------------------------------------------------------------

    return {
        DEV           : DEV,
        configuration : cfg,
        appendModule  : appendModule,
        public        : init,
        modules       : mod
    };

})();
