(function() {
    var rootDirectory = app.project.file.parent;
    var substratesDirectory = rootDirectory.fsName + "/" + "substrates";
    var highQualityWithAlpha = "High Quality with Alpha";

    saveSubstrates();

    function saveSubstrates() {
        app.project.renderQueue.showWindow(false);
        clearRenderQueue();
        var projectItems = app.project.items;
        for (var i = 1; i <= projectItems.length; i++) {
            var item = projectItems[i];
            if (item instanceof CompItem) {
                addCompositionToRenderQueue(item);
            }
        }
        runRenderQueue();
        clearRenderQueue();
        if (projectItems.length > 0) {
            openSubstratesDirectory();
        }
    }

    function addCompositionToRenderQueue(comp) {
        comp.openInViewer();
        setTimeToFirstMarkerIfExists();
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

    function setTimeToFirstMarkerIfExists() {
        var comp = activeComp();
        var markers = comp.markerProperty;
        if (markers.numKeys === 0) {
            return;
        }
        comp.time = markers.keyTime(1);
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
        outputModule.applyTemplate(highQualityWithAlpha);
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
