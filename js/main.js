/**
 * Created by marco.falsitta on 04/04/15.
 */

var SREventBrowser = function(in_params){

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

    this.eventManager = null;

    this.init();

};
SREventBrowser.prototype.init = function(){
    console.log("SREventBrowser initializing ...");

    this.$app = this.initAvatar();

    this.eventManager = new SREventManager({});

    this.buildInterfaceLayout();
    this.bindDomEvents();


    this.requestService({
        service:"onInit",
        data:{
         someData:"B"
        }
    });

    //connect with websockets
    this.connectToServer({}, function(cb_connectionId){
        console.log("*", cb_connectionId);

    });
};
SREventBrowser.prototype.initAvatar = function(){
    return $("body").attr('id', 'SREventBrowser').empty();
};

//redrawDetailedElements
SREventBrowser.prototype.redrawDetailedElements = function(inBufferElements){

    //console.log(inBufferElements);

    this.$closerEventView.empty();
    for(var elemIdx = 0; elemIdx < inBufferElements.length; elemIdx++){
        var $a = this.createDetailAvatar(inBufferElements[elemIdx]);

        //console.log($a);
        this.$closerEventView.append($a);
    }


};
SREventBrowser.prototype.createDetailAvatar = function(elemObj){

    //console.log(this.params);

    var $SREventElementExtended = $("<div class='SREventElementExtended'/>");

    if(typeof elemObj !== "undefined"){

        var visitorId =elemObj.visitor_id;
        var timestamp =elemObj.timestamp;
        var impressionsArray =elemObj.impressions;

        var viewedProductsArray = elemObj.viewed_products;


        //VIEWED PRODUCTS
        var $viewProductsGrp = $("<div class='viewProductsGrp'/>");

        if(typeof viewedProductsArray != "undefined"){

            if(viewedProductsArray.length){

                for(var productIdx = 0; productIdx < viewedProductsArray.length; productIdx++){

                    var prodId = viewedProductsArray[productIdx].id;

                    var imgLink = getImageLink(prodId);
                    var $imgTag = $('<div class="productImage" style="background-image: url('+imgLink+')"/>');

                    var prodf = viewedProductsArray[productIdx].f;
                    //console.log(prodf);

                    if(typeof prodf !== "undefined"){

                        $('<fieldset class="scarabRecomended"/>').append(
                            $('<legend/>').append(
                                $('<i class="fa fa-bug"/>'),
                                $('<span/>').text(prodf)
                            ),
                            $imgTag
                        ).appendTo($viewProductsGrp);

                    }
                    else{
                        $imgTag.appendTo($viewProductsGrp);
                    }


                }
            }

        }
        else{
            console.warn('no items where found');
        }

        //RELATED


        var $impressionGrp = $("<div class='impressionGrp'/>")


        for(var idx in impressionsArray){

            var impressionObj = impressionsArray[idx];
            var featureId = impressionObj.feature_id;

            var $impressionObject = $("<div class='impressionObject'/>")

            $impressionGrp.append(
                $impressionObject
            );

            $impressionObject.append(
                $('<div/>').text(featureId)
            );

            var items = impressionObj.item_impressions;
            if(items.length){

                var $impressionItemsGrp =
                    $("<div class='itemsGrp'/>").appendTo($impressionObject);


                for(var itemIdx = 0; itemIdx < items.length; itemIdx++){
                    var itemId = items[itemIdx];

                    var imgLink = getImageLink(itemId);

                    //console.log(itemId, imgLink);
                    //$('<div class="productImage"/>').data('imgLink', null).appendTo($impressionItemsGrp);

                    $('<div class="productImage" style="background-image: url('+imgLink+')"/>').appendTo($impressionItemsGrp);


                }
            }
            else{
                console.warn('no items where found');
            }

        }

        //process time stamp
        var date = srTimeStampToDate({srTimestamp:timestamp, format:"jquery"});
        //var date = timestamp;


         $SREventElementExtended.append(
             $('<div class="inlineInfo"/>').append(
             $('<span class="visitorId"/>').text(visitorId),
             $('<span class="timestamp"/>').html(date)
             ),
             $viewProductsGrp,
             $impressionGrp

         ).attr('id', visitorId);

        return $SREventElementExtended;
    }
    else{
        return null;
    }



};

