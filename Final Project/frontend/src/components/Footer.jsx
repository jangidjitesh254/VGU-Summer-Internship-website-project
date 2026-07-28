import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary border-opacity-25">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-recycle text-success"></i>
              <span className="navbar-brand-gradient">ReUse</span>
            </h4>
            <p className="text-white-50">
              The premier peer-to-peer campus marketplace. Buy, sell, and exchange second-hand books, electronics, furniture, and more safely within your campus community.
            </p>
          </div>
          
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-uppercase mb-3 text-success">Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-white-50">
              <li><Link to="/" className="text-white-50 text-decoration-none hover-white">Home</Link></li>
              <li><Link to="/dashboard" className="text-white-50 text-decoration-none">Browse Products</Link></li>
              <li><Link to="/add-product" className="text-white-50 text-decoration-none">List an Item</Link></li>
              <li><Link to="/login" className="text-white-50 text-decoration-none">Student Login</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-uppercase mb-3 text-success">Categories</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-white-50">
              <li><span className="text-white-50">Books & Notes</span></li>
              <li><span className="text-white-50">Electronics & Gadgets</span></li>
              <li><span className="text-white-50">Furniture & Decor</span></li>
              <li><span className="text-white-50">Cycles & Sports Gear</span></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-uppercase mb-3 text-success">Campus Guarantee</h6>
            <div className="p-3 bg-secondary bg-opacity-10 rounded-3 border border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-shield-check text-success fs-5"></i>
                <span className="fw-bold">100% Student Verified</span>
              </div>
              <p className="small text-white-50 mb-0">Direct cash on delivery or instant online transfers when meeting safely on campus.</p>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-50" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-white-50 small">
          <p className="mb-0">© {new Date().getFullYear()} ReUse Marketplace. All Rights Reserved.</p>
          <div className="d-flex gap-4">
            <a href="#" className="text-white-50 text-decoration-none">Privacy Policy</a>
            <a href="#" className="text-white-50 text-decoration-none">Terms of Service</a>
            <a href="#" className="text-white-50 text-decoration-none">Campus Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
