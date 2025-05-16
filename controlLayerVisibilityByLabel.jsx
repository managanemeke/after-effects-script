(function() {
    // Проверка доступности After Effects
    if (typeof app === 'undefined' || !app.project) {
        alert("Ошибка: After Effects не запущен или проект не открыт");
        return;
    }

    // Функция безопасного получения цветов меток
    function getLabelColors() {
        try {
            // Альтернативный способ получить цвета меток
            var colors = [];
            for (var i = 0; i < 16; i++) {
                colors.push(app.project.label(i + 1).color);
            }
            return colors;
        } catch (e) {
            // Если не сработало - возвращаем стандартные цвета AE
            return [
                [0.63, 0.13, 0.13], [0.85, 0.27, 0.27], [0.16, 0.49, 0.65],
                [0.89, 0.27, 0.58], [0.62, 0.36, 0.68], [0.98, 0.73, 0.02],
                [0.02, 0.66, 0.62], [0.16, 0.36, 0.59], [0.4, 0.8, 0.22],
                [0.5, 0.2, 0.6], [0.9, 0.5, 0.2], [0.3, 0.3, 0.3],
                [0.8, 0.2, 0.4], [0.2, 0.6, 0.8], [0.5, 0.3, 0.7], [0.3, 0.7, 0.4]
            ];
        }
    }

    // Получаем цвета меток
    var labelColors = getLabelColors();
    var availableLabels = [];

    // Формируем список доступных меток
    for (var i = 0; i < labelColors.length; i++) {
        availableLabels.push({
            index: i + 1,
            color: labelColors[i],
            name: "Label " + (i + 1)
        });
    }

    // Функция изменения видимости слоёв
    function setLayerVisibility(labelIndex, action) {
        if (!app.project || app.project.numItems === 0) {
            alert("В проекте нет композиций!");
            return;
        }

        var enable = (action === "enable");
        app.beginUndoGroup((enable ? "Включение" : "Отключение") + " слоёв с меткой " + labelIndex);

        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof CompItem) {
                for (var j = 1; j <= item.numLayers; j++) {
                    var layer = item.layer(j);
                    if (layer.label === labelIndex) {
                        layer.enabled = enable;
                    }
                }
            }
        }

        app.endUndoGroup();
        alert("Слои с меткой " + labelIndex + " были " + (enable ? "включены" : "отключены"));
    }

    // Создаём интерфейс
    var win = new Window("palette", "Управление слоями по меткам", undefined, {
        borderless: true
    });
    win.orientation = "column";
    win.spacing = 10;
    win.margins = 15;

    // Выбор метки
    var labelGroup = win.add("group");
    labelGroup.add("statictext", undefined, "Выберите метку:");
    var dropdown = labelGroup.add("dropdownlist", undefined,
        availableLabels.map(function(label) {
            return label.name;
        })
    );
    dropdown.selection = 0;

    // Кнопки управления
    var btnGroup = win.add("group");
    btnGroup.alignment = "center";

    var enableBtn = btnGroup.add("button", undefined, "Включить");
    enableBtn.onClick = function() {
        setLayerVisibility(dropdown.selection.index + 1, "enable");
    };

    var disableBtn = btnGroup.add("button", undefined, "Отключить");
    disableBtn.onClick = function() {
        setLayerVisibility(dropdown.selection.index + 1, "disable");
    };

    win.center();
    win.show();
})();