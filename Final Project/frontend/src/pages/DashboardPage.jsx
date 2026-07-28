import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, deleteProductApi } from '../api';

export default function DashboardPage({ externalSearchTerm }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
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
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
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

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = !searchTerm ||
      (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
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
                Buy and sell second-hand products quickly and easily from fellow students.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a href="#products" className="btn btn-light btn-lg px-4 py-3 fw-bold text-success rounded-3 shadow">
                  Browse Catalog ({products.length})
                </a>
                <Link to="/add-product" className="btn btn-outline-light btn-lg px-4 py-3 fw-bold rounded-3">
                  + List New Item
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

      {/* Products Section with Category Filter Icon */}
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

          {/* Action Bar: Filter Icon, Search Query Tag & Refresh */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Category Filter Icon Button */}
            <div className="position-relative" ref={filterRef}>
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`btn ${selectedCategory !== 'All' ? 'btn-success text-white' : 'btn-outline-emerald'} d-flex align-items-center gap-2 rounded-pill px-3 py-2 fw-semibold shadow-sm`}
                type="button"
                aria-expanded={showFilterMenu}
              >
                <i className="bi bi-funnel-fill fs-6"></i>
                <span>Filter {selectedCategory !== 'All' ? `: ${selectedCategory}` : 'Category'}</span>
                <i className={`bi bi-chevron-${showFilterMenu ? 'up' : 'down'} small ms-1`}></i>
              </button>

              {showFilterMenu && (
                <ul
                  className="dropdown-menu dropdown-menu-end dropdown-menu-dark show shadow-xl border border-secondary border-opacity-25 rounded-3 p-2 mt-2 position-absolute"
                  style={{ right: 0, top: '100%', minWidth: '200px', zIndex: 1050 }}
                >
                  <li className="px-3 py-2 text-white-50 small fw-bold text-uppercase tracking-wider">
                    Filter by Category
                  </li>
                  <li><hr className="dropdown-divider my-1 border-secondary border-opacity-25" /></li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`dropdown-item rounded-2 py-2 fw-medium ${selectedCategory === cat ? 'active bg-success text-white' : ''}`}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowFilterMenu(false);
                        }}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Clear Filters Button */}
            {(selectedCategory !== 'All' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchTerm('');
                }}
                className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1"
                title="Reset all filters"
              >
                <i className="bi bi-x-circle-fill"></i> Clear Filter
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

        {/* Search Term Badge Notification */}
        {searchTerm && (
          <div className="mb-4 d-flex align-items-center gap-2">
            <span className="text-muted small">Active Search:</span>
            <span className="badge bg-secondary text-white fw-normal px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2">
              "{searchTerm}"
              <i className="bi bi-x-lg cursor-pointer ms-1" onClick={() => setSearchTerm('')} style={{ cursor: 'pointer' }}></i>
            </span>
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
              {searchTerm || selectedCategory !== 'All'
                ? "No products match your current category or search filters. Try picking another category or resetting filters."
                : "There are currently no products listed in the marketplace. Be the first to add one!"}
            </p>
            <div className="d-flex justify-content-center gap-3">
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                  className="btn btn-outline-secondary rounded-pill"
                >
                  Reset All Filters
                </button>
              )}
              <Link to="/add-product" className="btn btn-emerald rounded-pill">
                + Add First Product
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
