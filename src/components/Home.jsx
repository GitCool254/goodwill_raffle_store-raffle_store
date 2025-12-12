import React from "react";

export default function Home({ setView, setSelectedProduct }) {
  const products = [
    {
      id: "p1",
      name: "iPhone 15 Pro",
      description: "Brand new iPhone 15 Pro — unopened box.",
      price: 5,
      image: "https://via.placeholder.com/250?text=iPhone+15+Pro",
    },
    {
      id: "p2",
      name: "PlayStation 5",
      description: "PS5 console with DualSense controller.",
      price: 5,
      image: "https://via.placeholder.com/250?text=PlayStation+5",
    },
    {
      id: "p3",
      name: "MacBook Air M3",
      description: "Lightweight MacBook Air with M3 chip.",
      price: 5,
      image: "https://via.placeholder.com/250?text=MacBook+Air+M3",
    },
  ];

  const handleEnterClick = (product) => {
    // ✅ Go to detail page and pass selected product
    setSelectedProduct(product);
    setView("detail");
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-6">Available Raffles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-2xl shadow p-4 hover:shadow-lg transition"
          >
            <img
              src={p.image}
              alt={p.name}
              className="mx-auto mb-4 rounded-xl w-64 h-64 object-cover"
            />
            <h3 className="text-xl font-semibold mb-1">{p.name}</h3>
            <p className="text-gray-600 mb-2">{p.description}</p>
            <p className="text-gray-800 font-semibold mb-4">
              Ksh {p.price} / ticket
            </p>
            <button
              onClick={() => handleEnterClick(p)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              Enter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
