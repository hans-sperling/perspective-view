;(function render(ppv) {
    'use strict';

    var canvas      = null,
        context     = null,
        map         = [[0]],
        mapSize     = { x : 1, y : 1},
        unitSize    = { x : 1, y : 1},
        renderOrder = [];

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {
        canvas   = config.canvas;
        context  = config.context;
        unitSize = config.unitSize;
    }

    // -----------------------------------------------------------------------------------------------------------------

    function update(config) {
        unitSize    = config.unitSize;
        map         = config.map;
        renderOrder = getRenderOrder();
        mapSize     = { x : map[0].length, y : map.length };
    }


    function getRenderOrder() {
        var vanishingCell = ppv.modules.location.getVanishingTile(),
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


    function render() {
        var x, y;

        for (y = 0; y < mapSize.y; y++){
            for (x = 0; x < mapSize.x; x++) {
                if (map[y][x] > 0) {
                    context.fillStyle = 'rgb(50,50,50)';
                }
                else {
                    //context.fillStyle = 'rgb(255,255,255)';
                    context.fillStyle = 'rgba(0,0,0,0.0)';
                }
                context.fillRect(
                    (x * unitSize.x),
                    (y * unitSize.y),
                    unitSize.x,
                    unitSize.y
                );
                context.fill();
            }
        }
        context.restore();
    }

    // -----------------------------------------------------------------------------------------------------------------

    // Append module with public methods and properties
    ppv.appendModule({ render : {
        init       : init,
        update     : update,
        render     : render
    }});

    // -----------------------------------------------------------------------------------------------------------------

})(window.PPV);