var frameRate = 30;

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
    var defaultTime = "00:00:10:00";
    var promptText = "Введите временную метку (формат ЧЧ:ММ:СС:КК):";
    
    while (true) {
        var userInput = prompt(promptText, defaultTime);
        if (userInput === null) return null;
        if (isValidTimeFormat(userInput)) {
            return timecodeToTime(userInput);
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
    var hours = parseInt(parts[0], 10);
    var minutes = parseInt(parts[1], 10);
    var seconds = parseInt(parts[2], 10);
    var frames = parseInt(parts[3], 10);
    
    return (minutes < 60) && (seconds < 60);
}

function timecodeToTime(timecode) {
    var parts = timecode.split(':');
    var hours = parseInt(parts[0], 10);
    var minutes = parseInt(parts[1], 10);
    var seconds = parseInt(parts[2], 10);
    var frames = parseInt(parts[3], 10);
    return hours * 3600 + minutes * 60 + seconds + frames / frameRate;
}

function timeToTimecode(timeInSeconds) {
    var totalFrames = Math.round(timeInSeconds * frameRate);
    var frames = totalFrames % frameRate;
    var seconds = Math.floor(totalFrames / frameRate) % 60;
    var minutes = Math.floor(totalFrames / (frameRate * 60)) % 60;
    var hours = Math.floor(totalFrames / (frameRate * 3600));
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + ":" + pad(frames);
}

function pad(number) {
    return (number < 10) ? "0" + number : number.toString();
}

function processAllCompositions(timeInSeconds) {
    var project = app.project;
    for (var i = 1; i <= project.numItems; i++) {
        var item = project.item(i);
        
        if (item instanceof CompItem) {
            addMarkerToComp(item, timeInSeconds);
        }
    }
}

function addMarkerToComp(comp, timeInSeconds) {
    var markers = comp.markerProperty;
    var markerExists = false;
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

main();
