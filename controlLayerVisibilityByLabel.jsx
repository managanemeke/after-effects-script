(function () {
    // Function to get the label color index based on the color name
    function getLabelColorIndex(colorName) {
        var labelColors = {
            "Red Pigment": 1, "Sunflower": 2, "Mediterranean Sea": 3, "Bara Red": 4, 
            "Lavender Tea": 5, "Radiant Yellow": 6, "Turkish Aqua": 7, "Merchant Marine Blue": 8, 
            "Android Green": 9, "Nasu Purple": 10, "Puffins Bill": 11, "Pencil Lead": 12, 
            "Very Berry": 13, "Blue Martina": 14, "Forgotten Purple": 15, "Pixelated Grass": 16
        };
        return labelColors[colorName] || null;
    }

    // Function to set layer visibility in all compositions
    function setLayerVisibilityInAllComps(colorName, action) {
        if (app.project.numItems === 0) {
            alert("No compositions found in the project!");
            return;
        }

        var colorIndex = getLabelColorIndex(colorName);
        if (!colorIndex) {
            alert("Invalid color name!");
            return;
        }

        var enableLayer = (action.toLowerCase() === "enable");

        app.beginUndoGroup("Set Layer Visibility by Color in All Comps");

        // Iterate through all items in the project
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof CompItem) {
                // Iterate through all layers in the composition
                for (var j = 1; j <= item.numLayers; j++) {
                    var layer = item.layer(j);
                    if (layer.label === colorIndex) {
                        layer.enabled = enableLayer;
                    }
                }
            }
        }

        app.endUndoGroup();
        alert("Layers updated in all compositions.");
    }

    // Create a window for the GUI
    var win = new Window("palette", "Set Layer Visibility", undefined);
    win.orientation = "column";

    // Dropdown for selecting the label color
    var colorGroup = win.add("group");
    colorGroup.add("statictext", undefined, "Select Label Color:");
    var colorDropdown = colorGroup.add("dropdownlist", undefined, [
        "Red Pigment", "Sunflower", "Mediterranean Sea", "Bara Red", 
        "Lavender Tea", "Radiant Yellow", "Turkish Aqua", "Merchant Marine Blue", 
        "Android Green", "Nasu Purple", "Puffins Bill", "Pencil Lead", 
        "Very Berry", "Blue Martina", "Forgotten Purple", "Pixelated Grass"
    ]);
    colorDropdown.selection = 0; // Default to the first color (Red Pigment)

    // Group for Enable/Disable buttons
    var buttonGroup = win.add("group");
    
    // Enable button
    var enableButton = buttonGroup.add("button", undefined, "Enable Layers");
    enableButton.onClick = function () {
        var selectedColor = colorDropdown.selection.text;
        setLayerVisibilityInAllComps(selectedColor, "Enable");
    };

    // Disable button
    var disableButton = buttonGroup.add("button", undefined, "Disable Layers");
    disableButton.onClick = function () {
        var selectedColor = colorDropdown.selection.text;
        setLayerVisibilityInAllComps(selectedColor, "Disable");
    };

    // Show the GUI
    win.center();
    win.show();
})();
