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
            [2, 0, 2, 0, 2],
            [0, 0, 0, 0, 0],
            [1, 0, 2, 0, 1],
            [0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1]
        ],
        dummyMap4= [
            [1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0]
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
        unitDepth : 1.1,
        position  : {x : 250, y : 250},
        camera    : {
            width    : 1000,
            height   : 1000,
            position : {
                //*
                x : canvas.width  / 2,
                y : canvas.height / 2
                /**/
                /*
                x : 0,
                y : 0
                /**/
            }
        }
    };

    var ppv = new PerspectiveView(config);

    var position = {x : 250, y : 250},
        c = 0.0027777777777778, m = 2, i = -(c * m), j = -(c * m);

    (function loop() {
        i += (c * m) * 1;
        j += (c * m) * 1;
        //console.log(Math.cos(Math.PI * i) * 50)

        //*
        ppv.update({
            position : {
                x : 250 + Math.cos(Math.PI * i) * 100,
                y : 250+ Math.sin(Math.PI * j) * 100
            }
        });
        /**/
        ppv.render();


        window.requestAnimFrame(loop);

    })();



});
