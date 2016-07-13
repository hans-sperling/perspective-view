;(function canvasHelper(ppv) {
    'use strict';


    /**
     * Stores the context of the canvas.
     *
     * @private
     * @memberof canvasHelper
     * @type {object}
     */
    var _context = {},


    /**
     * Stores the canvas element in which the helpers are rendered.
     *
     * @private
     * @memberof canvasHelper
     * @type {object}
     */
    _canvas  = {},


    /**
     * Stores the config for all helpers.
     *
     * @private
     * @memberof canvasHelper
     * @type     {object}
     * @property {object} camera           - Config of the camera helper
     * @property {string} camera.color     - Color of the camera lines
     * @property {number} camera.lineWidth - Line width of the camera lines
     * @property {object} grid             - Config of the grid helper
     * @property {string} grid.color       - Color of the grid lines
     * @property {number} grid.lineWidth   - Line width of the grid lines
     */
    _config = {
        camera: {
            color: 'rgba(0, 255, 127, 0.5)',
            lineWidth: 1
        },
        grid: {
            color: 'rgba(0, 127, 255, 0.5)',
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

    // -----------------------------------------------------------------------------------------------------------------

    function init(config) {
        _canvas  = config.canvas;
        _context = config.context;
    }

    // -----------------------------------------------------------------------------------------------------------------

    function clean() {
        _context.save();
        _context.setTransform(1, 0, 0, 1, 0, 0);
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        _context.restore();
    }


    function drawCamera(camera) {
        console.log(camera);
        var c  = { x : camera.position.x, y : camera.position.y},
            tl = { x : c.x - (camera.width / 2), y : c.y - (camera.height / 2)},
            tr = { x : c.x + (camera.width / 2), y : c.y - (camera.height / 2)},
            bl = { x : c.x - (camera.width / 2), y : c.y + (camera.height / 2)},
            br = { x : c.x + (camera.width / 2), y : c.y + (camera.height / 2)};

        _context.save();

        _context.strokeStyle = _config.camera.color;
        _context.lineWidth   = _config.camera.lineWidth;


        _context.rect(tl.x, tl.y, camera.width, camera.height);

        _context.beginPath();
        _context.moveTo(tl.x, tl.y);
        _context.lineTo(c.x,  c.y);
        _context.stroke();

        _context.beginPath();
        _context.moveTo(tr.x, tr.y);
        _context.lineTo(c.x,  c.y);
        _context.stroke();

        _context.beginPath();
        _context.moveTo(br.x, br.y);
        _context.lineTo(c.x,  c.y);
        _context.stroke();

        _context.beginPath();
        _context.moveTo(bl.x, bl.y);
        _context.lineTo(c.x,  c.y);
        _context.stroke();


        _context.restore();
    }



    function drawGrid(camera, unit, drift) {
        var startX = (camera.position.x % unit.width)   - drift.x,
            startY = (camera.position.y % unit.height)  - drift.y,
            x, y;

        _context.save();
        _context.strokeStyle = _config.grid.color;
        _context.lineWidth   = _config.grid.lineWidth;

        _context.beginPath();
        for (y = startY; y < camera.height; y += unit.height) {
            _context.moveTo(startX, y);
            _context.lineTo(camera.width, y);
        }
        for (x = startX; x < camera.width; x += unit.width) {
            _context.moveTo(x, startY);
            _context.lineTo(x, camera.height);
        }
        _context.closePath();
        _context.stroke();
        _context.restore();
    }


    function drawPoint(x, y, width, height) {
        if (typeof width !== 'number') {
            width = _config.point.width;
        }

        if (typeof height !== 'number') {
            height = _config.point.height;
        }

        _context.save();
        _context.fillStyle = _config.point.color;
        _context.fillRect(
            x - width/2,
            y - height/2,
            width,
            height
        );
        _context.restore();
    }


    function drawPath(parameters) {
        var path = parameters.path,
            filled = parameters.filled || false,
            i, pathAmount = path.length;

        _context.save();

        _context.strokeStyle = _config.path.color;
        _context.fillStyle   = _config.path.fillcolor;
        _context.lineWidth   = _config.path.lineWidth;

        _context.beginPath();
        _context.moveTo(path[0].x, path[0].y);

        for (i = 1; i < pathAmount; i++) {
            _context.lineTo(path[i].x, path[i].y);
        }

        _context.closePath();
        _context.stroke();

        if (!filled) {
            _context.fill();
        }

        _context.restore();
    }

    // -----------------------------------------------------------------------------------------------------------------

    // Append module with public methods and properties
    ppv.appendModule({ canvasHelper: {
        init       : init,
        clean      : clean,
        drawCamera : drawCamera,
        drawGrid   : drawGrid,
        drawPoint  : drawPoint,
        drawPath   : drawPath
    }});
})(window.PPV);
