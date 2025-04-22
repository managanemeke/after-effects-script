(function() {
    const defaultTime = "00:00:10:00";

    main();

    function main() {
        if (!app.project) {
            alert("Нет открытого проекта!", "Ошибка");
            return;
        }
        var timeStamp = promptForTimeStamp();
        if (timeStamp === null) return;
        processAllCompositions(timeStamp);
    }

    function promptForTimeStamp() {
        var promptText = "Введите временную метку (формат ЧЧ:ММ:СС:КК):";
        
        while (true) {
            var userInput = prompt(promptText, defaultTime);
            if (userInput === null) return null;
            if (isValidTimeFormat(userInput)) {
                return userInput;
            } else {
                alert("Неверный формат времени!\nИспользуйте формат ЧЧ:ММ:СС:КК", "Ошибка ввода");
                defaultTime = userInput;
            }
        }
    }

    function isValidTimeFormat(timeString) {
        var regex = /^\d{1,2}:\d{2}:\d{2}:\d{2}$/;
        if (!regex.test(timeString)) return false;
        var parts = timeString.split(':');
        var minutes = parseInt(parts[1], 10);
        var seconds = parseInt(parts[2], 10);
        return (minutes < 60) && (seconds < 60);
    }

    function timecodeToTime(timecode, frameRate) {
        var parts = timecode.split(':');
        var hours = parseInt(parts[0], 10);
        var minutes = parseInt(parts[1], 10);
        var seconds = parseInt(parts[2], 10);
        var frames = parseInt(parts[3], 10);
        return hours * 3600 + minutes * 60 + seconds + frames / frameRate;
    }

    function pad(number) {
        return (number < 10) ? "0" + number : number.toString();
    }

    function processAllCompositions(timeStamp) {
        var project = app.project;
        for (var i = 1; i <= project.numItems; i++) {
            var item = project.item(i);
            
            if (item instanceof CompItem) {
                addMarkerToComp(item, timeStamp);
            }
        }
    }

    function addMarkerToComp(comp, timeStamp) {
        var markers = comp.markerProperty;
        var markerExists = false;
        var timeInSeconds = timecodeToTime(timeStamp, comp.frameRate);
        for (var j = 1; j <= markers.numKeys; j++) {
            if (Math.abs(markers.keyTime(j) - timeInSeconds) < 0.001) {
                markerExists = true;
                break;
            }
        }
        if (!markerExists) {
            var markerValue = new MarkerValue("save");
            comp.markerProperty.setValueAtTime(timeInSeconds, markerValue);
        }
    }
})();
