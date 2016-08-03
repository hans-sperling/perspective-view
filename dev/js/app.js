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

    var position = { x : 850, y : 750 },
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
                back        : false,
                camera      : true,
                front       : true,
                grid        : true,
                hiddenWalls : false,
                mode        : 'default', // flat, uniform, default
                walls       : true,
                wireFrame   : !false
            },
            color : {
                mode        : 'default', // default, w.i.p
                objectColor : {r: 200, g: 200, b: 200, a: 1},
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
    ppv      = new PerspectiveView(config),
    gameLoop = new GameLoop(ppv, config);

    gameLoop.run();
});
