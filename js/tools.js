var getImage = function(id) {
  if ('scarab/homepage' === id) {
    return 'images/homepage.png';
  }
  var sub = id.substring(0, id.length-3);
  return "http://89130063.r.cdn77.net/data/tovar/_m/" + sub + "/m" + id + ".jpg";
};


/**
 * Just a wrapper
 */
var getImageLink = getImage;

//process timestamp
/**
 *Convert the SR timestamp found in the event stream as data object
 *
 * @author marco.falsitta@me.com
 * @param in_params
 * @returns {null}
 * @version 0.1
 *
 */
var srTimeStampToDate = function (in_params) {
    var returningDate = null;
    if (typeof in_params == "undefined" || in_params == null) {
        throw new {
            name: "SR error",
            message: "object parameter required"
        };
    }
    //TODO:continue validation of passed parameters
    var srTimestamp = in_params['srTimestamp'];

    //TODO:optimize this code
    var a_srTimestamp = srTimestamp.split('T');

    var year = a_srTimestamp[0].slice(0, 4);
    var month = a_srTimestamp[0].slice(4, 6);
    var day = a_srTimestamp[0].slice(6,8);

    var hour = a_srTimestamp[1].slice(0,2);
    var minutes = a_srTimestamp[1].slice(2,4);
    var seconds = a_srTimestamp[1].slice(4,6);


    var date = new Date(year, month, day, hour, minutes, seconds);

    returningDate = (year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds);

    if(typeof in_params['format'] !== "undefined"){


        switch(in_params['format']){

            case "timestamp":{
                returningDate = date.getTime();
            }break;

            case "jquery": {
                if(!jQuery){
                    throw new {
                        name: "SR error",
                        message: "jQuery is not defined"
                    };
                }
                returningDate = jQuery('<div class="srDate"/>').append(
                    jQuery('<span class="date" />').append(
                        jQuery('<span class="year" />').text(year),
                        jQuery('<span class="month" />').text(month),
                        jQuery('<span class="day" />').text(day)
                    ),
                    jQuery('<span class="time" />').append(
                        jQuery('<span class="hour" />').text(hour),
                        jQuery('<span class="minutes" />').text(minutes),
                        jQuery('<span class="seconds" />').text(seconds)
                    )


                )
            }break;

            default:{
                console.warn("date formatting not recognized, using predefined format");
                //keep the above default
            }break;
        }
    }

    //console.log(a_srTimestamp, date);


    return returningDate;

};