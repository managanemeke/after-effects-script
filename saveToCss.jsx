(function() {
    // Указываем цветовой лейбл для поиска слоев
    var targetLabel = 1; // Здесь используем лейбл с индексом 5 (вы можете изменить это на нужный вам лейбл)

    // Получаем все композиции в проекте
    var projectItems = app.project.items;
    var cssData = "";

    // Перебираем все элементы в проекте
    for (var i = 1; i <= projectItems.length; i++) {
        var item = projectItems[i];

        // Проверяем, является ли элемент композицией
        if (item instanceof CompItem) {
            var comp = item;
            var compName = comp.name.replace(/\s+/g, '-').toLowerCase(); // Форматируем название композиции для CSS

            // Добавляем название композиции в комментарий
            cssData += "/* " + comp.name + " */\n\n";

            // Перебираем все слои в композиции
            for (var j = 1; j <= comp.numLayers; j++) {
                var layer = comp.layer(j);

                alert(layer.label);
                if (layer instanceof ShapeLayer) {
                    alert("ShapeLayer");
                }
                alert(layer.name);

                // Проверяем, имеет ли слой нужный цветовой лейбл
                if (layer.label == targetLabel) {
                    var scale = layer.transform.scale.value;
                    var position = layer.transform.position.value;
                    var width = layer.sourceRectAtTime(comp.time, false).width * scale[0] / 100;
                    var height = layer.sourceRectAtTime(comp.time, false).height * scale[1] / 100;
                    var topMargin = position[1] - (height / 2);
                    var leftMargin = position[0] - (width / 2);

                    // Округляем значения
                    topMargin = Math.round(topMargin);
                    leftMargin = Math.round(leftMargin);
                    width = Math.round(width);
                    height = Math.round(height);

                    // Если это текстовый слой, используем "text" в качестве идентификатора
                    var layerName = "text";
                    if (!(layer instanceof TextLayer)) {
                        layerName = layer.name.replace(/\s+/g, '-').toLowerCase(); // Для других слоев используем имя слоя
                    }

                    // Формируем CSS данные для текущего слоя
                    var cssBlock = "#" + compName + "-" + layerName + " {\n" + // Добавляем название композиции
                                   "  top: " + topMargin + "px;\n" +
                                   "  left: " + leftMargin + "px;\n" +
                                   "  width: " + width + "px;\n" +
                                   "  height: " + height + "px;\n" +
                                   "}\n\n";
                    cssData += cssBlock;
                }
            }
        }
    }

    // Записываем результат в файл CSS
    if (cssData) {
        // Используем правильное обращение к Folder.desktop
        var file = new File(Folder.desktop.fullName + "/photo_layer_styles.css"); // Убедитесь, что используется fullName
        file.open("w");
        file.write(cssData);
        file.close();
        alert("CSS файл создан на рабочем столе!");
    } else {
        alert("Нет слоев с заданным цветовым лейблом.");
    }
})();