/*
SREventBrowser.prototype.createIndividualVisitorAvatar = function(visitorId, elemObj){

    var _this = this;

    //console.log(elemObj);

    var $SRIndividualVisitorElement = $("<div class='SRIndividualVisitorElement'/>");

    var visitorId =visitorId;
    var timestamps =elemObj.timestamps;


    var $visitorId = $('<div class="visitorId"/>').text(visitorId).appendTo($SRIndividualVisitorElement);
    var $historyContainer = $('<div class="historyContainer"/>').appendTo($SRIndividualVisitorElement);


    for(var timeStampId in timestamps){

        var historyBox = timestamps[timeStampId];

        //historyItems
        var $historyItem = $('<fieldset class="historyItem"/>');
        $historyContainer.append($historyItem);

        var $random = $('<legend class="random" align="right" />').text(historyBox.random);
        $historyItem.append($random);

        var $timeStampAsDate = srTimeStampToDate({srTimestamp:timeStampId, format:"jquery"});

        var $timestamp = $('<div class="timeStamp" />').html($timeStampAsDate);
        $historyItem.append($timestamp);

        var $productsGrp = $('<div class="productsGrp"/>');
        $historyItem.append($productsGrp);


        var viewed_productsArray = historyBox['viewed_products'];

        if(typeof viewed_productsArray != "undefined"){

            for(var i = 0; i < viewed_productsArray.length; i++){
                var product = viewed_productsArray[i];
                $productsGrp.append(
                    $('<div class="product"/>').text(product.id)
                );

            }

        }

        var impressions = historyBox['impressions'];
        //console.log(impressions);

        if(typeof impressions != "undefined"){

            var $impressionsGrp = $('<div class="impressionsGrp"/>');
            $productsGrp.append(
                $impressionsGrp
            );

            for(var i = 0; i < impressions.length; i++){

                var impression = impressions[i];

                if(impression.feature_id !== "undefined"){
                    $impressionsGrp.append(
                        $('<div class="product"/>').text(impression.feature_id)
                    );

                }

                var item_impressions = impression.item_impressions;

                if(item_impressions !== "undefined"){

                    var $item_impressions = $('<div class="impressions"/>')

                    $impressionsGrp.append($item_impressions);

                    for(var ipIdx = 0; ipIdx < item_impressions.length; ipIdx++){

                        $item_impressions.append(
                            $('<span class="impressionItem"/>').text(item_impressions[ipIdx])
                        )

                    }

                }





            }

        }

        var cart = historyBox['cart'];

        if(typeof cart != "undefined"){

            for(var ci = 0; ci < cart.length; ci++){
                var cartItem = cart[ci];
                $productsGrp.append(
                    $('<div class="cartItem"/>').text(cartItem.id)
                );

            }


        }

        //if cart, more likely there are added products
        var added_products = historyBox['added_products'];

        if(typeof added_products != "undefined"){

            //console.log(historyBox);

            for(var api = 0; api < added_products.length; api++){

                var productInCart = added_products[api];


                //f, id, q, p
                if(typeof productInCart.f == "undefined"){
                    productInCart.f = null;
                    console.log("*****");
                    console.log("NULL", productInCart);

                }


                $productsGrp.append(
                    $('<div class="productInCart"/>').append(

                        $('<div class="f"/>').text(productInCart.f),
                        $('<div class="id"/>').text(productInCart.id),
                        $('<div class="quantity"/>').text(productInCart.q),
                        $('<div class="price"/>').text(productInCart.p)

                    )
                );

            }

        }

    }

    return $SRIndividualVisitorElement;


};
*/
SREventBrowser.prototype.buildSearchTool = function(){

    var _this = this;

    var $st =
        $('<div class="searchTool"/>').append(
        //$('<label for="filter"/>').text('filter:'),
        $('<input id="filter" type="text" placeholder="search..."/>').on('keyup change', function(event){
            var val = $(this).val();
            var findings = _this.eventManager.filterFor(val);

            _this.$wideEventView.empty();
            _this.$devOptions.empty();

            if(findings.length == 0){
                _this.$app.trigger({
                    type:"onEmptyFilterResults"
                });
            }
            else{

                $(this).parent().removeClass("notFound");

                _this.$app.trigger({
                    type:"onEventsBunchReadyToDraw",
                    eventBunch:findings
                });
            }



        }),
        $('<i class="fa fa-times-circle"/>').on('click', function(){
            $("#filter").val("").trigger('change')
        })
    );

    return $st;

};

