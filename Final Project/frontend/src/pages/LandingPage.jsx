import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              
              <h1 className="display-3  fw-extrabold text-white fw-bolder mb-4 lh-sm">
                Buy & Sell Second-Hand Items Easily
              </h1>
              <p className="lead text-white-90 fs-5 mb-4 opacity-90">
                Find affordable textbooks, electronics, dorm furniture, cycles, and daily essentials from trusted students right on your campus.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/login" className="btn btn-light btn-lg px-4 py-3 fw-bold text-success shadow-lg rounded-3 d-flex align-items-center gap-2">
                  <i className="bi bi-bag-plus-fill fs-5"></i> Start Selling
                </Link>
                <Link to="/dashboard" className="btn btn-outline-light btn-lg px-4 py-3 fw-bold rounded-3 d-flex align-items-center gap-2">
                  <i className="bi bi-compass-fill fs-5"></i> Explore Marketplace
                </Link>
              </div>

              <div className="mt-5 d-flex align-items-center gap-4 text-white-50 border-top border-white border-opacity-10 pt-4">
                <div>
                  <h4 className="fw-bold text-white mb-0">5,000+</h4>
                  <small>Active Students</small>
                </div>
                <div className="vr bg-white opacity-25"></div>
                <div>
                  <h4 className="fw-bold text-white mb-0">12,000+</h4>
                  <small>Items Reused</small>
                </div>
                <div className="vr bg-white opacity-25"></div>
                <div>
                  <h4 className="fw-bold text-white mb-0">100%</h4>
                  <small>Verified Campus</small>
                </div>
              </div>
            </div>

            <div className="col-lg-6 text-center position-relative">
              <div className="position-relative d-inline-block">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                  alt="Students on campus"
                  className="img-fluid rounded-4 shadow-lg hero-img"
                />
                <div className="position-absolute bottom-0 start-0 m-4 p-3 glass-panel text-dark text-start shadow-lg rounded-3 d-none d-sm-flex align-items-center gap-3">
                  <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                    <i className="bi bi-shield-check fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Verified Trade Zone</h6>
                    <small className="text-muted">Direct Student-to-Student Deals</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

           
    </div>
  );
}
