/**
 * Created by marco.falsitta on 04/04/15.
 */
var SREventManager = function(in_params){

    this.params = $.extend({
    }, in_params);


    this.$SREventManager = null;

    this.loaderWidth = null;
    this.incrementalSteps = 0;

    this.eventsToReceive = null;

    /**
     * object attached to an observer.
     * @type {null}
     */
    this.currentSREvent = null;


    /**
     * the rebuilt event array received from the stream
     * @type {Array}
     */
    this.srEvents = [];

    /**
     * keeps individual visitors into a dictionary where the visitor id is the key
     * @type {{}}
     */
    this.individualVisitors = {};


    this.init();


};
SREventManager.prototype.init = function(){

    this.createAvatar();
    this.bindDomEvents();
    this.bindObservables();

};
SREventManager.prototype.bindObservables = function(){
    var _this = this;


    this.watch("currentSREvent", function(id, previousValue, newValue){

        //console.log(newValue);

        _this.srEvents.push(newValue);

        var timestamp = newValue.timestamp;

        var item = {
            random:newValue.random
        };

        if(typeof newValue.impressions !== "undefined"){
            item.impressions = newValue.impressions;
        }

        if(typeof newValue.viewed_products !== "undefined"){
            item.viewed_products = newValue.viewed_products;
        }

        if(typeof newValue.cart !== "undefined"){
            item.cart = newValue.cart;
        }

        if(typeof newValue.added_products !== "undefined"){
            item.added_products = newValue.added_products;
        }


        //group as well the individual visitors
        if(typeof( _this.individualVisitors[newValue.visitor_id] ) == "undefined"){

            _this.individualVisitors[newValue.visitor_id] = {
                streamIndex:_this.srEvents.length, //used to preserve the order as streamed from the server.
                timestamps:{}
            };

        }

        _this.individualVisitors[newValue.visitor_id].timestamps[timestamp] = item;

        _this.$SREventManager.trigger({
            type:"onSREventAdded",
            addedSRElement:newValue
        });

        return newValue;

    });


};
SREventManager.prototype.getAvatar = function(){
    return this.$SREventManager;
};
SREventManager.prototype.createAvatar = function(){

    this.$loadingBar = $('<div class="loadingBar"/>');

    this.loadedItems = 0;

    this.$incrementalInficator = $('<div class="incrementalIndicator"/>');
    this.$loadedItemsLbl = $('<span class="loadedItemsLbl"/>').text(this.loadedItems);
    this.$totalItemsLbl = $('<span class="totalItemsLbl"/>').text(0);

    this.$SREventManager =
        $("<div id='SREventManager'/>").append(
            $("<div class='loaderGroup'/>").append(
                $('<div class="textualInfo"/>').append(
                    this.$loadedItemsLbl,
                    this.$totalItemsLbl
                ),
                this.$loadingBar.append(
                    this.$incrementalInficator
                )
            )
        );

};
SREventManager.prototype.bindDomEvents = function(){
    var _this = this;

    this.$SREventManager.on('onSREventAdded', function(evt){

        _this.$loadedItemsLbl.text(++_this.loadedItems);

        _this.$incrementalInficator.css({
            width:(_this.loadedItems*_this.incrementalSteps)+"%"
        })

    });

};
/**
 *
 * @param in_eventObj SREventElement
 */
SREventManager.prototype.addSREvent = function(in_eventObj){
    //TODO:validate the incoming event object.
    this.currentSREvent = in_eventObj;

};
SREventManager.prototype.filterFor = function(in_val){


    //if(in_val.length >= 1){

        var findings = [];

        //console.log(in_val);

        var valueToSearch = in_val.toUpperCase();


        for(var i = 0; i < this.srEvents.length; i++){


            var evtObj = this.srEvents[i];

            var id = evtObj.visitor_id.toUpperCase();

            //finding by ID
            if(id.indexOf(valueToSearch) != -1){
                findings.push(evtObj);
            }

        }

        return findings;

    //}
    //else{
    //    return this.srEvents;
    //}

};
SREventManager.prototype.prepareReceivingEvent = function(in_totalEvents){

    this.eventsToReceive = in_totalEvents;

    this.loaderWidth = this.$loadingBar.outerWidth();

    this.$totalItemsLbl.text(this.eventsToReceive);

    this.incrementalSteps = this.loaderWidth / this.eventsToReceive;

    this.$SREventManager.trigger({
        type:"onPreparedToReceive"
    });

};
SREventManager.prototype.buildEventUI = function(in_events, callback){

    console.error("buildEventUI called");

    //reciver the filter string
    var filterValue = $("#filter").val();

    //TODO:time creation performance
    var start = new Date().getTime();
    for(var evtIdx = 0; evtIdx < in_events.length; evtIdx++){

        this.$SREventManager.trigger({
            type:'onBuildEventAvatar'
            ,eventObj:in_events[evtIdx]
            ,atPosition:evtIdx
            ,putInEvidence:{
                item:"visitorId",
                filterValue:filterValue
            }
        });
    }

    var end = new Date().getTime();
    var time = end - start;
    console.info('Execution time: ' + time);

    if(callback){
        callback();
    }




};
SREventManager.prototype.getSREvents = function(){
  return this.srEvents
};