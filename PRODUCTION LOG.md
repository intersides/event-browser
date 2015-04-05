# Event Browser Production log

This file should be considered as a development diary and not a production document therefore it might not be correctly updated with the latest code.

## Additional ideas

To implement a node.js server that can send the events objects sequentially as they are read from the events.js file.

The event objects are sent asynchronously using a web-socket. At this very moment there is no session or connection management and multiple connected clients my affect each-others operations.

**The current web-socket server is still at his basic development level.**



### WISH LIST

* `linked-list`: build a linked in system that keep tracks of pagination.
* `filtering`: filter results.
* `searching`: searching for users.


### TODO LIST

* `optimizing`: pagination or loading and dumping assets based on `in-view` visibility .

### THE SERVER

The server is a node.js server. It is split into a http server and a web-socket server. The client communicates with ajax POSTs and with a web-socket tunnel.

### SERVER REQUIREMENTS

* Install the npm modules
* run `npm start`

**Read the console of the node.js server. Http server responds to port 7777, ws-socket server to port 5000**.

### CLASSES 
JS function describing object are in js/entities.

* `EventManager.js`:  keep tracks of event stream and current event. Watches on event array changes and emits DOM events for drawing items. It should also implement lower level data-management such linked-list (still in wish list)
* `SREventElement.js`: wrapper to build jQuery "avatars" to display event content.

## TOOLS
Added `srTimeStampToDate` to convert timestamp into data object and/or jquery element.

