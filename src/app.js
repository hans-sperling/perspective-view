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


    function getVanishingCell() {
        var cell = {};

        if (cfg.unitSize.x > 0 && cfg.unitSize.y > 0) {
            cell.x = Math.floor(Number(cfg.vanishingPoint.x) / cfg.unitSize.x);
            cell.y = Math.floor(Number(cfg.vanishingPoint.y) / cfg.unitSize.y);
        }

        return cell;
    }


    function getRenderOrder() {
        var map           = cfg.map,
            vanishingCell = getVanishingCell(),
            mapAmountX    = map[0].length,
            mapAmountY    = map.length,
            orderX        = [],
            orderY        = [],
            orderlist     = [],
            x, y;

        // Get reversed x render order
        for (x = vanishingCell.x; x < mapAmountX; x++) {
            orderX.push(x);
        }

        for (x = vanishingCell.x-1; x >= 0 ; x--) {
            orderX.push(x);
        }


        // Get reversed y render order
        for (y = vanishingCell.y; y < mapAmountY; y++) {
            orderY.push(y);
        }

        for (y = vanishingCell.y - 1; y >= 0 ; y--) {
            orderY.push(y);
        }


        // Merge the x and y render order
        for (y = 0; y < mapAmountY; y++) {
            for (x = 0; x < mapAmountX; x++) {
                orderlist.push({
                    x: orderX[x],
                    y: orderY[y]
                });
            }
        }

        return orderlist;
    }

    // -----------------------------------------------------------------------------------------------------------------

    function init(configuration) {
        cfg = mod.merge.deepmerge(defaults, configuration);

        mod.map.setMap(cfg.map);
        console.dir(mod);
        console.log(mod.map.getMapArea());

        return {
            //dummy : dummy
        }
    }

    // -----------------------------------------------------------------------------------------------------------------

    return {
        configuration : cfg,
        appendModule  : appendModule,
        public        : init
    }

})();
