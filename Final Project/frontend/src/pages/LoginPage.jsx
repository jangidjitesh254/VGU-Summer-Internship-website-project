import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userNotFound, setUserNotFound] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after login if coming from a protected route
  const from = location.state?.from?.pathname || '/dashboard';
  const redirectMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUserNotFound(false);

    try {
      const response = await loginUser({ email, password });
      login(response.user);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const errMsg = err.message || 'Login failed. Please check your credentials.';
      setError(errMsg);

      if (errMsg.toLowerCase().includes('not exist') || errMsg.toLowerCase().includes('register first')) {
        setUserNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page py-5">
      <div className="container py-4">
        <div className="row justify-content-center align-items-center min-vh-80">
          <div className="col-lg-10">
            <div className="card auth-card overflow-hidden shadow-2xl">
              <div className="row g-0">
                {/* Left Side Hero */}
                <div className="col-lg-6 auth-left d-flex flex-column justify-content-center">
                  <span className="badge bg-white text-success px-3 py-2 rounded-pill fw-bold align-self-start mb-3">
                    ReUse Marketplace
                  </span>
                  <h1 className="fw-extrabold display-5 mb-3 text-white">
                    Welcome Back!
                  </h1>
                  <p className="lead text-white-90 fs-6 mb-4">
                    Buy and sell second-hand items safely within your campus community.
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                    alt="Campus illustration"
                    className="img-fluid rounded-4 shadow-sm mt-3"
                    style={{ maxHeight: '240px', objectFit: 'cover' }}
                  />
                </div>

                {/* Right Side Form */}
                <div className="col-lg-6 bg-white p-4 p-md-5 d-flex flex-column justify-content-center">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark mb-1">Sign In</h2>
                    <p className="text-muted small">Enter your email and password to access ReUse</p>
                  </div>

                  {redirectMessage && !error && (
                    <div className="alert alert-warning rounded-3 mb-3 small d-flex align-items-center gap-2" role="alert">
                      <i className="bi bi-shield-lock-fill text-warning fs-5"></i>
                      <span>{redirectMessage}</span>
                    </div>
                  )}

                  {error && (
                    <div className="alert alert-danger rounded-3 mb-3 small" role="alert">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                        <span className="fw-bold">{error}</span>
                      </div>
                      {userNotFound && (
                        <div className="mt-2 pt-2 border-top border-danger border-opacity-25">
                          <p className="mb-2">Don't have an account yet?</p>
                          <Link to="/register" className="btn btn-danger btn-sm w-100 fw-bold py-2">
                            <i className="bi bi-person-plus-fill me-1"></i> Register New Account Now
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control form-control-custom rounded-end-3"
                          placeholder="student@university.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control form-control-custom rounded-end-3"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4 small">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="form-check-label text-muted" htmlFor="rememberMe">
                          Remember Me
                        </label>
                      </div>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert("Password reset link sent!"); }} className="text-success text-decoration-none fw-semibold">
                        Forgot Password?
                      </a>
                    </div>

                    <button type="submit" className="btn btn-emerald w-100 py-3 fw-bold fs-6 shadow" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Verifying Account...
                        </>
                      ) : (
                        <>
                          Login to Account <i className="bi bi-arrow-right ms-2"></i>
                        </>
                      )}
                    </button>
                  </form>

                  <hr className="my-4 border-light-subtle" />

                  <p className="text-center text-muted small mb-3">
                    Don't have an account?{' '}
                    <Link to="/register" className="fw-bold text-success text-decoration-none ms-1">
                      Register First
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
