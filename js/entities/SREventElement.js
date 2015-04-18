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
    this.bindDomEvents();

};

SREventElement.prototype.createAvatars = function(){

    //console.log(this.params);

    this.$SREventElement = $("<div class='SREventElement minified'/>");
    this.$SREventElement.data().eventObj = this.params;

    //this.$SREventElementExtended = $("<div class='SREventElementExtended out'/>");


    if(typeof this.params.visitor_id !== "undefined"){

        var visitorId =this.params.visitor_id;
        var timestamp =this.params.timestamp;
        var impressionsArray =this.params.impressions;

        var viewedProductsArray = this.params.viewed_products;


        //VIEWED PRODUCTS
        var $viewProductsGrp = $("<div class='viewProductsGrp'/>");

        var isScarab = false;
        if(typeof viewedProductsArray != "undefined"){

            if(viewedProductsArray.length){

                for(var productIdx = 0; productIdx < viewedProductsArray.length; productIdx++){
                    var prodId = viewedProductsArray[productIdx].id;
                    var prodF = viewedProductsArray[productIdx].f;
                    if(typeof prodF != "undefined"){
                        //console.log(prodF);
                        isScarab = true;
                    }

                    //var imgLink = getImageLink(prodId);
                    //$('<div class="productImage"/>').data('imgLink', null).appendTo($viewProductsGrp);

                    //$('<div class="productImage" style="background-image: url('+imgLink+')"/>').appendTo($viewProductsGrp);


                }
            }

        }
        else{
            //console.warn('no items where found');
        }

        //RELATED

        //var $impressionGrp = $("<div class='impressionGrp'/>")

        /*
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

                    //var imgLink = getImageLink(itemId);

                    //console.log(itemId, imgLink);
                    $('<div class="productImage"/>').data('imgLink', null).appendTo($impressionItemsGrp);

                    //$('<div class="productImage" style="background-image: url('+imgLink+')"/>').appendTo($impressionItemsGrp);


                }
            }
            else{
                //console.warn('no items where found');
            }

        }

        */

        //process time stamp
        //var date = srTimeStampToDate({srTimestamp:timestamp, format:"jquery"});
        var date = timestamp;
        //
        //var $topMarker = $('<div class="topMarker"/>');
        //var $bottomMarker = $('<div class="bottomMarker"/>');

        /*

        this.$SREventElementExtended.append(
            //$topMarker,
            //$bottomMarker,

            $('<div class="inlineInfo"/>').append(
                $('<span class="visitorId"/>').text(visitorId)
                //$('<span class="timestamp"/>').html(date)
            )
            //$viewProductsGrp,
            //$impressionGrp

        ).attr('id', visitorId);

        */

        //this.$SREventElementExtended.data().markers = {
        //    top:$topMarker,
        //    bottom:$bottomMarker
        //};

        this.$SREventElement.append(

            $('<div class="inlineInfo"/>').append(
                (function(c_isScarab){
                    var $icon = $("<i class='fa'/>");
                    if(c_isScarab){
                        $icon.addClass('fa-bug')
                    }
                    return $icon;
                }(isScarab)),
                $('<span class="visitorId"/>').text(visitorId),
                //,$('<span class="timestamp"/>').html(date)

                (function(){
                    return $("<i class='fa fa-search'/>").on('click', function(evt){
                        evt.stopPropagation();
                        console.log($(this).siblings('.visitorId').text());
                        $('#filter').val($(this).siblings('.visitorId').text()).trigger('change');

                    })
                }())

            )

        ).on('click', function(){
                $(this).trigger("onLittleBrotherClicked");
            });
    //.attr('id', visitorId);

    }

    //cross reference twin brothers
    //this.$SREventElement.data().twin = this.$SREventElementExtended;
    //this.$SREventElementExtended.data().twin = this.$SREventElement;

};

SREventElement.prototype.bindDomEvents = function(){

    //this.$SREventElementExtended.on("onOutOfBuffer", function(){
    //    $(this).addClass("out");
    //});

    this.$SREventElement.on("onInView", function(){

        $(this).addClass("IN");


        //display imgLink
        //var $productImage = $(this).find(".itemsGrp .productImage");
        //$productImage.each(function(){
        //    var $this = $(this);
        //    var imgLink = $this.data('imgLink');
        //    $this.css("backgroundImage", "url("+imgLink+")");
        //
        //});

    });

    //onOutView
    this.$SREventElement.on("onOutView", function(){
        $(this).removeClass("IN");
        //display imgLink
        //var $productImage = $(this).find(".itemsGrp .productImage");
        //$productImage.each(function(){
        //    var $this = $(this);
        //    var imgLink = $this.data('imgLink');
        //    $this.css("backgroundImage", "url("+imgLink+")");
        //
        //});

    });


    //this.$SREventElementExtended.on("onInOfBuffer", function(){
    //    $(this).removeClass("out");
    //    //display imgLink
    //    var $productImage = $(this).find(".itemsGrp .productImage");
    //    $productImage.each(function(){
    //        var $this = $(this);
    //        var imgLink = $this.data('imgLink');
    //        $this.css("backgroundImage", "url("+imgLink+")");
    //
    //    });
    //
    //});



};

SREventElement.prototype.getAvatars = function(){
    return {
        //bigBrother:this.$SREventElementExtended,
        littleBrother:this.$SREventElement};
};
SREventElement.prototype.getId = function(){
    return this.params.visitor_id;
};

