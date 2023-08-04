import { CouponStore } from "../src/store/couponStore";
import { InMemoryDB } from "../src/store/db";
import { Coupon } from "../src/types/Coupon";
import dummyData from "../src/store/dummyData";
import { generateId } from "../src/util";
import { Transaction } from "../src/types/Transaction";

const coupon1: Coupon = {
  afterTransactions: 1,
  code: "TEST1",
  discountPercent: 5,
  maxUses: 1,
}
const coupon5: Coupon = {
  afterTransactions: 5,
  code: "TEST5",
  discountPercent: 5,
  maxUses: 5,
}

test('create and retrieve a coupon', () => {
  const db = new InMemoryDB(dummyData);
  const couponStore = new CouponStore(db);
  return couponStore.createCoupon(coupon5)
    .then(createResult => {
      expect(createResult).toEqual(coupon5);
      return couponStore.getCouponByCode(coupon5.code)
        .then(getResult => {
          expect(getResult).toEqual(coupon5);
        })
    })
})

test('get all coupons', () => {
  const db = new InMemoryDB(dummyData);
  const couponStore = new CouponStore(db);
  return couponStore.getAllCoupons()
    .then(allCoupons => {
      expect(allCoupons).toHaveLength(dummyData.coupons.length)
      dummyData.coupons.forEach(coupon => expect(allCoupons).toContain(coupon))
    })
})

test('delete a coupon', () => {
  const db = new InMemoryDB(dummyData);
  const couponStore = new CouponStore(db);
  return couponStore.createCoupon(coupon5)
    .then(createResult => {
      expect(createResult).toEqual(coupon5);
      return couponStore.deleteCoupon(coupon5.code)
        .then(() => {
          expect(couponStore.getCouponByCode(coupon5.code)).rejects.toMatch("not found");
        })
    })
})

test('get all transactions', () => {
  const db = new InMemoryDB(dummyData);
  const couponStore = new CouponStore(db);
  return couponStore.getAllTransactions()
    .then(allTransactions => {
      expect(allTransactions).toHaveLength(dummyData.transactions.length)
      dummyData.transactions.forEach(transaction => expect(allTransactions).toContain(transaction))
    })
})

test('get transactions by user ID', () => {
  const db = new InMemoryDB(dummyData);
  const couponStore = new CouponStore(db);

  const user = dummyData.users[0];

  return couponStore.getTransactionsByUserId(user.id)
    .then(userTransactions => {
      userTransactions.forEach(transaction => expect(transaction.user.id).toEqual(user.id))
    })
})

test('create a transaction', () => {
  const db = new InMemoryDB(dummyData);
  const couponStore = new CouponStore(db);

  const user = dummyData.users[0];
  const products = [dummyData.products[0], dummyData.products[4]]
  const transaction = generateId<Transaction>({ user, products, coupons: [] })

  return couponStore.createTransaction(transaction)
    .then(() => couponStore.getAllTransactions())
    .then(allTransactions => {
      expect(allTransactions).toContain(transaction)
    })
})

test('get all products', () => {
  const db = new InMemoryDB(dummyData);
  const couponStore = new CouponStore(db);

  return couponStore.getAllProducts()
    .then(allProducts => {
      expect(allProducts).toHaveLength(dummyData.products.length)
      dummyData.products.forEach(product => expect(allProducts).toContain(product))
    })
})

test('get all users', () => {
  const db = new InMemoryDB(dummyData);
  const couponStore = new CouponStore(db);

  return couponStore.getAllUsers()
    .then(allUsers => {
      expect(allUsers).toHaveLength(dummyData.users.length)
      dummyData.users.forEach(user => expect(allUsers).toContain(user))
    })
})

test('get coupons for user', () => {
  const user = dummyData.users[0]
  const seedData: typeof dummyData = {
    ...dummyData,
    coupons: [coupon1],
    transactions: [generateId({ user, products: [dummyData.products[0]], coupons: []})]
  }

  const db = new InMemoryDB(seedData);
  const couponStore = new CouponStore(db);

  return couponStore.getCouponsForUser(user.id)
    .then(userCoupons => {
      expect(userCoupons).toHaveLength(1)
      expect(userCoupons).toContain(coupon1)
    })
})

