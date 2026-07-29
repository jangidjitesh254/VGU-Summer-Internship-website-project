import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AddProductPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    location: 'Main Campus',
    image: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        sellerEmail: user ? user.email : "seller@university.edu",
        sellerName: user ? (user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email.split('@')[0]) : "Campus Seller"
      };

      await createProduct(payload);
      alert('Product Added Successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Cannot connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-dark text-white p-4 text-center border-0 position-relative" style={{ background: 'var(--primary-gradient)' }}>
                <Link to="/dashboard" className="btn btn-sm btn-outline-light position-absolute start-0 top-50 translate-middle-y ms-3 d-none d-sm-inline-flex align-items-center">
                  <i className="bi bi-arrow-left me-1"></i> Back
                </Link>
                <h2 className="mb-0 fw-bold fs-3">Add New Product</h2>
                <p className="text-white-50 mb-0 small mt-1">Fill in details to post your item on campus</p>
              </div>

              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger rounded-3 mb-4" role="alert">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark">
                      Product Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="title"
                      placeholder="e.g. Engineering Mathematics Textbook 4th Ed."
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold text-dark">
                        Price (₹) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light fw-bold text-success border-end-0 rounded-start-3">₹</span>
                        <input
                          type="number"
                          className="form-control form-control-custom rounded-end-3"
                          id="price"
                          placeholder="450"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold text-dark">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select form-control-custom"
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Choose Category</option>
                        <option value="Books">Books</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Sports">Sports</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold text-dark">
                        Condition <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select form-control-custom"
                        id="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Choose Condition</option>
                        <option value="New">Brand New</option>
                        <option value="Like New">Like New (Barely used)</option>
                        <option value="Good">Good (Minor wear)</option>
                        <option value="Fair">Fair (Fully functional)</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold text-dark">
                        Campus / Pickup Location <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        id="location"
                        placeholder="e.g. Main Campus, Dorm A, Library..."
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark">
                      Image URL <span className="text-danger">*</span>
                    </label>
                    <input
                      type="url"
                      className="form-control form-control-custom"
                      id="image"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted mt-1 d-block">
                      Paste a direct image link from Unsplash, Imgur, or cloud storage.
                    </small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control form-control-custom"
                      rows="4"
                      id="description"
                      placeholder="Include details such as age, reason for selling, campus pickup location..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="d-grid gap-3 pt-2">
                    <button
                      className="btn btn-success btn-lg py-3 fw-bold shadow d-flex align-items-center justify-content-center gap-2"
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Adding Product...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus-circle"></i> Add Product
                        </>
                      )}
                    </button>

                    <Link to="/dashboard" className="btn btn-outline-secondary py-2.5 rounded-3 fw-semibold text-center">
                      Cancel & Back to Dashboard
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
