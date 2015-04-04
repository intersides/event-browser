/**
 * Created by marco.falsitta on 04/04/15.
 */

var EventBrowser = function(in_params){

    this.params = $.extend({
        host:location.origin.replace(/^http/, 'ws'),
        wsPort:5000,//default values
        httpPort:80,//default values
        baseHost:"localhost",
        unitTest:false
    }, in_params);

    this.httpServer = location.origin+"/";
    this.wsServer = "ws://"+this.params.baseHost+":"+this.params.wsPort+"/";

    console.info(this.httpServer, this.wsServer);


    this.webSocket = null;




    this.init();

};
EventBrowser.prototype.init = function(){
    console.log("EventBrowser initializing ...");

    this.requestService({
        service:"A",
        data:{
         someData:"B"
        }
    });

    //connect with websockets
    this.connectToServer({}, function(cb_connectionId){
        console.log("*", cb_connectionId);

    });
};
EventBrowser.prototype.requestService = function(in_requestedService){

    var service = 'default';
    if(typeof in_requestedService["service"] !== "undefined"){
        service = in_requestedService["service"];
    }
    var requestData = {};

    requestData = $.extend(requestData, in_requestedService.data);

    $.ajax({
        url:service,
        data:requestData,
        method:'POST',
        dataType:'JSON',
        beforeSend:function(){
            console.info('requesting ajax service');
        },
        success:function(response){
            console.log(response);
        },
        error:function(error){
            console.error(error);
        }
    });
};
EventBrowser.prototype.connectToServer = function(in_params, connCallback){
    var _this = this;

    //if host is not provided use the one in the app params (which at least its try to resolve to location.origin)
    var host = typeof in_params.host != "undefined" ? in_params.host : this.params.host;
    var wsHost = typeof in_params.wsHost != "undefined" ? in_params.wsHost : this.params.wsHost;

    this.openConnection(wsHost);
    this.bindSocketEvents();


    this.webSocket.onmessage = function (event) {

        var receivedMsg = JSON.parse(event.data);

        switch(receivedMsg.msgType){

            case "onOpenConnection":

                //var connectionId = receivedMsg.msg.connectionId;
                //_this.observable.connectionId = connectionId;
                //
                //if(connCallback){
                //    console.info("sending connectionId back to connectionToServer caller ");
                //    connCallback(connectionId);
                //
                //}

                break;

            case "onEventObjectReceived":{
                var receivedEventObj = receivedMsg.msg.eventObj;
                //console.info(receivedEventObj);

            }break;

            case "onMatchResponse":

//                var objToMatch = receivedMsg.msg.connectionId;
////                _this.observable.connectionId = connectionId;
//
//                if(_this.matchingCallback){
//                    console.info("sending connectionId back to connectionToServer caller ");
//                    _this.matchingCallback(objToMatch);
//
//                }

                break;

            case "onAllEventObjectsSent":
                var totalEvents = receivedMsg.msg.totalEvents;
                var msg = totalEvents+" events have been received";
                alert(msg);
                console.info(msg);

                break;


            default:
                console.log("default triggered, do something about it");
                break;
        }


    };




};

EventBrowser.prototype.bindSocketEvents = function(){

    this.webSocket.onclose = function (evt) {
        console.warn("closed connection");
    };
    this.webSocket.onerror = function (evt) {
        console.error("error during web socket connection");
    };

};
EventBrowser.prototype.openConnection = function(in_host){

    var _this = this;
    this.webSocket = new WebSocket(this.wsServer);

    this.webSocket.onopen = function (evt) {

        console.log("opened");

        _this.webSocket.send({
            msg: "respond to first connection"
        });

    };

};