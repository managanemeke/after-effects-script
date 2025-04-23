(function() {
    var saveFolder = "comps";
    var rootDirectory = app.project.file.parent;
    var substratesDirectory = rootDirectory.fsName + "/" + "substrates";
    var outputModuleTemplate = selectOutputModuleTemplate();

    saveSubstrates();

    function saveSubstrates() {
        app.project.renderQueue.showWindow(false);
        clearRenderQueue();
        var projectItems = app.project.items;
        for (var i = 1; i <= projectItems.length; i++) {
            var item = projectItems[i];
            if (
                item instanceof CompItem
                && isInsideSaveFolder(item)
            ) {
                addCompositionToRenderQueue(item);
            }
        }
        runRenderQueue();
        clearRenderQueue();
        if (projectItems.length > 0) {
            openSubstratesDirectory();
        }
    }

    function isInsideSaveFolder(comp) {
        var parentFolder = comp.parentFolder;
        if (
            parentFolder !== null
            && parentFolder.name.toLowerCase() === saveFolder
        ) {
            return true;
        }
        return false;
    }

    function selectOutputModuleTemplate() {
        var tempComp = app.project.items.addComp("temp", 1920, 1080, 1.0, 1.0, 30);
        var queueItem = app.project.renderQueue.items.add(tempComp);
        var outputModule = queueItem.outputModules.add();
        
        var templates = [];
        for (var i = 1; i <= outputModule.templates.length; i++) {
            templates.push(outputModule.templates[i]);
        }
        
        clearRenderQueue();
        tempComp.remove();
        
        if (templates.length === 0) {
            alert("Нет доступных шаблонов Output Module.\nСоздайте их через Edit > Templates > Output Module");
            return "";
        }
        
        var dialog = new Window("dialog", "Выберите Output Module Template");
        
        var dropdownListGroup = dialog.add("group");
        dropdownListGroup.alignChildren = ["left", "center"];
        dropdownListGroup.add("statictext", undefined, "Шаблон:");
        
        var dropdown = dropdownListGroup.add("dropdownlist", undefined, templates);
        dropdown.selection = 0;
        
        var buttonGroup = dialog.add("group");
        buttonGroup.alignment = "right";
        buttonGroup.add("button", undefined, "OK");
        
        if (dialog.show() === 1) {
            return templates[dropdown.selection.index];
        }
        
        return null;
    }

    function addCompositionToRenderQueue(comp) {
        comp.openInViewer();
        setTimeToFirstSaveMarkerIfExists();
        addActiveFrameToQueueAsPng();
    }

    function activeComp() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Нет активной композиции!");
            return null;
        }
        return comp;
    }

    function setTimeToFirstSaveMarkerIfExists() {
        var comp = activeComp();
        var markers = comp.markerProperty;
        if (markers.numKeys === 0) {
            return;
        }
        for (var i = 1; i <= markers.numKeys; i++) {
            if (markers.keyValue(i).comment === "save") {
                comp.time = markers.keyTime(i);
                return;
            }
        }
    }

    function openSubstratesDirectory() {
        new Folder(substratesDirectory).execute();
    }

    function substratesDirectoryFile(name) {
        var outputFolder = new Folder(substratesDirectory);
        if (!outputFolder.exists) {
            outputFolder.create();
        }
        return new File(outputFolder.fsName + "/" + name);
    }

    function addActiveFrameToQueueAsPng() {
        var comp = activeComp();
        var res = [1, 1];
        if (comp.resolutionFactor != "1,1") {
            res = comp.resolutionFactor;
            comp.resolutionFactor = [1, 1];
        }
        var file = substratesDirectoryFile(comp.name.replace(/\s+/g, '-').toLowerCase() + ".png");
        if (file.exists) {
            file.remove();
        }
        callSaveFrameAs();
        var queue = app.project.renderQueue;
        var lastItem = queue.item(queue.numItems);
        prepareQueueItemToSaveAsPngFile(lastItem, file);
        app.activeViewer.setActive();
        comp.resolutionFactor = res;
    }

    function callSaveFrameAs() {
        app.executeCommand(2104);
    }

    function prepareQueueItemToSaveAsPngFile(item, file) {
        item.render = true;
        var outputModule = item.outputModule(1);
        outputModule.applyTemplate(outputModuleTemplate);
        outputModule.file = file;
    }

    function runRenderQueue() {
        var queue = app.project.renderQueue;
        queue.render();
    }

    function clearRenderQueue() {
        var queue = app.project.renderQueue;
        while (queue.numItems > 0) {
            queue.item(queue.numItems).remove();
        }
    }
})();
