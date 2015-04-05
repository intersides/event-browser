/**
 * Created by marco.falsitta on 04/04/15.
 */

module.exports = function(httpApp){

    httpApp.post('/A', function(req, res){
        console.log('got A request');
        res.send({response:"AA"});
    });

    httpApp.post('/onInit', function(req, res){
        console.log('got onInit request but I do not know what to do with this at the moment');
        res.send({response:"onInitResponse"});
    });

};