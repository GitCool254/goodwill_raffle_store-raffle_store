import React, { useState } from "react";

/**
 * Catalog Component
 * - Displays categories (Electronics, Phones, Laptops, Furniture, Household)
 * - Smaller product cards
 * - Category filter + search bar
 * - Real images (local PNG/JPG + online placeholders)
 */

export default function Catalog({ openProduct }) {
  // ----- PRODUCT DATA -----
  const catalogItems = [
    // ----- Phones -----
    {
      id: "p1",
      category: "Casual & Outdoor Wear",
      title: "iPhone 15 Pro",
      ticketPrice: 5,
      description: "Premium Apple flagship.",
      image: "/Screenshot_20251007-201731~2.png",
    },
    {
      id: "p2",
      category: "Casual & Outdoor Wear",
      title: "Golf cart club car",
      ticketPrice: 4,
      description: "Golf club car.",
      image: "/Golf car.png",
    },

    // ----- Sports -----
    {
      id: "p3",
      category: "Sports",
      title: "Yamaha Jetski",
      ticketPrice: 5,
      description: "Yamaha jetski.",
      image: "/Yamaha vx110 jetski.png",
    },
    {
      id: "p4",
      category: "Sports",
      title: "Surfboard",
      ticketPrice: 3,
      description: "Surfboard xxxx.",
      image: "/Surfboard.png",
    },

    // ----- Electronics -----
    {
      id: "p5",
      category: "Electronics",
      title: "Treadmill",
      ticketPrice: 5,
      description: "Treadmill for you.",
      image: "/Treadmill Pro.png",
    },
    {
      id: "p6",
      category: "Electronics",
      title: "E bike",
      ticketPrice: 6,
      description: "Quality ebike for sale.",
      image: "/E bike Two.png",
    },

    // ----- Furniture -----
    {
      id: "p7",
      category: "Furniture",
      title: "Beachcroft Patio",
      ticketPrice: 10,
      description: "High-quality living room sofa.",
      image: "/Beachcroft Patio.jpg",
      images: [
        "/Beachcroft Patio.jpg",
        "/Beachcroft Patio1.jpg",
        "/Beachcroft Patio2.jpg",
      ],
    },
    {
      id: "p8",
      category: "Furniture",
      title: "Kitchen Island",
      ticketPrice: 8,
      description: "A highly customized Kitchen island.",
      image: "/Kitchen Island1.jpg",
    },

    // ----- Household -----
    {
      id: "p9",
      category: "Household",
      title: "Washer &Dryer",
      ticketPrice: 2,
      description: "High-efficiency Dryer Washer.",
      image: "/Washer &Dryer.png",
    },
    {
      id: "p10",
      category: "Household",
      title: "Spa Hot Tub",
      ticketPrice: 1,
      description: "Hot tub customized, high efficiency.",
      image: "/Spa Hot Tub.jpg",
    },
  ];

  // ----- CATEGORY LIST -----
  const categories = ["All", "Phones", "Sports", "Electronics", "Furniture", "Household"];

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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Product Catalog</h1>

      {/* ----- SEARCH + CATEGORY FILTERS ----- */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border rounded w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Buttons */}
        <div className="flex gap-2 overflow-scroll no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded border ${
                selectedCategory === cat
                  ? "bg-sky-600 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ----- PRODUCT GRID ----- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-lg p-3 flex flex-col cursor-pointer hover:shadow-lg transition"
            onClick={() => openProduct(item)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-28 w-full object-cover rounded mb-2"
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/200x150")
              }
            />
            <div className="text-sm font-semibold">{item.title}</div>
            <div className="text-xs text-slate-500">{item.category}</div>
            <div className="text-sm mt-1">
              $ {item.ticketPrice} <span className="text-xs">/ticket</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
