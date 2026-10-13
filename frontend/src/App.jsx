import { useEffect, useState } from "react";
import "./App.css";
import AdminDashboard from "./AdminDashboard";
import ProductDetails from "./ProductDetails";

const API_URL = "https://ecommerce-ad0t.onrender.com";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authMessage, setAuthMessage] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    pincode: "",
    phone: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    loadProducts();
  }, []);

  // ==========================================
  // LOAD SAVED USER
  // ==========================================

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("User data error:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  async function loadProducts() {
    try {
      const response = await fetch(
        `${API_URL}/api/products`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      setProducts(data);
    } catch (error) {
      console.error("Products error:", error);
    }
  }

  // ==========================================
  // CART
  // ==========================================

  function addToCart(product) {
    if (product.stock <= 0) {
      return;
    }

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item._id === product._id
      );

      if (existing) {
        if (existing.quantity >= product.stock) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1
        }
      ];
    });
  }

  function increaseQuantity(id) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item._id !== id) {
          return item;
        }

        if (item.quantity >= item.stock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1
        };
      })
    );
  }

  function decreaseQuantity(id) {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item._id === id) {
            return {
              ...item,
              quantity: item.quantity - 1
            };
          }

          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item._id !== id
      )
    );
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // ==========================================
  // SEARCH AND CATEGORY
  // ==========================================

  const categories = [
    "All",
    ...new Set(
      products.map((product) => product.category)
    )
  ];

  const filteredProducts = products.filter(
    (product) => {
      const productName = String(
        product.name || ""
      ).toLowerCase();

      const productDescription = String(
        product.description || ""
      ).toLowerCase();

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        productName.includes(search) ||
        productDescription.includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }
  );

  // ==========================================
  // LOGIN / REGISTER
  // ==========================================

  async function handleAuth(event) {
    event.preventDefault();

    setAuthMessage("");

    const endpoint = isLogin
      ? "login"
      : "register";

    const body = isLogin
      ? {
          email,
          password
        }
      : {
          name,
          email,
          password
        };

    try {
      const response = await fetch(
        `${API_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAuthMessage(
          data.message || "Something went wrong"
        );
        return;
      }

      if (isLogin) {
        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);
        setShowAuth(false);

        setName("");
        setEmail("");
        setPassword("");
      } else {
        setAuthMessage(
          "Registration successful! Please login."
        );

        setIsLogin(true);
        setPassword("");
      }
    } catch (error) {
      console.error("Auth error:", error);

      setAuthMessage(
        "Unable to connect to server."
      );
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setCart([]);
    setOrders([]);

    setShowOrders(false);
    setShowAdmin(false);
    setShowCheckout(false);
    setShowCart(false);
  }

  // ==========================================
  // CHECKOUT
  // ==========================================

  function checkout() {
    if (!user) {
      setShowCart(false);
      setShowAuth(true);
      setIsLogin(true);

      setAuthMessage(
        "Please login before checkout."
      );

      return;
    }

    if (cart.length === 0) {
      setOrderMessage("Your cart is empty.");
      return;
    }

    setOrderMessage("");
    setPaymentMethod("");

    setShowCart(false);
    setShowCheckout(true);
  }

  // ==========================================
  // SHIPPING ADDRESS CHANGE
  // ==========================================

  function handleShippingChange(event) {
    setShippingAddress({
      ...shippingAddress,
      [event.target.name]: event.target.value
    });
  }

  // ==========================================
  // PLACE ORDER
  // ==========================================

  async function placeOrder(event) {
    event.preventDefault();

    setOrderMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setShowCheckout(false);
      setShowAuth(true);
      setIsLogin(true);
      return;
    }

    if (!paymentMethod) {
      setOrderMessage(
        "Please select a payment method."
      );
      return;
    }

    const items = cart.map((item) => ({
      product: item._id,
      quantity: item.quantity
    }));

    try {
      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },

          body: JSON.stringify({
            items,
            shippingAddress,
            paymentMethod
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setOrderMessage(
          data.message || "Unable to place order"
        );
        return;
      }

      setCart([]);

      setShippingAddress({
        fullName: "",
        address: "",
        city: "",
        pincode: "",
        phone: ""
      });

      setPaymentMethod("");

      setOrderMessage(
        "Order placed successfully!"
      );

      await loadProducts();
      await loadOrders();

      setShowCheckout(false);
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      setOrderMessage(
        "Unable to connect to server."
      );
    }
  }

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  async function loadOrders() {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowAuth(true);
      setIsLogin(true);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setOrders(data);
      setShowOrders(true);
    } catch (error) {
      console.error(
        "Orders error:",
        error
      );
    }
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="store">

      {/* NAVBAR */}

      <header className="navbar">

        <h1>My E-Commerce Store</h1>

        <div className="nav-actions">

          {user ? (
            <>
              <span>
                Hello, {user.name}
              </span>

              {user.role === "admin" && (
                <button
                  onClick={() =>
                    setShowAdmin(true)
                  }
                >
                  Admin Dashboard
                </button>
              )}

              <button onClick={loadOrders}>
                My Orders
              </button>

              <button onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setShowAuth(true);
                setIsLogin(true);
                setAuthMessage("");
              }}
            >
              Login
            </button>
          )}

          <button
            onClick={() =>
              setShowCart(!showCart)
            }
          >
            Cart ({cartCount})
          </button>

        </div>

      </header>

      {/* PRODUCT DETAILS / PRODUCT LIST */}

      {selectedProduct ? (
        <ProductDetails
          product={selectedProduct}
          onBack={() =>
            setSelectedProduct(null)
          }
          onAddToCart={addToCart}
        />
      ) : (
        <main>

          <h2 className="title">
            Products
          </h2>

          {/* SEARCH */}

          <div className="product-controls">

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              className="search-input"
            />

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(
                  event.target.value
                )
              }
              className="category-select"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

          </div>

          {/* PRODUCTS */}

          {products.length === 0 ? (
            <p className="no-products">
              No products available.
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="no-products">
              No products found.
            </p>
          ) : (
            <div className="product-grid">

              {filteredProducts.map(
                (product) => (

                  <div
                    className="product-card"
                    key={product._id}
                    onClick={() =>
                      setSelectedProduct(
                        product
                      )
                    }
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />

                    <div className="product-info">

                      <span className="product-category">
                        {product.category}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      <p className="description">
                        {product.description}
                      </p>

                      <div className="product-bottom">

                        <div>

                          <h3>
                            ₹{product.price}
                          </h3>

                          <p>
                            Stock:{" "}
                            {product.stock}
                          </p>

                        </div>

                        <button
                          className="add-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            addToCart(product);
                          }}
                          disabled={
                            product.stock === 0
                          }
                        >
                          {product.stock === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </main>
      )}

      {/* AUTH MODAL */}

      {showAuth && (
        <div className="modal-overlay">

          <div className="auth-modal">

            <button
              className="close-button"
              onClick={() =>
                setShowAuth(false)
              }
            >
              ×
            </button>

            <h2>
              {isLogin
                ? "Login"
                : "Create Account"}
            </h2>

            <form onSubmit={handleAuth}>

              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                required
              />

              <button
                type="submit"
                className="auth-button"
              >
                {isLogin
                  ? "Login"
                  : "Register"}
              </button>

            </form>

            {authMessage && (
              <p className="auth-message">
                {authMessage}
              </p>
            )}

            <p>

              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                className="switch-button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setAuthMessage("");
                }}
              >
                {isLogin
                  ? " Register"
                  : " Login"}
              </button>

            </p>

          </div>

        </div>
      )}

      {/* CART */}

      {showCart && (
        <div className="cart-panel">

          <div className="cart-header">

            <h2>Your Cart</h2>

            <button
              className="close-button"
              onClick={() =>
                setShowCart(false)
              }
            >
              ×
            </button>

          </div>

          {cart.length === 0 ? (

            <div className="empty-cart">

              <h3>
                Your cart is empty
              </h3>

              <p>
                Add some products to your cart.
              </p>

              <button
                className="continue-shopping"
                onClick={() =>
                  setShowCart(false)
                }
              >
                Continue Shopping
              </button>

            </div>

          ) : (

            <>

              <div className="cart-items">

                {cart.map((item) => (

                  <div
                    className="cart-item"
                    key={item._id}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />

                    <div className="cart-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        ₹{item.price}
                      </p>

                      <div className="quantity-controls">

                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item._id
                            )
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              item._id
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                      <p className="item-subtotal">
                        Subtotal: ₹
                        {item.price *
                          item.quantity}
                      </p>

                      <button
                        className="remove-button"
                        onClick={() =>
                          removeFromCart(
                            item._id
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                ))}

              </div>

              <div className="cart-total">

                <h2>
                  Total: ₹{cartTotal}
                </h2>

                {orderMessage && (
                  <p className="auth-message">
                    {orderMessage}
                  </p>
                )}

                <button
                  className="checkout-button"
                  onClick={checkout}
                >
                  Proceed to Checkout
                </button>

              </div>

            </>

          )}

        </div>
      )}

      {/* CHECKOUT MODAL */}

      {showCheckout && (
        <div className="modal-overlay">

          <div className="auth-modal checkout-modal">

            <button
              className="close-button"
              onClick={() => {
                setShowCheckout(false);
                setOrderMessage("");
              }}
            >
              ×
            </button>

            <h2>Checkout</h2>

            <form onSubmit={placeOrder}>

              {/* SHIPPING DETAILS */}

              <h3>Delivery Details</h3>

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={shippingAddress.fullName}
                onChange={handleShippingChange}
                required
              />

              <textarea
                name="address"
                placeholder="Delivery Address"
                value={shippingAddress.address}
                onChange={handleShippingChange}
                required
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleShippingChange}
                required
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={shippingAddress.pincode}
                onChange={handleShippingChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={shippingAddress.phone}
                onChange={handleShippingChange}
                required
              />

              {/* PAYMENT METHOD */}

              <div className="payment-section">

                <h3>Payment Method</h3>

                <label className="payment-option">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={
                      paymentMethod ===
                      "Cash on Delivery"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />

                  <span>
                    💵 Cash on Delivery
                  </span>

                </label>

                <label className="payment-option">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={
                      paymentMethod === "Card"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />

                  <span>
                    💳 Card
                  </span>

                </label>

                <label className="payment-option">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={
                      paymentMethod === "UPI"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />

                  <span>
                    📱 UPI
                  </span>

                </label>

                {paymentMethod === "Card" && (
                  <p className="payment-note">
                    Card payment is currently
                    simulated for this project.
                    No card details are required.
                  </p>
                )}

                {paymentMethod === "UPI" && (
                  <p className="payment-note">
                    UPI payment is currently
                    simulated for this project.
                    No UPI PIN or payment credentials
                    are required.
                  </p>
                )}

                {paymentMethod ===
                  "Cash on Delivery" && (
                  <p className="payment-note">
                    Pay when your order is delivered.
                  </p>
                )}

              </div>

              {/* ORDER SUMMARY */}

              <div className="checkout-summary">

                <h3>
                  Order Summary
                </h3>

                {cart.map((item) => (

                  <div
                    className="checkout-summary-item"
                    key={item._id}
                  >

                    <span>
                      {item.name} ×{" "}
                      {item.quantity}
                    </span>

                    <span>
                      ₹
                      {item.price *
                        item.quantity}
                    </span>

                  </div>

                ))}

                <h3 className="checkout-summary-total">
                  Total: ₹{cartTotal}
                </h3>

                {paymentMethod && (
                  <p>
                    Payment:{" "}
                    <strong>
                      {paymentMethod}
                    </strong>
                  </p>
                )}

              </div>

              {/* ERROR / SUCCESS MESSAGE */}

              {orderMessage && (
                <p className="auth-message">
                  {orderMessage}
                </p>
              )}

              {/* PLACE ORDER */}

              <button
                type="submit"
                className="checkout-button"
              >
                Place Order
              </button>

            </form>

          </div>

        </div>
      )}

      {/* MY ORDERS */}

      {showOrders && (
        <div className="modal-overlay">

          <div className="auth-modal orders-modal">

            <button
              className="close-button"
              onClick={() =>
                setShowOrders(false)
              }
            >
              ×
            </button>

            <h2>
              My Orders
            </h2>

            {orders.length === 0 ? (

              <p>
                You haven't placed any orders yet.
              </p>

            ) : (

              orders.map((order) => (

                <div
                  className="order-card"
                  key={order._id}
                >

                  <h3>
                    Order #
                    {order._id.slice(-6)}
                  </h3>

                  <p>
                    Date:{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    Status:{" "}
                    <strong>
                      {order.status}
                    </strong>
                  </p>

                  <p>
                    Payment:{" "}
                    <strong>
                      {order.paymentMethod}
                    </strong>
                  </p>

                  <p>
                    Payment Status:{" "}
                    <strong>
                      {order.paymentStatus}
                    </strong>
                  </p>

                  <div className="order-status">

                    <div
                      className={
                        order.status === "Pending" ||
                        order.status === "Processing" ||
                        order.status === "Shipped" ||
                        order.status === "Delivered"
                          ? "status-step active"
                          : "status-step"
                      }
                    >
                      <span>1</span>
                      <p>Pending</p>
                    </div>

                    <div
                      className={
                        order.status === "Processing" ||
                        order.status === "Shipped" ||
                        order.status === "Delivered"
                          ? "status-step active"
                          : "status-step"
                      }
                    >
                      <span>2</span>
                      <p>Processing</p>
                    </div>

                    <div
                      className={
                        order.status === "Shipped" ||
                        order.status === "Delivered"
                          ? "status-step active"
                          : "status-step"
                      }
                    >
                      <span>3</span>
                      <p>Shipped</p>
                    </div>

                    <div
                      className={
                        order.status === "Delivered"
                          ? "status-step active"
                          : "status-step"
                      }
                    >
                      <span>4</span>
                      <p>Delivered</p>
                    </div>

                  </div>

                  <h4>
                    Order Items
                  </h4>

                  {order.items.map(
                    (item, index) => (

                      <div
                        className="order-item"
                        key={index}
                      >

                        <span>
                          {item.name} ×{" "}
                          {item.quantity}
                        </span>

                        <span>
                          ₹
                          {item.price *
                            item.quantity}
                        </span>

                      </div>

                    )
                  )}

                  <div className="order-total">

                    <strong>
                      Total: ₹
                      {order.totalAmount}
                    </strong>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>
      )}

      {/* ADMIN DASHBOARD */}

      {showAdmin &&
        user &&
        user.role === "admin" && (

          <div className="modal-overlay">

            <div className="admin-modal">

              <AdminDashboard
                onClose={() =>
                  setShowAdmin(false)
                }
              />

            </div>

          </div>

        )}

    </div>
  );
}

export default App;