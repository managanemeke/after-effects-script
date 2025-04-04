// after-effects-script-to-tokens.jsx
(function() {
    var activeComp = app.project.activeItem;
    if (!activeComp || !(activeComp instanceof CompItem)) {
        alert("Откройте композицию!");
        return;
    }

    // Объект для хранения токенов
    var designTokens = {
        color: {},
        size: {},
        font: {}
    };

    // Парсим слои в композиции
    for (var i = 1; i <= activeComp.numLayers; i++) {
        var layer = activeComp.layer(i);
        var layerName = layer.name.toLowerCase();

        // Если слой — Shape (цвет)
        if (layerName.includes("color")) {
            try {
                var shapeGroup = layer.property("ADBE Root Vectors Group");
                var fill = shapeGroup.property("ADBE Vectors Group").property("ADBE Vector Graphic - Fill");
                var color = fill.property("ADBE Vector Fill Color").value;
                
                // Конвертируем цвет из [0..1] в HEX
                var hexColor = rgbToHex(color);
                designTokens.color[layerName] = hexColor;
            } catch (e) {}
        }

        // Если слой — Text (шрифт)
        else if (layerName.includes("font")) {
            try {
                var textProp = layer.property("ADBE Text Properties");
                var textDoc = textProp.property("ADBE Text Document").value;
                designTokens.font[layerName] = {
                    "fontSize": textDoc.fontSize,
                    "fontFamily": textDoc.fontFamily
                };
            } catch (e) {}
        }

        // Если слой — Solid (размер)
        else if (layerName.includes("size")) {
            designTokens.size[layerName] = {
                "width": layer.width,
                "height": layer.height
            };
        }
    }

    // Сохраняем JSON в файл
    var outputFile = new File("~/Desktop/ae-design-tokens.json");
    outputFile.open("w");
    outputFile.write(JSON.stringify(designTokens, null, 2));
    outputFile.close();

    alert("Токены экспортированы на Desktop: ae-design-tokens.json");

    // Вспомогательная функция: RGB [0..1] → HEX
    function rgbToHex(rgb) {
        var r = Math.round(rgb[0] * 255);
        var g = Math.round(rgb[1] * 255);
        var b = Math.round(rgb[2] * 255);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
})();
