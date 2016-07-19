jQuery(document).ready(function() {
    'use strict';

    var map = [
            [2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3],
            [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 2, 1, 0, 1, 1, 0, 1],
            [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 3, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2],
            [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
            [1, 0, 1, 1, 0, 2, 2, 2, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 2, 0, 2, 0, 2, 3, 0, 3],
            [2, 0, 2, 2, 2, 2, 2, 2, 0, 1, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 2, 3, 2, 1, 0, 1, 2, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
            [3, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 3]
        ],
        $canvas      = $('#PerspectiveView'),
        canvas       = $canvas[0],
        context      = canvas.getContext('2d');

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    var position = { x : 650, y : 750 },
        c        = 0.0027777777777778, // 1 / 360
        m        = 1,
        i        = -(c * m),
        j        = -(c * m),
        config   = {
            canvas    : canvas,
            context   : context,
            map       : map,
            unitSize  : 100,
            unitDepth : 1.1,
            position  : position,
            camera    : {
                width    : canvas.width,
                height   : canvas.height,
                position : {
                    x : canvas.width  / 2,
                    y : canvas.height / 2
                }
            },
            render : {
                mode      : 'normal', // flat, normal, uniform
                wireFrame : false,
                grid      : false,
                camera    : false
            }
        },
        ppv = new PerspectiveView(config);

    (function loop() {
        i += (c * m);
        j += (c * m);

        ppv.update({
            position : {
                x : position.x + Math.floor(Math.cos(Math.PI * i) * 200),
                y : position.y + Math.floor(Math.sin(Math.PI * j) * 200)
            }
        });

        ppv.render();

        window.requestAnimFrame(loop);
    })();
});
