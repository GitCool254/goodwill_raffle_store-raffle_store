import React, { useState } from "react";
import { catalogItems } from "../data/products";

/**
 * Catalog Component
 * - Displays categories (Electronics, Phones, Laptops, Furniture, Household)
 * - Smaller product cards
 * - Category filter + search bar
 * - Real images (local PNG/JPG + online placeholders)
 */
export default function Catalog({ openProduct }) {
  // ----- CATEGORY LIST -----
  const categories = ["All", "Casual & Outdoor Wear", "Sports", "Electronics", "Furniture", "Household"];

  // ----- STATE -----
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  // ----- FILTER LOGIC -----
  const filtered = catalogItems.filter((item) => {
    const matchCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div
      className="max-w-6xl mx-auto p-6"
      style={{ backgroundColor: "#f1f5f9" }}
    >
      <h1
        className="text-xl font-bold mb-4"
        style={{ fontSize: "1.25rem" }}
      >
        Product Catalog
      </h1>

      {/* ----- SEARCH INPUT (full width) ----- */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ----- CATEGORY BUTTONS - Grid with 6 equal columns, full width, evenly distributed ----- */}
      <div className="grid grid-cols-6 gap-2 w-full mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-1 rounded border text-center text-sm ${
              selectedCategory === cat
                ? "bg-sky-600 text-white"
                : "bg-white text-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ----- PRODUCT GRID - Exactly two cards per row, edge to edge ----- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          width: '100%'
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer hover:shadow-lg transition"
            style={{
              width: '100%',
              backgroundColor: '#e6f3ff',
              borderRadius: '0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              overflow: 'hidden',
              padding: '16px',
              paddingBottom: '20px',
              marginBottom: '10px'
            }}
            onClick={() => openProduct(item)}
          >
            {/* White container for title + category + price with 20px left/right margins */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0px',
                padding: '10px',
                marginLeft: '10px',
                marginRight: '10px',
                marginTop: '10px',
                marginBottom: '20px'
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '8px', color: '#1e293b' }}>{item.title}</div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>{item.category}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginTop: '8px' }}>
                $ {item.ticketPrice} <span style={{ fontSize: '0.75rem' }}>/ticket</span>
              </div>
            </div>
            {/* White container for image with 10px margins and padding */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0px',
                marginLeft: '5px',
                marginRight: '5px',
                marginTop: '10px',
                marginBottom: '10px',
                padding: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain', borderRadius: '6px' }}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/200x150")
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
