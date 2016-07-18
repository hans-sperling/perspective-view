# Perspective-view

Delivers a simple javascript methods pool for rendering grid based (array) maps into a virtual, perspective, 3d top view
with canvas.

[Visual description](https://raw.githubusercontent.com/hans-sperling/perspective-view/master/dev/img/visual-description.png)


## Initialize

```javascript
var config = {
    canvas    : document.getElementById('myCanvas'), // HTML Object of the canvas
    context   : canvas.getContext('2d'),             // The 2d context of the canvas 
    map       : [                                    // Your complete map
        [2, 0, 1, 0, 2], 
        [0, 0, 0, 0, 0],
        [1, 0, 3, 0, 1],
        [0, 0, 0, 0, 0],
        [2, 0, 1, 0, 2]],
        unitSize  : 100,                             // Sze of a cel in the grid
        unitDepth : 1.1,                             // Factor to set the depth (height) of an object
        position  : {                                // Position on the map in px for the center of the visible part
        x : 250,
        y : 250
    },
    camera    : {
        width    : 800,                              // canvas.width
        height   : 600,                              // canvas.height
        position : {
            x : 400,                                 // (canvas.width  / 2)
            y : 300                                  // (canvas.height / 2)
        }
    }
}

var ppv = new PerspectiveView(config);               // Create an instance of perspective-view with your config

ppv.render();                                        // Render the perspective-view of the given map

```


## Methods

### update(config);
- Argument(s): `object` **config** - Properties to update; will be merged with all existing properties
- Return: `void`

**Example**:
```javascript
    ppv.update({
        position : { x : 252, y : 250 }
    }); 
```

### render()

- Argument(s): `void`
- Return: `void`

**Example**:
```javascript
    ppv.render(); 
```