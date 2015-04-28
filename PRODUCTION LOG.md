# Run the project

The project depends on node.js since it implements a pre-loader useful for large data transfer.
Nodejs is also used to send email notifications as part of the task to share "interesting data" with team members.

User npm to install the node modules locally and **npm start** to run the applicatin server.

After that navigate to **http://localhost:7777/**


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

## RECENT MODIFICATIONS
Apr 18 - Improving performance by converting some jQuery into vanilla javascript.

Apr 20 - Improving performance by converting some jQuery into vanilla javascript for event in its detail form. Preparing for filtering for product id.

Apr 22 - working on adding sharing functionality from interface (json object sent to server via web-socket. Server send emails to colleagues containing object data)

Apr 23 - finished the sharing functionality (still ugly, style to be improved), start working on scroll-feedback for the right column of minimized events


