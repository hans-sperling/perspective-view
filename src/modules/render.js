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
        unitSize     = 10,
        unitDepth    = 2,
        unitShift    = { x : 0, y : 0},
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
        unitSize  = config.unitSize;
    }


    function run() {
        update();
    }


    function update() {
        var halfX, halfY, offsetX, offsetY, startX, startY, endX, endY;

        location    = mod_Location.getMapLocation();
        halfX   = Math.ceil(canvas[0].width  / ((unitSize + unitShift.x) * 2));
        halfY   = Math.ceil(canvas[0].height / ((unitSize + unitShift.y) * 2));
        offsetX = location.tile.x + bufferTile.x;
        offsetY = location.tile.y + bufferTile.y;
        startX  = halfX - offsetX;
        startY  = halfY - offsetY;
        endX    = halfX + offsetX;
        endY    = halfY + offsetY;

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
        //renderBase();
        renderTop();
    }


    function renderBase() {
        var x, y,
            offsetX = unitShift.x - (bufferTile.x * unitSize),
            offsetY = unitShift.y - (bufferTile.y * unitSize);

        for (y = 0; y < mapSize.y; y++){
            for (x = 0; x < mapSize.x; x++) {
                if (map[y][x] > 0) {
                    context.fillStyle = mod_Color.getBaseColor();
                }
                else {
                    context.fillStyle = mod_Color.getSpaceColor();
                }

                context.fillRect(((x * unitSize) + offsetX), ((y * unitSize) + offsetY), unitSize, unitSize);
                context.fill();
            }
        }
        context.restore();
    }


    function renderTop() {
        var x, y,
            offsetX     = unitShift.x - (bufferTile.x * unitSize),
            offsetY     = unitShift.y - (bufferTile.y * unitSize);

        for (y = 0; y < mapSize.y; y++){
            for (x = 0; x < mapSize.x; x++) {
                if (map[y][x] > 0) {
                    context.fillStyle = mod_Color.getBaseColor();
                }
                else {
                    context.fillStyle = mod_Color.getSpaceColor();
                }

                context.fillRect(((x * unitSize) + offsetX) * unitDepth, ((y * unitSize) + offsetY) * unitDepth, unitSize * unitDepth, unitSize * unitDepth);
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
        render     : render,
        renderBase : renderBase
    }});

})(window.PPV);