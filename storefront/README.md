# Storefront

This basic front end was created using Nextjs with client code provided by `openapi-fetch`.
It allows viewing the page as one of two customers, "alice" and "bob", or as an admin.
So, you can use this to try out all of the functionality of the [backend API](../server/README.md).

As Users:
- see available products and eligible coupons
- see your own transaction history
- add products and coupons to a cart to create transactions
- eligible coupons will update as you make transactions

As Admins:
- see all products, coupons, and transaction histories
- create a new coupon for customers to use

There is also a link in the upper left corner of the page which leads to the API Docs powered by `redoc`.

### Startup

Install dependencies by running
```
npm install
```

Build the storefront resources
```
npm run build
```

Start the frontend server
```
npm run start
```

Visit the local page at http://localhost:3000