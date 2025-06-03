(function myNightScriptPanel(thisObj) {
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Тёмная ночь...", undefined, {resizeable:true});

        var grp = win.add("group", undefined);
        grp.orientation = "column";
        grp.alignChildren = ["fill", "top"];

        grp.add("statictext", undefined, "Настройки:");

        // Чекбоксы для Каширка и Красна Пресня
        var specialChkGrp = grp.add("group");
        specialChkGrp.orientation = "row";
        var kashirkaChk = specialChkGrp.add("checkbox", undefined, "Каширка (15с / 3с)");
        var presnyaChk = specialChkGrp.add("checkbox", undefined, "Красна Пресня (65с / 7.5с)");

        var durationGrp = grp.add("group");
        durationGrp.add("statictext", undefined, "Длительность (сек):");
        var durationInput = durationGrp.add("edittext", undefined, "60");
        durationInput.characters = 5;

        var fadeGrp = grp.add("group");
        fadeGrp.add("statictext", undefined, "Затухание (сек):");
        var fadeInput = fadeGrp.add("edittext", undefined, "10");
        fadeInput.characters = 5;

        var freezeGrp = grp.add("group");
        freezeGrp.add("statictext", undefined, "Заморозить время (сек):");
        var freezeInput = freezeGrp.add("edittext", undefined, "4");
        freezeInput.characters = 5;

        // Взаимно исключающие чекбоксы затемнения
        var darkenCheckbox = grp.add("checkbox", undefined, "Затемнить (90%)");
        var sinaleCheckbox = grp.add("checkbox", undefined, "Сина затемнить (68%)");

        // Взаимное исключение для двух чекбоксов затемнения
        darkenCheckbox.onClick = function() {
            if (darkenCheckbox.value) {
                sinaleCheckbox.value = false;
            }
        };

        sinaleCheckbox.onClick = function() {
            if (sinaleCheckbox.value) {
                darkenCheckbox.value = false;
            }
        };

        // Взаимное исключение для Каширка и Красна Пресня
        kashirkaChk.onClick = function() {
            if (kashirkaChk.value) {
                presnyaChk.value = false;
                durationInput.enabled = false;
                fadeInput.enabled = false;
                durationInput.text = "15";
                fadeInput.text = "3";
            } else {
                if (!presnyaChk.value) {
                    durationInput.enabled = true;
                    fadeInput.enabled = true;
                }
            }
        };

        presnyaChk.onClick = function() {
            if (presnyaChk.value) {
                kashirkaChk.value = false;
                durationInput.enabled = false;
                fadeInput.enabled = false;
                durationInput.text = "65";
                fadeInput.text = "7.5";
            } else {
                if (!kashirkaChk.value) {
                    durationInput.enabled = true;
                    fadeInput.enabled = true;
                }
            }
        };

        var btnGroup = grp.add("group");
        btnGroup.orientation = "row";

        var createNightBtn = btnGroup.add("button", undefined, "Создать ночь");
        var renderFrameBtn = btnGroup.add("button", undefined, "Рендерить средний кадр");

        createNightBtn.onClick = function() {
            var newDuration = parseFloat(durationInput.text);
            var fadeDuration = parseFloat(fadeInput.text);
            var freezeTime = parseFloat(freezeInput.text);
            var darken = darkenCheckbox.value;
            var sinale = sinaleCheckbox.value;

            if (isNaN(newDuration) || isNaN(fadeDuration) || isNaN(freezeTime)) {
                alert("А ничо то факт, что надо вводить нормальные числа для длительности, затухания и заморозки времени?");
                return;
            }

            createNightCompositions(newDuration, fadeDuration, freezeTime, darken, sinale);
        };

        renderFrameBtn.onClick = function() {
            saveMiddleFrameAuto();
        };

        win.layout.layout(true);
        win.layout.resize();
        win.
		onResizing = win.onResize = function () { this.layout.resize(); };

        return win;
    }

    function createNightCompositions(newDuration, fadeDuration, freezeTime, darken, sinale) {
        var compItems = app.project.selection;
        if (compItems.length === 0) {
            alert("О ЭМ ДЖИ дог, выбери хотя бы одну композицию.");
            return;
        }

        app.beginUndoGroup("Создать ночь");

        for (var i = 0; i < compItems.length; i++) {
            var originalComp = compItems[i];
            if (!(originalComp instanceof CompItem)) continue;

            var nightFolder = getOrCreateNightFolderIn(originalComp.parentFolder);
            var compName = originalComp.name + "_ночь";

            var newComp = app.project.items.addComp(
                compName,
                originalComp.width,
                originalComp.height,
                originalComp.pixelAspect,
                newDuration,
                originalComp.frameRate
            );
            newComp.parentFolder = nightFolder;

            var layer = newComp.layers.add(originalComp);
            layer.timeRemapEnabled = true;
            var remap = layer.property("ADBE Time Remapping");

            var freezeTimeClamped = Math.min(freezeTime, originalComp.duration);
            remap.setValueAtTime(0, freezeTimeClamped);
            remap.setValueAtTime(newDuration, freezeTimeClamped);

            for (var k = remap.numKeys; k >= 1; k--) {
                var t = remap.keyTime(k);
                if (t !== 0 && t !== newDuration) remap.removeKey(k);
            }

            layer.inPoint = 0;
            layer.outPoint = newComp.duration;

            var opacity = layer.property("ADBE Transform Group").property("ADBE Opacity");
            var maxOpacity = sinale ? 68 : (darken ? 90 : 100);

            opacity.setValueAtTime(0, 0);
            opacity.setValueAtTime(fadeDuration, maxOpacity);
            opacity.setValueAtTime(newDuration - fadeDuration, maxOpacity);
            opacity.setValueAtTime(newDuration, 0);
        }

        app.endUndoGroup();
        alert("Питичка в клетке");
    }

    function getOrCreateNightFolderIn(parentFolder) {
        var nightFolderName = "#ночь";
        for (var i = 1; i <= parentFolder.numItems; i++) {
            var item = parentFolder.item(i);
            if (item instanceof FolderItem && item.name === nightFolderName) {
                return item;
            }
        }
        return parentFolder.items.addFolder(nightFolderName);
    }

    function saveMiddleFrameAuto() {
        var compItems = app.project.selection;
        if (compItems.length === 0) {
            alert("О ЭМД ЖИ дог, выбери хотя бы одну композицию.");
            return;
        }

        app.beginUndoGroup("Save Middle Frame via Render Queue");

        for (var i = 0; i < compItems.length; i++) {
            var comp = compItems[i];
            if (!(comp instanceof CompItem)) {
                alert("Выделены не все композиции, пропускаем элемент №" + (i + 1));
                continue;
            }

            var rqItem = app.project.renderQueue.items.add(comp);

            var middleTime = comp.duration / 2;

            rqItem.timeSpanStart = middleTime;
            rqItem.timeSpanDuration = comp.frameDuration;

            var outputModule = rqItem.outputModule(1);

            var projectFolder = app.project.file ? app.project.file.parent : Folder.myDocuments;
            var saveFolder = new Folder(projectFolder.fullName + "/СТАТИКА");
            if (!saveFolder.exists) {
                saveFolder.create();
            }

            var filePath = saveFolder.fsName + "/" + comp.name + "_статика.jpg";

            outputModule.file = new File(filePath);
            outputModule.applyTemplate("JPEG Sequence");

            rqItem.audioOutput = false;
        }

        app.project.renderQueue.render();

        app.endUndoGroup();

        alert("Рендер кадров из середины выбранных композиций начат.\nФайлы сохранятся в папку СТАТИКА рядом с проектом.");
    }
	var myPanel = buildUI(thisObj);

    if (myPanel instanceof Window) {
        myPanel.center();
        myPanel.show();
    }
})(this);