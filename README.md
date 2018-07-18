<!DOCTYPE html>
<html>
<body>
<h1>Academy Days Test Tool (NodeJS)</h1>

<p>This tool allows Sailthru clients to mimic an API POST to the <a href="https://getstarted.sailthru.com/developers/api/user/" target="_blank">user</a>, <a href="https://getstarted.sailthru.com/developers/api/event/" target="_blank">event</a>, <a href="https://getstarted.sailthru.com/developers/api/content/" target="_blank">content</a>, and <a href="https://getstarted.sailthru.com/developers/api/purchase/" target="_blank">purchase</a> endpoints, as well as <a href="https://getstarted.sailthru.com/email/lo/automate-abandoned-cart-reminders/" target="_blank">cart</a> and <a href="https://getstarted.sailthru.com/email/lo/browse-abandon/" target="_blank">browse</a> abandon entries.</p>

<h2>User API</h2>
<p>Enter your email address plus one of the pre-set Master Lists to trigger a Lifecycle Optimizer "List Joined" flow. You can optionally set a single user variable as well.</p>

<h2>Event API</h2>
<p>Enter your email address plus an event name to trigger a Lifecycle Optimizer "Custom Event" flow. You can optionally set a single event variable as well.</p>

<h2>Content API</h2>
<p>Enter your URL and title to automatically publish a piece of content to Sailthru. You can optionally set a single content variable, tags, and an image URL as well.</p>

<h2>Purchase API</h2>
<p>Enter your email address plus an item URL, title, price, and quantity to either post a complete or incomplete purchase. ou can optionally set a single purchase variable, tags, and an image URL as well. Clicking "Purchase" can trigger a Lifecycle Optimizer "Purchase Made" flow; clicking "Add to Cart" will add an item to the user's cart (does not trigger a flow); clicking "Return" will return the item (this leverages the /return endpoint, not the /purchase endpoint).</p>

<h2>Send API</h2>
<p>Enter your email and select a template to automatically trigger a template. You can optional pass a single send variable, CC, BCC, reply-to, and behalf of email. This lets you trigger a Transactional Send flow in Lifecycle Optimizer, and subsequently Transactional Open and Click flows.</p>

<h2>Cart Abandon</h2>
<p>Enter your email address to kick off a Lifecycle Optimizer "Cart Abandoned" flow. The email address you enter will be automatically cookied and log a pageview, as well as have a pre-set item added to its cart.</p>

<h2>Browse Abandon</h2>
<p>Enter your email address to kick off a Lifecycle Optimizer "Browse Abandoned" flow. The email address you enter will be automatically cookied and log a pageview, but not item will be added to its cart.</p>

</body>
</html>