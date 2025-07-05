Protocols: `graphql-ws`, `graphql-subscriptions`
Note that `graphql-subscriptions` is deprecated

# Handlers

## `connectionHandler`


Main entry point. When the websockets server connects, the `connectionHandler` is called.

It doesn't look to do much interesting except set up other handlers and also check for an invalid setup. What is invalid in this case?

Seems to be invalid if the protocols doesn't contain either of the above protocols.

## `this.onMessage`

I suspect this is where our problem lies.
