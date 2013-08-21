# Event Browser

A homework assignment for testing your front-end chops.

## Problem Statement

Here at Scarab Research, we collect a huge amount of behavioral data: customers view and buy products, add them to their carts and wishlists, search for various terms, browse category pages. They also look at and click on recommendations and ads served by our servers. Hundreds of these events happen every single second.

Our algorithms are very good at chewing through this raw stream of data, but it would be nice for us humans to be able to make sense of it as well.

**Your task is to build a tool that gives us X-ray vision into the event stream.**

### The data you get

The template in this repository loads the event stream into the global variable `events`. It is an array containing actual data from one of our clients. Let's pretend that you got this data from an actual live web service. It should be fairly obvious to figure out what's in the data without a schema (use an inspector like Chrome DevTools).

Some notes on non-trivial fields:

* `added_products` contains the items currently being added to the cart
* `cart` contains the current cart contents.
* `viewed_products`, `added_products`, `purchased_products` and `cart` are list of item info objects. Item infos have the following fields:
  * `id`: the product ID
  * `f`: the feature ID. Indicates that the event originated from a recommender box.
  * `p`: total price
  * `q`: quantity
* `impressions`
  * a list of recommender boxes (features) that was shown to the visitor (eg. RELATED, PERSONAL)
  * each entry contains a list of product IDs (`item_impressions`)

One event may contain several of the above fields. For example the following event object says that visitor `4F6B6D2E72F75AA7` viewed product `149923` and was presented with a recommendation box (RELATED_CZ) containing 6 products.

    impressions: Array[1]
      0: Object
        feature_id: "RELATED_CZ"
        item_impressions: Array[6]
          0: "148036"
          1: "143883"
          2: "150371"
          3: "58590"
          4: "79807"
          5: "128128"
    timestamp: "20130820T100002Z"
    viewed_products: Array[1]
      0: Object
        id: "149923"
    visitor_id: "4F6B6D2E72F75AA7"

Use the `getImage` global function to get an image thumbnail representing the product ID. This will be helpful to actually show the data, not just some meaningless IDs.

    > getImage(events[0].viewed_products[0].id)
    "http://89130063.r.cdn77.net/data/tovar/_m/149/m149923.jpg"

### Task 1 - Show the event stream

Build a page that shows the event stream line-by-line, just as if it were a Twitter feed. Show the most recent event first. The actual display is up to you, but you should show us everything you can about a particular event (timestamp, visitor ID, event type(s), products that the visitor interacted with, at least the first few products that we recommended to the user).

Events that are generated directly from Scarab recommendation boxes (`iteminfo.f != null`) should really stand out visually.

You might want to avoid showing all the events at once (you don't want the browser to load thousands of images). Provide some sort of pagination facility instead.

### Task 2 - Filter individual visitors

Now we have a way of eyeballing the event stream, which is cool, but using this tool still feels like drinking from a fire hose. Let's say we want to see how a specific visitor interacts with the site. Clicking on a visitor ID in the event stream should show events from that particular visitor, and everything else should be filtered out.

Nice to have:

* Do this without a page refresh
* Don't break the browser's history handling. (Use the History API.)
* If I find an interesting visitor history (eg. where the recommendations are horrendously wrong) I should be able to send my current view over to the rest of the team so that we can investigate together. (Make the visitor ID part of the URL.)

### Task 3 - Filter individual products

This is similar to task #2, but with product IDs. When I click on a product ID, I should see all the events that have anything to do with that particular product (and nothing else)

### Task 4 - Top visitors

Having the ability to filter for individual visitors and products is nice, but it's still hard to find the really interesting visitors and products.

Provide a little statistics page (if possible within the application, without a page load) that summarizes some interesting metrics of the top 20 visitors:

* number of events
* number of views
* total value of purchased products
* number of impressions shown to the user
* number of clicks (views where `iteminfo.f != null`)
* click-through-rate (number of clicks divided by the number of impressions)

It would be nice to be able to sort this little table by the above metrics.

### Task 5 - Top products

Similar to #4, provide a statistics page of the 20 most popular products. Interesting metrics:

* number of views
* number of purchases
* number of times we recommended the product
* number of times people clicked on the product
* CTR of the product

## Your Submission

1. fork this repository here, on Bitbucket.
2. solve the assignment (commit early and often!)
3. invite us to your repo (andrascsibi, phraktle)

### Additional notes

* Don't waste your time with IE8. We will test your tool in the latest Chrome and Firefox.
* Use any CSS/JS library/framework you want. Good coders code, great reuse.

### Hints
