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

    this.pageNumber = 0;
    this.currentPage = null;



    this.init();

};
Paginator.prototype.init = function(){

    console.log(this.params.srEvents.length);

    this.initPageList();
    this.buildAvatars();
    this.bindDomEvents();

    this.gotoPage(1);


};
Paginator.prototype.initPageList = function(){

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

    console.log(this.firstPage, this.lastPage);

};

Paginator.prototype.bindDomEvents = function(){
    var _this = this;

    this.$paginatorTable.on('onPaginatorAttachedToDom', function(evt){
        _this.gotoPage(1);
        $(this).trigger({
            type:"onPageChanged",
            pageObj:_this.currentPage
        });
    });

    this.$paginatorTable.on('onPageChanged', function(evt){
        console.log('onPageChanged', evt.pageObj);
        //deterine range
        var startRange = evt.pageObj.params.range.start;
        var endRange = evt.pageObj.params.range.end;

        for(var i = startRange; i <= endRange; i++ ){
            console.log(_this.params.srEvents[i]);
        }


    });


};

Paginator.prototype.buildAvatars = function(){

    var _this = this;

    this.$paginatorTable = $('<table/>');

    this.$previousButton = $('<button/>').text('<').on('click', function(){

        _this.gotoPrevious();
        $(this).trigger({
            type:'onPageChanged',
            pageObj:_this.currentPage
        });

    });


    this.$nextButton = $('<button/>').text('>').on('click', function(){

        _this.gotoNext();
        $(this).trigger({
            type:'onPageChanged',
            pageObj:_this.currentPage
        });

    });

};
Paginator.prototype.buildTable = function(){
    var _this = this;
    console.log(this.params.srEvents.length);

    this.$paginatorTable.append(
        $('<thead/>').append(
            $('<tr/>').append(
                $('<th/>').text('visitor id'),
                $('<th/>').text('creation time')
            )
        ),
        $('<tfoot/>').append(
            $('<tr/>').append(
                $('<td/>').append(
                  _this.$previousButton
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
        this.currentPage = this.firstPage;
    }
    else{
        var currentPageIndex = this.currentPage.params.idx;
        this.currentPage = this.pages[currentPageIndex+1];
    }

    console.log(this.currentPage, this.currentPage.params.idx);

};
Paginator.prototype.gotoPrevious = function(pageId){

    if(this.currentPage == this.firstPage){
        this.currentPage = this.lastPage;
    }
    else{
        var currentPageIndex = this.currentPage.params.idx;
        this.currentPage = this.pages[currentPageIndex-1];
    }

    console.log(this.currentPage, this.currentPage.params.idx);



};
Paginator.prototype.gotoPage = function(pageId){
    this.loadPage(pageId-1);
};
Paginator.prototype.loadPage = function(pageId){

    this.currentPage = this.pages[pageId];

    console.log("current page:",this.currentPage.params.idx);


};

var Page = function(in_params){
    this.params = $.extend({
    }, in_params);

    this.init();

};
Page.prototype.init = function(){

};