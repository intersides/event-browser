/**
 * Created by marco.falsitta on 04/04/15.
 */
var SREventElement = function(in_params, in_putInEvidence){

    this.params = in_params;

    this.putInEvidence = in_putInEvidence;

    this.init();
};
SREventElement.prototype.init = function(){

    this.createAvatars();
    this.bindDomEvents();

};

SREventElement.prototype.createAvatars = function(){

    var _this = this;
    //console.log(this.params);

    this.SREventElement = document.createElement("div");
    this.SREventElement.className = 'SREventElement minified';
    this.SREventElement.setAttribute('id', this.params.random);

    this.SREventElement.eventObj = this.params;


    if(typeof this.params.visitor_id !== "undefined"){

        var visitorId =this.params.visitor_id;
        var timestamp =this.params.timestamp;
        var impressionsArray =this.params.impressions;

        var viewedProductsArray = this.params.viewed_products;


        //VIEWED PRODUCTS
        //var viewProductsGrp = document.createElement('div').className = "viewProductsGrp";
        //var $viewProductsGrp = $("<div class='viewProductsGrp'/>");

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


        //process time stamp
        //var date = srTimeStampToDate({srTimestamp:timestamp, format:"jquery"});
        var date = timestamp;


        //console.log(this.putInEvidence);

        this.SREventElement.appendChild(

            (function(){
                var inlineInfoDiv = document.createElement('div');
                inlineInfoDiv.className="inlineInfo";

                inlineInfoDiv.appendChild(

                    (function(c_isScarab){
                        var icon = document.createElement('i');
                        icon.className = 'fa';
                        if(c_isScarab){
                            icon.className += ' fa-bug';
                        }
                        return icon;
                    }(isScarab))

                );
                inlineInfoDiv.appendChild(
                    (function(c_visitorId, c_putInEvidence){

                        var htmlVisitorId = document.createElement('span');
                        htmlVisitorId.className = "visitorIdValue";

                        if(c_putInEvidence.filterValue != "" && c_putInEvidence.item == 'visitorId' ){
                            //split
                            htmlVisitorId.innerHTML = c_visitorId.replace(c_putInEvidence.filterValue, "<span class='inFilter'>"+c_putInEvidence.filterValue+"</span>")
                        }
                        else{
                            htmlVisitorId.textContent = c_visitorId;
                        }

                        var visitorId = document.createElement('span');
                        visitorId.appendChild(htmlVisitorId);
                        visitorId.className='visitorId';
                        return visitorId;

                    }(visitorId, _this.putInEvidence))

                );
                inlineInfoDiv.appendChild(
                    (function(){
                        var searchIcon =  document.createElement('i');
                        searchIcon.className='fa fa-search';
                        searchIcon.onclick = function(evt){
                            evt.stopPropagation();

                            var siblings = this.parentNode.childNodes;

                            var visitorId = null;
                            for(var elemIdx in siblings){
                                if(siblings[elemIdx].className == 'visitorId'){
                                    visitorId = siblings[elemIdx];
                                    break;
                                }
                            }
                            var filterInput = document.getElementById('filter');
                            filterInput.value = visitorId.textContent;

                            //manually trigger the change event
                            if ("createEvent" in document) {
                                var evt = document.createEvent("HTMLEvents");
                                evt.initEvent("change", false, true);
                                filterInput.dispatchEvent(evt);
                            }
                            else{
                                filterInput.fireEvent("onchange");
                            }

                        };
                        return searchIcon;
                    }())
                );

                return inlineInfoDiv;

            }())

        );

        this.SREventElement.onclick = function(){
            $(this).trigger("onLittleBrotherClicked");
        };


    }

};

SREventElement.prototype.bindDomEvents = function(){

};

SREventElement.prototype.getAvatars = function(){
    return this.SREventElement;

};
SREventElement.prototype.getId = function(){
    return this.params.visitor_id;
};

