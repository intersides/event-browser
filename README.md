# Event Browser

A homework assignment for testing your front-end chops.

## Problem Statement

Here at Scarab Research, we collect a huge amount of behavioral data: customers view and buy products, add them to their carts and wishlists, search for various terms, browse category pages. They also look at and click on recommendations and ads served by our servers. Hundreds of these events happen every single second.

Our algorithms are very good at chewing through this raw stream of data, but it would be nice for us humans to be able to make sense of it as well. We need a tool that gives us X-ray vision into this stream of events.

### Task 1 - Show the event stream

You will find two JSON files in this repository:

 * `events.json` is an array containing the event stream. It is sorted by time.
 * `products.json` is a mapping that contains product metadata (like title & image)

Pretend that you get this data from an actual live web service. It should be fairly obvious to figure out what's in the data without a schema (use an inspector like Chrome DevTools).

We care about the following things:

* `viewed_products`
  * a list of product IDs that the visitor viewed
  * usually contains one item
* `added_products`
  * a list of product IDs that the visitor added to her shopping cart
  * usually contains one item
  * contains the quantity and the price of the item
* `purchased_products`
  * a list of product IDs that the visitor bought
  * contains the quantities and the prices of the items
* `impressions`
  * a list of recommender boxes (features) that was shown to the visitor
  * each entry contains a list of product IDs (`item_impressions`)

One item in the `events` array may contain several events. Eg. the visitor viewed product X and was shown the RELATED recommender box (products Y1, Y2, Y3, Y4) and the PERSONAL recommender box (containing products Z1, Z2).

Your tool should present this data as a list of entries (or rows), each entry (or row) representing one item of the events array.

An entry representing an event should contain:

* timestamp (when did the event happen)
* visitor ID (who produced the event)
* the type of event
* the product(s) involved in the event

### Task 2 - Filter individual visitors and products

### Task 3 - Top visitors and products

## Submission

1. fork this repository here, on Bitbucket.
2. solve the assignment (commit often!)
3. invite us to your repo (andrascsibi, phraktle)

