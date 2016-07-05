;(function render(ppv) {
    'use strict';

    var mod_Location     = null,
        mod_Map          = null,
        mod_Color        = null,
        mod_canvasHelper = null,

        canvas       = null,
        context      = null,
        bufferTile   = { x : 0, y : 0}, // Amount of tiles out of the canvas
        unitSize     = 10,
        unitDepth    = 2,
        unitShift    = { x : 0, y : 0},
        renderOrder  = [],
        camera       = { width : 1, height : 1, position : { x : 1, y : 1 }},
        map          = [],
        mapSize      = { x : 1, y : 1},
        mapPosition  = { x : 0, y : 0},
        mapOffset    = { x : 0, y : 0},
        grid         = [],
        gridSize     = { x : 1, y : 1 },
        gridPosition = { x : 1, y : 1 };

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
        gridSize     = getGridSize();
        gridPosition = {
            x: Math.floor(gridSize.x / 2),
            y: Math.floor(gridSize.y / 2)
        };
        var mapPosition = {
                x : 2,
                y : 2
            },
            mapEdges = {
                startX : mapPosition.x - gridPosition.x - mapOffset.x,
                startY : mapPosition.y - gridPosition.y - mapOffset.y,
                endX   : mapPosition.x + gridPosition.x + mapOffset.x,
                endY   : mapPosition.y + gridPosition.y + mapOffset.y
            };


        grid = mod_Map.getMapArea(mapEdges);

        renderOrder = getRenderOrder();
    }

    // ---------------------------------------------------------------------------------------------------------- Render

    function render() {
        var i             = renderOrder.length,
            vanishingCell = gridPosition,
            backPath, frontPath,
            northPath, eastPath, southPath, westPath,
            x, y;

        while (i--) {
            x = renderOrder[i].x;
            y = renderOrder[i].y;

            if (grid[y][x] > 0) {
                backPath  = getBackPath(x, y);
                frontPath = getFrontPath(x, y);

                renderShape(backPath, mod_Color.getBackColor());

                if (x < vanishingCell.x + mapOffset.x) {
                    eastPath  = getEastPath(backPath, frontPath);
                    renderShape(eastPath, mod_Color.getEastColor());
                }
                else if (x > vanishingCell.x + mapOffset.x) {
                    westPath  = getWestPath(backPath, frontPath);
                    renderShape(westPath, mod_Color.getWestColor());
                }

                if (y < vanishingCell.y + mapOffset.y) {
                    southPath = getSouthPath(backPath, frontPath);
                    renderShape(southPath, mod_Color.getSouthColor());
                }
                else if (y > vanishingCell.y + mapOffset.y) {
                    northPath = getNorthPath(backPath, frontPath);
                    renderShape(northPath, mod_Color.getNorthColor());
                }

                renderShape(frontPath, mod_Color.getFrontColor());
            }
        }

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
        var vanishingCell   = gridPosition,
            mapAmountX      = grid[0].length,
            mapAmountY      = grid.length,
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

    // ----------------------------------------------------------------------------------------------------------- Paths

    function getBackPath(x, y) {
        //console.log(x, y);

        var currentUnitSize = unitSize,
            startX = (currentUnitSize * x) - (currentUnitSize * mapOffset.x),
            startY = (currentUnitSize * y) - (currentUnitSize * mapOffset.y),
            endX   = startX + currentUnitSize,
            endY   = startY + currentUnitSize;

        return [
            { x : startX, y : startY },
            { x : endX,   y : startY },
            { x : endX,   y : endY   },
            { x : startX, y : endY   }
        ];
    }


    function getFrontPath(x, y) {
        //console.log(x, y);

        var currentUnitSize = unitSize * unitDepth,
            startX = (currentUnitSize * x) - (currentUnitSize * mapOffset.x) - ((gridSize.x * currentUnitSize) / 2) + camera.position.x,
            startY = (currentUnitSize * y) - (currentUnitSize * mapOffset.y) - ((gridSize.y * currentUnitSize) / 2) + camera.position.y,
            endX   = startX + currentUnitSize,
            endY   = startY + currentUnitSize;

        return [
            { x : startX, y : startY },
            { x : endX,   y : startY },
            { x : endX,   y : endY   },
            { x : startX, y : endY   }
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