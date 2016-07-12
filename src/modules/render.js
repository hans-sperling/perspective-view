;(function render(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var mod_Location     = null,
        mod_Map          = null,
        mod_Color        = null,
        mod_canvasHelper = null,
        CFG              = {},

        buffer = 0, // Amount of tiles to buffer

        renderOrder  = [],
        mapPosition  = { x : 0, y : 0 },
        grid         = [],
        gridSize     = { x : 1, y : 1 },
        gridPosition = { x : 1, y : 1 },
        gridOffset   = { x : 1, y : 1 }; // Should be simplified to a single int var - x and y size are same!

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


        mod_Map.getArea(CFG.position, buffer);

        /*

        gridSize     = getGridSize();
        gridPosition = {
            x: Math.floor(gridSize.x / 2),
            y: Math.floor(gridSize.y / 2)
        };

        mapPosition = {
            x : Math.ceil(CFG.position.x / CFG.unitSize),
            y : Math.ceil(CFG.position.y / CFG.unitSize)
        };

        var mapEdges = {
            startX : mapPosition.x - gridPosition.x - gridOffset.x,
            startY : mapPosition.y - gridPosition.y - gridOffset.y,
            endX   : mapPosition.x + gridPosition.x + gridOffset.x,
            endY   : mapPosition.y + gridPosition.y + gridOffset.y
        };


        grid = mod_Map.getArea(mapEdges);

        renderOrder = getRenderOrder();
        */

         debug();
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


    function render() {

        /*
        var renderOrderAmount = renderOrder.length,
            vanishingCell = gridPosition,
            halfUnitSize  = CFG.unitSize / 2,
            backPath, frontPath,
            northPath, eastPath, southPath, westPath,
            i, x, y;
        */

        cleanCanvas();


        /*
        //for (i = 0; i < renderOrderAmount; i++) { // normal
        for (i = renderOrderAmount - 1; i >= 0; i--) { // reversed
            x = renderOrder[i].x;
            y = renderOrder[i].y;

            if (grid[y][x] > 0) {
                backPath  = getBackPath(x, y);
                frontPath = getFrontPath(x, y, grid[y][x]);

                renderShape(backPath, mod_Color.getBack());

                if (x < vanishingCell.x + gridOffset.x || CFG.unitShift.x < -halfUnitSize) {
                    eastPath  = getEastPath(backPath, frontPath);
                    renderShape(eastPath, mod_Color.getEast());
                }
                else if (x > vanishingCell.x + gridOffset.x || CFG.unitShift.x > halfUnitSize) {
                    westPath  = getWestPath(backPath, frontPath);
                    renderShape(westPath, mod_Color.getWest());
                }

                if (y < vanishingCell.y + gridOffset.y || CFG.unitShift.y < -halfUnitSize) {
                    southPath = getSouthPath(backPath, frontPath);
                    renderShape(southPath, mod_Color.getSouth());
                }
                else if (y > vanishingCell.y + gridOffset.y || CFG.unitShift.y > halfUnitSize) {
                    northPath = getNorthPath(backPath, frontPath);
                    renderShape(northPath, mod_Color.getNorth());
                }

                renderShape(frontPath, mod_Color.getFront());
            }
        }
        */

        mod_canvasHelper.drawCamera(CFG.camera);
        //mod_canvasHelper.drawGrid(CFG.camera, { width: CFG.unitSize, height : CFG.unitSize}, CFG.position);
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


    function getRenderOrder() {
        var vanishingCell   = gridPosition,
            mapAmountX      = grid[0].length,
            mapAmountY      = grid.length,
            orderX          = [],
            orderY          = [],
            order           = [],
            x, y;

        // Get reversed x render order
        for (x = vanishingCell.x + gridOffset.x; x < mapAmountX; x++) {
            orderX.push(x);
        }

        for (x = vanishingCell.x + gridOffset.x - 1; x >= 0 ; x--) {
            orderX.push(x);
        }

        // Get reversed y render order
        for (y = vanishingCell.y + gridOffset.y; y < mapAmountY; y++) {
            orderY.push(y);
        }

        for (y = vanishingCell.y + gridOffset.y - 1; y >= 0 ; y--) {
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


    function getGridSize() {
        return {
            x : Math.ceil(CFG.camera.width  / CFG.unitSize) + (gridOffset.x * 2),
            y : Math.ceil(CFG.camera.height / CFG.unitSize) + (gridOffset.y * 2)
        };
    }

    // ------------------------------------------------------------------------------------------------- Paths

    function getBackPath(x, y) {
        var startX = (CFG.unitSize * x) - (CFG.unitSize * gridOffset.x) + CFG.unitShift.x,
            startY = (CFG.unitSize * y) - (CFG.unitSize * gridOffset.y) + CFG.unitShift.y,
            endX   = startX + CFG.unitSize,
            endY   = startY + CFG.unitSize;

        return [
            { x : startX, y : startY },
            { x : endX,   y : startY },
            { x : endX,   y : endY   },
            { x : startX, y : endY   }
        ];
    }


    function getFrontPath(x, y, h) {
        var startX = (( (CFG.unitSize * x) - (CFG.unitSize * gridOffset.x) - ( (gridSize.x * CFG.unitSize) / 2) ) * CFG.unitDepth * h) + CFG.camera.position.x + (CFG.unitShift.x * CFG.unitDepth * h),
            startY = (( (CFG.unitSize * y) - (CFG.unitSize * gridOffset.y) - ( (gridSize.y * CFG.unitSize) / 2) ) * CFG.unitDepth * h) + CFG.camera.position.y + (CFG.unitShift.y * CFG.unitDepth * h),
            endX   = startX + (CFG.unitSize * CFG.unitDepth * h),
            endY   = startY + (CFG.unitSize * CFG.unitDepth * h);

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

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ render : {
        init   : init,
        run    : run,
        update : update,
        render : render
    }});

})(window.PPV);
