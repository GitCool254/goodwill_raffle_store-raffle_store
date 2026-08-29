import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { catalogItems } from "../data/products";

export default function Catalog({ openProduct }) {
  const categories = ["All", "Casual & Outdoor Wear", "Sports", "Electronics", "Furniture", "Household"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = catalogItems.filter((item) => {
    const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                        item.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <Helmet>
        <title>Shop Products – Goodwillstores</title>
        <meta name="description" content="Browse our full catalog of quality second‑hand electronics, furniture, outdoor gear, and more. Enter affordable prices to buy great pre‑owned items." />
      </Helmet>
      <div className="max-w-6xl mx-auto p-6" style={{ backgroundColor: "#f1f5f9" }}>
        <h1 className="text-xl font-bold mb-4" style={{ fontSize: "1.25rem" }}>Shop Products</h1>
        {/* SEARCH INPUT (full width) */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* CATEGORY BUTTONS - Grid with 6 equal columns */}
        <div className="grid grid-cols-6 gap-2 w-full mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 rounded border text-center text-sm ${
                selectedCategory === cat ? "bg-sky-600 text-white" : "bg-white text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* PRODUCT GRID - Exactly two cards per row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer hover:shadow-lg transition"
              style={{
                width: '100%',
                backgroundColor: '#e6f3ff',
                borderRadius: '0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                padding: '16px',
                paddingBottom: '20px',
                marginBottom: '10px'
              }}
              onClick={() => openProduct(item)}
            >
              {/* White container for title + category + price */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '0px', padding: '10px', marginLeft: '10px', marginRight: '10px', marginTop: '10px', marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '8px', color: '#1e293b' }}>{item.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#475569' }}>{item.category}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginTop: '8px' }}>
                  $ {item.ticketPrice} <span style={{ fontSize: '0.75rem' }}>/ticket</span>
                </div>
              </div>
              {/* Image container */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '0px', marginLeft: '5px', marginRight: '5px', marginTop: '10px', marginBottom: '10px', padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain', borderRadius: '6px' }}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/200x150")}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
