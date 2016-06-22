;(function render(ppv) {
    'use strict';

    var mod_Location     = null,
        mod_Map          = null,
        mod_Color        = null,
        mod_canvasHelper = null,

        canvas       = null,
        context      = null,
        map          = [],
        bufferTile   = { x : 1, y : 1}, // Amount of tiles out of the canvas
        mapSize      = { x : 1, y : 1},
        unitSize     = 10,
        unitDepth    = 1,
        unitShift    = { x : 0, y : 0},
        renderOrder  = [],
        camera       = { width : 1, height : 1, position : { x : 1, y : 1 }},
        gridSize     = { x : 1, y : 1 },
        gridPosition = { x : 1, y : 1 },
        mapPosition  = { x : 0, y : 0};

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {
        mod_Map          = ppv.modules.map;
        mod_Color        = ppv.modules.color;
        mod_canvasHelper = ppv.modules.canvasHelper;

        canvas    = config.canvas;
        context   = config.context;
        camera    = config.camera;
        unitSize  = config.unitSize;
        unitShift = config.unitShift;
    }


    function run() {
        update();
    }


    function update() {
        var mapAreaPosition = getMapAreaPositions();

        console.log(mapAreaPosition);
        gridSize     = getGridSize();
        gridPosition = {
            x: Math.ceil(gridSize.x / 2),
            y: Math.ceil(gridSize.y / 2)
        };

/*        map         = mod_Map.getMapArea(mapAreaPosition);
        mapSize     = { x : map[0].length, y : map.length };
        renderOrder = getRenderOrder();
        */
    }

    // ---------------------------------------------------------------------------------------------------------- Render

    function render() {
        var i = renderOrder.length,
            vanishingCell = gridPosition,
            backPath, frontPath,
            northPath, eastPath, southPath, westPath,
            x, y;

/*
        while (i--) {
            x        = renderOrder[i].x;
            y        = renderOrder[i].y;

            if (map[y][x] > 0) {
                backPath  = getBackPath(x, y);
                console.log(backPath);
                frontPath = getFrontPath(x, y);

                renderShape(backPath, mod_Color.getBackColor());
/*
                if (x < vanishingCell.x) {
                    eastPath  = getEastPath(backPath, frontPath);
                    renderShape(eastPath, mod_Color.getBackColor());
                }
                else if (x > vanishingCell.x) {
                    westPath  = getWestPath(backPath, frontPath);
                    renderShape(westPath, mod_Color.getBackColor());
                }

                if (y < vanishingCell.y) {
                    southPath = getSouthPath(backPath, frontPath);
                    renderShape(southPath, mod_Color.getBackColor());
                }
                else if (y > vanishingCell.y) {
                    northPath = getNorthPath(backPath, frontPath);
                    renderShape(northPath, mod_Color.getBackColor());
                }
//*
                //renderShape(frontPath, mod_Color.getFrontColor());
            }
        }
*/
        mod_canvasHelper.drawCamera(camera);
        mod_canvasHelper.drawGrid(camera, { width: unitSize, height : unitSize}, unitShift);
    }


    function renderShape(path, color) {
        var i = 0;

        context.beginPath();
        context.moveTo(path[i].x, path[i].y);

        context.fillStyle   = color;
        context.strokeStyle = color;

        for (i = 1; i < path.length; i++) {
            context.lineTo(path[i].x, path[i].y);
        }

        context.closePath();
        context.stroke();
        context.fill();
    }


    function getRenderOrder() {
        var vanishingCell   = getGridPosition({ x : camera.position.x, y : camera.position.y }),
            mapAmountX      = map[0].length,
            mapAmountY      = map.length,
            orderX          = [],
            orderY          = [],
            orderlistSimple = [],
            orderlist       = {
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

        for (x = vanishingCell.x - 1; x >= 0 ; x--) {
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
                /*
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
*/

                orderlistSimple.push({
                    x: orderX[x],
                    y: orderY[y]
                });

            }
        }

        return orderlistSimple;
    }



    function getMapAreaPositions() {
        var halfX, halfY, offsetX, offsetY, startX, startY, endX, endY;

        halfX        = Math.floor(canvas.width  / ((unitSize) * 2));
        halfY        = Math.floor(canvas.height / ((unitSize) * 2));

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

    // ----------------------------------------------------------------------------------------------------------- Paths

    function old_getBackPath(x, y) {
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


    function getBackPath(x, y) {
        var currentUnitSize = unitSize,
            startX          = (camera.position.x % unitSize) - (unitSize * 1.5) - unitShift.x,
            startY          = (camera.position.y % unitSize) - (unitSize * 1.5) - unitShift.y;


        return [
            { x : startX, y : startY},
            { x : startX + currentUnitSize, y : startY},
            { x : startX + currentUnitSize, y : startY + currentUnitSize},
            { x : startX, y : startY + currentUnitSize}
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
            { x : pathX,                   y : pathY                  },
            { x : pathX + currentUnitSize, y : pathY                  },
            { x : pathX + currentUnitSize, y : pathY + currentUnitSize},
            { x : pathX,                   y : pathY + currentUnitSize}
        ];
    }


    function getFrontPath(x, y) {
        var pathX, pathY, depthShiftX, depthShiftY,
            vanishingCell = mod_Location.getVanishingTile(),
            tileHeight, currentUnitSize, shiftX, shiftY,
            halfCanvasX = canvas.width  / 2,
            halfCanvasY = canvas.height / 2;

        tileHeight      = map[y][x];
        currentUnitSize = unitSize + (unitSize * tileHeight * unitDepth); // Base unit size * depth factor

        shiftX          = -((currentUnitSize * bufferTile.x) + (unitShift.x + currentUnitSize / 4));
        shiftY          = -((currentUnitSize * bufferTile.y) + (unitShift.y + currentUnitSize / 4));

        pathX           = ((x * currentUnitSize) + shiftX);
        pathY           = ((y * currentUnitSize) + shiftY);

        return [
            { x : pathX,                   y : pathY                  },
            { x : pathX + currentUnitSize, y : pathY                  },
            { x : pathX + currentUnitSize, y : pathY + currentUnitSize},
            { x : pathX,                   y : pathY + currentUnitSize}
        ];
    }

    function getNorthPath(backPath, frontPath) {
        return [
            { x : backPath[0].x,  y : backPath[0].y  },
            { x : backPath[1].x,  y : backPath[1].y  },
            { x : frontPath[1].x, y : frontPath[1].y },
            { x : frontPath[0].x, y : frontPath[0].y }
        ];
    }


    function getEastPath(backPath, frontPath) {
        return [
            { x : frontPath[1].x, y : frontPath[1].y },
            { x : backPath[1].x,  y : backPath[1].y  },
            { x : backPath[2].x,  y : backPath[2].y  },
            { x : frontPath[2].x, y : frontPath[2].y }
        ];
    }


    function getSouthPath(backPath, frontPath) {
        return [
            { x : frontPath[3].x, y : frontPath[3].y },
            { x : backPath[3].x,  y : backPath[3].y  },
            { x : backPath[2].x,  y : backPath[2].y  },
            { x : frontPath[2].x, y : frontPath[2].y }
        ];
    }


    function getWestPath(backPath, frontPath) {
        return [
            { x : frontPath[0].x, y : frontPath[0].y },
            { x : backPath[0].x,  y : backPath[0].y  },
            { x : backPath[3].x,  y : backPath[3].y  },
            { x : frontPath[3].x, y : frontPath[3].y }
        ];
    }

    // -----------------------------------------------------------------------------------------------------------------

    function getGridSize() {
        return {
            x : Math.ceil(camera.width  / unitSize) + (bufferTile.x * 2),
            y : Math.ceil(camera.height / unitSize) + (bufferTile.y * 2)
        };
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