# Chain of Responsibility

## Intent
Chain of Responsibility is a behavioral design pattern that lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.

## Applicability
- 🐞 Use the Chain of Responsibility pattern when your program is expected to process different kinds of requests in various ways, but the exact types of requests and their sequences are unknown beforehand.

- ⚡️ The pattern lets you link several handlers into one chain and, upon receiving a request, “ask” each handler whether it can process it. This way all handlers get a chance to process the request.

- 🐞 Use the pattern when it’s essential to execute several handlers in a particular order.

- ⚡️ Since you can link the handlers in the chain in any order, all requests will get through the chain exactly as you planned.

- 🐞 Use the CoR pattern when the set of handlers and their order are supposed to change at runtime.

- ⚡️ If you provide setters for a reference field inside the handler classes, you’ll be able to insert, remove or reorder handlers dynamically.

[More info](https://refactoring.guru/design-patterns/chain-of-responsibility)