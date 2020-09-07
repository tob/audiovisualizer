# audiovisualizer
Experiments with audio and visualizations

Audiovisuals based on microphone input. 
Tested only on Chrome.

Doesn't require server, it's plain javascript and very little html.

multicanvas.js is where the drawing actually happens so start from there. 
The name multicanvas comes from an experiment drawing on different canvases but in the end I opted for using only one to not consume too many resources.

Every frame the setting layers are inspected to define the values of the shapes to draw.

## Dependencies
dragging layers: https://bevacqua.github.io/dragula/
custom fonts: https://fonts.google.com/
url shortener: https://rel.ink/api
