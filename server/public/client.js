
const host = 'localhost:8080';
let socket = new WebSocket('ws://' + host + '/progress');

socket.onopen = function (e) {
    console.log('WebSocket connection established');
};

socket.onmessage = function (event) {
    const wsMessage = JSON.parse(event.data);
    drawProgressBar(100, Number(wsMessage.progress));
    if (wsMessage.result) {
        document.getElementById('result').innerHTML = 'RESULT: ' + wsMessage.result;
    }
};

socket.onclose = function (event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        console.log('[close] Connection died');
    }
};

socket.onerror = function (error) {
    console.log(`[error] ${error.message}`);
};

function createTask() {
    document.getElementById('createButton').style.display = 'none';
    document.getElementById('httpRequestButton').style.display = 'block';
    document.getElementById('barwrapper').style.display = 'block';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', 'http://' + host + '/task', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify({ "text": document.getElementById("textToUppercase").value }));
    xhr.onload = function () {
        const jsonResponse = xhr.response;
        console.log({ jsonResponse });
        drawProgressBar(100, 0);
    };

    xhr.onerror = function () {
        alert('Request failed');
    };
}

function getProgressFromHttp() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', 'http://' + host + '/task/1', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send();
    xhr.onload = function () {
        document.getElementById('apiResponse').innerHTML = 'RESPONSE: ' + JSON.stringify(xhr.response);
    };

    xhr.onerror = function () {
        alert('Request failed');
    };
}

function drawProgressBar(total, progress) {
    var percentage = Math.round((progress * 100) / total);
    document.getElementById('progressbar').style.width = percentage + '%';
    document.getElementById('percentage').innerHTML = percentage + '%';
}
