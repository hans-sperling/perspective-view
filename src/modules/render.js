;(function render(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var mod_Map          = null,
        mod_Color        = null,
        mod_canvasHelper = null,
        CFG              = {},
        renderMap        = [],
        renderOrder      = [],
        buffer           = 0,
        doNotFill        = 0,
        renderCamera     = 0,
        renderGrid       = 0;

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    function init(config) {
        mod_Map          = ppv.modules.map;
        mod_Color        = ppv.modules.color;
        mod_canvasHelper = ppv.modules.canvasHelper;

        update(config);
    }


    function run() {
        // Nothing to do yet
    }


    function update(config) {
        CFG         = config;
        renderMap   = mod_Map.getArea(CFG.position, buffer);
        renderOrder = getRenderOrder(renderMap);
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    function cleanCanvas() {
        CFG.context.save();
        CFG.context.setTransform(1, 0, 0, 1, 0, 0);
        CFG.context.clearRect(0, 0, CFG.canvas.width, CFG.canvas.height);
        CFG.context.restore();
    }


    function getVanishingTile() {
        return { x : Math.floor(renderMap[0].length / 2), y : Math.floor(renderMap.length / 2)};
    }


    function getShiftByHeight(h) {
        var position    = CFG.position,
            unitSize    = CFG.unitSize,
            newUnitSize = getUnitSizeByHeight(h);

        if (h == 0) {
            return {
                x : (position.x % unitSize),
                y : (position.y % unitSize)
            };
        }
        else {
            return {
                x : Math.round((position.x % unitSize) + ((newUnitSize - unitSize) / (unitSize / (position.x % unitSize)))),
                y : Math.round((position.y % unitSize) + ((newUnitSize - unitSize) / (unitSize / (position.y % unitSize))))
            };
        }
    }


    function getUnitSizeByHeight(h) {
        var unitSize  = CFG.unitSize,
            unitDepth = CFG.unitDepth;

        if (h == 0) {
            return unitSize;
        }
        else {
            return Math.round(unitSize + (Math.round(((unitSize * unitDepth) - unitSize)) * h));
        }
    }


    function render() {
        var camera            = CFG.camera,
            renderOrderAmount = renderOrder.length,
            vanishingTile     = getVanishingTile(),
            backPath, frontPath,
            eastPath, westPath, southPath, northPath,
            h, i, x, y;

        cleanCanvas();

        for (i = renderOrderAmount - 1; i >= 0; i--) {
            x = renderOrder[i].x;
            y = renderOrder[i].y;
            h = renderMap[y][x];

            if (h > 0) {
                backPath  = getFrontPath(x, y, 0);
                frontPath = getFrontPath(x, y, h);

                renderShape(backPath, mod_Color.getBase());

                if (x < vanishingTile.x && renderMap[y][x + 1] !== undefined && renderMap[y][x + 1] < h) {
                    eastPath = getEastPath(backPath, frontPath);
                    renderShape(eastPath, mod_Color.getEast());
                }
                else if (x > vanishingTile.x && renderMap[y][x - 1] !== undefined && renderMap[y][x - 1] < h) {
                    westPath = getWestPath(backPath, frontPath);
                    renderShape(westPath, mod_Color.getWest());
                }

                if (y < vanishingTile.y && renderMap[y + 1] !== undefined && renderMap[y + 1][x] < h) {
                    southPath = getSouthPath(backPath, frontPath);
                    renderShape(southPath, mod_Color.getSouth());
                }
                else if (y > vanishingTile.y && renderMap[y - 1] !== undefined && renderMap[y - 1][x] < h) {
                    northPath = getNorthPath(backPath, frontPath);
                    renderShape(northPath, mod_Color.getNorth());
                }

                renderShape(frontPath, mod_Color.getFront());
            }
        }

        if (renderGrid) {
            var shift       = getShiftByHeight(0),
                newUnitSize = getUnitSizeByHeight(0);

            //mod_canvasHelper.drawCameraGrid(camera, newUnitSize, shift);
            mod_canvasHelper.drawCanvasGrid(camera, newUnitSize, shift);
        }

        if (renderCamera) {
            mod_canvasHelper.drawCamera(camera);
        }
    }


    function renderShape(path, color) {
        var i = 0;

        CFG.context.beginPath();
        CFG.context.moveTo(path[i].x, path[i].y);

        CFG.context.fillStyle   = color;
        CFG.context.strokeStyle = color;

        for (i = 1; i < path.length; i++) {
            CFG.context.lineTo(path[i].x, path[i].y);
        }

        CFG.context.closePath();
        CFG.context.stroke();

        if (!doNotFill) {
            CFG.context.fill();
        }
    }


    function getRenderOrder(map) {
        var vanishingCell = getVanishingTile(),
            mapAmountX    = map[0].length,
            mapAmountY    = map.length,
            orderX        = [],
            orderY        = [],
            order         = [],
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
                order.push({
                    x: orderX[x],
                    y: orderY[y]
                });
            }
        }

        return order;
    }

    // ------------------------------------------------------------------------------------------------- Paths

    function getFrontPath(x, y, h) {
        var vanishingTile = getVanishingTile(),
            shift         = getShiftByHeight(h),
            unitSize      = getUnitSizeByHeight(h),
            camPosition   = CFG.camera.position,
            shiftX        = shift.x,
            shiftY        = shift.y,
            startX        = camPosition.x + ((x - vanishingTile.x) * unitSize) - shiftX,
            startY        = camPosition.y + ((y - vanishingTile.y) * unitSize) - shiftY,
            stopX         = startX + unitSize,
            stopY         = startY + unitSize;

        return [
            { x : startX, y : startY },
            { x : stopX,  y : startY },
            { x : stopX,  y : stopY  },
            { x : startX, y : stopY  }
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

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ render : {
        init   : init,
        run    : run,
        update : update,
        render : render
    }});
})(window.PPV);