test('dont get coupons for user without enough transactions', () => {
  const user = dummyData.users[0]
  const seedData: typeof dummyData = {
    ...dummyData,
    coupons: [coupon5],
    transactions: [generateId({ user, products: [dummyData.products[0]], coupons: []})]
  }

  const db = new InMemoryDB(seedData);
  const couponStore = new CouponStore(db);

  return couponStore.getCouponsForUser(user.id)
    .then(userCoupons => {
      expect(userCoupons).toHaveLength(0)
    })
})

test('dont get coupons for user that have been used up', () => {
  const user = dummyData.users[0]
  const otherUser = dummyData.users[1]
  const seedData: typeof dummyData = {
    ...dummyData,
    coupons: [coupon1],
    transactions: [
      generateId({ user, products: [dummyData.products[0]], coupons: []}),
      generateId({ user: otherUser, products: [dummyData.products[0]], coupons: [coupon1]}),
    ]
  }

  const db = new InMemoryDB(seedData);
  const couponStore = new CouponStore(db);

  return couponStore.getCouponsForUser(user.id)
    .then(userCoupons => {
      expect(userCoupons).toHaveLength(0)
    })
})

test('dont get coupons for user that they have redeemed', () => {
  const user = dummyData.users[0]
  const otherUser = dummyData.users[1]
  const coupon: Coupon = {
    ...coupon1,
    maxUses: 5
  }
  const seedData: typeof dummyData = {
    ...dummyData,
    coupons: [coupon],
    transactions: [
      generateId({ user, products: [dummyData.products[0]], coupons: [coupon]}),
    ]
  }

  const db = new InMemoryDB(seedData);
  const couponStore = new CouponStore(db);

  return couponStore.getCouponsForUser(user.id)
    .then(userCoupons => {
      expect(userCoupons).toHaveLength(0)
    })
})

test('adding nth transaction makes user eligible for coupon', () => {
  const user = dummyData.users[0]
  const seedData: typeof dummyData = {
    ...dummyData,
    coupons: [coupon1],
    transactions: []
  }
  const transaction: Transaction = generateId({ user, products: [dummyData.products[0]], coupons: []});

  const db = new InMemoryDB(seedData);
  const couponStore = new CouponStore(db);

  return couponStore.getCouponsForUser(user.id)
    .then(userCoupons => {
      expect(userCoupons).toHaveLength(0)
    })
    .then(() => couponStore.createTransaction(transaction))
    .then(() => couponStore.getCouponsForUser(user.id))
    .then(userCoupons => {
      expect(userCoupons).toHaveLength(1)
      expect(userCoupons).toContain(coupon1)
    })
})

test('redeeming coupon makes user ineligible for coupon', () => {
  const user = dummyData.users[0]
  const seedData: typeof dummyData = {
    ...dummyData,
    coupons: [coupon1],
    transactions: [generateId({ user, products: [dummyData.products[0]], coupons: []})]
  }
  const transaction: Transaction = generateId({ user, products: [dummyData.products[0]], coupons: [coupon1]});

  const db = new InMemoryDB(seedData);
  const couponStore = new CouponStore(db);

  return couponStore.getCouponsForUser(user.id)
    .then(userCoupons => {
      expect(userCoupons).toHaveLength(1)
      expect(userCoupons).toContain(coupon1)
    })
    .then(() => couponStore.createTransaction(transaction))
    .then(() => couponStore.getCouponsForUser(user.id))
    .then(userCoupons => {
      expect(userCoupons).toHaveLength(0)
    })
})

test('coupon used max times makes user ineligible for coupon', () => {
  const user = dummyData.users[0]
  const otherUser = dummyData.users[1]
  const seedData: typeof dummyData = {
    ...dummyData,
    coupons: [coupon1],
    transactions: [generateId({ user, products: [dummyData.products[0]], coupons: []})]
  }
  const transaction: Transaction = generateId({ user: otherUser, products: [dummyData.products[0]], coupons: [coupon1]});

  const db = new InMemoryDB(seedData);
  const couponStore = new CouponStore(db);

  return couponStore.getCouponsForUser(user.id)
    .then(userCoupons => {
      expect(userCoupons).toHaveLength(1)
      expect(userCoupons).toContain(coupon1)
    })
    .then(() => couponStore.createTransaction(transaction))
    .then(() => couponStore.getCouponsForUser(user.id))
    .then(userCoupons => {
      expect(userCoupons).toHaveLength(0)
    })
})