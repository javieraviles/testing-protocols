const express = require('express');
const app = express();
const cors = require('cors');
const expressWs = require('express-ws')(app);
const amqp = require('amqplib/callback_api');

const CONN_URL = 'amqp://guest:guest@localhost';

let ch = null;

process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
});

amqp.connect(CONN_URL, async function (err, conn) {

    let progress = null;
    let text = null;
    let completed = false;
    let result = null;
    
    ch = await conn.createChannel();
    app.use(express.json());
    app.use(express.static('public'));
    app.use(cors());

    app.post('/task', function (req, res) {
        if(progress == null) {
            text = req.body.text;
            progress = 0;
            res.json({ id: 1, text: text, progress: progress, completed: completed });
            ch.sendToQueue("messages", Buffer.from(JSON.stringify({ id: 1, text: text})));
            console.log('Client creating task, sending it to queue messages: ' + JSON.stringify({ id: 1, text: text}));
            res.end();
        } else {
            res.status(400).send('Task already started');
        }
    });

    app.get('/task/1', function (req, res) {
        
        if(progress != null) {
            res.status(200).send({ id: 1, text: text, progress: progress, completed: completed, result: result });
        } else {
            res.status(404).send('Not found');
        }
    });

    app.ws('/progress', function (ws, req) {
        getProgress(ws);
    });

    function getProgress(ws) {
        ch.consume('tasksProgress', function (msg) {
            const jsonMessage = JSON.parse(msg.content.toString());
            progress = jsonMessage.progress;
            result = jsonMessage.result;
            if(result) {
                completed = true;
                console.log("task completed! result: " + result);
            }
            console.log('receiving progress from queue tasksProgress: ', progress + '% and seding it to client through websocket');
            ws.send(msg.content.toString());
        }, { noAck: true }
        );
    }

    app.listen(8080);
});



