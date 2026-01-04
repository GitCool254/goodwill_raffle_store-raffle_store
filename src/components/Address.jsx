import { useState } from "react";

function AddressLine({ line1, line2 }) {
  return (
    <div className="grid grid-cols-[16px_1fr] gap-y-0">
      <span>•</span>
      <span>{line1}</span>

      <span></span>
      <span>{line2}</span>
    </div>
  );
}

function CountrySection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      {/* HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 font-bold text-left w-full"
      >
        <span
          className={`transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
        {title}
      </button>

      {/* COLLAPSIBLE CONTENT */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-[1000px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pl-6 space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Address() {
  return (
    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-lg font-bold mb-3 text-left">
        Visit Our Stores
      </h1>

      <div className="text-slate-700 text-left leading-relaxed text-base">

        <p className="mb-3">
          <strong>Goodwillstores</strong> — Your trusted home for classy second-hand products.
        </p>

        <p className="mb-3">
          <strong>We're located at:</strong>
        </p>

        {/* USA */}
        <CountrySection title="USA">
          <AddressLine line1="South San Francisco, CA" line2="66174" />
          <AddressLine line1="Jupiter, Florida" line2="58298" />
          <AddressLine line1="Rio Rancho, New Mexico" line2="91956" />
          <AddressLine line1="Mission, Texas" line2="81050" />
          <AddressLine line1="Bismarck, North Dakota" line2="67034" />
        </CountrySection>

        {/* CANADA */}
        <CountrySection title="Canada">
          <AddressLine line1="303 Perry St, Whitby, ON" line2="L1N 4C2" />
          <AddressLine line1="Near 524 Corbin Ct, Mississauga, ON" line2="L5A 1M3" />
          <AddressLine line1="519 Wilson St, Quesnel, BC" line2="V2J 2W2" />
          <AddressLine line1="194 Av. Brien, Laval, QC" line2="H7N 3M5" />
        </CountrySection>

        {/* AUSTRALIA */}
        <CountrySection title="Australia">
          <AddressLine line1="12 John St, Blackburn VIC" line2="3130" />
          <AddressLine line1="54 Pitt St, Parramatta NSW" line2="2150" />
          <AddressLine line1="12 Telford St, Proserpine QLD" line2="4800" />
          <AddressLine line1="55 Gairloch St, Applecross WA" line2="6153" />
          <AddressLine line1="24 Wattle Rd, Dodges Ferry TAS" line2="7173" />
          <AddressLine line1="Near St Albans VIC" line2="3021" />
          <AddressLine line1="Near 12 Damson Pl, Elanora QLD" line2="4221" />
        </CountrySection>

        <p className="mt-4 font-bold">
          We're Open:
        </p>

        <ul className="list-disc pl-4 space-y-1">
          <li>Monday – Friday: 8:00 AM – 6:30 PM</li>
          <li>Saturday: 9:00 AM – 4:00 PM</li>
          <li>Sunday: Closed</li>
        </ul>

      </div>
    </div>
  );
}
