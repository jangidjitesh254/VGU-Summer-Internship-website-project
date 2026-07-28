import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      alert(response.message || "Registration Successful!");
      login(response.user);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page py-5">
      <div className="container py-4">
        <div className="row justify-content-center align-items-center min-vh-80">
          <div className="col-lg-11">
            <div className="card auth-card overflow-hidden shadow-2xl">
              <div className="row g-0">
                {/* Left Section */}
                <div className="col-lg-5 auth-left d-flex flex-column justify-content-center">
                  <span className="badge bg-white text-success px-3 py-2 rounded-pill fw-bold align-self-start mb-3">
                    Campus Marketplace
                  </span>
                  <h1 className="fw-extrabold display-5 mb-3 text-white">
                    Join Campus Marketplace
                  </h1>
                  <p className="lead text-white-90 fs-6 mb-4">
                    Buy and sell second-hand items with trusted students around you.
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                    alt="Campus Community"
                    className="img-fluid rounded-4 shadow-sm mt-3"
                    style={{ maxHeight: '250px', objectFit: 'cover' }}
                  />
                </div>

                {/* Right Section */}
                <div className="col-lg-7 bg-white p-4 p-md-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark mb-1">Create Account</h2>
                    <p className="text-muted small">Sign up with your details to get started</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger rounded-3 mb-3 small" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold text-dark">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          className="form-control form-control-custom"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold text-dark">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          className="form-control form-control-custom"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-custom"
                        placeholder="john.doe@university.edu"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control form-control-custom"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold text-dark">Password</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control form-control-custom"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold text-dark">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control form-control-custom"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4 form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="agreeTerms"
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label text-muted small" htmlFor="agreeTerms">
                        I agree to the <a href="#" onClick={(e)=>e.preventDefault()} className="text-success text-decoration-none">Terms & Conditions</a> and Campus Safety Guidelines.
                      </label>
                    </div>

                    <button type="submit" className="btn btn-emerald w-100 py-3 fw-bold fs-6 shadow" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        "Create Student Account"
                      )}
                    </button>
                  </form>

                  <hr className="my-4 border-light-subtle" />

                  <p className="text-center text-muted small mb-3">
                    Already have an account?{' '}
                    <Link to="/login" className="fw-bold text-success text-decoration-none ms-1">
                      Login Here
                    </Link>
                  </p>

                  <div className="text-center">
                    <Link to="/" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                      <i className="bi bi-arrow-left me-1"></i> Back to Home
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
