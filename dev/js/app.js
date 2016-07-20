jQuery(document).ready(function() {
    'use strict';

    var map     = [
            [2,   1,   1,   1,   1,   1,   2,   1,   1,   1,   1,   1,   3],
            [1,   0,   0,   0,   0,   0, [1,2], 0,   0,   0,   0,   0,   1],
            [1,   0,   1,   1,   0,   1,   2,   1,   0,   1,   1,   0,   1],
            [1,   0,   2,   0,   0,   0,   0,   0,   0,   0,   0,   0,   1],
            [1,   0, [1,3], 0,   2,   0,   2,   3, [1,4], 3,   4,   0,   2],
            [1,   0,   2,   0,   0,   0,   0,   0,   0,   0,   3,   0,   1],
            [1,   0,   1,   1,   0,   1,   2,   3,   0,   0, [2,3], 0,   1],
            [1,   0,   0,   0,   0,   2,   4,   5,   0,   2,   3,   0,   3],
            [2,   0,   2,   2,   2,   3,   5,   6,   0,   1,   2,   0,   1],
            [1,   0,   0,   0,   0, [2,3], 0,   0,   0,   0,   1,   0,   1],
            [1,   0,   2, [1,3], 2,   3,   0,   1,   2,   0,   1,   0,   1],
            [1,   0,   0,   0,   0,   0,   0,   0, [1,2], 0,   0,   0,   1],
            [3,   1,   1,   2,   1,   1,   1,   1,   2,   1,   1,   1,   3]
        ],
        $canvas = $('#PerspectiveView'),
        canvas  = $canvas[0],
        context = canvas.getContext('2d');

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    var position = { x : 650, y : 750 },
        looping  = 1,
        c        = 0.0027777777777778, // 1 / 360
        m        = 1,                  // multiplier to rotate faster
        i        = -(c * m),           // Initial circle position x
        j        = -(c * m),           // Initial circle position y
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
                mode      : 'default', // flat, default, uniform
                wireFrame : false,
                grid      : false,
                camera    : false
            },
            color : {
                mode        : 'default', // default, w.i.p
                objectColor : {r: 200, g: 200, b: 200, a: 0.5},
                spaceColor  : {r: 255, g: 255, b: 255, a: 0},
                lighting    : {
                    back   : -20,
                    east   : -10,
                    front  : 0,
                    height : 2,
                    north  : -20,
                    south  : 0,
                    west   : -15
                }
            }
        },
        ppv = new PerspectiveView(config);

    (function loop() {
        i += (c * m);
        j += (c * m);


        if (looping) {
            ppv.update({
                position : {
                    x : position.x + Math.floor(Math.cos(Math.PI * i) * 200),
                    y : position.y + Math.floor(Math.sin(Math.PI * j) * 200)
                }
            });
        }

        ppv.render();

        if (looping) {
            window.requestAnimFrame(loop);
        }
    })();
});
