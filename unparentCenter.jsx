// Set the desired label color (replace 'labelIndex' with the index of the color you want)
var labelIndex = 14; // Change this value (1-16) for your desired label color (1 = Red, 16 = Violet)

// Get the project
var project = app.project;

// Ensure there's an open project
if (project) {
    app.beginUndoGroup("Unparent Layers by Label Color and Set Anchor Point to Center for All Compositions");

    // Loop through all items in the project
    for (var j = 1; j <= project.items.length; j++) {
        var item = project.items[j];

        // Check if the item is a composition
        if (item instanceof CompItem) {
            var comp = item;
            
            // Loop through all layers in the composition
            for (var i = 1; i <= comp.numLayers; i++) {
                var layer = comp.layer(i);

                // Check if the layer's label color matches the specified label color
                if (layer.label === labelIndex) {

                    // Step 1: Unparent the layer
                    layer.parent = null;

                    // Step 2: Set the anchor point to the center of the layer without moving it
                    var curTime = comp.time;
                    var layerAnchor = layer.anchorPoint.value;
                    var x, y;

                    try {
                        // For text layers, use sourceRectAtTime to handle multi-line and bounding box sizes
                        var rect = layer.sourceRectAtTime(curTime, false);

                        // Calculate the center of the text bounding box
                        x = rect.width / 2 + rect.left;
                        y = rect.height / 2 + rect.top;
                    } catch (e) {
                        // For non-text layers: calculate based on sourceRectAtTime (general case)
                        var rect = layer.sourceRectAtTime(curTime, false);
                        x = rect.width / 2 + rect.left;
                        y = rect.height / 2 + rect.top;
                    }

                    // Calculate the difference between the current anchor point and the new center
                    var xAdd = (x - layerAnchor[0]) * (layer.scale.value[0] / 100);
                    var yAdd = (y - layerAnchor[1]) * (layer.scale.value[1] / 100);

                    // Set the new anchor point to the center
                    layer.anchorPoint.setValue([x, y]);

                    // Get the current position and adjust it to prevent visual shift
                    var layerPosition = layer.position.value;
                    layer.position.setValue([layerPosition[0] + xAdd, layerPosition[1] + yAdd, layerPosition[2]]);
                }
            }
        }
    }

    app.endUndoGroup();
} else {
    alert("Please select a project first.");
}
