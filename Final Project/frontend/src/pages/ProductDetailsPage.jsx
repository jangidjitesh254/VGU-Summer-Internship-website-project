import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../api';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackImg = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800";

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5 min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading product details...</span>
        </div>
        <p className="mt-3 text-muted">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger p-5 rounded-4 shadow-sm max-w-lg mx-auto">
          <i className="bi bi-exclamation-triangle-fill display-4 mb-3 d-block text-danger"></i>
          <h4 className="fw-bold">{error || "Product Not Found"}</h4>
          <p className="text-muted">The product you are looking for does not exist or was removed.</p>
          <Link to="/dashboard" className="btn btn-success mt-3">
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
          <div className="col-lg-10">
            <div className="card shadow-xl border-0 rounded-4 overflow-hidden">
              <div className="row g-0">
                {/* Left Side Product Image */}
                <div className="col-md-6 bg-dark position-relative d-flex align-items-center justify-content-center overflow-hidden">
                  <img
                    src={product.image || fallbackImg}
                    alt={product.title}
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: 'cover', minHeight: '380px', maxHeight: '550px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImg;
                    }}
                  />
                  {product.condition && (
                    <span className="badge-condition m-3">
                      Condition: {product.condition}
                    </span>
                  )}
                </div>

                {/* Right Side Details */}
                <div className="col-md-6 bg-white p-4 p-md-5 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge-category">
                        <i className="bi bi-tag-fill me-1"></i> {product.category || 'General'}
                      </span>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i> Listed Recently
                      </small>
                    </div>

                    <h1 className="fw-extrabold text-dark mb-3 fs-2">{product.title}</h1>

                    <div className="p-3 bg-light rounded-3 mb-4 d-flex align-items-center justify-content-between border">
                      <div>
                        <small className="text-muted text-uppercase fw-semibold d-block">Listing Price</small>
                        <span className="display-6 fw-extrabold text-success">
                          ₹{Number(product.price).toLocaleString()}
                        </span>
                      </div>
                      <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill fw-semibold">
                        <i className="bi bi-check-circle-fill me-1"></i> Campus Direct
                      </span>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold text-dark mb-2">Description</h6>
                      <p className="text-secondary leading-relaxed fs-6">
                        {product.description || "No description provided by the seller."}
                      </p>
                    </div>

                    <div className="border-top pt-3 mb-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '45px', height: '45px', fontSize: '1.2rem' }}>
                          <i className="bi bi-person"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">Verified Student Seller</h6>
                          <small className="text-muted">Safe campus meet-up guaranteed</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-sm-row gap-3 pt-3 border-top">
                    <button
                      onClick={() => alert(`Contacting seller regarding "${product.title}"...`)}
                      className="btn btn-success flex-grow-1 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
                    >
                      <i className="bi bi-chat-dots-fill"></i> Contact Seller
                    </button>
                    <Link to="/dashboard" className="btn btn-outline-secondary py-3 px-4 fw-semibold d-flex align-items-center justify-content-center gap-2">
                      <i className="bi bi-arrow-left"></i> Back to Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
