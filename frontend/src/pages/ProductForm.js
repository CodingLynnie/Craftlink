import React, { useState } from "react";
   import './ProductForm.css';

function AddProductForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
     stock_quantity: "",
    images: [],
  });

  const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (name === "images") {
    setForm((prev) => ({
      ...prev,
      images: Array.from(files),
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!form.name || !form.category || !form.price || !form.description || !form.stock_quantity || form.images.length === 0) {
      alert('Please fill in all required fields and upload at least one image');
      return;
    }
    
    // Validate price and stock quantity
    if (parseFloat(form.price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    
    if (parseInt(form.stock_quantity) < 0) {
      alert('Stock quantity must be 0 or greater');
      return;
    }
    
    onSubmit(form);
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <div className="form-header">
  <span className="form-header-icon" role="img" aria-label="upload">⤴️</span>
  <div>
    <h2 className="form-title">Add New Product</h2>
    <p className="form-subtitle">Share your beautiful crafts with buyers</p>
  </div>
</div>
  <div className="form-row">
    <div className="form-group">
      <label>Product Name</label>
      <input name="name" value={form.name} onChange={handleChange} required />
    </div>
    <div className="form-group">
      <label>Craft Category</label>
      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="">Select category</option>
        <option value="jewelry">Jewelry</option>
        <option value="baskets">Baskets</option>
        <option value="beaded journals">Beaded journals</option>
        <option value="ceramic cups">Ceramic cups</option>
        <option value="crocheted clothes">Crocheted clothes</option>
        {/* Add more categories */}
      </select>
    </div>
  </div>
  <div className="form-row">
    <div className="form-group">
      <label>Price (KSH)</label>
      <input name="price" type="number" value={form.price} onChange={handleChange} required />
    </div>
    <div className="form-group">
      <label>Stock Quantity</label>
      <input name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} required />
    </div>
  </div>
  <div className="form-row">
    <div className="form-group">
      <label>Product Images</label>
      <label className="upload-btn">
        <span role="img" aria-label="upload">🖼️</span> Upload Images
        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          required
          style={{ display: 'none' }}
        />
      </label>
    </div>
  </div>
  <div className="form-group">
    <label>Description</label>
    <textarea name="description" value={form.description} onChange={handleChange} required />
  </div>
  <button type="submit" className="add-btn">Add Product</button>
</form>
  );
}

export default AddProductForm;