import React, { useState } from "react";

export default function SearchBar({ placeholder = "Search products", onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div style={{ marginTop: "20px", marginBottom: "20px", width: "100%" }}>
      <form
        className="search-form"
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "24px",
          padding: "4px 8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          style={{ marginRight: "8px", fill: "#888" }}
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            padding: "8px 0",
            fontSize: "16px",
            backgroundColor: "transparent",
          }}
        />
        <button
          type="button"
          style={{
            background: "#f68b1e",
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "6px 16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>
    </div>
  );
}
