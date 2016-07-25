
function GameLoop(ppv) {
    var config = {
            isLooping : true,
            maxFrames : -1,
            desiredFrameRate : 60
        },
        frameStep    = 0,
        frameCounter = 0,
        desiredFrameCounter = 0,
        now,
        dt           = 0,
        last         = timestamp(),
        c            = 0.0027777777777778, // 1 / 360
        i            = -(c),
        renderConfig = {
            position : ppv.getConfig().position
        },
        stats =  {
            fps : new Stats(),
            ms  : new Stats()
        };


        stats.fps.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        stats.ms.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom


        var DOM_A = document.body.appendChild(stats.fps.dom);
        var DOM_B = document.body.appendChild(stats.ms.dom);

    DOM_A.style.top ='0px';
    DOM_B.style.top ='50px';


    function timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }


    function getShiftPosition(pxPerSec, dt) {
        return (pxPerSec / config.desiredFrameRate) + ((pxPerSec / config.desiredFrameRate) * dt);
    }


    function getCircleShiftPositionX(sec, dt) {
        var degPerFrame = 360 / (((config.desiredFrameRate) / (frameStep * sec)) );

        // cos(RAD_0) = 1, cos(RAD_90) = 0; cos(RAD_180) = -1, cos(RAD_270) = 0
        // console.log(Math.cos(Math.radians(0)));
        // console.log(Math.cos(Math.radians(360)));

        //console.log(Math.round(Math.cos(Math.radians(270))));


        return Math.cos(Math.radians(degPerFrame));
    }


    function getCircleShiftPositionY(sec, dt) {
        var degPerFrame = 360 / ((config.desiredFrameRate / frameStep) * sec);

        return Math.sin(Math.radians(degPerFrame));
    }











var n = 0, m = 0;
    var startPosition = ppv.getConfig().position;


    /*var int = setInterval*/(function frame() {
        now   = timestamp();
        delta = ((now - last) / 1000);
        dt    = (dt + Math.min(1, delta));
        fps   = (1 / delta);

        stats.fps.begin();
        stats.ms.begin();

        frameCounter++;




        while (dt > (1 / config.desiredFrameRate)) {
            dt = dt - (1 / config.desiredFrameRate);
            frameStep  = (frameStep + 1) % config.desiredFrameRate;
            desiredFrameCounter++;

            //renderConfig.position.x += getShiftPosition(100, dt);
            //renderConfig.position.y += getShiftPosition(0, dt);

            n = getCircleShiftPositionX(4, dt);
            m = getCircleShiftPositionY(dt);

/*
            renderConfig = {
                position: getRotatePosition(renderConfig.position, dt)
            };
*/
        }


      //  x = position.x + Math.floor(Math.cos(Math.PI * i) * 200),
        renderConfig = {
            position : {
                x: startPosition.x + (n * 50),
                //y: startPosition.y + (m * 50)
            }
        };



        //console.log(n);

        //n = 0;
        ppv.update(renderConfig);
        ppv.render();


        stats.fps.end();
        stats.ms.end();
        if ((config.isLooping && config.maxFrames == -1) || (desiredFrameCounter < config.maxFrames)) {

            last = now;

            //console.log(frameCounter, ' :: ', delta, ' :: ' , Math.round(fps));
            //console.log(frameCounter, ' ::');
            requestAnimFrame(frame);

        }
        else {
            console.log(ppv.getConfig().position.x);
            //clearTimeout(int);
            //int = null;

        }
    }/*, 1000 / 25*/)();

    
}
