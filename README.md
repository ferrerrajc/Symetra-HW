# Symetra HW

This project contains:
* a node express server to implement a small commerce REST API with support for using coupons for discounts
* a nextjs storefront UI to demonstrate the functionality of the backend server

### Prerequisites

In order to build and run this project, you will need node installed.

### Startup

In order to see the full project running, you will need to start the backend server, followed by the frontend UI server.

1. open a terminal in the `server` directory, and follow the [server startup](./server/README.md#startup) steps.
1. open a terminal in the `storefront` directory, and follow the [storefront startup](./storefront/README.md#startup) steps.

See [storefront/README.md](./storefront/README.md) for an overview of the supported operations in the UI, or browse the API docs also provided by the storefront UI.

### Discussion

I chose to define the [API spec](./server/spec/SymetraHW-v1.0.json) in the openapi format so that
1. I could easily generate client code to use on the frontend and
1. I could easily share type definitions between the projects

#### If I were to continue...

The front end application was kept to a single React component to simplify state management with an eye for development speed.
If I was to continue the project, I would probably add something else for shared state (logged in user, cart state) and split components out for reuse and readabilty.
I'd also move the "log in" from a state value in the front end to a request to the back end, even if I don't add any sort of auth.

The coupon functionality is also pretty simple. They only have the ability to reduce the total transaction price by a percent amount, such as "10% off", and they can only be redeemed by each customer one time. If I spent more time on the coupon model, I would probably make the "discount" part of the coupon data a function of transaction data. In that way, you would be able to implement things like "$5 off when you spend $25" or "20% off groceries".

There are no timestamps tied to the transactions, so when checking if a customer has made `n` transactions to be eligible for a coupon, it checks if they have _ever_ made at least `n` transactions. Adding timestamp data would allow for coupon campaigns to run for certain periods of time. "15% off all summer" or "10% off your 4th purchase every month"