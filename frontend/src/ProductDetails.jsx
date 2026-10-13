import { useState } from "react";

function ProductDetails({ product, onBack, onAddToCart }) {
  const [message, setMessage] = useState("");

  function handleAddToCart() {
    if (product.stock <= 0) {
      setMessage("Product is out of stock.");
      return;
    }

    onAddToCart(product);
    setMessage("Product added to cart!");
  }

  return (
    <main className="product-details">

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Products
      </button>

      <div className="product-details-card">

        <div className="product-details-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="product-details-info">

          <p className="product-category">
            {product.category}
          </p>

          <h1>
            {product.name}
          </h1>

          <p className="product-details-description">
            {product.description}
          </p>

          <h2>
            Rs. {product.price}
          </h2>

          <p>
            Stock: {product.stock}
          </p>

          <button
            className="add-button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          {message && (
            <p className="product-message">
              {message}
            </p>
          )}

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;