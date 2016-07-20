;(function render(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var mod_Map          = null,
        mod_Color        = null,
        mod_canvasHelper = null,
        CFG              = {},
        renderMap        = [],
        renderOrder      = [],
        buffer           = 0;

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    function init(config) {
        mod_Map          = ppv.modules.map;
        mod_Color        = ppv.modules[config.colorModule];
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
            newUnitSize = getUnitSizeByHeight(h),
            baseShift   = {
                x : (position.x % unitSize),
                y : (position.y % unitSize)
            };

        if (h == 0) {
            return baseShift;
        }
        else {
            return {
                x : Math.round(baseShift.x + ((newUnitSize - unitSize) / (unitSize / baseShift.x))),
                y : Math.round(baseShift.y + ((newUnitSize - unitSize) / (unitSize / baseShift.y)))
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
            item, i, x, y;

        cleanCanvas();

        for (i = renderOrderAmount - 1; i >= 0; i--) {
            x    = renderOrder[i].x;
            y    = renderOrder[i].y;
            item = renderMap[y][x];

            if (CFG.render.mode.toLowerCase() === 'flat') {
                if (isNumber(item) && item > 0 || isArray(item)) {
                    renderShape(getFrontPath(x, y, 0), mod_Color.getFront(0));
                }
            }
            else if (CFG.render.mode.toLowerCase() === 'uniform') {
                if (isNumber(item) && item > 0 || isArray(item)) {
                    renderObject(x, y, 0, 1);
                }
            }
            else { // if (CFG.render.mode.toLowerCase() === 'default') {
                if (isNumber(item) && item > 0) {
                    renderObject(x, y, 0, item);
                }
                else if (isArray(item) && item.length >= 2) {
                    renderObject(x, y, item[0], item[1]);
                }
            }
        }

        if (CFG.render.grid) {
            var shift       = getShiftByHeight(0),
                newUnitSize = getUnitSizeByHeight(0);

            //mod_canvasHelper.drawCameraGrid(camera, newUnitSize, shift);
            mod_canvasHelper.drawCanvasGrid(camera, newUnitSize, shift);
        }

        if (CFG.render.camera) {
            mod_canvasHelper.drawCamera(camera);
        }
    }


    function renderObject(x, y, h1, h2) {
        var vanishingTile     = getVanishingTile(),
            backPath, frontPath,
            eastPath, westPath, southPath, northPath;

        backPath  = getFrontPath(x, y, h1);
        frontPath = getFrontPath(x, y, h2);

        if (CFG.render.wireFrame || x < vanishingTile.x) {
            eastPath = getEastPath(backPath, frontPath);
            renderShape(eastPath, mod_Color.getEast());
        }
        if (CFG.render.wireFrame || x > vanishingTile.x) {
            westPath = getWestPath(backPath, frontPath);
            renderShape(westPath, mod_Color.getWest());
        }

        if (CFG.render.wireFrame || y < vanishingTile.y) {
            southPath = getSouthPath(backPath, frontPath);
            renderShape(southPath, mod_Color.getSouth());
        }
        if (CFG.render.wireFrame || y > vanishingTile.y) {
            northPath = getNorthPath(backPath, frontPath);
            renderShape(northPath, mod_Color.getNorth());
        }

        renderShape(frontPath, mod_Color.getFront(h2));
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

        if (!CFG.render.wireFrame) {
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
