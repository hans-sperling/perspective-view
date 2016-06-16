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
        unitDepth    = 1,
        unitShift    = { x : 0, y : 0},
        renderOrder  = [],
        gridPosition;

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {
        mod_Location = ppv.modules.location;
        mod_Map      = ppv.modules.map;
        mod_Color    = ppv.modules.color;

        canvas    = config.canvas;
        context   = config.context;
        // unitShift = config.unitShift;
        unitSize  = config.unitSize;
    }


    function run() {
        update();
    }


    function getMapAreaPositions() {
        var halfX, halfY, offsetX, offsetY, startX, startY, endX, endY;

        gridPosition = mod_Location.getGridPosition();

        halfX        = Math.ceil(canvas[0].width  / ((unitSize) * 2));
        halfY        = Math.ceil(canvas[0].height / ((unitSize) * 2));
        offsetX      = gridPosition.x + bufferTile.x;
        offsetY      = gridPosition.y + bufferTile.y;
        startX       = halfX - offsetX;
        startY       = halfY - offsetY;
        endX         = halfX + offsetX;
        endY         = halfY + offsetY;

        return {
            startX : halfX - offsetX,
            startY : halfY - offsetY,
            endX   : halfX + offsetX,
            endY   : halfY + offsetY
        }
    }


    function update() {
        var mapAreaPosition = getMapAreaPositions();

        map         = mod_Map.getMapArea(mapAreaPosition.startX, mapAreaPosition.startY, mapAreaPosition.endX, mapAreaPosition.endY);
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

        //renderPaths(100);

        // Or
        //*
        renderBase();
        renderRoof();
        /**/
    }


    function renderPaths(delay) {
        var path = [],
            a, x, y, i, j;


        for (y = 0; y < mapSize.y; y++) {
            for (x = 0; x < mapSize.x; x++) {
                if (map[y][x] > 0) {
                    path.push({
                        base : getBasePath(x, y),
                        roof : getRoofPath(x, y)
                    });
                }
            }
        }


        for (i = 0; i < path.length; i++) {
            (function(i) {
                setTimeout(function () {
                    var b = path[i].base;
                    var r = path[i].roof;

                    // Base
                    context.beginPath();
                    context.moveTo(b[0].x, b[0].y);

                    context.fillStyle   = mod_Color.getBaseColor();
                    context.strokeStyle = mod_Color.getBaseColor();
                    for (j = 1; j < b.length; j++) {
                        context.lineTo(b[j].x, b[j].y);
                    }
                    context.closePath();
                    context.stroke();
                    context.fill();
/*
                    // Roof
                    context.beginPath();
                    context.moveTo(r[0].x, r[0].y);

                    context.fillStyle   = mod_Color.getTopColor();
                    context.strokeStyle = mod_Color.getTopColor();
                    for (j = 1; j < r.length; j++) {
                        context.lineTo(r[j].x, r[j].y);
                    }
                    context.closePath();
                    context.stroke();
                    context.fill();
*/
                },delay * i);
            })(i);
        }

    }


    function renderBase() {
        var x, y, tileHeight, currentUnitSize, shiftX, shiftY;

        for (y = 0; y < mapSize.y; y++){
            for (x = 0; x < mapSize.x; x++) {
                tileHeight      = map[y][x];
                currentUnitSize = unitSize;
                shiftX          = -(currentUnitSize * bufferTile.x) + unitShift.x;
                shiftY          = -(currentUnitSize * bufferTile.y) + unitShift.y;

                // Color of the shape
                if (tileHeight > 0) {
                    context.fillStyle = mod_Color.getBaseColor();
                }
                else {
                    context.fillStyle = mod_Color.getSpaceColor();
                }

                context.fillRect((x * currentUnitSize) + shiftX, (y * currentUnitSize) + shiftY, currentUnitSize, currentUnitSize);
                context.fill();
            }
        }
        context.restore();
    }


    function renderRoof() {
        var x, y, tileHeight, currentUnitSize, shiftX, shiftY;

        for (y = 0; y < mapSize.y; y++){
            for (x = 0; x < mapSize.x; x++) {
                tileHeight      = map[y][x];
                currentUnitSize = unitSize + (unitSize * tileHeight * unitDepth);
                shiftX          = -(currentUnitSize * bufferTile.x) + unitShift.x + (unitShift.x * unitDepth);
                shiftY          = -(currentUnitSize * bufferTile.y) + unitShift.y + (unitShift.y * unitDepth);

                // Color of the shape
                if (tileHeight > 0) {
                    context.fillStyle = mod_Color.getTopColor();
                }
                else {
                    context.fillStyle = mod_Color.getSpaceColor();
                }

                context.fillRect((x * currentUnitSize) + shiftX, (y * currentUnitSize) + shiftY, currentUnitSize, currentUnitSize);
                context.fill();
            }
        }
        context.restore();
    }


    function getBasePath(x, y) {
        var pathX, pathY, tileHeight, currentUnitSize, shiftX, shiftY;

        tileHeight      = map[y][x];
        currentUnitSize = unitSize;
        shiftX          = -(currentUnitSize * bufferTile.x) + unitShift.x;
        shiftY          = -(currentUnitSize * bufferTile.y) + unitShift.y;
        pathX           = (x * currentUnitSize) + shiftX;
        pathY           = (y * currentUnitSize) + shiftY;

        return [
            { x : pathX, y : pathY},
            { x : pathX + currentUnitSize, y : pathY},
            { x : pathX + currentUnitSize, y : pathY + currentUnitSize},
            { x : pathX, y : pathY + currentUnitSize}
        ];
    }


    function getRoofPath(x, y) {
        var pathX, pathY,
            tileHeight, currentUnitSize, shiftX, shiftY;

        tileHeight      = map[y][x];
        currentUnitSize = unitSize + (unitSize * tileHeight * unitDepth);
        shiftX          = -(currentUnitSize * bufferTile.x) + unitShift.x + (unitShift.x * unitDepth);
        shiftY          = -(currentUnitSize * bufferTile.y) + unitShift.y + (unitShift.y * unitDepth);
        pathX           = (x * currentUnitSize) + shiftX;
        pathY           = (y * currentUnitSize) + shiftY;

        return [
            { x : pathX, y : pathY},
            { x : pathX + currentUnitSize, y : pathY},
            { x : pathX + currentUnitSize, y : pathY + currentUnitSize},
            { x : pathX, y : pathY + currentUnitSize}
        ];

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