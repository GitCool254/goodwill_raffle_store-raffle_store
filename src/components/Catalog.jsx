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
    // ----- Casual & Outdoor Wear -----
    {
      id: "p1",
      category: "Casual & Outdoor Wear",
      title: "Balaclava",
      ticketPrice: 3,
      description: "Best Quality & fitting.",
      image: "/Balaclava.jpg",
      images: [
        "/Balaclava.jpg",
        "/Balaclava1.jpg",
        "/Balaclava2.jpg",
        "/Balaclava3.jpg",
      ],
    },
    {
      id: "p2",
      category: "Casual & Outdoor Wear",
      title: "Western boots",
      ticketPrice: 4,
      description: "Western boots - all varieties.",
      image: "/Western Boots  Gld.jpg",
      images: [
        "/Western Boots  Gld.jpg",
        "/Western Boots Bla1.jpg",
        "/Western Boots Blu3.jpg",
        "/Western Boots Bro1.jpg",
        "/Western Boots Gld2.jpg",
      ],
    },

    // ----- Sports -----
    {
      id: "p3",
      category: "Sports",
      title: "Golf cart club car",
      ticketPrice: 4,
      description: "Golf club car.",
      image: "/Golf car.png",
      images: [
        "/Golf car1.png",
        "/Golf cart club car.png",
        "/Golf cart club car1.png",
        "/Golf cart club car2.png",
        "/Golf cart club car3.png",
      ],
    },
     {
      id: "p4",
      category: "Sports",
      title: "G2 Virtual Reality Headset",
      ticketPrice: 4,
      description: "Reliable virtual reality headset.",
      image: "/G2 virtual reality headset.png",
      images: [
        "/G2 virtual reality headset.png",
        "/G2 virtual reality headset1.png",
        "/G2 virtual reality headset2.png",
      ],
    },
    {
      id: "p5",
      category: "Sports",
      title: "Yamaha Jetski",
      ticketPrice: 5,
      description: "Yamaha jetski.",
      image: "/Yamaha vx110 jetski.png",
      images: [
        "/Yamaha vx110 jetski.png",
        "/Yamaha vx110 jetski1.png",
        "/Yamaha vx110 jetski2.png",
        "/Yamaha vx110 jetski3.png",
        "/Yamaha vx110 jetski4.png",
        "/Yamaha vx110 jetski5.png",
      ],  
    },
    {
      id: "p6",
      category: "Sports",
      title: "Surfboard",
      ticketPrice: 3,
      description: "Surfboard xxxx.",
      image: "/Surfboard.png",
      images: [
        "/Surfboard.png",
        "/Surfboard1.png",
        "/Surfboard2.png",
        "/Surfboard3.png",
      ],
    },

    // ----- Electronics -----
    {
      id: "p7",
      category: "Electronics",
      title: "Treadmill",
      ticketPrice: 5,
      description: "Treadmill for you.",
      image: "/Treadmill Pro.png",
      images: [
        "/Treadmill Pro1.png",
        "/Treadmill Pro2.png",
        "/Treadmill Pro3.png",
        "/Treadmill Pro4.png",
      ],
    },
    {
      id: "p8",
      category: "Electronics",
      title: "E bike",
      ticketPrice: 6,
      description: "Quality ebike for sale.",
      image: "/E bike Two.png",
      images: [
        "/E bike Two.png",
        "/E bike Two1.png",
        "/E bike Two2.png",
      ],
    },
     {
      id: "p9",
      category: "Electronics",
      title: "Night Vision",
      ticketPrice: 6,
      description: "Night vision scope.",
      image: "/Night vision scope.png",
      images: [
        "/Night vision scope.png",
        "/Night vision scope1.png",
        "/Night vision scope2.png",
      ],
    },

    // ----- Furniture -----
    {
      id: "p10",
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
      id: "p11",
      category: "Furniture",
      title: "Kitchen Island",
      ticketPrice: 8,
      description: "A highly customized Kitchen island.",
      image: "/Kitchen Island1.jpg",
      images: [
        "Kitchen Island1.jpg",
        "/Kitchen Island2.jpg",
        "/Kitchen Island3.jpg",
      ],
    },
    {
      id: "p12",
      category: "Furniture",
      title: "Sofa set",
      ticketPrice: 10,
      description: "High-quality living room sofa.",
      image: "/Sofa set.jpg",
      images: [
        "/Sofa set.jpg",
        "/Sofa set1.jpg",
        "/Sofa set2.jpg",
      ],
    },
    {
      id: "p13",
      category: "Furniture",
      title: "Light Grey Sectional",
      ticketPrice: 10,
      description: "High-quality living room sofa.",
      image: "/Cross -sectional set1.jpg",
      images: [
        "/Cross -sectional set1.jpg",
        "/Cross -sectional set.jpg",
        "/Cross -sectional set2.jpg",
        "/Cross -sectional set3.jpg",
        "/Cross -sectional set4.jpg",
        "/Cross -sectional set5.jpg",
        "/Cross -sectional set6.jpg",
      ],
    },
    {
      id: "p14",
      category: "Furniture",
      title: "Power Recliner Set",
      ticketPrice: 10,
      description: "High-quality living room sofa.",
      image: "/Beautiful Sofa.jpg",
      images: [
        "/Beautiful Sofa.jpg",
        "/Beautiful Sofa1.jpg",
        "/Beautiful Sofa2.jpg",
        "/Beautiful Sofa3.jpg",
      ],
    },
    {
      id: "p15",
      category: "Furniture",
      title: "Modern L - Shaped",
      ticketPrice: 10,
      description: "High-quality living room sofa.",
      image: "/Modern L - shaped.jpg",
      images: [
        "/Modern L - shaped.jpg",
        "/Modern L - shaped1.jpg",
        "/Modern L - shaped2.jpg",
      ],
    },


    // ----- Household -----
    {
      id: "p16",
      category: "Household",
      title: "Washer &Dryer",
      ticketPrice: 2,
      description: "High-efficiency Dryer Washer.",
      image: "/Washer &Dryer.png",
      images: [
        "/Washer &Dryer.png",
        "/Washer &Dryer1.png",
        "/Washer &Dryer2.png",
        "/Washer &Dryer3.png",
        "/Washer &Dryer4.png",
        "/Washer &Dryer5.png",
      ],
    },
    {
      id: "p17",
      category: "Household",
      title: "Spa Hot Tub",
      ticketPrice: 1,
      description: "Hot tub customized, high efficiency.",
      image: "/Spa Hot Tub.jpg",
      images: [
        "/Spa Hot Tub.jpg",
        "/Spa Hot Tub1.jpg",
        "/Spa Hot Tub2.jpg",
      ],
    },
    {
      id: "p18",
      category: "Household",
      title: "Inflatable Hot Tub",
      ticketPrice: 5,
      description: "Inflatable Tub, high efficiency.",
      image: "/Inflatable hot tub.png",
      images: [
        "/Inflatable hot tub.png",
      ],
    },
    {
      id: "p19",
      category: "Household",
      title: "Snoo Baby",
      ticketPrice: 5,
      description: "Snoo Baby.",
      image: "/Snoo Baby.jpg",
      images: [
        "/Snoo Baby.jpg",
        "/Snoo Baby1.jpg",
        "/Snoo Baby2.jpg",
        "/Snoo Baby3.jpg",
        "/Snoo Baby4.jpg",
      ],
    },
    {
      id: "p20",
      category: "Household",
      title: "Massage sit",
      ticketPrice: 3,
      description: "Customized & comfortable massage sit.",
      image: "/Massage sit.png",
      images: [
        "/Massage sit.png",
        "/massage sit1.png",
      ],
    },
  ];

  // ----- CATEGORY LIST -----
  const categories = ["All", "Casual & Outdoor Wear", "Sports", "Electronics", "Furniture", "Household"];

  // ----- STATE -----
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [expandedDesc, setExpandedDesc] = useState({});

  const DESCRIPTION_LIMIT = 70;

  function toggleDescription(e, id) {
    e.stopPropagation(); // prevent card click
    setExpandedDesc((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

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

            {/* DESCRIPTION */}
            <div className="text-xs text-slate-600 mt-1 leading-relaxed">
              {item.description.length > DESCRIPTION_LIMIT && !expandedDesc[item.id]
                ? item.description.slice(0, DESCRIPTION_LIMIT) + "…"
                : item.description}
            </div>

            {/* SEE MORE / LESS */}
            {item.description.length > DESCRIPTION_LIMIT && (
              <button
                className="text-xs text-sky-600 mt-0.5 self-start hover:underline"
                onClick={(e) => toggleDescription(e, item.id)}
              >
                {expandedDesc[item.id] ? "See less" : "See more"}
              </button>
            )}

            <div className="text-sm mt-2 font-medium">
              $ {item.ticketPrice} <span className="text-xs">/ticket</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
