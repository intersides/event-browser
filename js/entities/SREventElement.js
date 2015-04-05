/**
 * Created by marco.falsitta on 04/04/15.
 */
var SREventElement = function(in_params){

    this.params = in_params;

    this.$SREventElement = null;
    this.$SREventElementExtended = null;
    this.init();
};
SREventElement.prototype.init = function(){

    this.createAvatars();

};
SREventElement.prototype.createAvatars = function(){

    //console.log(this.params);

    this.$SREventElement = $("<div class='SREventElement minified'/>");
    this.$SREventElementExtended = $("<div class='SREventElementExtended'/>");

    if(typeof this.params.visitor_id !== "undefined"){

        var visitorId =this.params.visitor_id;
        var timestamp =this.params.timestamp;
        var impressionsArray =this.params.impressions;

        var viewedProductsArray = this.params.viewed_products;


        //VIEWED PRODUCTS
        var $viewProductsGrp = $("<div class='viewProductsGrp'/>");

        if(viewedProductsArray.length){

            for(var productIdx = 0; productIdx < viewedProductsArray.length; productIdx++){
                var prodId = viewedProductsArray[productIdx].id;

                var imgLink = getImageLink(prodId);
                console.log(imgLink);


                $('<div class="productImage" style="background-image: url('+imgLink+')"/>').appendTo($viewProductsGrp);


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

                var $impressionItemsGrp = $("<div class='itemsGrp'/>")
                $impressionItemsGrp.appendTo($impressionObject);

                for(var itemIdx = 0; itemIdx < items.length; itemIdx++){
                    var itemId = items[itemIdx];
                    var imgLink = getImageLink(itemId);

                    //console.log(itemId, imgLink);

                    $('<div class="productImage" style="background-image: url('+imgLink+')"/>').appendTo($impressionItemsGrp);


                }
            }
            else{
                console.warn('no items where found');
            }

        }

        //process time stamp
        var date = srTimeStampToDate({srTimestamp:timestamp, format:"jquery"});


        this.$SREventElementExtended.append(

            $('<div class="inlineInfo"/>').append(
                $('<span class="visitorId"/>').text(visitorId),
                $('<span class="timestamp"/>').html(date)
            ),
            $viewProductsGrp,
            $impressionGrp

        );

        this.$SREventElement.append(

            $('<div class="inlineInfo"/>').append(
                $('<span class="visitorId"/>').text(visitorId),
                $('<span class="timestamp"/>').html(date)
            )

        );

    }

    //cross reference twin brothers
    //this.$SREventElement.data().twin = this.$SREventElementExtended;
    //this.$SREventElementExtended.data().twin = this.$SREventElement;



};
SREventElement.prototype.getAvatars = function(){
    return {
        bigBrother:this.$SREventElementExtended,
        littleBrother:this.$SREventElement};
};
SREventElement.prototype.getId = function(){
    return this.params.visitor_id;
};

