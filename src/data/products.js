// src/data/products.js
//
// Product data is now managed through the admin portal (/admin) and
// stored on the backend. On application boot, App.jsx fetches the
// latest data from /products and stores it in localStorage under the
// key "gw_products_dynamic". This module reads that cache synchronously
// and falls back to the hardcoded defaults below if the cache is empty.
//
// The rest of the app (Home, Catalog, Detail, …) keeps importing
// { sampleProducts, catalogItems } exactly as before — nothing else
// needs to change.

const STORAGE_KEY = "gw_products_dynamic";

function loadDynamic() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      Array.isArray(parsed.sampleProducts) &&
      Array.isArray(parsed.catalogItems)
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Called by App.jsx once the backend responds. */
export function setDynamicProducts(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

// -------- Fallback (hardcoded defaults) --------

const FALLBACK_SAMPLE = [
  {
    id: "p1",
    title: "DJI Mini 2 drone",
    description:
      "◆ Camera\n• Resolution - 48MP photos\n• Sensor - 1/1.3-inch CMOS with Dual Native ISO Fusion\n• Video Recording - FHD (1080p): Up to 200fps Slow Motion\n\n◆ Battery\n• Standard Intelligent Flight Battery - Capacity: 2590mAh\n• Charging speed - 58min(Standard)\n\n◆ Propellers & Propulsion\n• Type - Folding, low-noise, and quick-release propellers\n• Max Speed(Sport mode) -horizontal speed: 16m/s; Ascent/Descend speed: 5m/s\n• Wind resistance - Up to 11m/s\n\n◆ Flexibility, Flight Modes & Sensors\n• Foldability - Folded: 148 × 94 × 64 mm; Unfolded: 298 × 373 × 101 mm\n• Omnidirectional Obstacle Sensing - Equipped with binocular vision sensors and a 3D infrared sensor underneath. Detects obstacles in front, back, left, right, top, and bottom\n• Transmission (DJI O4): Provides 1080p/60fps video feed up to 20 km (FCC) or 10 km (CE)\n\n◆ Smart Tracking Features\n• ActiveTrack 360°: Trace path control directly from the controller touch screen; Waypoint Flight: Program autonomous flight paths and actions; Cruise Control & Advanced RTH: Automatic obstacle navigation during return home.\n• Cuisine carrying case. Sil works perfectly fine.\n• Comes with instruction manual.\n\nGood working condition.",
    price: 6,
    image: "/Mini drone1.png",
    images: ["/Mini drone1.png", "/Mini drone2.png", "/Mini drone.png"],
    ticketPrice: 6,
    totalTickets: 200,
    category: "Sports",
    marketPrice: 300,
  },
  {
    id: "p2",
    title: "Beachcroft Patio set",
    description:
      "• 2 Swivel rocking outdoors chairs, fire pit, and 5 pc sectional.\nBrand is Beachcroft.",
    price: 6,
    image: "/BeachCroft.png",
    images: ["/BeachCroft.png", "/BeachCroft1.png", "/BeachCroft3.png", "/BeachCroft2.png"],
    ticketPrice: 6,
    totalTickets: 200,
    category: "Households",
    marketPrice: 250,
  },
  {
    id: "p3",
    title: "Coolster 3125CX-2",
    description: `◆ Engine & Performance\n• Engine Type: 125cc Single-Cylinder, 4-stroke, Air-Cooled\n• Max Horsepower: ~7.4 HP (5.7 kW) @ 7,500 RPM\n• Max Torque: 8.0 N·m @ 5,500 RPM\n• Top Speed: Up to 25–35 mph\n\n◆ Drivetrain & Transmission\n• Starting System: Electric Push-Button Start\n• Transmission: Fully Automatic with Reverse (Forward-Neutral-Reverse)\n• Drive System: Chain Drive (Rear-Wheel Drive)\n\n◆ Chassis, Suspension & Brakes\nFront Brakes: Mechanical Drum / Hub\nRear Brakes: Hydraulic Disc\n• Front Suspension: Dual A-Arm with Shocks\n• Rear Suspension: Rear Swing Arm with Mono-Shock\n• Front Tires: 19 × 7.00 – 8\n​• Rear Tires: 18 × 9.50 – 8\n\n◆ Dimensions & Capacities\n• Overall Dimensions (L × W × H): 57" × 38" × 39" (1450 mm × 970 mm × 990 mm)\n​• Net Weight / Gross Weight: ~225 lbs / 260 lbs\n​• Max Weight Capacity: 165 lbs (75 kg)\n​• Fuel Capacity: ~0.63 Gallons (2.4 L)\n\n• Great working condition and performer for kids`,
    price: 10,
    image: "/coolsterM.png",
    images: ["/coolsterM.png", "/coolsterM1.png", "/coolster2.png", "/coolsterM2.png"],
    ticketPrice: 10,
    totalTickets: 150,
    category: "Eletronics",
    marketPrice: 650,
  },
];

// Paste the current catalogItems array here as the fallback.
// (For brevity in this patch, we re-export whatever the user already had.
//  Simply keep your existing catalogItems array and assign it to FALLBACK_CATALOG.)
const FALLBACK_CATALOG = [ /* ⬅️ paste your existing catalogItems array here */ ];

// -------- Resolved exports --------

const _dynamic = loadDynamic();

export const sampleProducts = _dynamic?.sampleProducts ?? FALLBACK_SAMPLE;
export const catalogItems    = _dynamic?.catalogItems    ?? FALLBACK_CATALOG;