SREventBrowser.prototype.buildViewNavigator = function(){

    var _this = this;

    this.$smallViewBuffer = $('<div id="smallViewBuffer"/>');
    //this.$wideEventView.append(this.$smallViewBuffer);

    //this.$smallViewBuffer.draggable({
    //    containment: "parent",
    //    stop: function( event, ui ){
    //        _this.bufferControl();
    //    }
    //
    //});
    //
    //this.adjustMiniNavigatorSize();


};
SREventBrowser.prototype.buildInterfaceLayout = function(){

    var _this = this;

    this.$closerEventView = $('<div id="closerEventView"/>');



    this.$wideEventViewGrp = $('<div id="wideEventViewGrp"/>');
    this.$wideEventView = $('<div id="wideEventView"/>');

    this.$searchTool = this.buildSearchTool();
    this.$wideEventViewGrp.append(
        this.$searchTool,
        this.$wideEventView
    );

    this.$devOptions = $("<div class='devOptions'/>").append(

    );

    this.$app.append(
        $("<section id='appLayout'/>")
            .append(
                $('<div class="eventPage"/>').append(
                    $('<div class="utilityBar"/>').append(

                        $('<div class="HorizontalLayout extended"/>').append(
                            $('<div class="HorizontalRow"/>').append(
                                this.eventManager.getAvatar(),
                                this.$devOptions
                            )
                        )

                    ),
                    this.$closerEventView,
                    this.$wideEventViewGrp

                )
        )
    );

    //add buffer for full item allocation and deallocation (wrong term for sure)
    this.buildViewNavigator();

    this.$creationBuffer = $('<div id="creationBuffer"/>');
    this.$closerEventView.append(this.$creationBuffer);

    var bufferOffset = this.$creationBuffer.offset();
    var bufferTop = bufferOffset.top;
    var bufferBottom = bufferTop+this.$creationBuffer.outerHeight();

};
SREventBrowser.prototype.adjustMiniNavigatorSize = function() {

    //assign size to smallView buffer based on window visible size
    var w = this.$closerEventView.outerWidth();
    var h = this.$closerEventView.outerHeight();

    //this.$smallViewBuffer.css({position:"absolute"});

    //current smallView
    var smallViewW = this.$wideEventView.outerWidth();
    var smallViewOffset = this.$wideEventView.offset();
    //console.log(smallViewOffset);

    this.$smallViewBuffer.css({
        height:smallViewW*(h/w)+"px",
        width:smallViewW,
        top:smallViewOffset.top,
        left:smallViewOffset.left
    });

    //this.$smallViewBuffer.css({position:"fixed"});

};

