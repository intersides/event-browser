/**
 * Created by marco.falsitta on 08/04/15.
 */
var Paginator = function(in_params){

    this.params = $.extend({
        itemsPerPage:5,
        srEvents:[]
    }, in_params);

    /**
     * reference to page nodes
     * @type {Array}
     */
    this.pages = [];
    this.firstPage = null;
    this.lastPage = null;

    this.currentPage = null;

    this.totalPages = 0;

    this.init();

};
Paginator.prototype.init = function(){

    //console.log(this.params.srEvents.length);

    this.initPageList();
    this.buildAvatars();
    this.bindDomEvents();

};
Paginator.prototype.initPageList = function(){
    console.log("initPageList");

    var itemsPerPage = this.params.itemsPerPage;
    var page = null;

    var steps = 0;
    var i;
    for(i = 0; i < this.params.srEvents.length; i++){

        if(i%this.params.itemsPerPage == 0){

            var startItems = steps*itemsPerPage;
            var endItems = startItems+itemsPerPage-1;

            //console.log("id:"+i, "start:"+startItems, "end:"+endItems);

            page = new Page({
                idx:steps,
                range:{
                    start:startItems,
                    end:endItems
                }
            });

            this.pages.push(page);

            if(i == 0){
                this.firstPage = page;
            }

            steps++;


        }

    }
    this.lastPage = page;

    this.totalPages = steps;

    //console.log(this.firstPage, this.lastPage, this.totalPages);

};

Paginator.prototype.bindDomEvents = function(){
    var _this = this;

    this.$paginatorTable.on('onPaginatorAttachedToDom', function(evt){

        //console.error(_this.$pagesHolder.outerWidth());
        var last = null;
        var itemWidth = 50;
        var margins=2;
        var padding=2;
        var borderWidth = 1;

        //var $previousElement = null;
        for(var i = 0; i < _this.totalPages; i++){
            var $pageAvatar = $('<span class="pageIcon"/>').text(i).css({
                margin:margins,
                padding:padding,
                width:itemWidth,
                borderWidth:borderWidth
            }).on('click', function(){
                _this.setPage($(this).data('pageN'));
            }).data('pageN', i);
            _this.pages[i].setPageButtonAvatar($pageAvatar);

            //var computedWidth = itemWidth*(i+1)+padding+margins+borderWidth;
            //if(computedWidth <= _this.$pagesHolder.outerWidth()){

                //console.log("computedWidth = ", computedWidth);

                _this.$pagesHolder.append($pageAvatar);
                //$previousElement = $pageAvatar;

            //}
            //else{
            //    $previousElement.text('...');
            //    break;
            //}


        }


        _this.setPage(0);

    });

    this.$paginatorTable.on('onPageChanged', function(evt){

        //console.info('Paginator:onPageChanged');
        var triggeringElementId = null;
        if(evt.triggeringElementId){
            triggeringElementId = evt.triggeringElementId;
        }


        //recover range
        var startRange = _this.currentPage.params.range.start;
        var endRange = _this.currentPage.params.range.end;

        //console.log(startRange, endRange);

        //set the relevant button as selected and clear the current one.
        var $currentPageButtonAvatar = _this.pages[_this.currentPage.params.idx].getPageButtonAvatar();

        $currentPageButtonAvatar.siblings().removeClass('selected');
        $currentPageButtonAvatar.addClass('selected');

        //set selected page in focus.
        var $buttonContainer =  $currentPageButtonAvatar.parent();

        var parentLeft = $buttonContainer.offset().left;
        var buttonLeft = $currentPageButtonAvatar.offset().left;

        var parentMaxRigth = $buttonContainer.outerWidth()+parentLeft;
        var buttonMaxRight = $currentPageButtonAvatar.outerWidth()+buttonLeft;

        var differenceRL = parentMaxRigth - buttonMaxRight;
        if(differenceRL < 0){
            $buttonContainer.animate({scrollLeft: "-="+differenceRL}, 200);
        }
        else{
            var differenceLeftOverflow = parentLeft - buttonLeft;
            if(differenceLeftOverflow > 0){
                //console.error(differenceLeftOverflow);
                $buttonContainer.animate({scrollLeft: "-="+differenceLeftOverflow}, 200);
            }

        }
        //console.log(parentMaxRigth, buttonMaxRight, differenceRL);

        var srEventsInFocus = [];
        for(var i = startRange; i <= endRange; i++ ){
            var srEvent = _this.params.srEvents[i];
            //console.log(srEvent);
            srEventsInFocus.push(srEvent)
        }

        _this.$paginatorTable.trigger({
            type:'srEventsInFocus',
            eventsInFocus:srEventsInFocus
        });


        _this.refreshFrameAvatar(triggeringElementId);


    });

};
Paginator.prototype.pageIndexContainingItemWithIndex = function(in_index){

    return parseInt(in_index/this.params.itemsPerPage);

};

