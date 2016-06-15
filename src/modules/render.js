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
        renderOrder  = [],
        unitX = 1,
        unitY = 1;

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
        var halfX, halfY, offsetX, offsetY, startX, startY, endX, endY;

        location    = mod_Location.getMapLocation();
        unitSize    = mod_Map.getUnitSize();

        unitX = unitSize.x * unitScale;
        unitY = unitSize.y * unitScale;

        halfX   = Math.ceil(canvas[0].width  / ((unitX + unitShift.x) * 2));
        halfY   = Math.ceil(canvas[0].height / ((unitY + unitShift.y) * 2));
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
        var x, y,
            offsetX = unitShift.x - (bufferTile.x * unitX),
            offsetY = unitShift.y - (bufferTile.y * unitY);

        for (y = 0; y < mapSize.y; y++){
            for (x = 0; x < mapSize.x; x++) {
                if (map[y][x] > 0) {
                    context.fillStyle = mod_Color.getBaseColor();
                }
                else {
                    context.fillStyle = mod_Color.getSpaceColor();
                }

                context.fillRect(((x * unitX) + offsetX), ((y * unitY) + offsetY), (unitX), (unitY));
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