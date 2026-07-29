import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, createEscrowCheckout } from '../api';
import { useAuth } from '../context/AuthContext';
import socket from '../socket';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Form Inputs
  const [chatMessage, setChatMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleEscrowCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to complete your escrow purchase.");
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await createEscrowCheckout({
        productId: product._id,
        productTitle: product.title,
        productImage: product.image,
        amount: product.price,
        buyerEmail: user.email,
        buyerName: user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email.split('@')[0],
        sellerEmail: product.sellerEmail || "seller@university.edu",
        sellerName: product.sellerName || "Campus Seller"
      });

      alert("✨ Escrow Payment Successful! Funds are safely held in escrow until you inspect and receive the item.");
      setShowCheckoutModal(false);
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert(err.message || "Escrow Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to chat with the seller.");
      navigate('/login');
      return;
    }
    if (!chatMessage.trim()) return;

    const sellerEmail = product.sellerEmail || "seller@university.edu";
    const roomId = `${product._id}_${[user.email.toLowerCase(), sellerEmail.toLowerCase()].sort().join('_')}`;

    socket.emit('send_message', {
      roomId,
      productId: product._id,
      productTitle: product.title,
      senderEmail: user.email,
      senderName: user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email.split('@')[0],
      receiverEmail: sellerEmail,
      receiverName: product.sellerName || "Seller",
      text: chatMessage.trim()
    });

    alert("✨ Message sent to seller! Redirecting to your Inbox...");
    setChatMessage('');
    setShowChatModal(false);
    navigate('/messages');
  };

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
                    style={{ objectFit: 'cover', minHeight: '400px', maxHeight: '580px' }}
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
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i> {product.location || 'Main Campus'}
                      </small>
                    </div>

                    <h1 className="fw-extrabold text-dark mb-3 fs-2">{product.title}</h1>

                    <div className="p-3 bg-light rounded-3 mb-4 border">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div>
                          <small className="text-muted text-uppercase fw-semibold d-block">Price</small>
                          <span className="display-6 fw-extrabold text-success">
                            ₹{Number(product.price).toLocaleString()}
                          </span>
                        </div>
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill fw-semibold">
                          <i className="bi bi-shield-check me-1"></i> Escrow Protected
                        </span>
                      </div>
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                        🛡️ Payment held safely in escrow until you inspect and accept the item.
                      </small>
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
                          <h6 className="fw-bold mb-0">{product.sellerName || "Verified Student Seller"}</h6>
                          <small className="text-muted">{product.sellerEmail || "seller@university.edu"}</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="d-flex flex-column gap-2 pt-3 border-top">
                    {/* Buy Now Escrow Payment */}
                    <button
                      onClick={() => setShowCheckoutModal(true)}
                      className="btn btn-success w-100 py-3 fw-bold fs-6 shadow d-flex align-items-center justify-content-center gap-2"
                    >
                      <i className="bi bi-shield-lock-fill fs-5"></i> Buy Now with Escrow Protection
                    </button>

                    <button
                      onClick={() => setShowChatModal(true)}
                      className="btn btn-outline-success w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    >
                      <i className="bi bi-chat-dots-fill"></i> Chat with Seller
                    </button>

                    <Link to="/dashboard" className="btn btn-link text-secondary text-decoration-none text-center small mt-2">
                      <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-2xl">
              <div className="modal-header bg-dark text-white p-4" style={{ background: 'var(--primary-gradient)' }}>
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-shield-lock-fill me-2"></i> Secure Escrow Payment
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCheckoutModal(false)}></button>
              </div>

              <form onSubmit={handleEscrowCheckout}>
                <div className="modal-body p-4">
                  <div className="alert alert-success bg-success bg-opacity-10 border-success text-dark rounded-3 mb-3 small">
                    <i className="bi bi-info-circle-fill me-2 text-success"></i>
                    Your funds will be safely held in <strong>ReUse Escrow</strong>. The seller only receives payment after you inspect and accept the product in person.
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Item Title</label>
                    <input type="text" className="form-control" value={product.title} disabled />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">Total Amount</label>
                      <input type="text" className="form-control font-weight-bold text-success" value={`₹${product.price}`} disabled />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">Seller</label>
                      <input type="text" className="form-control" value={product.sellerEmail || "seller@university.edu"} disabled />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark fw-semibold small">Simulated Payment Method</label>
                    <select className="form-select">
                      <option>Campus Wallet / UPI Direct</option>
                      <option>Credit / Debit Card</option>
                      <option>Net Banking</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer p-3 bg-light border-top">
                  <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => setShowCheckoutModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success fw-bold px-4" disabled={submitting}>
                    {submitting ? 'Processing...' : 'Confirm Escrow Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Socket.io Chat Modal */}
      {showChatModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-2xl">
              <div className="modal-header bg-dark text-white p-4" style={{ background: 'var(--primary-gradient)' }}>
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-chat-dots-fill me-2"></i> Chat with Seller
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowChatModal(false)}></button>
              </div>

              <form onSubmit={handleSendChatMessage}>
                <div className="modal-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-3 p-3 bg-light rounded-3 border">
                    <i className="bi bi-box-seam fs-3 text-success"></i>
                    <div>
                      <h6 className="fw-bold mb-0">{product.title}</h6>
                      <small className="text-muted">Seller: {product.sellerEmail || "seller@university.edu"}</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark fw-semibold small">Your Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Hi! Is this item still available for pickup on campus?"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer p-3 bg-light border-top">
                  <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => setShowChatModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success fw-bold px-4">
                    Send Message <i className="bi bi-send-fill ms-1"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
