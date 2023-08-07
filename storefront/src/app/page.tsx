'use client'
import { Coupon, Product, Transaction, User } from "@/generated/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Stack, Table } from "react-bootstrap";
import { v4 } from "uuid";
import { getAllProducts, getAllTransactions, getAllUsers, getCoupons, postCoupon, postTransaction } from "./api/client";

const initialCouponDraft: Coupon = { code: "", afterTransactions: 1, discountPercent: 10, maxUses: 1 }

export default function Home() {

  // API data
  const [users, setUsers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Used to mark data as stale after post
  const [refresh, setRefresh] = useState(false);
  function refreshData() {
    setRefresh(!refresh);
  }

  // Page state
  const [cart, setCart] = useState<Transaction>({ id: v4(), userId: "", productIds: [], couponCodes: [] });
  const [activeUser, setActiveUser] = useState<string | undefined>();
  const [draftCoupon, setDraftCoupon] = useState<Coupon>(initialCouponDraft);
  const [editingCoupon, setEditingCoupon] = useState(false);

  // Util
  function getUserName(userId: string) {
    return users.find(user => user.id === userId)?.name;
  }
  function getProduct(productId: string) {
    return products.find(product => product.id === productId);
  }
  function couponCodeToDiscountPercent(couponCode: string) {
    return coupons.find(coupon => coupon.code === couponCode)?.discountPercent || 0;
  }
  function discountPercentToMultiplier(percent: number) {
    return (100 - percent) / 100;
  }
  function calculuateTransactionPrice({ productIds, couponCodes }: Transaction) {
    const subtotal = productIds.map(getProduct).reduce((sum, prod) => sum + (prod?.price || 0), 0)
    const discountMultiplier = couponCodes.map(couponCodeToDiscountPercent)
      .reduce((multiplier, percent) => multiplier * (discountPercentToMultiplier(percent)), 1)

    return {
      total: subtotal * discountMultiplier,
      savings: subtotal * (1 - discountMultiplier)
    };
  }

  // Cart state management
  function addProductToCart(productId: string) {
    setCart({
      ...cart,
      productIds: [
        ...cart.productIds,
        productId
      ]
    });
  }
  function removeProductFromCart(productId: string) {
    const oldProducts = [...cart.productIds];
    let idx = oldProducts.findIndex(id => id === productId);
    if (idx !== -1) {
      setCart({
        ...cart,
        productIds: [
          ...oldProducts.splice(0, idx),
          ...oldProducts.splice(1)
        ]
      })
    }
  }
  function addCouponToCart(couponCode: string) {
    if (!cart.couponCodes.includes(couponCode)) {
      setCart({
        ...cart,
        couponCodes: [
          ...cart.couponCodes,
          couponCode
        ]
      });
    }
  }
  function removeCouponFromCart(couponCode: string) {
    return setCart({
      ...cart,
      couponCodes: cart.couponCodes.filter(code => code !== couponCode)
    })
  }
  function submitCartTransaction() {
    return postTransaction(cart)
      .then(() => {
        setCart({
          ...cart,
          id: v4(),
          productIds: [],
          couponCodes: []
        })
        refreshData()
      })
  }

  // Coupon Form handling
  function handleCloseModal() {
    setEditingCoupon(false);
    setDraftCoupon(initialCouponDraft);
  }
  function handleChangeCouponCode(code: string) {
    setDraftCoupon({
      ...draftCoupon,
      code
    })
  }
  function handleChangeCouponAfterTransaction(afterTransactions: number) {
    setDraftCoupon({
      ...draftCoupon,
      afterTransactions
    })
  }
  function handleChangeCouponMaxUses(maxUses: number) {
    setDraftCoupon({
      ...draftCoupon,
      maxUses
    })
  }
  function handleChangeCouponDiscountPercent(discountPercent: number) {
    setDraftCoupon({
      ...draftCoupon,
      discountPercent
    })
  }
  function handleSubmitModal() {
    postCoupon(draftCoupon)
      .then(() => handleCloseModal())
      .then(() => refreshData())
  }

  // Data Fetching
  useEffect(() => {
    getAllProducts().then(({ data }) => {
      if (data) {
        setProducts(data);
      }
    })
  }, []);
  useEffect(() => {
    getAllUsers().then(({ data }) => {
      if (data) {
        setUsers(data);
      }
    })
  }, [])
  useEffect(() => {
    getAllTransactions(activeUser).then(({ data }) => {
      if (data) {
        setTransactions(data);
      }
    })
  }, [activeUser, refresh])
  useEffect(() => {
    getCoupons(activeUser).then(({ data }) => {
      if (data) {
        setCoupons(data);
      }
    })
  }, [activeUser, refresh])
  useEffect(() => {
    setCart({
      id: v4(),
      userId: activeUser || "",
      productIds: [],
      couponCodes: [],
    })
  }, [activeUser, refresh])

  return (
    <main>
      <Stack direction="horizontal" gap={3}>
        <div className="p-2">Hello {activeUser ? getUserName(activeUser) : "Admin"}</div>
        <Link href={"/docs"} >API Docs</Link>
        <div className="p-2 ms-auto">View page as:</div>
        {users.map(user => (
          <Button
            variant={activeUser === user.id ? "success" : "primary"}
            key={user.id}
            onClick={() => setActiveUser(user.id)}
          >
            {user.name}
          </Button>
        ))}
        <Button
          variant={activeUser === undefined ? "success" : "primary"}
          onClick={() => setActiveUser(undefined)}
        >
          Admin
        </Button>
      </Stack>

      {/* Cart Section */}
      {cart && activeUser &&
        <Container className="justify-content-md-center mb-4">
          <h3>Cart</h3>
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.productIds.map(getProduct).map((product, idx) => {
                  if (product != undefined) {
                    return <tr key={product.id + idx}>
                      <td className="text-left">{product.name}</td>
                      <td className="text-justify text-right">${product.price.toFixed(2)}</td>
                      <td><Button variant="warning" onClick={() => removeProductFromCart(product.id)}>X</Button></td>
                    </tr>
                  }
                })}
              </tbody>
            </Table>
          </Row>
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>Discount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.couponCodes.map(coupon => {
                  return <tr key={coupon}>
                    <td>{coupon}</td>
                    <td>{couponCodeToDiscountPercent(coupon)}%</td>
                    <td><Button variant="warning" onClick={() => removeCouponFromCart(coupon)}>X</Button></td>
                  </tr>
                })}
              </tbody>
            </Table>
          </Row>
          <Row>
            <Col>Total: ${calculuateTransactionPrice(cart).total.toFixed(2)}</Col>
            <Col>Savings: ${calculuateTransactionPrice(cart).savings.toFixed(2)}</Col>
            <Col><Button onClick={submitCartTransaction}>Check Out</Button></Col>
          </Row>
        </Container>
      }

      {/* Product List Section */}
      {products && activeUser &&
        <Container className="justify-content-md-center">
          <h3>Products</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                return <tr key={product.id}>
                  <td className="text-left">{product.name}</td>
                  <td className="text-justify text-right">${product.price.toFixed(2)}</td>
                  <td><Button onClick={() => addProductToCart(product.id)}>Add to Cart</Button></td>
                </tr>
              })}
            </tbody>
          </Table>
        </Container>
      }

      {/* Coupon List Section */}
      <Container className="justify-content-md-center">
        <Stack direction="horizontal" gap={3}>
          <h3>Available Coupons</h3>
          {!activeUser && <Button onClick={() => setEditingCoupon(true)}>Create a new coupon</Button>}
        </Stack>
        {coupons &&
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Required Transactions</th>
                <th>Maximum Uses</th>
                {!activeUser && transactions && <th>Recorded Uses</th>}
                <th>Discount Percent</th>
                {activeUser && <th></th>}
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => {
                return <tr key={coupon.code}>
                  <td>{coupon.code}</td>
                  <td>{coupon.afterTransactions}</td>
                  <td>{coupon.maxUses}</td>
                  {!activeUser && transactions && <td>{transactions.filter(transaction => transaction.couponCodes.includes(coupon.code)).length}</td>}
                  <td>{coupon.discountPercent}%</td>
                  {activeUser &&
                    <td>
                      <Button onClick={() => addCouponToCart(coupon.code)}>Add to Cart</Button>
                    </td>
                  }
                </tr>
              })}
            </tbody>
          </Table>
        }
      </Container>

      {/* Create Coupon Modal */}
      <Modal show={editingCoupon}>
        <Modal.Header>
          <Modal.Title>New Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitModal}>
            <Form.Group className="mb-3">
              <Form.Label>Coupon Code</Form.Label>
              <Form.Control
                required
                value={draftCoupon.code}
                onChange={(e) => handleChangeCouponCode(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>After Transaction</Form.Label>
              <Form.Control
                required
                type="number"
                min={1}
                step={1}
                value={draftCoupon.afterTransactions}
                onChange={(e) => handleChangeCouponAfterTransaction(parseInt(e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Maximum Uses</Form.Label>
              <Form.Control
                required
                type="number"
                min={1}
                step={1}
                value={draftCoupon.maxUses}
                onChange={(e) => handleChangeCouponMaxUses(parseInt(e.target.value))}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Percent Discount</Form.Label>
              <Form.Control
                required
                type="number"
                min={1}
                max={99}
                value={draftCoupon.discountPercent}
                onChange={(e) => handleChangeCouponDiscountPercent(parseInt(e.target.value))}
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitModal}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Transaction List Section */}
      <Container className="justify-content-md-center">
        <h3>Transactions</h3>
        {transactions &&
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>User</th>
                <th>Products</th>
                <th>Coupons</th>
                <th>Total Price</th>
                <th>Savings</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => {
                const { total, savings } = calculuateTransactionPrice(transaction);
                return <tr key={transaction.id}>
                  <td>{users.find(user => user.id === transaction.userId)?.name}</td>
                  <td>{transaction.productIds.map(id => getProduct(id)?.name).join(", ")}</td>
                  <td>{transaction.couponCodes.join(", ")}</td>
                  <td>${total.toFixed(2)}</td>
                  <td>${savings.toFixed(2)}</td>
                </tr>
              })}
            </tbody>
          </Table>
        }
      </Container>
    </main>
  )
}
