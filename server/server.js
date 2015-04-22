/**
 * Created by marco.falsitta on 04/04/15.
 */
var dev = false;
var maxEvent = 500;

var colors = require('colors');

var nodemailer = require('nodemailer');

var CircularJSON = require('circular-json');
var favicon = require('serve-favicon');
var express = require('express');
var WebSocketServer = require('ws').Server;
var http = require('http');
var fs = require('fs');

var publicPort = 7777;//PUBLIC PORT
var channelledPort = process.env['PORT'] || 5000; //WS DEFAULT PORT

var eventArray = [];


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

        //console.log(CircularJSON.parse(data));
        var clientMessage = JSON.parse(data);
        console.log('received: %j', JSON.parse(data));

        var clientEvent = clientMessage.clientEvent;
        var clientData = clientMessage.data;


        switch(clientEvent){

            case "onOpen":{
                console.log('onOpen received');

                var eventFile = null;
                eventFile = __dirname+'/data/events.json';

                fs.readFile(eventFile, function (err, data) {

                    if (err){
                        console.error(JSON.stringify(err));
                    }


                    eventArray = JSON.parse(data);
                    console.log('event array filled'.green);

                    var eventsCounter = eventArray.length;
                    var eventsToSend = eventsCounter;

                    ws.send(CircularJSON.stringify({msgType:"onPrepareToSendAllEvents", msg:{totalEvents:eventsToSend}}));



                });



            }break;

            case "onReadyToReceive":{
                console.log('onOpen onReadyToReceive');

                var eventsCounter = eventArray.length;
                var eventsToSend = eventsCounter;

                if(dev == true) {
                    //override the total events to be sent
                    if (maxEvent > eventsCounter) {
                        maxEvent = eventsCounter;
                    }

                    eventsToSend = maxEvent;

                }

                for(var idx = 0; idx < eventsToSend; idx++){
                    var eventObj = eventArray[idx];
                    ws.send(CircularJSON.stringify({msgType:"onEventObjectReceived", msg:{eventObj:eventObj}}));
                }

                setTimeout(function timeout() {
                    ws.send(CircularJSON.stringify({msgType:"onAllEventObjectsSent", msg:{totalEvents:eventsToSend}}));
                    console.log("all event objects have been sent !".yellow);
                }, 500);




            }break;

            case "onShareSelected":{
                console.log('onShareSelected', clientData);
                console.log(clientData['shareWith']);
                console.log(clientData['eventObj']);

                // create reusable transporter object using SMTP transport
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'm.falsitta@genioo.com',
                        pass: 'chiave8871'
                    }
                });

                // NB! No need to recreate the transporter object. You can use
                // the same transporter object for all e-mails

                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: 'Marco Falsitta <m.falsitta@genioo.com>', // sender address
                    to: 'marco.falsitta@me.com, marco.falsitta@mac.com', // list of receivers
                    subject: 'Hello ✔', // Subject line
                    text: 'Hello world ✔', // plaintext body
                    html: '<b>Hello world ✔</b>' // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Message sent: ' + info.response);
                    }
                });

                setTimeout(function timeout() {
                    ws.send(CircularJSON.stringify({msgType:"onShareSelected", msg:{sent:true}}));
                    console.log("onShareSelected have been sent !".yellow);
                }, 500);




            }break;


            default:{
                console.log('un-handle client event type'.red);


            }break;
        }

        /*


        fs.readFile(eventFile, function (err, data) {

            if (err){
                console.error(JSON.stringify(err));
            }

            eventArray = JSON.parse(data);
            var eventsCounter = eventArray.length;
            var eventsToSend = eventsCounter;

            ws.send(CircularJSON.stringify({msgType:"onPrepareToSendAllEvents", msg:{totalEvents:eventsToSend}}));





            if(dev == true) {
                //override the total events to be sent
                if (maxEvent > eventsCounter) {
                    maxEvent = eventsCounter;
                }

                eventsToSend = maxEvent;

                //eventFile = __dirname + '/data/events_reduced.json';
            }

            for(var idx = 0; idx < eventsToSend; idx++){
                var eventObj = eventArray[idx];
                ws.send(CircularJSON.stringify({msgType:"onEventObjectReceived", msg:{eventObj:eventObj}}));
            }

            setTimeout(function timeout() {
                ws.send(CircularJSON.stringify({msgType:"onAllEventObjectsSent", msg:{totalEvents:eventsToSend}}));
                console.log("all event objects have been sent !".yellow);
            }, 500);






        });
        */




    });

});