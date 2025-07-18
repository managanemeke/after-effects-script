(function () {
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    app.beginUndoGroup("Create Shape Coverage Setup");

    var shapeLayer = comp.layers.addShape();
    shapeLayer.name = "measure-area-shape";

    var contents = shapeLayer.property("Contents");
    var rectGroup = contents.addProperty("ADBE Vector Group");
    rectGroup.name = "measure-area-group";

    var rectPath = rectGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rectPath.property("Size").setValue([comp.width, comp.height]);

    var fill = rectGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    fill.property("Color").setValue([1, 0, 0.588]);

    var textLayer = comp.layers.addText("Coverage %");
    textLayer.name = "Coverage Text";

    var layerControl = textLayer.property("Effects").addProperty("ADBE Layer Control");
    layerControl.name = "Layer Control";

    layerControl.property("Layer").setValue(shapeLayer.index);

    var expression = 
        'l = effect("Layer Control")("Layer");\n' +
        'if (l != null && l.content("measure-area-group") != null) {\n' +
        '    w = l.content("measure-area-group").content("Rectangle Path 1").size[0];\n' +
        '    h = l.content("measure-area-group").content("Rectangle Path 1").size[1];\n' +
        '    scaleLayerX = l.transform.scale[0] / 100;\n' +
        '    scaleLayerY = l.transform.scale[1] / 100;\n' +
        '    scaleGroup = l.content("measure-area-group").transform.scale[0] / 100;\n' +
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
