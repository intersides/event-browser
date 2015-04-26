/**
 * Created by marco.falsitta on 04/04/15.
 */

var collegues = {
    marco01:{
        firstName:"Marco",
        lastName:"Falsitta",
        email:"marco.falsitta@icloud.com"
    },
    marco02:{
        firstName:"Marco",
        lastName:"Falsitta",
        email:"marco.falsitta@me.com"
    },
    marco03:{
        firstName:"Marco",
        lastName:"Falsitta",
        email:"m.falsitta@genioo.com"
    }
};

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

    this.currentFilter = null;

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

    //trigger init events
    this.$app.trigger({
        type:'onSelectedFilter',
        filter:'uid'
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
        var detailAvatar = this.createDetailAvatar(inBufferElements[elemIdx]);

        //console.log($a);
        this.$closerEventView.append(detailAvatar);

    }

    console.info('all extended avatars have been attached');
    //reset all the event elements currently belonging to the selected page.

    var eventElementsInCurrentPage = document.getElementsByClassName("SREventElement selected");
    for(var idx = 0; idx < eventElementsInCurrentPage.length; idx++){
        var selectedElement = eventElementsInCurrentPage[idx];
        selectedElement.removeAttribute('style');
    }

    this.underlineEventsInMainFrame(this.$closerEventView[0]);


};
SREventBrowser.prototype.createDetailAvatar = function(elemObj){

    var _this = this;

    //console.log(this.params);

    var SREventElementExtended = document.createElement('div');
        SREventElementExtended.className = "SREventElementExtended";


    if(typeof elemObj !== "undefined"){


        SREventElementExtended.srId = elemObj.random;
        SREventElementExtended.setAttribute("data-srId", elemObj.random);

        var visitorId =elemObj.visitor_id;
        var timestamp =elemObj.timestamp;
        var impressionsArray =elemObj.impressions;

        var viewedProductsArray = elemObj.viewed_products;


        //VIEWED PRODUCTS
        var viewProductGrp = document.createElement('div');
        viewProductGrp.className = "viewProductsGrp";

        //var $viewProductsGrp = $("<div class='viewProductsGrp'/>");

        if(typeof viewedProductsArray != "undefined"){

            if(viewedProductsArray.length){

                for(var productIdx = 0; productIdx < viewedProductsArray.length; productIdx++){

                    var prodId = viewedProductsArray[productIdx].id;

                    var imgTag = document.createElement('div');
                        imgTag.className = "productImage";
                        imgTag.style.backgroundImage = "url("+getImageLink(prodId)+")";

                    var prodIdElem = document.createElement('div');
                    prodIdElem.className = 'prodIdElem';
                    prodIdElem.textContent = prodId;

                    var imgTagGrp = document.createElement('div');
                    imgTagGrp.className = "imgTagGrp";

                    imgTagGrp.appendChild(imgTag);
                    imgTagGrp.appendChild(prodIdElem);


                    var prodf = viewedProductsArray[productIdx].f;
                    //console.log(prodf);

                    if(typeof prodf !== "undefined"){

                        var scarabRecommendedFieldSet = document.createElement('fieldset');
                            scarabRecommendedFieldSet.className = "scarabRecomended";

                        var scarabRecommendedIconLegend = document.createElement('legend');
                            scarabRecommendedIconLegend.className='fa fa-bug';
                        var productF = document.createElement('div');
                            productF.textContent = prodf;

                        scarabRecommendedFieldSet.appendChild(scarabRecommendedIconLegend);
                        scarabRecommendedFieldSet.appendChild(productF);
                        scarabRecommendedFieldSet.appendChild(imgTagGrp);

                        viewProductGrp.appendChild(scarabRecommendedFieldSet);

                    }
                    else{
                        viewProductGrp.appendChild(imgTagGrp);
                    }


                }
            }

        }
        else{
            console.warn('no items where found');
        }

        //RELATED


        var impressionGrp = document.createElement('div');
            impressionGrp.className ='impressionGrp';

        for(var idx in impressionsArray){

            var impressionObj = impressionsArray[idx];
            var featureId = impressionObj.feature_id;

            var impressionObjectElem = document.createElement('div');
            impressionObjectElem.className = 'impressionObject';

            impressionGrp.appendChild(impressionObjectElem);

            var featureIdElem = document.createElement('div');
            featureIdElem.textContent = featureId;
            impressionObjectElem.appendChild(featureIdElem);

            var items = impressionObj.item_impressions;
            if(items.length){

                var impressionItemsGrp = document.createElement('div');
                impressionItemsGrp.className ='itemsGrp';

                impressionObjectElem.appendChild(impressionItemsGrp);

                for(var itemIdx = 0; itemIdx < items.length; itemIdx++){
                    var itemId = items[itemIdx];

                    var imgTag2 = document.createElement('div');
                    imgTag2.className = "productImage";
                    imgTag2.style.backgroundImage = "url("+getImageLink(itemId)+")";

                    var prodIdElem2 = document.createElement('div');
                    prodIdElem2.className = 'prodIdElem';
                    prodIdElem2.textContent = itemId;

                    var imgTagGrp2 = document.createElement('div');
                    imgTagGrp2.className = "imgTagGrp";

                    imgTagGrp2.appendChild(imgTag2);
                    imgTagGrp2.appendChild(prodIdElem2);

                    impressionItemsGrp.appendChild(imgTagGrp2);

                }
            }
            else{
                console.warn('no items where found');
            }

        }

        //process time stamp
        var htmlDate = srTimeStampToDate({srTimestamp:timestamp, format:"html"});

        var content = document.createElement('div');
            content.className = "content";

        var visitorIdElem = document.createElement('span');
            visitorIdElem.className = "visitorId";
            visitorIdElem.textContent = visitorId;
        //console.log(visitorId);

        var shareIconGrp = document.createElement('div');
            shareIconGrp.className = 'shareIconGrp';

        var shareIcon = document.createElement('i');
            shareIcon.className = 'shareIcon fa fa-share-alt-square';
            shareIcon.title = "click to share with collegue";
            shareIcon.elemObj = elemObj;
            shareIcon.onclick = function(){
                console.log(this.elemObj);


                var $dialog = $('<div id="shareDialog" title="share this item"/>');
                $dialog.data().elemObj = this.elemObj;
                $dialog.append(
                    $('<div/>').html("<p>Choose the collegues to which you want to share this item. They will receive it as an email.</p>"),
                    (function(_$dialog){
                        var $userList = $('<ul/>');

                        $userList.append(

                            (function(c_collegues){

                                var colleguesItems = [];
                                for(var collegueId in c_collegues){
                                    if(c_collegues.hasOwnProperty(collegueId) ){

                                        console.log(collegueId, c_collegues[collegueId]);

                                        if(typeof _$dialog.data().collegues == "undefined"){
                                            _$dialog.data().collegues = {};
                                        }
                                        _$dialog.data().collegues[collegueId] = c_collegues[collegueId];

                                        colleguesItems.push(

                                            $('<li/>').append(
                                                $('<input type="checkbox" checked/>').on('click', function(){


                                                    if($(this).is(':checked')){

                                                        (function(c_collegueId, c_collegueObj){
                                                            _$dialog.data().collegues[c_collegueId] = c_collegueObj;

                                                        }(collegueId, c_collegues[collegueId]))
                                                    }
                                                    else{
                                                        (function(c_collegueId){
                                                            delete _$dialog.data().collegues[c_collegueId];
                                                        }(collegueId))

                                                    }

                                                    console.log(_$dialog.data().collegues);

                                                }),
                                                $('<label/>').text(
                                                    c_collegues[collegueId].firstName+' '+
                                                    c_collegues[collegueId].firstName+'('+c_collegues[collegueId].email+')')
                                            )
                                        )


                                    }
                                }

                                return colleguesItems;

                            }(collegues))


                        );

                        return $userList
                    }($dialog)),
                    $('<div class="objectToSend"/>').append(
                        $('<p/>').text(JSON.stringify(this.elemObj, null, 2))
                    )
                );

                _this.$app.append($dialog);

                $dialog.dialog({
                    minWidth:510,
                    minHeight:400,
                    modal: true,
                    buttons: {
                        Ok: function () {
                            var collegues = $(this).data().collegues;
                            var elemObj = $(this).data().elemObj;

                            var paramsForServer = {
                                eventObj :elemObj,
                                shareWith:collegues
                            };
                            _this.webSocket.send(
                                JSON.stringify({clientEvent:'onShareSelected', data:paramsForServer})
                            );

                            $(this).dialog("close");
                            $(this).remove();
                        }
                    }
                });


            };
        shareIconGrp.appendChild(shareIcon);

        var timestampElem = document.createElement('span');
            timestampElem.className = "timestamp";
            timestampElem.appendChild(htmlDate);


        SREventElementExtended.appendChild(content);
        content.appendChild(visitorIdElem);
        content.appendChild(shareIconGrp);
        content.appendChild(timestampElem);
        content.appendChild(viewProductGrp);
        content.appendChild(impressionGrp);

        return SREventElementExtended;
    }
    else{
        return null;
    }



};


