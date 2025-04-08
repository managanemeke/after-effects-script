(function() {
    var rootDirectory = app.project.file.parent;
    var substratesDirectory = rootDirectory.fsName + "/" + "substrates";

    saveSubstrates();

    function saveSubstrates() {
        var projectItems = app.project.items;
        for (var i = 1; i <= projectItems.length; i++) {
            var item = projectItems[i];
            if (item instanceof CompItem) {
                var comp = item;
                comp.openInViewer();
                setTimeToFirstMarkerIfExists();
                saveActiveFrameToPng();
            }
        }
        if (projectItems.length > 0) {
            openSubstratesDirectory();
        }
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

    function saveActiveFrameToPng() {
        var comp = activeComp();

        //if the resolution isnt 'Full', store current resolution and set to Full, then restore later;
        var res = [1, 1];
        if (comp.resolutionFactor != "1,1") {
            res = comp.resolutionFactor;
            comp.resolutionFactor = [1, 1];
        }
        var file = substratesDirectoryFile(comp.name.replace(/\s+/g, '-').toLowerCase() + ".png");
        if (file.exists) {
            file.remove();
        }
        //close the renderQueue panel
        app.project.renderQueue.showWindow(false);
        //backup the render queue status, then uncheck the queued items
        var RQbackup = storeRenderQueue();
        if (RQbackup[RQbackup.length - 1] == "rendering") {
            alert(RQerr);
        } else {
            //call command "save frame as" to add current frame to render queue
            app.executeCommand(2104);
            app.project.renderQueue.item(app.project.renderQueue.numItems).render = true;
            var templateTemp = app.project.renderQueue.item(app.project.renderQueue.numItems).outputModule(1).templates;
            //call hidden template '_HIDDEN X-Factor 16 Premul', which exports png with alpha
            var setPNG = app.project.renderQueue.item(app.project.renderQueue.numItems).outputModule(1).templates[templateTemp.length - 1];
            app.project.renderQueue.item(app.project.renderQueue.numItems).outputModule(1).applyTemplate(setPNG);
            app.project.renderQueue.item(app.project.renderQueue.numItems).outputModule(1).file = file;
            var finalpath = app.project.renderQueue.item(app.project.renderQueue.numItems).outputModule(1).file.fsName;
            app.project.renderQueue.render();
            //remove the rendered item and restored the render queue items
            app.project.renderQueue.item(app.project.renderQueue.numItems).remove();
            if (RQbackup != null) {
                restoreRenderQueue(RQbackup);
            }
            app.activeViewer.setActive();
            comp.resolutionFactor = res;
        }
    }

    function storeRenderQueue() {
        var checkeds = [];
        for (var p = 1; p <= app.project.renderQueue.numItems; p++) {
            if (app.project.renderQueue.item(p).status == RQItemStatus.RENDERING) {
                checkeds.push("rendering");
                break;
            } else if (app.project.renderQueue.item(p).status == RQItemStatus.QUEUED) {
                checkeds.push(p);
                app.project.renderQueue.item(p).render = false;
            }
        }
        return checkeds;
    }

    function restoreRenderQueue(checkedItems) {
        for (var q = 0; q < checkedItems.length; q++) {
            app.project.renderQueue.item(checkedItems[q]).render = true;
        }
    }
})();
