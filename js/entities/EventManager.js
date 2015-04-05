/**
 * Created by marco.falsitta on 04/04/15.
 */
var SREventManager = function(in_params){

    this.params = $.extend({
    }, in_params);


    this.$SREventManager = null;


    this.currentSREvent = null;
    this.srEvents = [];


    this.init();


};
SREventManager.prototype.init = function(){

    this.createAvatar();
    this.bindDomEvents();
    this.bindObservables();

};
SREventManager.prototype.bindObservables = function(){
    var _this = this;
;

    this.watch("currentSREvent", function(id, previousValue, newValue){

        //console.log(id, previousValue, newValue);


        _this.srEvents.push(newValue);

        _this.$SREventManager.trigger({
            type:"onSREventAdded",
            addedSRElement:newValue
        });

        return newValue;


    });







};
SREventManager.prototype.createAvatar = function(){
    this.$SREventManager = $("<div id='SREventManager'/>").appendTo('body');

};
SREventManager.prototype.bindDomEvents = function(){
    var _this = _this;
    this.$SREventManager.on('onSREventAdded', function(evt){});

};
/**
 *
 * @param in_eventObj SREventElement
 */
SREventManager.prototype.addSREvent = function(in_eventObj){
    //TODO:validate the incoming event object.
    this.currentSREvent = in_eventObj;

};