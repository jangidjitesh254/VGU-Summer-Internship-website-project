import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, deleteProductApi } from '../api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage({ externalSearchTerm }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterRef = useRef(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery) {
      setSearchTerm(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (externalSearchTerm !== undefined) {
      setSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  // Close filter menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadProductsList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load products from server. Make sure backend is running on localhost:5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductsList();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete your product listing?");
    if (!confirmDelete) return;

    try {
      await deleteProductApi(id, user ? user.email : null);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete product.");
    }
  };

  const categories = [
    'All',
    'Books',
    'Electronics',
    'Furniture',
    'Fashion',
    'Sports',
    'Others',
  ];

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setLocationFilter('');
  };

  const isFiltered = selectedCategory !== 'All' || searchTerm || minPrice || maxPrice || locationFilter;

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = !searchTerm ||
      (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const price = Number(p.price);
    const matchesMin = !minPrice || price >= Number(minPrice);
    const matchesMax = !maxPrice || price <= Number(maxPrice);
    const matchesLocation = !locationFilter || (p.location && p.location.toLowerCase().includes(locationFilter.toLowerCase()));

    return matchesCategory && matchesSearch && matchesMin && matchesMax && matchesLocation;
  });

  return (
    <div>
      {/* Dashboard Hero */}
      <section className="hero-section py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge bg-white text-success px-3 py-2 rounded-pill fw-bold mb-3 shadow-sm">
                Campus Deals Hub
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3">
                Find Great Deals Around Your Campus
              </h1>
              <p className="lead text-white-90 fs-5 mb-4">
                Buy and sell second-hand products quickly and easily with Buyer Escrow Protection.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a href="#products" className="btn btn-light btn-lg px-4 py-3 fw-bold text-success rounded-3 shadow">
                  Browse Catalog ({products.length})
                </a>
                <Link to="/add-product" className="btn btn-outline-light btn-lg px-4 py-3 fw-bold rounded-3">
                  List New Item
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                className="img-fluid rounded-4 shadow-lg hero-img"
                alt="Marketplace banner"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section with Filters */}
      <section className="container py-5" id="products">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
          <div>
            <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <span>Latest Products</span>
              {selectedCategory !== 'All' && (
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 fs-6 fw-semibold rounded-pill px-3 py-1">
                  {selectedCategory}
                </span>
              )}
            </h2>
            <p className="text-muted small mb-0">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} on campus
            </p>
          </div>

          {/* Action Bar: Filter Icon, Price & Location Filters & Refresh */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Category & Multi-Criteria Filter Dropdown */}
            <div className="position-relative" ref={filterRef}>
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`btn ${isFiltered ? 'btn-success text-white' : 'btn-outline-success'} d-flex align-items-center gap-2 rounded-pill px-3 py-2 fw-semibold shadow-sm`}
                type="button"
                aria-expanded={showFilterMenu}
              >
                <i className="bi bi-funnel-fill fs-6"></i>
                <span>Filter Options</span>
                <i className={`bi bi-chevron-${showFilterMenu ? 'up' : 'down'} small ms-1`}></i>
              </button>

              {showFilterMenu && (
                <div
                  className="dropdown-menu dropdown-menu-end dropdown-menu-dark show shadow-2xl border border-secondary border-opacity-25 rounded-4 p-4 mt-2 position-absolute"
                  style={{ right: 0, top: '100%', minWidth: '310px', zIndex: 1050 }}
                >
                  <h6 className="fw-bold text-white mb-3 d-flex align-items-center justify-content-between">
                    <span><i className="bi bi-sliders me-2 text-success"></i>Search & Filter</span>
                    {isFiltered && (
                      <button onClick={handleResetFilters} className="btn btn-link text-danger p-0 text-decoration-none small">
                        Reset All
                      </button>
                    )}
                  </h6>

                  {/* Category Selection */}
                  <div className="mb-3">
                    <label className="form-label text-white-50 small fw-bold">Category</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-3">
                    <label className="form-label text-white-50 small fw-bold">Price Range (₹)</label>
                    <div className="row g-2">
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control bg-dark text-white border-secondary form-control-sm"
                          placeholder="Min ₹"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control bg-dark text-white border-secondary form-control-sm"
                          placeholder="Max ₹"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="mb-3">
                    <label className="form-label text-white-50 small fw-bold">Campus / Location</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary form-control-sm"
                      placeholder="e.g. Main Campus, Dorm A..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => setShowFilterMenu(false)}
                    className="btn btn-success w-100 btn-sm py-2 fw-bold mt-2"
                  >
                    Apply Filters
                  </button>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1"
                title="Reset all filters"
              >
                <i className="bi bi-x-circle-fill"></i> Clear Filters
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={loadProductsList}
              className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-medium d-flex align-items-center gap-2"
            >
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>

        {/* Active Filter Tags */}
        {isFiltered && (
          <div className="mb-4 d-flex flex-wrap align-items-center gap-2">
            <span className="text-muted small">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <span className="badge bg-success text-white px-3 py-1.5 rounded-pill">Category: {selectedCategory}</span>
            )}
            {minPrice && <span className="badge bg-secondary text-white px-3 py-1.5 rounded-pill">Min: ₹{minPrice}</span>}
            {maxPrice && <span className="badge bg-secondary text-white px-3 py-1.5 rounded-pill">Max: ₹{maxPrice}</span>}
            {locationFilter && <span className="badge bg-secondary text-white px-3 py-1.5 rounded-pill">Location: {locationFilter}</span>}
            {searchTerm && <span className="badge bg-secondary text-white px-3 py-1.5 rounded-pill">Search: "{searchTerm}"</span>}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading products...</span>
            </div>
            <p className="mt-3 text-muted">Fetching latest campus items...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="alert alert-danger p-4 rounded-4 shadow-sm text-center my-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill fs-2 d-block mb-2"></i>
            <h5 className="fw-bold">{error}</h5>
            <p className="mb-3 small">Please verify that your Express backend is running on <code>http://localhost:5000</code>.</p>
            <button onClick={loadProductsList} className="btn btn-danger btn-sm px-4">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-5">
            <i className="bi bi-box-seam text-muted display-3 mb-3 d-block"></i>
            <h4 className="fw-bold text-dark">No Products Found</h4>
            <p className="text-muted max-w-md mx-auto mb-4">
              {isFiltered
                ? "No products match your current search, price, or location filters. Try clearing filters."
                : "There are currently no products listed in the marketplace. Be the first to add one!"}
            </p>
            <div className="d-flex justify-content-center gap-3">
              {isFiltered && (
                <button onClick={handleResetFilters} className="btn btn-outline-secondary rounded-pill">
                  Reset All Filters
                </button>
              )}
              <Link to="/add-product" className="btn btn-success rounded-pill">
                Add First Product
              </Link>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || Math.random()}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