Paginator.prototype.assignLittleAvatar = function(in_index, in_$avatar){

    var pageIndex = this.pageIndexContainingItemWithIndex(in_index);

    this.pages[pageIndex].navEventAvatars[in_index] = in_$avatar;

    //console.warn(in_index, this.params.itemsPerPage, pageIndex, this.pages[pageIndex]);

};
Paginator.prototype.refreshFrameAvatar = function(triggeringElementId) {

    console.info("Paginator:refreshFrameAvatar, need to identify who triggered the selection");



    var _this = this;
    var startRange = this.currentPage.params.range.start;
    var endRange = this.currentPage.params.range.end;

    var allSREventElements = document.getElementsByClassName('SREventElement');
    domExtendedRemoveClass(allSREventElements, 'selected');

    var $firstOfPage = this.currentPage.navEventAvatars[startRange];

    //cannot rely on endRange since in the last page
    //there might be less items that the page full range
    var $lastOfPage = this.currentPage.navEventAvatars[endRange];
    var lastItemIndex = endRange;
    for(var idx in this.currentPage.navEventAvatars){
        $lastOfPage = this.currentPage.navEventAvatars[idx];
        lastItemIndex = idx;
    }

    if(typeof $firstOfPage !== "undefined"){

        for(var i = startRange; i <= lastItemIndex; i++){

            var navEventAvatars = _this.currentPage.navEventAvatars[i];

            if(typeof navEventAvatars !== "undefined"){
                navEventAvatars.SREventElement.className += ' selected';
            }

        }
    }
    else{
        console.error('cannot find the $firstOfPage avatar');
    }

    if(triggeringElementId){


        var srEventElementExtended = document.querySelector('[data-srid="'+triggeringElementId+'"]');

        $(srEventElementExtended).trigger({
            type:"onSREventReadyToBeCentered"
        });


    }



};
Paginator.prototype.buildAvatars = function(){

    var _this = this;

    this.$paginatorTable = $('<table id="Paginator"/>');

    this.$previousButton = $('<button/>').text('<').on('click', function(){
        _this.gotoPrevious();
    });

    this.$nextButton = $('<button/>').text('>').on('click', function(){
        _this.gotoNext();
    });


    //this.$pageFrameAvatar = $('<div class="pageFrameAvatar"/>');

};
Paginator.prototype.buildTable = function(){
    var _this = this;
    //console.log(this.params.srEvents.length);


    this.$pagesHolder = $('<div class="pagesHolder"/>');
    this.$paginatorTable.append(
        //$('<thead/>').append(
        //    $('<tr/>').append(
        //        $('<th/>').text('visitor id'),
        //        $('<th/>').text('creation time')
        //    )
        //),
        $('<tfoot/>').append(
            $('<tr/>').append(
                $('<td/>').append(
                  _this.$previousButton
                ),
                $('<td/>').append(
                    this.$pagesHolder
                ),
                $('<td/>').append(
                    _this.$nextButton
                )
            )
        )
    );

    return this.$paginatorTable;

};
Paginator.prototype.gotoNext = function(pageId){

    if(this.currentPage == this.lastPage){
        this.setPage(this.firstPage.params.idx);
    }
    else{
        this.setPage(this.currentPage.params.idx+1);
    }


};
Paginator.prototype.gotoPrevious = function(pageId){

    if(this.currentPage == this.firstPage){
        this.setPage(this.lastPage.params.idx);
    }
    else{
        this.setPage(this.currentPage.params.idx-1);
    }

};
Paginator.prototype.setPage = function(pageId, srEventId){

    var triggeringElementId = null;
    if(srEventId){
        triggeringElementId = srEventId;
    }


    if(this.pages.length > 0){
        this.currentPage = this.pages[pageId];
        this.$paginatorTable.trigger({
            type:'onPageChanged',
            triggeringElementId:triggeringElementId
        });
    }
    else{
        console.warn('paginator has no pages');
        this.$paginatorTable.trigger('onEmptyPages');
    }

};
Paginator.prototype.getCurrentPage = function(){
    return this.currentPage;
};
//Paginator.prototype.getPageFrameAvatar = function() {
//    return this.$pageFrameAvatar;
//};

//Paginator.prototype.getViasibleItemsFrame = function() {
//    return this.$viasibleItemsFrame;
//};


var Page = function(in_params){
    this.params = $.extend({
    }, in_params);

    this.navEventAvatars = [];

    this.init();
    this.buildAvatars();

};
Page.prototype.init = function(){

};
Page.prototype.buildAvatars = function() {
    this.$buttonAvatar = null;

    var itemsInPage = this.params.range.end - this.params.range.start;

    for(var i = 0; i < itemsInPage; i++){

    }

};
Page.prototype.buildAvatars = function() {
    this.$buttonAvatar = null;


};
Page.prototype.setPageButtonAvatar = function(in_$pageButton) {
    this.$buttonAvatar = in_$pageButton;

};
Page.prototype.getPageButtonAvatar = function() {
    return this.$buttonAvatar;
};
Page.prototype.getIndex = function(){
    return this.params.idx;
};

