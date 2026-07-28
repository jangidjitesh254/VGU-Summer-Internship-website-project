import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onDelete }) {
  const fallbackImg = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800";

  return (
    <div className="col-lg-3 col-md-6 col-sm-12">
      <div className="card product-card h-100">
        <div className="product-card-img-wrapper">
          <img
            src={product.image || fallbackImg}
            className="product-card-img"
            alt={product.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImg;
            }}
          />
          {product.condition && (
            <span className="badge-condition">
              {product.condition}
            </span>
          )}
        </div>

        <div className="card-body d-flex flex-column p-4">
          <div>
            {product.category && (
              <span className="badge-category">
                <i className="bi bi-tag-fill me-1"></i>
                {product.category}
              </span>
            )}
            <h5 className="card-title fw-bold text-dark text-truncate mb-2" title={product.title}>
              {product.title}
            </h5>
          </div>

          <div className="mt-2 mb-3">
            <span className="fs-4 fw-bold text-success">
              ₹{Number(product.price).toLocaleString()}
            </span>
          </div>

          {product.description && (
            <p className="text-muted small text-truncate-2 mb-3" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '38px'
            }}>
              {product.description}
            </p>
          )}

          <div className="mt-auto d-flex flex-column gap-2 pt-2 border-top">
            <div className="d-flex gap-2">
              <Link to={`/product/${product._id}`} className="btn btn-success flex-grow-1 btn-sm py-2 fw-medium d-flex align-items-center justify-content-center gap-1">
                 View Details
              </Link>
              <Link to={`/edit-product/${product._id}`} className="btn btn-outline-warning btn-sm px-3 d-flex align-items-center justify-content-center" title="Edit Product">
                <i className="bi bi-pencil"></i>
              </Link>
            </div>

            <button
              onClick={() => onDelete(product._id)}
              className="btn btn-outline-danger btn-sm w-100 py-1 d-flex align-items-center justify-content-center gap-1 opacity-75 hover-100"
            >
               Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
