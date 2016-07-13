jQuery(document).ready(function() {
    'use strict';

    var dummyMap0     = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        dummyMap1     = [
            [1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1]
        ],
        dummyMap2     = [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1]
        ],
        dummyMap3     = [
            [1, 0, 1, 0, 1],
            [0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1],
            [0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1]
        ],
        $canvas      = $('#PerspectiveView'),
        canvas       = $canvas[0],
        context      = canvas.getContext('2d');

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;


    var config = {
        canvas    : canvas,
        context   : context,
        map       : dummyMap3,
        unitSize  : 100,
        unitDepth : 1.0,
        position  : {x : 0, y : 0},
        camera    : {
            width    : 900,
            height   : 900,
            position : {
                x : canvas.width  / 2,
                y : canvas.height / 2
            }
        }
    };

    var ppv = new PerspectiveView(config);

    var c = 0.0027777777777778, m = 2, i = -(c * m), j = -(c * m);

    (function loop() {
        i += (c * m) * 2;
        j += (c * m) * 3;

        ppv.render({
            position : {
                x : Math.cos(Math.PI * i) * 50,
                y : Math.sin(Math.PI * j) * 50
            }
        });


        //window.requestAnimFrame(loop);

    })();



});
