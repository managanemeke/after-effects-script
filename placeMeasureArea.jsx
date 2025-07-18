(function () {
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    app.beginUndoGroup("Create Shape Coverage Setup");

    // === 1. Create Shape Layer ===
    var shapeLayer = comp.layers.addShape();
    shapeLayer.name = "Shape Layer 1";

    var contents = shapeLayer.property("Contents");
    var rectGroup = contents.addProperty("ADBE Vector Group");
    rectGroup.name = "Rectangle 1";

    // Add rectangle path and set size to comp dimensions
    var rectPath = rectGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rectPath.property("Size").setValue([comp.width, comp.height]);

    // Add Fill with color #FF0096
    var fill = rectGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    fill.property("Color").setValue([1, 0, 0.588]); // #FF0096 in RGB (0–1)

    // === 2. Create Text Layer ===
    var textLayer = comp.layers.addText("Coverage %");
    textLayer.name = "Coverage Text";

    // === 3. Add Layer Control Effect ===
    var layerControl = textLayer.property("Effects").addProperty("ADBE Layer Control");
    layerControl.name = "Layer Control";

    // Link Layer Control to the shape layer
    layerControl.property("Layer").setValue(shapeLayer.index);

    // === 4. Apply Expression to Source Text ===
    var expression = 
        'l = effect("Layer Control")("Layer");\n' +
        'if (l != null && l.content("Rectangle 1") != null) {\n' +
        '    w = l.content("Rectangle 1").content("Rectangle Path 1").size[0];\n' +
        '    h = l.content("Rectangle 1").content("Rectangle Path 1").size[1];\n' +
        '    scaleLayerX = l.transform.scale[0] / 100;\n' +
        '    scaleLayerY = l.transform.scale[1] / 100;\n' +
        '    scaleGroup = l.content("Rectangle 1").transform.scale[0] / 100;\n' +
        '    S_block = w * scaleLayerX * scaleGroup * h * scaleLayerY * scaleGroup;\n' +
        '    S_comp = thisComp.width * thisComp.height;\n' +
        '    S_percent = Math.abs(S_block / S_comp * 100);\n' +
        '    S_percent.toFixed(1) + "%";\n' +
        '} else {\n' +
        '    "No layer"\n' +
        '}';

    textLayer.property("Source Text").expression = expression;

    app.endUndoGroup();
})();