SREventBrowser.prototype.buildSearchTool = function(){

    var _this = this;

    return $('<div class="searchTool"/>').append(
            $('<input id="filter" type="text" placeholder="filter..."/>').on('keyup change', function(event){
            var val = $(this).val();
            var findings = _this.eventManager.filterFor(val, _this.currentFilter);

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
            }),
            $('<div class="radio-filters"/>').append(
                $('<i class="fa fa-user" data-filtertype="uid"/>').on('click', function(){
                    $(this).trigger({
                        type:'onSelectedFilter',
                        filter:'uid'
                    });

                }),
                $('<i class="fa fa-book"  data-filtertype="pid"/>').on('click', function(){
                    $(this).trigger({
                        type:'onSelectedFilter',
                        filter:'pid'
                    });

                })
            )
    );


};
SREventBrowser.prototype.setSearchFilter = function(in_params){

    var filter = in_params.filter;
    if(typeof filter != "undefined"){

        $('.radio-filters i.fa').removeClass('active');
        $('.radio-filters i.fa[data-filtertype='+filter+']').addClass('active');
    }
    else{
        console.error('filter udefiend');
    }

};
SREventBrowser.prototype.buildViewNavigator = function(){
    var _this = this;

    this.$smallViewBuffer = $('<div id="smallViewBuffer"/>');
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


SREventBrowser.prototype.bindDomEvents = function(){
    var _this = this;

    window.onresize = function(){};

    this.$app.on('onSelectedFilter', function(evt){
        var filter = evt.filter;
        _this.setSearchFilter({filter:filter});
        _this.currentFilter = filter;
    });

    this.$app.on('onEmptyFilterResults', function(evt){
      var $filterInput = $("#filter");
      $filterInput.parent().addClass("notFound");
    });


    //trigger onElementInCenter
    this.$app.on('onElementInCenter', function(evt){
        console.warn('onElementInCenter::triggered');
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
            //var $pageFrameAvatar = _this.paginator.getPageFrameAvatar();
            //_this.$wideEventView.append($pageFrameAvatar);

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
            //_this.bufferControl();
        }, 100));
    });

    this.$closerEventView.on('scroll', function() {

        var closerEventView = this;
        var containerBB = closerEventView.getBoundingClientRect();
        var lastPaginatedElementBB = (closerEventView.lastChild).getBoundingClientRect();
        var firstPaginatedElementBB = (closerEventView.firstChild).getBoundingClientRect();

        clearTimeout($.data(this, 'scrollTimer'));

        $.data(this, 'scrollTimer', setTimeout(function() {

            //reset all the event elements currently belonging to the selected page.

            var eventElementsInCurrentPage = document.getElementsByClassName("SREventElement selected");
            for(var idx = 0; idx < eventElementsInCurrentPage.length; idx++){
                var selectedElement = eventElementsInCurrentPage[idx];
                selectedElement.removeAttribute('style');
            }


            //TODO:reavaulate this functionality
            if(false){
                //load previous page when try to scroll before first element
                if(lastPaginatedElementBB.bottom == containerBB.bottom){
                    _this.paginator.gotoNext();
                    return;
                }

                //load next page when try to scroll after last element
                if(firstPaginatedElementBB.top == containerBB.top){
                    _this.paginator.gotoPrevious();
                    return;
                }

            }

            _this.underlineEventsInMainFrame(closerEventView);

        }, 10));

    });


    this.$app.on("onPreparedToReceive",function(evt){
        _this.webSocket.send(
            JSON.stringify({clientEvent:'onReadyToReceive', data:null})
        );
    });

    //onSREventReadyToBeCentered
    this.$app.on("onSREventReadyToBeCentered",function(evt){

        var srEventElementExtended = evt.target;

        //center the element into its container
        var closerEventView = _this.$closerEventView[0];

        var containerBB = closerEventView.getBoundingClientRect();
        var srEventElementExtendedBB = srEventElementExtended.getBoundingClientRect();

        //var containerY = containerBB.top;
        //var srEventElementExtendedCenterY = srEventElementExtendedBB.top;
        var containerY = containerBB.top+containerBB.height/2;
        var srEventElementExtendedCenterY = srEventElementExtendedBB.top+srEventElementExtendedBB.height/2;
        var scrollTo = srEventElementExtendedCenterY-containerY;

        if(scrollTo > 0){
            closerEventView.scrollTop += scrollTo;
        }
        else{
            closerEventView.scrollTop -= Math.abs(scrollTo);

        }

    });


    this.$app.on('onLittleBrotherClicked', function(evt){
        console.log('onLittleBrotherClicked');

        var pageIdContainigSelectedItem = _this.paginator.pageIndexContainingItemWithIndex(evt.target.atPosition);

        var srId = _this.paginator.params.srEvents[evt.target.atPosition].random;


        var srEventElementExtended = null;
        if(pageIdContainigSelectedItem !==  _this.paginator.getCurrentPage().getIndex()){
            _this.paginator.setPage(pageIdContainigSelectedItem, srId);
        }
        else{
            srEventElementExtended = document.querySelector('[data-srid="'+srId+'"]');
            $(srEventElementExtended).trigger({
                type:"onSREventReadyToBeCentered"
            });
            //srEventElementExtended = document.getElementById(_this.paginator.params.srEvents[evt.target.atPosition].random);
        }

        //console.log(evt.target.atPosition, _this.paginator.params.srEvents[evt.target.atPosition]);
        //console.log(srEventElementExtended);


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

SREventBrowser.prototype.underlineEventsInMainFrame = function(closerEventView){

    var gradientDegradationStep = 5;

    for(var childIdx = 0; childIdx < closerEventView.children.length; childIdx++){

        var srEventElementExtended = closerEventView.children[childIdx];

        var elementInRange = portionOfVisibleElement(srEventElementExtended, closerEventView);

        if(elementInRange){

            var elementId = elementInRange.element.srId;
            var element = document.getElementById(elementId);

            //centered element
            var gradientStyle = "linear-gradient(lightsteelblue 0%, lightsteelblue 100%)";


            //partially covered element
            if(elementInRange.coverPart){

                if(elementInRange.coverPart == "both"){

                    var topStart = elementInRange.coverages.top.value;
                    var topEnd = topStart+gradientDegradationStep;

                    var bottomStart = 100 - elementInRange.coverages.bottom.value;
                    var bottomEnd = bottomStart+gradientDegradationStep;

                    gradientStyle = "linear-gradient(lightgreen "+topStart+"%, lightsteelblue "+topEnd+"%, lightsteelblue "+bottomEnd+"%, lightgreen "+bottomStart+"%)";
                    //console.log(gradientStyle);


                }
                else{

                    gradientStyle = "-webkit-repeating-linear-gradient("+elementInRange.coverPart+", lightgreen 0%, lightgreen "+elementInRange.percent+"%, lightsteelblue "+elementInRange.percent+"%, lightsteelblue 100%)";
                }

            }

            element.style.background = gradientStyle;
            //element.className += "inRange";

            if(elementInRange.isCentral){
                //console.info(elementInRange.element, 'is most central');
                $(elementInRange.element).trigger("onElementInCenter");

            }


        }
    }



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

function portionOfVisibleElement (el, container) {
    var elemBB = el.getBoundingClientRect();
    var containerBB = container.getBoundingClientRect();

    var elemVerticalCenter = elemBB.height / 2 + elemBB.top;

    var isTopInContainer = containerBB.top < elemBB.top && containerBB.bottom > elemBB.top;
    var isBottomInContainer = containerBB.bottom > elemBB.bottom && containerBB.top < elemBB.bottom;
    var isCenterInContainer = containerBB.bottom > elemVerticalCenter && containerBB.top < elemVerticalCenter;

    //console.log(isTopInContainer, isBottomInContainer, isCenterInContainer);



    if( isTopInContainer == true  && isBottomInContainer == true){
        //FULL OBJECT IS VISIBLE
        return {
            coverPart:null,
            element:el,
            isCentral:isCenterInContainer
        };
    }
    else if (isTopInContainer == true  && isBottomInContainer == false ){
        //PART OF THE BOTTOM IS HIDDEN
        var missingBottom = Math.round((Math.abs(containerBB.bottom - elemBB.bottom)/elemBB.height)*100, 1);
        return {
            coverPart:'bottom',
            percent:missingBottom,
            element:el,
            isCentral:isCenterInContainer
        };
    }
    else if (isTopInContainer == false  && isBottomInContainer == true ){
        //PART OF THE TOP IS HIDDEN
        var missingTop = Math.round((Math.abs(containerBB.top - elemBB.top)/elemBB.height)*100, 1);
        return {
            coverPart:'top',
            percent:missingTop,
            element:el,
            isCentral:isCenterInContainer
        };
    }
    else if(isCenterInContainer == true){

        var missingBottomForCentralItem = Math.round((Math.abs(containerBB.bottom - elemBB.bottom)/elemBB.height)*100, 1);
        var missingTopForCentralItem = Math.round((Math.abs(containerBB.top - elemBB.top)/elemBB.height)*100, 1);

        return {
            coverPart:"both",
            coverages:{
                top:{
                    value:missingTopForCentralItem
                },
                bottom:{
                    value:missingBottomForCentralItem
                }
            },
            element:el,
            isCentral:isCenterInContainer
        };
    }
    //else IT IS ALL HIDDEN
    return null;
}


function isElementInViewport (el, container) {
    var rect = el.getBoundingClientRect();

    return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (container.clientHeight) &&
    rect.right <= (container.clientWidth)
    );
}

//EXTEND DOM ELEMENT (adding support for HTMLCollections)
//ref: http://www.openjs.com/scripts/dom/class_manipulation.php
function domExtendedHasClass(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
function domExtendedAddClass(ele,cls) {

    if( Object.prototype.toString.call( ele ) === '[object HTMLCollection]' ) {
        Array.prototype.forEach.call(ele, function(el) {
            domExtendedAddClass(el, cls);
        });
    }
    else{
        if (!this.domExtendedHasClass(ele,cls)) ele.className += " "+cls;
    }

}
function domExtendedRemoveClass(ele,cls) {

    if( Object.prototype.toString.call( ele ) === '[object HTMLCollection]' ) {
        Array.prototype.forEach.call(ele, function(el) {
            domExtendedRemoveClass(el, cls);
        });
    }
    else{
        if (domExtendedHasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }
    }


}

