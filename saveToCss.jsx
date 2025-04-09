(function() {
    var rootDirectory = app.project.file.parent;
    var stylesDirectory = rootDirectory.fsName + "/" + "styles";

    var targetLabel = 14;

    var projectItems = app.project.items;
    var cssData = "";

    for (var i = 1; i <= projectItems.length; i++) {
        var item = projectItems[i];
        if (item instanceof CompItem) {
            var comp = item;
            var compName = comp.name.replace(/\s+/g, '-').toLowerCase();
            for (var j = 1; j <= comp.numLayers; j++) {
                var layer = comp.layer(j);
                // if (layer.label != targetLabel) {
                //     return;
                // }
                cssData += getTextLayerIfItIs(layer);
            }
        }
    }
    saveUsCss(cssData);

    function getTextLayerIfItIs(layer, cssData) {
        var layerName;
        if (!(layer instanceof TextLayer)) {
            layerName = layer.name.replace(/\s+/g, '-').toLowerCase();
        }
        var scale = layer.transform.scale.value;
        var position = layer.transform.position.value;
        var width = layer.sourceRectAtTime(comp.time, false).width * scale[0] / 100;
        var height = layer.sourceRectAtTime(comp.time, false).height * scale[1] / 100;
        var topMargin = position[1] - (height / 2);
        var leftMargin = position[0] - (width / 2);
        topMargin = Math.round(topMargin);
        leftMargin = Math.round(leftMargin);
        width = Math.round(width);
        height = Math.round(height);
        var cssBlock = "#" + compName + "-" + layerName + " {\n" +
                        "  position: absolute;\n" +
                        "  top: " + topMargin + "px;\n" +
                        "  left: " + leftMargin + "px;\n" +
                        "  width: " + width + "px;\n" +
                        "  height: " + height + "px;\n" +
                        "}\n\n";
        return cssBlock;
    }

    function openStylesDirectory() {
        new Folder(stylesDirectory).execute();
    }

    function saveUsCss(cssData) {
        if (cssData) {
            var outputFolder = new Folder(stylesDirectory);
            if (!outputFolder.exists) {
                outputFolder.create();
            }
            var file = new File(outputFolder.fsName + "/" + "us.css");
            file.open("w");
            file.write(cssData);
            file.close();
            openStylesDirectory();
        } else {
            alert("Нет слоев с заданным цветовым лейблом.");
        }
    }
})();
