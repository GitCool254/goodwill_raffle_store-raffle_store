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
      title: "2004 Golf cart club car",
      ticketPrice: 4,
      description: "The cart come with charger. Currently the cart doesn't move on its own since the battery is dead.\nClub car also have aluminum frames, so it'll never rust out.",
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
      description: "HP Reverb G2 Virtual Reality Headset VR3000-0XX.\nBarely used. Works great!.",
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
      description: "2008 Yamaha vx110 waverunner jetski.\nFresh rebuilt motor runs 52 mph. \nGood performance stator and battery.",
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
      title: "Beachcroft Patio Set",
      ticketPrice: 10,
      description: "FIRM ON PRICE! 2 Swivel rocking outdoors chairs, fire pit, and 5 pc sectional.\nUnboxed just a month ago.\nRetails over. Bought for a project and went  different direction . \nBrand is Beachcroft.",
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
      description: "Kitchen Island.Excellent condition no damages.\nDimensions 1.5m long, 1m wide and 1m high.",
      image: "/Kitchen Island1.jpg",
      images: [
        "/Kitchen Island1.jpg",
        "/Kitchen Island2.jpg",
        "/Kitchen Island3.jpg",
      ],
    },
    {
      id: "p12",
      category: "Furniture",
      title: "Stunning Brand Broyhill Patio Set - Like New.",
      ticketPrice: 10,
      description: "Elevate your outdoor space with this exquisite Brand Broyhill patio set. Perfect for entertaining, this set comfortably seats 7 and includes a table plus two extra seats, expanding to accommodate up to 9 people. \n\nIt's used only once, it looks like new. \nFree of parties, kids and pets.",
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
      description: "Light Grey weave fabric with piping on edge.It can give a hint of beige with the wood trim.Bought at The Brick, special ordered as colour not shown in store.The legs and bottom is wood trim in a medium to dark stain. This sectional is very heavy and good quality. The extra seat can be attached to make one side longer or used as extra seat like here.\n95”x 95” width and XSeat is 24”width, and all seating 34” in depth (Back to front),\nheight is 34” floor to top of cushion. \nThere is no marks nicks or stains.No pets, no kids, non smoking very clean home! It never gets sat on only when company comes for seasonal holidays! I can show how to connect the extra seat.",
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
      description: "Beautiful Sofa set with power recliners and USB charging ports. \nSofas are bonded leather white color fabric. Sofas include easily removable backrests which makes it ideal for transporting and maneuvering around into tight spaces. Sofas are just 6 months old, adult used and considered to be in mint condition.\nSofa is 85 inches long and Loveseat is 63 inches long.",
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
      title: "Modern L - Shaped Sofa",
      ticketPrice: 10,
      description: `Comfy 3-seater with reversible storage ottoman\n\n78" D x 53" W x 32" H (seat depth 21", seat height 18.5")\n\nCold beige linen (light gray-ish), sturdy iron frame, soft cushions.\n\nModern, sleek, and super functional.\n\nNo pets, no smoking home.`,
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
      title: "Snoo Happiest Baby Bassinet",
      ticketPrice: 5,
      description: "Snoo Happiest Baby Bassinet \nNo smoking house :)\n1st owner. It's clean and looks great , I've included pictures for reference. Price includes ;\n -Smart Bassinet\n-Snoo Mattress\n-Snoo Mattress Sheet\n-3 sleep sacks, size small, medium and large.",
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
      title: "Massage seat",
      ticketPrice: 3,
      description: "Customized & comfortable massage seat. It is electric powered",
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
            <div className="w-full aspect-square flex items-center justify-center bg-white rounded mb-2 overflow-hidden p-2">
              <img
                src={item.image}
                alt={item.title}
                className="max-h-full max-w-full object-contain"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/200x150")
                }
              />
            </div>
            <div className="text-sm font-semibold">{item.title}</div>
            <div className="text-xs text-slate-500">{item.category}</div>
            
            <div className="text-sm mt-2 font-medium">
              $ {item.ticketPrice} <span className="text-xs">/ticket</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
