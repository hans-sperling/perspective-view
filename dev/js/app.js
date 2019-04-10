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
/**/
    map = [
        [1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1]
    ];
/**/
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    /*
    var position = { x : canvas.width  / 2 , y : canvas.height  / 2 },/**/
    var position = { x : 250 , y : 250 },/**/
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
                warped   : true,
                position : {
                    x : canvas.width  / 2,
                    y : canvas.height / 2
                }
            },
            render : {
                back        : false,
                camera      : false,
                front       : true,
                grid        : false,
                hiddenWalls : false,
                mode        : 'default', // flat, uniform, default
                walls       : true,
                wireFrame   : false
            },
            color : {
                mode        : 'default', // default, w.i.p
                objectColor : {
                  north : { r: 100, g: 200, b: 200, a: 1 },
                  east  : { r: 200, g: 100, b: 200, a: 1 },
                  south : { r: 200, g: 200, b: 100, a: 1 },
                  west  : { r: 100, g: 100, b: 200, a: 1 },
                  front : { r: 200, g: 100, b: 100, a: 1 },
                  back  : { r: 200, g: 200, b: 200, a: 1 }
                },
                spaceColor  : {r: 255, g: 255, b: 255, a: 0},
                lighting    : {
                    north  : -20,
                    east   : -10,
                    south  : 0,
                    west   : -15,
                    front  : 0,
                    back   : -20,
                    height : 2
                }
            }
        },
    ppv      = new PerspectiveView(config),
    gameLoop = new GameLoop(ppv, config);

    gameLoop.run();
});
