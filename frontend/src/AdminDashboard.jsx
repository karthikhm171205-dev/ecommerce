import { useEffect, useState } from "react";

function AdminDashboard({ onClose }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: ""
  });

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to fetch products"
        );
        return;
      }

      setProducts(data);
    } catch (error) {
      console.error("Products error:", error);
      setMessage("Unable to connect to server.");
    }
  };

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to fetch orders"
        );
        return;
      }

      setOrders(data);
    } catch (error) {
      console.error("Orders error:", error);
      setMessage("Unable to connect to server.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ==========================================
  // FORM
  // ==========================================

  const handleChange = (event) => {
    setProduct({
      ...product,
      [event.target.name]: event.target.value
    });
  };

  const resetForm = () => {
    setProduct({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      stock: ""
    });

    setEditingProduct(null);
    setShowProductForm(false);
  };

  // ==========================================
  // ADD / UPDATE PRODUCT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const url = editingProduct
      ? `http://localhost:5000/api/products/${editingProduct._id}`
      : "http://localhost:5000/api/products";

    const method = editingProduct
      ? "PUT"
      : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: Number(product.price),
          image: product.image,
          category: product.category,
          stock: Number(product.stock)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Operation failed"
        );
        return;
      }

      setMessage(
        editingProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();
      fetchProducts();

    } catch (error) {
      console.error("Product error:", error);
      setMessage("Unable to connect to server.");
    }
  };

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const editProduct = (item) => {
    setEditingProduct(item);

    setProduct({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      stock: item.stock
    });

    setShowProductForm(true);
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Delete failed"
        );
        return;
      }

      setMessage(
        "Product deleted successfully!"
      );

      fetchProducts();

    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Unable to connect to server.");
    }
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Status update failed"
        );
        return;
      }

      setMessage(
        "Order status updated successfully!"
      );

      fetchOrders();

    } catch (error) {
      console.error(
        "Order status error:",
        error
      );

      setMessage(
        "Unable to connect to server."
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-dashboard">

      {/* CLOSE BUTTON */}

      <button
        className="admin-dashboard-close"
        onClick={onClose}
        aria-label="Close admin dashboard"
      >
        ×
      </button>

      {/* HEADER */}

      <div className="admin-header">

        <div>
          <p className="admin-label">
            ADMIN PANEL
          </p>

          <h1>
            Dashboard
          </h1>

          <p className="admin-subtitle">
            Manage products and customer orders
          </p>
        </div>

        <div className="admin-stats">

          <div className="admin-stat">
            <span>
              Products
            </span>

            <strong>
              {products.length}
            </strong>
          </div>

          <div className="admin-stat">
            <span>
              Orders
            </span>

            <strong>
              {orders.length}
            </strong>
          </div>

        </div>

      </div>

      {/* MESSAGE */}

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      {/* ==========================================
          PRODUCT MANAGEMENT
      ========================================== */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>
            <h2>
              Product Management
            </h2>

            <p>
              Add, edit and remove products
              from your store.
            </p>
          </div>

          <button
            className="admin-primary-button"
            onClick={() => {
              resetForm();
              setShowProductForm(true);
            }}
          >
            + Add Product
          </button>

        </div>

        {/* PRODUCT FORM */}

        {showProductForm && (

          <div className="admin-form-card">

            <div className="form-title">

              <h3>
                {editingProduct
                  ? "Edit Product"
                  : "Add New Product"}
              </h3>

              <button
                className="form-close"
                onClick={resetForm}
              >
                ×
              </button>

            </div>

            <form
              className="product-form"
              onSubmit={handleSubmit}
            >

              <div className="form-grid">

                <div className="form-field">

                  <label>
                    Product Name
                  </label>

                  <input
                    name="name"
                    placeholder="Enter product name"
                    value={product.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-field">

                  <label>
                    Category
                  </label>

                  <input
                    name="category"
                    placeholder="Electronics"
                    value={product.category}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-field">

                  <label>
                    Price
                  </label>

                  <input
                    name="price"
                    type="number"
                    placeholder="1999"
                    value={product.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />

                </div>

                <div className="form-field">

                  <label>
                    Stock
                  </label>

                  <input
                    name="stock"
                    type="number"
                    placeholder="25"
                    value={product.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />

                </div>

                <div className="form-field full-width">

                  <label>
                    Image URL
                  </label>

                  <input
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    value={product.image}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-field full-width">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    placeholder="Enter product description"
                    value={product.description}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="form-buttons">

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  {editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}

        {/* PRODUCT LIST */}

        <div className="admin-product-list">

          {products.length === 0 ? (

            <div className="admin-empty">

              <h3>
                No products yet
              </h3>

              <p>
                Add your first product
                to the store.
              </p>

            </div>

          ) : (

            products.map((item) => (

              <div
                className="admin-product-card"
                key={item._id}
              >

                <div className="admin-product-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>

                <div className="admin-product-details">

                  <span className="admin-category">
                    {item.category}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    {item.description}
                  </p>

                  <div className="admin-product-meta">

                    <strong>
                      ₹{item.price}
                    </strong>

                    <span>
                      Stock: {item.stock}
                    </span>

                  </div>

                </div>

                <div className="admin-card-buttons">

                  <button
                    className="edit-button"
                    onClick={() =>
                      editProduct(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteProduct(item._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </section>

      {/* ==========================================
          ORDER MANAGEMENT
      ========================================== */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <h2>
              Order Management
            </h2>

            <p>
              View customer orders and
              update delivery status.
            </p>

          </div>

        </div>

        {orders.length === 0 ? (

          <div className="admin-empty">

            <h3>
              No orders found
            </h3>

            <p>
              Customer orders will
              appear here.
            </p>

          </div>

        ) : (

          <div className="admin-orders">

            {orders.map((order) => (

              <div
                className="admin-order-card"
                key={order._id}
              >

                {/* ORDER HEADER */}

                <div className="order-top">

                  <div>

                    <span className="order-label">
                      ORDER
                    </span>

                    <h3>
                      #{order._id.slice(-6)}
                    </h3>

                  </div>

                  <span className="order-price">
                    ₹{order.totalAmount}
                  </span>

                </div>

                {/* CUSTOMER */}

                <div className="customer-info">

                  <div>

                    <span>
                      Customer
                    </span>

                    <strong>
                      {order.user?.name ||
                        "Unknown"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Email
                    </span>

                    <strong>
                      {order.user?.email ||
                        "N/A"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Items
                    </span>

                    <strong>
                      {order.items.length}
                    </strong>

                  </div>

                </div>

                {/* SHIPPING ADDRESS */}

                {order.shippingAddress && (

                  <div className="shipping-address">

                    <div className="shipping-title">

                      <h4>
                        Shipping Address
                      </h4>

                    </div>

                    <p>
                      <strong>
                        {order.shippingAddress.fullName}
                      </strong>
                    </p>

                    <p>
                      {order.shippingAddress.address}
                    </p>

                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.pincode}
                    </p>

                    <p>
                      Phone:{" "}
                      {order.shippingAddress.phone}
                    </p>

                  </div>

                )}

                {/* ORDER ITEMS */}

                <div className="order-items">

                  <h4>
                    Order Items
                  </h4>

                  {order.items.map(
                    (item, index) => (

                      <div
                        className="admin-order-item"
                        key={index}
                      >

                        <span>
                          {item.name} ×{" "}
                          {item.quantity}
                        </span>

                        <strong>
                          ₹
                          {item.price *
                            item.quantity}
                        </strong>

                      </div>

                    )
                  )}

                </div>

                {/* STATUS */}

                <div className="order-footer">

                  <div>

                    <span>
                      Status
                    </span>

                    <strong
                      className={`status-${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </strong>

                  </div>

                  <select
                    value={order.status}
                    onChange={(event) =>
                      updateOrderStatus(
                        order._id,
                        event.target.value
                      )
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default AdminDashboard;