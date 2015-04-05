/**
 * Created by marco.falsitta on 04/04/15.
 */
var dev = true;

var colors = require('colors');
var CircularJSON = require('circular-json');
var favicon = require('serve-favicon');
var express = require('express');
var WebSocketServer = require('ws').Server;
var http = require('http');
var fs = require('fs');

var publicPort = 7777;//PUBLIC PORT
var channelledPort = process.env['PORT'] || 5000; //WS DEFAULT PORT


var app = express();
    app.use(express.static(__dirname+"/../"));
    app.use(favicon(__dirname+"/../images/favicon.png"));

    //load the router module
    require('./router/routes.js')(app);




//HTTP SERVER to handle GET, POST, ajax, etc...
app.listen(publicPort, function(){
    var _httpServer = this;
    console.log('http server listening at http://%s:%s', _httpServer.address().address, _httpServer.address().port);
});


//WEBSOCKET SERVER
var wsServer = new WebSocketServer({port:channelledPort}, function(){
    console.log('webSocket server listening at ws://%s'.inverse, this._connectionKey);
});
wsServer.on('connection', function(ws){
    console.log('web-socket connection opened'.blue);

    ws.on('open', function open() {
        console.log('connected'.blue);
        ws.send(Date.now().toString(), {mask: true});
    });

    ws.on('close', function close() {
        console.log('disconnected'.red);
    });

    ws.on('message', function message(data, flags) {
        console.log('message received '.magenta);

        var eventArray;

        var eventFile = null;

        if(dev == true){
            eventFile = __dirname+'/data/events_reduced.json';
        }else{
            eventFile = __dirname+'/data/events.json';
        }

        fs.readFile(eventFile, function (err, data) {

            if (err){
                console.error(JSON.stringify(err));
            }

            eventArray = JSON.parse(data);
            var eventsCounter = eventArray.length;
            eventArray.forEach(function(eventObj){

                ws.send(CircularJSON.stringify({msgType:"onEventObjectReceived", msg:{eventObj:eventObj}}));

                if(--eventsCounter === 0){

                    setTimeout(function timeout() {
                        ws.send(CircularJSON.stringify({msgType:"onAllEventObjectsSent", msg:{totalEvents:eventArray.length}}));
                        console.log("all event objects have been sent !".yellow);
                    }, 500);
                }

            });




        });





    });

});