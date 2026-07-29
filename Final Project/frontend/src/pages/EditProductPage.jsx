import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, updateProduct } from '../api';
import { useAuth } from '../context/AuthContext';

export default function EditProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    image: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(true);

  useEffect(() => {
    async function loadProductData() {
      try {
        setLoading(true);
        const product = await getProductById(id);

        // Check product ownership
        if (product && product.sellerEmail && user && user.email.toLowerCase() !== product.sellerEmail.toLowerCase()) {
          setIsOwner(false);
          setError("Unauthorized: You can only edit products that you listed for sale.");
          return;
        }

        setFormData({
          title: product.title || '',
          price: product.price || '',
          category: product.category || '',
          condition: product.condition || '',
          location: product.location || 'Main Campus',
          image: product.image || '',
          description: product.description || '',
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch product data for editing.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProductData();
    }
  }, [id, user]);

  const handleChange = (e) => {
    const { id: fieldId, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOwner) {
      alert("Unauthorized: You can only edit products you listed.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await updateProduct(id, formData, user ? user.email : null);
      alert('Product Updated Successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading product details...</span>
        </div>
        <p className="mt-3 text-muted">Loading product information...</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="container py-5 text-center min-vh-80 d-flex flex-column justify-content-center align-items-center">
        <div className="card shadow-lg p-5 rounded-4 border-0 max-w-md bg-white">
          <i className="bi bi-shield-lock-fill display-2 text-danger mb-3"></i>
          <h3 className="fw-bold">Access Denied</h3>
          <p className="text-muted">You do not have permission to edit this product. Only the seller who listed it can make changes.</p>
          <Link to="/dashboard" className="btn btn-success px-4 py-2 mt-2">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
                <h2 className="mb-0 fw-bold fs-3">Edit Product</h2>
                <p className="text-white-50 mb-0 small mt-1">Update details for your marketplace listing</p>
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
                    <label className="form-label fw-bold text-dark">Product Title</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="title"
                      placeholder="Title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold text-dark">Price (₹)</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light fw-bold text-success border-end-0 rounded-start-3">₹</span>
                        <input
                          type="number"
                          className="form-control form-control-custom rounded-end-3"
                          id="price"
                          placeholder="Price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold text-dark">Category</label>
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
                      <label className="form-label fw-bold text-dark">Condition</label>
                      <select
                        className="form-select form-control-custom"
                        id="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Choose Condition</option>
                        <option value="New">Brand New</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold text-dark">Location</label>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark">Image URL</label>
                    <input
                      type="url"
                      className="form-control form-control-custom"
                      id="image"
                      placeholder="Image URL"
                      value={formData.image}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark">Description</label>
                    <textarea
                      className="form-control form-control-custom"
                      rows="4"
                      id="description"
                      placeholder="Description"
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
                          Updating Product...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg"></i> Update Product
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
