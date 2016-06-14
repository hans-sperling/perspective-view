function PerspectiveView(configuration) {
    return window.PPV.public(configuration);
}

window.PPV = (function() {
    'use strict';

    var mod      = {},
        cfg      = {},
        dev      = {
            enable       : true,
            abortOnError : false,
            util         : {}
        },
        defaults = {
            canvas         : null,
            context        : null,
            map            : [[0]],
            unitSize       : { x : 1, y : 1},
            vanishingPoint : { x : 0, y : 0}
        };

    // -----------------------------------------------------------------------------------------------------------------

    function appendModule(module) {
        var id;

        if (dev.enable) {
            if ((!module) || (typeof module !== 'object')) {
                console.error('Parameter <module> is not a valid PerspectiveView module :: ', '{' , typeof module, '} :: ', module);
                if (dev.abortOnError) { throw new Error('Script abort'); }
            }
        }

        for (id in module) {
            if (mod.hasOwnProperty(id)) {
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

        initModules(config);
        runModules();

        return {
            render : render
        }
    }

    // -----------------------------------------------------------------------------------------------------------------

    function render() {
        mod.render.update({
            unitSize : cfg.unitSize,
            map      : cfg.map
        });
        mod.render.render()
    }

    // -----------------------------------------------------------------------------------------------------------------

    return {
        configuration : cfg,
        appendModule  : appendModule,
        public        : init,
        modules       : mod
    };

})();
