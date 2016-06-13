;(function map(win, doc, ppv) {
    'use strict';

    var mapArray = [[0]];


    function setMap(map) {
        mapArray = map;
    }


    function getMapArea() {
        return mapArray;
    }

    // -----------------------------------------------------------------------------------------------------------------

    // Append module with public methods and properties
    ppv.appendModule({ map : {
        setMap     : setMap,
        getMapArea : getMapArea
    }});

    // -----------------------------------------------------------------------------------------------------------------

})(window, document, window.PPV);