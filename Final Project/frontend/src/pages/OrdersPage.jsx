import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserTransactions, releaseEscrow } from '../api';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [activeTab, setActiveTab] = useState('purchases');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTransactions = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getUserTransactions(user.email);
      setPurchases(data.purchases || []);
      setSales(data.sales || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders and transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const handleRelease = async (id) => {
    const confirmRelease = window.confirm(
      "Confirm releasing escrow payment to seller? Only release funds once you have inspected and received the item."
    );
    if (!confirmRelease) return;

    try {
      await releaseEscrow(id);
      alert("✨ Payment released to seller! Transaction completed.");
      loadTransactions();
    } catch (err) {
      console.error(err);
      alert("Failed to release payment.");
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center min-vh-75 d-flex flex-column justify-content-center align-items-center">
        <div className="card shadow-lg p-5 rounded-4 border-0 max-w-md">
          <i className="bi bi-shield-lock-fill display-2 text-success mb-3"></i>
          <h3 className="fw-bold">Sign In Required</h3>
          <p className="text-muted">Please log in to view your orders, escrow transactions, and buyer protection status.</p>
          <Link to="/login" className="btn btn-success px-4 py-2 mt-2">
            Login to Account
          </Link>
        </div>
      </div>
    );
  }

  const currentList = activeTab === 'purchases' ? purchases : sales;

  return (
    <div className="py-5 bg-light min-vh-90">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-extrabold mb-1 d-flex align-items-center gap-2">
              <i className="bi bi-shield-check text-success"></i> My Orders & Escrow
            </h2>
            <p className="text-muted small mb-0">Track purchases, buyer protection, and escrow statuses</p>
          </div>

          <div className="d-flex gap-2">
            <button
              onClick={() => setActiveTab('purchases')}
              className={`btn ${activeTab === 'purchases' ? 'btn-success fw-bold' : 'btn-outline-secondary'} rounded-pill px-4`}
            >
              My Purchases ({purchases.length})
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`btn ${activeTab === 'sales' ? 'btn-success fw-bold' : 'btn-outline-secondary'} rounded-pill px-4`}
            >
              My Sales ({sales.length})
            </button>
          </div>
        </div>

        {/* Escrow Banner */}
        <div className="card border-0 bg-dark text-white rounded-4 p-4 mb-4 shadow">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                <i className="bi bi-bank fs-4"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1">Buyer Escrow Guarantee</h5>
                <p className="text-white-50 small mb-0">Payments are held safely in ReUse Escrow until you inspect and accept the item in person.</p>
              </div>
            </div>
            <button onClick={loadTransactions} className="btn btn-outline-light btn-sm rounded-pill px-3">
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh Orders
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading orders...</span>
            </div>
            <p className="mt-3 text-muted">Fetching transaction records...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger p-4 rounded-4 shadow-sm text-center">
            {error}
          </div>
        )}

        {!loading && !error && currentList.length === 0 && (
          <div className="card shadow-sm border-0 rounded-4 p-5 text-center bg-white">
            <i className="bi bi-box-seam text-muted display-3 mb-3 d-block"></i>
            <h4 className="fw-bold">No {activeTab === 'purchases' ? 'Purchases' : 'Sales'} Found</h4>
            <p className="text-muted">You haven't made any {activeTab === 'purchases' ? 'purchases with escrow protection' : 'sales'} yet.</p>
            <Link to="/dashboard" className="btn btn-success rounded-pill px-4 align-self-center mt-2">
              Browse Campus Marketplace
            </Link>
          </div>
        )}

        {!loading && !error && currentList.length > 0 && (
          <div className="row g-4">
            {currentList.map((t) => (
              <div key={t._id} className="col-lg-6">
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100 bg-white">
                  <div className="p-4 d-flex flex-column justify-content-between h-100">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="badge bg-secondary bg-opacity-10 text-secondary border px-3 py-1.5 rounded-pill fw-semibold">
                          <i className="bi bi-tag-fill me-1"></i> {t.type}
                        </span>

                        {t.status === 'Held in Escrow' && (
                          <span className="badge bg-warning bg-opacity-20 text-dark border border-warning px-3 py-1.5 rounded-pill fw-bold">
                            <i className="bi bi-hourglass-split me-1"></i> Held in Escrow
                          </span>
                        )}

                        {t.status === 'Released' && (
                          <span className="badge bg-success text-white px-3 py-1.5 rounded-pill fw-bold">
                            <i className="bi bi-check-circle-fill me-1"></i> Released & Completed
                          </span>
                        )}
                      </div>

                      <div className="d-flex gap-3 align-items-center mb-3">
                        {t.productImage ? (
                          <img src={t.productImage} alt={t.productTitle} className="rounded-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                        ) : (
                          <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                            <i className="bi bi-box fs-3 text-muted"></i>
                          </div>
                        )}
                        <div>
                          <h5 className="fw-bold text-dark mb-1">{t.productTitle}</h5>
                          <p className="text-muted small mb-0">Order Date: {new Date(t.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-light rounded-3 mb-3 d-flex align-items-center justify-content-between border">
                        <div>
                          <small className="text-muted text-uppercase fw-semibold d-block">Amount</small>
                          <span className="fs-4 fw-bold text-success">₹{Number(t.amount).toLocaleString()}</span>
                        </div>
                        <div className="text-end">
                          <small className="text-muted d-block">
                            {activeTab === 'purchases' ? 'Seller' : 'Buyer'}
                          </small>
                          <span className="fw-semibold text-dark">
                            {activeTab === 'purchases' ? t.sellerName || t.sellerEmail : t.buyerName || t.buyerEmail}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Escrow Release Button for Buyer */}
                    {activeTab === 'purchases' && t.status === 'Held in Escrow' && (
                      <div className="pt-2 border-top">
                        <button
                          onClick={() => handleRelease(t._id)}
                          className="btn btn-success w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        >
                          <i className="bi bi-check-lg fs-5"></i> Release Escrow Payment to Seller
                        </button>
                        <small className="text-muted text-center d-block mt-2" style={{ fontSize: '0.75rem' }}>
                          Only click after you have inspected and received the item.
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
