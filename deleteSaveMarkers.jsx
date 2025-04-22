(function() {
    deleteSaveMarkers();

    function deleteSaveMarkers() {
        if (!app.project) {
            alert("Нет открытого проекта!", "Ошибка");
            return;
        }
        var project = app.project;
        var deletedMarkersCount = 0;

        for (var i = 1; i <= project.numItems; i++) {
            var item = project.item(i);
            if (item instanceof CompItem) {
                var markers = item.markerProperty;
                for (var j = markers.numKeys; j >= 1; j--) {
                    var markerValue = markers.keyValue(j);
                    if (markerValue.comment === "save") {
                        markers.removeKey(j);
                        deletedMarkersCount++;
                    }
                }
            }
        }
        alert("Удалено маркеров: " + deletedMarkersCount, "Готово");
    }
})();
