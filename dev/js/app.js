jQuery(document).ready(function() {
    'use strict';

    var map     = [
            [2, 1, 1,     1,     1, 1,      2,     1,     1,     1, 1, 1, 3],
            [1, 0, 0,     0,     0, 0,      [1,2], 0,     0,     0, 0, 0, 1],
            [1, 0, 1,     1,     0, 1,      2,     1,     0,     1, 1, 0, 1],
            [1, 0, 2,     0,     0, 0,      0,     0,     0,     0, 0, 0, 1],
            [1, 0, [1,3], 0,     2, 0,      2,     2,     [1,2], 2, 2, 0, 2],
            [1, 0, 2,     0,     0, 0,      0,     0,     0,     0, 2, 0, 1],
            [1, 0, 1,     1,     0, 2,      [1,2], 2,     0,     0, 0, 0, 1],
            [1, 0, 0,     0,     0, [1,2], 0,      [1,2], 0,     2, 3, 0, 3],
            [2, 0, 2,     2,     2, 2,      [1,2], 2,     0,     1, 2, 0, 1],
            [1, 0, 0,     0,     0, 0,      0,     0,     0,     0, 1, 0, 1],
            [1, 0, 2,     [1,3], 2, 1,      0,     1,     2,     0, 1, 0, 1],
            [1, 0, 0,     0,     0, 0,      0,     0,     [1,2], 0, 0, 0, 1],
            [3, 1, 1,     2,     1, 1,      1,     1,     2,     1, 1, 1, 3]
        ],
        $canvas = $('#PerspectiveView'),
        canvas  = $canvas[0],
        context = canvas.getContext('2d');

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    var position = { x : 650, y : 750 },
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
                mode      : 'normal', // flat, normal, uniform
                wireFrame : false,
                grid      : false,
                camera    : false
            },
            color : {
                mode          : 'lightingColor', // color, lightingColor/normal
                lightingColor : {
                    color    : {r: 200, g: 200, b: 200, a: 1},
                    lighting : {
                        back  : 0,
                        east  : 0.8,
                        front : 0.9,
                        north : 0.7,
                        south : 0.85,
                        space : 0.9,
                        west  : 0.75
                    }
                },
                color          : {
                    back  : {r: 150, g: 150, b: 150, a: 1}, // Not necessary but useful in wireFrame mode for coloring
                    east  : {r: 159, g: 159, b: 159, a: 1},
                    front : {r: 207, g: 207, b: 207, a: 1},
                    north : {r: 127, g: 127, b: 127, a: 1},
                    south : {r: 223, g: 223, b: 223, a: 1},
                    space : {r: 255, g: 255, b: 255, a: 0}, // Not necessary because we won't show any color in space
                    west  : {r: 191, g: 191, b: 191, a: 1}
                }
            }
        },
        ppv = new PerspectiveView(config);

    (function loop() {
        i += (c * m);
        j += (c * m);

        /*
        ppv.update({
            position : {
                x : position.x + Math.floor(Math.cos(Math.PI * i) * 200),
                y : position.y + Math.floor(Math.sin(Math.PI * j) * 200)
            }
        });
        /**/

        ppv.render();

        //window.requestAnimFrame(loop);
    })();
});
