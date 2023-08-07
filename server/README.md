# API Server

This express server implements the required API for an assignment for the Symetra interview process.

* A public API to view products and coupons, and to make transactions
* An admin API to create coupons and see a full transaction history

See the API docs provided in the [storefront](../storefront/README.md) web application.

### Startup

Install dependencies by running
```
npm install
```

Run Unit tests by running
```
npm run test
```

Start the backend server by running
```
npm run start
```

The server will begin accepting requests at http://localhost:7070

Follow the [storefront startup](../storefront/README.md#startup) instructions and use the storefront UI to interact with the API.