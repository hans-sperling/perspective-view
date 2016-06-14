jQuery(document).ready(function() {
    'use strict';

    var simpleMap    = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        realisticMap = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 1, 0, 1, 2, 1, 0, 1, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 3, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 0],
            [0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 1, 0, 2, 2, 2, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 2, 0, 2, 0, 2, 3, 0, 3, 0, 0],
            [0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 1, 2, 0, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 2, 3, 2, 1, 0, 1, 2, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0],
            [0, 0, 3, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 3, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        heightMap    = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 6, 4, 2, 0, 1, 0, 0, 1, 2, 0, 1, 0, 0],
            [0, 0, 1, 0, 4, 2, 1, 0, 2, 1, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 2, 1, 0, 0, 3, 2, 1, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 4, 3, 2, 1, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 3, 2, 1, 0, 0, 0, 1, 2, 3, 0, 1, 0, 0],
            [0, 0, 1, 0, 4, 3, 2, 1, 0, 0, 2, 3, 4, 0, 1, 0, 0],
            [0, 0, 1, 0, 5, 4, 3, 2, 1, 0, 3, 4, 5, 0, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        dummyMap     = [
            [11, 0,  31, 0,  51, 0,  71,  0],
            [ 0, 22,  0, 42,  0, 62,  0, 82],
            [13,  0, 33,  0, 53,  0, 73,  0],
            [ 0, 24,  0, 44,  0, 64,  0, 84],
            [15,  0, 35,  0, 55,  0, 75,  0],
            [ 0, 26,  0, 46,  0, 66,  0, 86],
            [17,  0, 37,  0, 57,  0, 77,  0],
            [ 0, 28,  0, 48,  0, 68,  0, 88]
        ],
        $canvas      = $('#PerspectiveView'),
        canvas       = $canvas[0],
        context      = canvas.getContext('2d');

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;


    var config = {
        canvas:         $canvas,
        context:        context,
        //depth:          0.05,
        //renderMode:     'specified',
        //renderMode:     'flat',
        //renderMode:     'unitary',
        //map:            realisticMap,
        map:            dummyMap,
        //map:            simpleMap,
        //map:            heightMap,
        //unitSize       : {x: 1,  y: 1},
        //unitScale      : 40
        //vanishingPoint : {x: 260, y: 180}
        vanishingPoint : {x: canvas.width/2, y: canvas.height/2}
    };

    var ppv = new PerspectiveView(config);

    ppv.render();
    console.dir(ppv);

});
