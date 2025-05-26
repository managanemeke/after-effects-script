(function renameCompositions() {
    const COLUMN_SEPARATOR = ";";

    var proj = app.project;
    if (!proj) {
        alert("No project open.");
        return;
    }

    var csvFile = File.openDialog("Select CSV with name,width,height", "*.csv");
    if (!csvFile) {
        alert("No file selected.");
        return;
    }

    if (!csvFile.open("r")) {
        alert("Failed to open file.");
        return;
    }

    var csvContent = csvFile.read();
    csvFile.close();

    var lines = csvContent.split(/\r?\n/);
    var sizeToNames = {};

    for (var i = 1; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue;

        var parts = line.split(COLUMN_SEPARATOR);
        if (parts.length < 3) continue;

        var name = parts[0].trim();
        var width = parseInt(parts[1].trim(), 10);
        var height = parseInt(parts[2].trim(), 10);
        if (isNaN(width) || isNaN(height)) continue;

        var key = width + "x" + height;
        if (!sizeToNames[key]) sizeToNames[key] = [];
        sizeToNames[key].push(name);
    }

    var targetFolder = null;
    for (var f = 1; f <= proj.rootFolder.numItems; f++) {
        var folder = proj.rootFolder.item(f);
        if (folder instanceof FolderItem && folder.name.toLowerCase() === "comps") {
            targetFolder = folder;
            break;
        }
    }
    if (!targetFolder) {
        alert("Folder named 'comps' not found in project root.");
        return;
    }

    function compNameExists(folder, name) {
        for (var i = 1; i <= folder.numItems; i++) {
            if (folder.item(i).name === name) return true;
        }
        return false;
    }

    function chooseNameDialog(nameList, compIndex, sizeLabel) {
        var dialog = new Window("dialog", "Choose new name for comp #" + compIndex + " (" + sizeLabel + ")");
        dialog.orientation = "column";
        dialog.alignChildren = ["fill", "top"];
        dialog.margins = 15;
        dialog.preferredSize = [350, 150];

        var dropdown = dialog.add("dropdownlist", undefined, nameList);
        dropdown.selection = 0;

        var btnGroup = dialog.add("group");
        btnGroup.alignment = "right";
        btnGroup.add("button", undefined, "OK", { name: "ok" });
        btnGroup.add("button", undefined, "Cancel", { name: "cancel" });

        return (dialog.show() === 1) ? dropdown.selection.text : null;
    }

    var compsToRename = [];
    for (var j = 1; j <= targetFolder.numItems; j++) {
        var comp = targetFolder.item(j);
        if (comp instanceof CompItem) {
            compsToRename.push(comp);
        }
    }

    app.beginUndoGroup("Rename Comps By Size with Safe Renaming");

    var assignedNames = {};

    for (var idx = 0; idx < compsToRename.length; idx++) {
        var comp = compsToRename[idx];
        var sizeKey = comp.width + "x" + comp.height;
        var availableNames = sizeToNames[sizeKey];

        if (!availableNames || availableNames.length === 0) {
            $.writeln("❌ No CSV names for comp '" + comp.name + "' size: " + sizeKey);
            continue;
        }

        if (!assignedNames[sizeKey]) assignedNames[sizeKey] = [];

        var namesLeft = availableNames.filter(function(n) {
            return assignedNames[sizeKey].indexOf(n) === -1;
        });

        if (namesLeft.length === 0) {
            $.writeln("ℹ️ All names used for size " + sizeKey + ". Skipping comp #" + (idx + 1));
            continue;
        }

        var chosenName;
        if (namesLeft.length === 1) {
            chosenName = namesLeft[0];
            $.writeln("Auto-renaming comp '" + comp.name + "' to '" + chosenName + "'");
        } else {
            chosenName = chooseNameDialog(namesLeft, idx + 1, sizeKey);
            if (!chosenName) {
                $.writeln("User cancelled renaming for comp #" + (idx + 1));
                continue;
            }
        }

        var finalName = chosenName;
        var counter = 1;
        while (compNameExists(targetFolder, finalName)) {
            finalName = chosenName + "_" + counter;
            counter++;
        }

        comp.name = finalName;
        assignedNames[sizeKey].push(chosenName);
    }

    app.endUndoGroup();

    alert("Renaming completed.");
})();
