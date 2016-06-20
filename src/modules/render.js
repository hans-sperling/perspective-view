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

        halfX        = Math.ceil(canvas.width  / ((unitSize) * 2));
        halfY        = Math.ceil(canvas.height / ((unitSize) * 2));
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

    // get reversed render order
    function getRenderOrder() {
        var vanishingCell = ppv.modules.location.getVanishingTile(),
            mapAmountX    = map[0].length,
            mapAmountY    = map.length,
            orderX        = [],
            orderY        = [],
            orderlist2     = [],
            orderlist     = {
                tl : [],
                tc : [],
                tr : [],
                cl : [],
                cc : [],
                cr : [],
                bl : [],
                bc : [],
                br : []
            },
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

                if (orderY[y] < vanishingCell.y) { // Top
                    if (orderX[x] < vanishingCell.x) { // Top left
                        orderlist.tl.push({
                            x: orderX[x],
                            y: orderY[y]
                        });
                    }
                    else if (orderX[x] == vanishingCell.x) { // Top center

                        orderlist.tc.push({
                            x: orderX[x],
                            y: orderY[y]
                        });
                    }
                    else { // Top right - if (orderX[x] > vanishingCell.x)
                        orderlist.tr.push({
                            x: orderX[x],
                            y: orderY[y]
                        });
                    }
                }
                else if (orderY[y] == vanishingCell.y) { // Top
                    if (orderX[x] < vanishingCell.x) { // Top left
                        orderlist.cl.push({
                            x: orderX[x],
                            y: orderY[y]
                        });
                    }
                    else if (orderX[x] == vanishingCell.x) { // Top center
                        orderlist.cc.push({
                            x: orderX[x],
                            y: orderY[y]
                        });
                    }
                    else { // Top right - if (orderX[x] > vanishingCell.x)
                        orderlist.cr.push({
                            x: orderX[x],
                            y: orderY[y]
                        });
                    }
                }
                else { // if (orderY[y] < vanishingCell.y)
                    if (orderX[x] < vanishingCell.x) { // Top left
                        orderlist.bl.push({
                            x: orderX[x],
                            y: orderY[y]
                        });
                    }
                    else if (orderX[x] == vanishingCell.x) { // Top center
                        orderlist.bc.push({
                            x: orderX[x],
                            y: orderY[y]
                        });
                    }
                    else { // Top right - if (orderX[x] > vanishingCell.x)
                        orderlist.br.push({
                            x: orderX[x],
                            y: orderY[y]
                        });
                    }
                }

                /*
                orderlist2.push({
                    x: orderX[x],
                    y: orderY[y]
                });
                 */
            }
        }

        return orderlist;
    }


    function render() {

        renderPaths(150);

        newRenderLogic(150);

        // Or
        /*
        renderBase();
        renderRoof();
        /**/
    }


    function renderShape(path) {
        var i = 0;

        // Base
        context.beginPath();
        context.moveTo(path[i].x, path[i].y);

        context.fillStyle   = mod_Color.getBaseColor();
        context.strokeStyle = mod_Color.getBaseColor();

        for (i = 1; i < path.length; i++) {
            context.lineTo(path[i].x, path[i].y);
        }

        context.closePath();
        context.stroke();
        context.fill();
    }


    function newRednerLogic(delay) {
        var objects = [],

            i;

    }




    function renderPaths(delay) {
        var path = [],
            c = renderOrder.length,
            x, y, i, j;


        // Get paths in render order
        while (c--) {
            x = renderOrder[c].x;
            y = renderOrder[c].y;

            if (map[y][x] > 0) {
                path.push({
                    base : getBasePath(x, y),
                    roof : getRoofPath(x, y)
                });
            }
        }




        // Render paths into canvas
        for (i = 0; i < path.length; i++) {
            (function(i) {
                setTimeout(function () {
                    var basePath = path[i].base,
                        roofPath = path[i].base;

                    renderShape(basePath);
                    renderShape(roofPath);

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