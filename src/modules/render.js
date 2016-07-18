;(function render(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var mod_Location     = null,
        mod_Map          = null,
        mod_Color        = null,
        mod_canvasHelper = null,
        CFG              = {},
        buffer           = 0, // Amount of tiles to buffer
        renderMap        = [],
        renderOrder      = [];

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
        CFG = config;

        renderMap     = mod_Map.getArea(CFG.position, buffer);
        renderOrder   = getRenderOrder(renderMap);

        //debug();
    }

    // ----------------------------------------------------------------------------------------------------------- DEBUG

    function debug() {
        console.log('render.js: ', {
        });
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


    function render() {
        var renderOrderAmount = renderOrder.length,
            vanishingTile     = getVanishingTile(),
            halfUnitSize      = CFG.unitSize / 2,
            shift             = { x : (CFG.position.x % CFG.unitSize), y : (CFG.position.y % CFG.unitSize) },
            backPath, frontPath,
            eastPath, westPath, southPath, northPath,
            i, x, y;

        cleanCanvas();
        for (i = renderOrderAmount - 1; i >= 0; i--) { // reversed
            x = renderOrder[i].x;
            y = renderOrder[i].y;

            if (renderMap[y][x] > 0) {
                //backPath  = getBackPath(x, y);
                backPath  = getFrontPath(x, y, 0);
                frontPath = getFrontPath(x, y, renderMap[y][x]);

                renderShape(backPath, mod_Color.getBack());

                /*
                 if (x < vanishingTile.x ) {
                 eastPath  = getEastPath(backPath, frontPath);
                 renderShape(eastPath, mod_Color.getEast());
                 }
                 else if (x > vanishingTile.x) {
                 westPath  = getWestPath(backPath, frontPath);
                 renderShape(westPath, mod_Color.getWest());
                 }

                 if (y < vanishingTile.y ) {
                 southPath = getSouthPath(backPath, frontPath);
                 renderShape(southPath, mod_Color.getSouth());
                 }
                 else if (y > vanishingTile.y) {
                 northPath = getNorthPath(backPath, frontPath);
                 renderShape(northPath, mod_Color.getNorth());
                 }
                 */

                renderShape(frontPath, mod_Color.getFront());
            }
        }


        //mod_canvasHelper.drawCameraGrid(CFG.camera, { width: CFG.unitSize, height : CFG.unitSize}, shift);
        mod_canvasHelper.drawCamera(CFG.camera);
        mod_canvasHelper.drawCanvasGrid(CFG.camera, { width: CFG.unitSize, height : CFG.unitSize}, shift);

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
        CFG.context.fill();
    }


    function getRenderOrder(map) {
        var vanishingCell   = getVanishingTile(),
            mapAmountX      = map[0].length,
            mapAmountY      = map.length,
            orderX          = [],
            orderY          = [],
            order           = [],
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

    function getBackPath(x, y) {
        var unitSize     = CFG.unitSize,
            camera       = CFG.camera,
            cameraStartX = (camera.position.x - (camera.width  / 2)),
            cameraStartY = (camera.position.y - (camera.height / 2)),
            shift        = { x : (CFG.position.x % CFG.unitSize), y : (CFG.position.y % CFG.unitSize) },
            startX       = cameraStartX - (cameraStartX % unitSize) + x * unitSize - shift.x,
            startY       = cameraStartY - (cameraStartY % unitSize) + y * unitSize - shift.y,
            stopX        = startX + unitSize,
            stopY        = startY + unitSize;

        return [
            { x : startX, y : startY },
            { x : stopX,  y : startY },
            { x : stopX,  y : stopY  },
            { x : startX, y : stopY  }
        ];
    }


    function getShift(h) {
        var position      = CFG.position,
            unitDepth     = CFG.unitDepth,
            unitSize      = CFG.unitSize;

        return {
            x : (position.x % unitSize),
            y : (position.y % unitSize)
        };
    }


    function getUnitSizeByHeight(h) {
        if (h == 0) {
            return CFG.unitSize;
        }
        else {
            return CFG.unitSize + (Math.round(((CFG.unitSize * CFG.unitDepth) - CFG.unitSize)) * h);
        }
    }


    function getFrontPath(x, y, h) {

        var vanishingTile = getVanishingTile(),
            shift         = getShift(),
            unitSize      = getUnitSizeByHeight(h),
            position      = CFG.position,
            camPosition   = CFG.camera.position,
            unitDepth     = CFG.unitDepth,
            camera        = CFG.camera,
            shiftX        = shift.x,
            shiftY        = shift.y,

            startX        = camPosition.x + ((x - vanishingTile.x) * unitSize) - shiftX,
            startY        = camPosition.y + ((y - vanishingTile.y) * unitSize) - shiftY,
            stopX         = startX + unitSize,
            stopY         = startY + unitSize;

        if (x==5&&y==5) {
            console.log('x: ', x);
            console.log('unitSize: ', unitSize);
            console.log('shift.x: ', shift.x);
            console.log('vanishingTile.x: ', vanishingTile.x);
            console.log('position.x: ', position.x);
            console.log('h: ', h);
            console.log('newSize: ', stopX - startX);
            console.log('shift.x: ', shift.x);
            console.log('shiftX: ', shiftX);
            console.log('startX: ', startX);
            console.log('----------------------------------');
        }

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
