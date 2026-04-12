import React, { useState, useEffect } from "react";

export default function RecentlyViewed({ onProductClick }) {
  const [recentProducts, setRecentProducts] = useState([]);

  // Load recently viewed products from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("gw_recently_viewed");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setRecentProducts(parsed);
      } catch (e) {}
    }
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 my-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 
          className="text-lg font-semibold text-slate-800"
          style={{ fontSize: "1.1rem", color: "#94a3b8" }}
        >
          Recently Viewed
        </h2>
      </div>

      {/* Horizontal scrollable product row with inline styles for gap */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '20px',
          paddingBottom: '8px',
        }}
      >
        {recentProducts.map((product) => (
          <div
            key={product.id}
            style={{
              flexShrink: 0,
              width: '80px',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s ease',
            }}
            className="hover:shadow-md"
            onClick={() => onProductClick(product)}
          >
            <div
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '0px',
                padding: '4px',
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '64px',
                  objectFit: 'contain',
                }}
              />
            </div>
            <div
              style={{
                marginTop: '4px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#1e293b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {product.title}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#64748b',
              }}
            >
              ${product.ticketPrice}/ticket
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
