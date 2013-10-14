var getImage = function(id) {
  if ('scarab/homepage' === id) {
    return 'images/homepage.png';
  }
  var sub = id.substring(0, id.length-3);
  return "http://89130063.r.cdn77.net/data/tovar/_m/" + sub + "/m" + id + ".jpg";
};
