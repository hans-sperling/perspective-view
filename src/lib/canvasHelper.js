;(function canvasHelper(ppv) {
    'use strict';

    // ------------------------------------------------------------------------------------------------------ PROPERTIES

    var context = {},
        canvas  = {},
        _config = {
            camera: {
                color: 'rgba(0, 255, 127, 0.5)',
                lineWidth: 1
            },
            grid: {
                color: 'rgba(127, 127, 127, 0.2)',
                lineWidth: 1
            },
            path: {
                color: 'rgba(255, 0, 127, 0.5)',
                fillcolor: '#fff',
                lineWidth: 1
            },
            point: {
                color: 'rgba(255, 127, 0, 0.5)',
                width: 5,
                height: 5
            }
        };

    // ------------------------------------------------------------------------------------------------ MODULE INTERFACE

    function init(config) {
        update(config);
    }


    function run() {
        // Nothing to do yet
    }


    function update(config) {
        canvas  = config.canvas;
        context = config.context;
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    function clean() {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }


    function drawCamera(camera) {
        var c  = { x : camera.position.x, y : camera.position.y},
            tl = { x : c.x - (camera.width / 2), y : c.y - (camera.height / 2)},
            tr = { x : c.x + (camera.width / 2), y : c.y - (camera.height / 2)},
            bl = { x : c.x - (camera.width / 2), y : c.y + (camera.height / 2)},
            br = { x : c.x + (camera.width / 2), y : c.y + (camera.height / 2)};

        if (camera.warped) {
            var widthOffset  = ((canvas.width  - camera.width)  / 2),
                heightOffset = ((canvas.height - camera.height) / 2);

            tl = { x : widthOffset,                y : heightOffset};
            tr = { x : widthOffset + camera.width, y : heightOffset};
            bl = { x : widthOffset + camera.width, y : heightOffset + camera.height};
            br = { x : widthOffset,                y : heightOffset + camera.height};
        }

        context.save();

        context.strokeStyle = _config.camera.color;
        context.lineWidth   = _config.camera.lineWidth;

        context.rect(tl.x, tl.y, camera.width, camera.height);
        context.stroke();

        context.beginPath();

        context.moveTo(tl.x, tl.y);
        context.lineTo(c.x,  c.y);

        context.moveTo(tr.x, tr.y);
        context.lineTo(c.x,  c.y);

        context.moveTo(br.x, br.y);
        context.lineTo(c.x,  c.y);

        context.moveTo(bl.x, bl.y);
        context.lineTo(c.x,  c.y);

        context.stroke();
        context.restore();
    }


    function drawCanvasGrid(camera, unitSize, shift) {
        var startX = (camera.position.x % unitSize)  - shift.x,
            startY = (camera.position.y % unitSize) - shift.y,
            x, y;

        context.save();
        context.strokeStyle = _config.grid.color;
        context.lineWidth   = _config.grid.lineWidth;

        context.beginPath();

        for (x = startX; x <= canvas.width; x += unitSize) {
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
        }

        for (y = startY; y <= canvas.height; y += unitSize) {
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
        }

        context.stroke();
        context.restore();
    }


    function drawCameraGrid(camera, unit, shift) {
        var cameraStartX = (camera.position.x - (camera.width  / 2)),
            cameraStartY = (camera.position.y - (camera.height / 2)),
            startX       = cameraStartX + (((cameraStartX % unit.width)+ unit.width - shift.x) % unit.width),
            stopX        = cameraStartX + camera.width,
            startY       = cameraStartY + (((cameraStartY % unit.height) + unit.height - shift.y) % unit.height),
            stopY        = cameraStartY + camera.height,
            x, y;

        context.save();
        context.strokeStyle = _config.grid.color;
        context.lineWidth   = _config.grid.lineWidth;

        context.beginPath();

        for (x = startX; x <= stopX; x += unit.width) {
            context.moveTo(x, cameraStartY);
            context.lineTo(x, stopY);
        }

        for (y = startY; y <= stopY; y += unit.height) {
            context.moveTo(cameraStartX, y);
            context.lineTo(stopX, y);
        }

        context.stroke();
        context.restore();
    }


    function drawPoint(x, y, width, height) {
        if (typeof width !== 'number') {
            width = _config.point.width;
        }

        if (typeof height !== 'number') {
            height = _config.point.height;
        }

        context.save();
        context.fillStyle = _config.point.color;
        context.fillRect(
            x - width/2,
            y - height/2,
            width,
            height
        );
        context.restore();
    }


    function drawPath(parameters) {
        var path = parameters.path,
            filled = parameters.filled || false,
            i, pathAmount = path.length;

        context.save();

        context.strokeStyle = _config.path.color;
        context.fillStyle   = _config.path.fillcolor;
        context.lineWidth   = _config.path.lineWidth;

        context.beginPath();
        context.moveTo(path[0].x, path[0].y);

        for (i = 1; i < pathAmount; i++) {
            context.lineTo(path[i].x, path[i].y);
        }

        context.closePath();
        context.stroke();

        if (!filled) {
            context.fill();
        }

        context.restore();
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    // Append module with public methods and properties
    ppv.appendModule({ canvasHelper: {
        init           : init,
        clean          : clean,
        drawCamera     : drawCamera,
        drawCanvasGrid : drawCanvasGrid,
        drawCameraGrid : drawCameraGrid,
        drawPoint      : drawPoint,
        drawPath       : drawPath
    }});
})(window.PPV);
