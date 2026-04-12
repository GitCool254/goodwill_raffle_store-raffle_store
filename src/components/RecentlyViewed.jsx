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
        <h2 className="text-lg font-semibold text-slate-800">Recently Viewed</h2>
        {/* Optional "See All" link – could link to a full history page, but we skip for now */}
      </div>

      {/* Horizontal scrollable product row */}
      <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin">
        {recentProducts.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-36 cursor-pointer hover:shadow-md transition"
            onClick={() => onProductClick(product)}
          >
            <div className="bg-gray-100 rounded-lg p-2">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-24 object-contain"
              />
            </div>
            <div className="mt-2 text-sm font-medium text-slate-800 truncate">
              {product.title}
            </div>
            <div className="text-xs text-slate-500">
              ${product.ticketPrice} / ticket
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