SREventBrowser.prototype.bufferControl = function() {

    return;

    var smallViewTop = this.$smallViewBuffer.offset().top;
    var smallViewH = smallViewTop+this.$smallViewBuffer.outerHeight();


    var inBufferElements = [];

    $('.SREventElement').each(function(){

        var _$SREventElement = $(this);

        var topMarkerOffsetTop = _$SREventElement.offset().top;

        //if($(this).is('#53950BF0AAA8AEC0')){
        //    console.log(topMarkerOffsetTop, smallViewH);
        //}

        if(
            topMarkerOffsetTop < smallViewH
            &&
            topMarkerOffsetTop > smallViewTop
        ){

            inBufferElements.push(_$SREventElement.data().eventObj);

            _$SREventElement.trigger({
                type:"onInView"
            });
        }
        else{
            _$SREventElement.trigger({
                type:"onOutView"
            });
        }


    });

    this.redrawDetailedElements(inBufferElements);



    //get the first element of the list.
    //var $firstElement = $('.SREventElement.IN').first().data('twin');
    //
    //
    //var elementPosition = $firstElement.offset().top;
    //
    //var goto = this.$closerEventView.offset().top - elementPosition;
    //
    //var _this = this;
    //
    //this.$closerEventView.stop().animate({
    //    top: goto
    //}, 500, function(){
    //    console.info($firstElement.attr('id'));
    //});

};
SREventBrowser.prototype.bindDomEvents = function(){
    var _this = this;

    window.onresize = function(){
        //_this.adjustMiniNavigatorSize();
    };

    //onEmptyFilterResults

    this.$app.on('onEmptyFilterResults', function(evt){
      var $filterInput = $("#filter");
      $filterInput.parent().addClass("notFound");
    });



    this.$app.on('onEventsBunchReadyToDraw', function(evt){
        //console.log(evt.eventBunch);

        _this.$wideEventView.empty();
        _this.$devOptions.empty();

        if(evt.eventBunch.length > 0){

            //build the pagination object
            var paginationParams={
                itemsPerPage:20,
                srEvents:evt.eventBunch
            };

            _this.paginator = new Paginator(paginationParams);
            var $pageFrameAvatar = _this.paginator.getPageFrameAvatar();
            _this.$wideEventView.append($pageFrameAvatar);

            _this.eventManager.buildEventUI(evt.eventBunch, function(){

                var $pagTable = _this.paginator.buildTable();
                _this.$devOptions.append($pagTable);
                $pagTable.trigger('onPaginatorAttachedToDom');

            });


        }



    });



    this.$app.on('srEventsInFocus', function(evt){
        //console.log(evt.eventsInFocus);
        _this.redrawDetailedElements(evt.eventsInFocus);
    });

    //THANKS TO : http://stackoverflow.com/questions/9144560/jquery-scroll-detect-when-user-stops-scrolling
    this.$wideEventView.on('scroll', function() {
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function() {
            // do something
            _this.bufferControl();
        }, 100));
    });


    this.$app.on("onPreparedToReceive",function(evt){
        _this.webSocket.send(
            JSON.stringify({clientEvent:'onReadyToReceive', data:null})
        );
    });

    this.$app.on('onLittleBrotherClicked', function(evt){
        //console.log(evt.target.atPosition);
        var pageIdContainigSelectedItem = _this.paginator.pageIndexContainingItemWithIndex(evt.target.atPosition);
        _this.paginator.setPage(pageIdContainigSelectedItem);
    });



    this.$app.on("onBuildEventAvatar",function(evt){

        var evtObj = evt.eventObj;
        var putInEvidence = evt.putInEvidence;

        var aSREventElement = new SREventElement(evtObj, putInEvidence);

        _this.paginator.assignLittleAvatar(evt.atPosition, aSREventElement);

        var sREventElementAvatar = aSREventElement.getAvatars();
        sREventElementAvatar.atPosition = evt.atPosition;

        _this.$wideEventView.append(
            sREventElementAvatar
        );

        //$littleBroAvatar.data().atPosition = evt.atPosition;
        //
        //_this.$wideEventView.append(
        //    $littleBroAvatar
        //);
        //
        //

    });
};
SREventBrowser.prototype.requestService = function(in_requestedService){

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
SREventBrowser.prototype.connectToServer = function(in_params, connCallback){
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

            case "onPrepareToSendAllEvents":{
                console.log("onPrepareToSendAllEvents");
                _this.eventManager.prepareReceivingEvent(receivedMsg.msg.totalEvents);

            }break;


            case "onEventObjectReceived":{
                _this.eventManager.addSREvent(receivedMsg.msg.eventObj);

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

            case "onAllEventObjectsSent":{

                var totalEvents = receivedMsg.msg.totalEvents;
                var msg = totalEvents+" events have been received";
                console.info(msg);

                _this.$app.trigger({
                    type:"onEventsBunchReadyToDraw",
                    eventBunch:_this.eventManager.getSREvents()
                });





            }break;


            default:
                console.log("default triggered, do something about it");
                break;
        }


    };




};

SREventBrowser.prototype.bindSocketEvents = function(){

    this.webSocket.onclose = function (evt) {
        console.warn("closed connection");
    };
    this.webSocket.onerror = function (evt) {
        console.error("error during web socket connection");
    };

};
SREventBrowser.prototype.openConnection = function(in_host){

    var _this = this;
    this.webSocket = new WebSocket(this.wsServer);

    this.webSocket.onopen = function (evt) {

        console.log("opened");

        _this.webSocket.send(
            JSON.stringify({clientEvent:'onOpen', data:null})
        );

    };

};