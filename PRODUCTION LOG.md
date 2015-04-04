# Event Browser Production log

This file should be considered as a development diary and not a production document therefore it might not be correctly updated with the latest code.

## Additional ideas

To implement a node.js server that can send the events objects sequentially as they are read from the events.js file.

The event objects are sent asynchronously using a web-socket. At this very moment there is no session or connection management and multiple connected clients my affect each-others operations.

**The current web-socket server is still at his basic development level.**


### TODO LIST

* `linked-list`: build a linked in system that keep tracks of pagination.
* `filtering` filter results.
* `searching` searching for users.

### THE SERVER

The server is a node.js server. It is split into a http server and a web-socket server. The client communicates with ajax POSTs and with a web-socket tunnel.

### SERVER REQUIREMENTS

* Install the npm modules
* run `npm start`

**Read the console of the node.js server. Http server responds to port 7777, ws-socket server to port 5000**.

more to come...

