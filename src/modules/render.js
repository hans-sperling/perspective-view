;(function render(ppv) {
    'use strict';

    var mod_Location = null,
        mod_Map      = null,
        mod_Color    = null,

        canvas       = null,
        context      = null,
        map          = [],
        bufferTile   = { x : 1, y : 1}, // Amount of tiles out of the canvas
        mapSize      = { x : 1, y : 1},
        unitSize     = { x : 1, y : 1},
        unitShift    = { x : 0, y : 0},
        unitScale    = 1,
        location     = {
            tile  : { x : 0, y : 0 },
            shift : { x : 0, y : 0 }
        },
        renderOrder  = [];

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {
        mod_Location = ppv.modules.location;
        mod_Map      = ppv.modules.map;
        mod_Color    = ppv.modules.color;

        canvas    = config.canvas;
        context   = config.context;
        unitShift = config.unitShift;
        unitScale = config.unitScale;
    }


    function run() {
        update();
    }


    function update() {
        location    = mod_Location.getMapLocation();
        unitSize    = mod_Map.getUnitSize();

        // Wie groß muss die Map sein?

        var mapX = Math.ceil(canvas[0].width  / ((unitSize.x * unitScale) + unitShift.x));
        var mapY = Math.ceil(canvas[0].height / ((unitSize.y * unitScale) + unitShift.y));
        var x = (Math.ceil(mapX/2));
        var y = (Math.ceil(mapY/2));
        var startX = location.tile.x - x - bufferTile.x;
        var startY = location.tile.y - y - bufferTile.y;
        var endX   = location.tile.x + x + bufferTile.x;
        var endY   = location.tile.y + y + bufferTile.y;


        console.log(startX, startY, endX, endY);
        console.log(unitShift);
        map         = mod_Map.getMapArea(startX, startY, endX, endY);
        mapSize     = { x : map[0].length, y : map.length };
        renderOrder = getRenderOrder();
    }

    // -----------------------------------------------------------------------------------------------------------------

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
                    context.fillStyle = mod_Color.getBaseColor();
                }
                else {
                    context.fillStyle = mod_Color.getSpaceColor();
                }

                context.fillRect(
                    ((x * (unitSize.x * unitScale)) + unitShift.x) - (bufferTile.x * (unitSize.x * unitScale)),
                    ((y * (unitSize.y * unitScale)) + unitShift.y) - (bufferTile.y * (unitSize.x * unitScale)),
                    ((unitSize.x * unitScale)),
                    ((unitSize.y * unitScale))
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
        run        : run,
        update     : update,
        render     : render
    }});

})(window.PPV);