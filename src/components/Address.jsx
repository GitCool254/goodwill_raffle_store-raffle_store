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

export default function Address() {
  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* TITLE */}
      <h1 className="text-lg font-bold mb-3 text-left">
        Visit Our Stores
      </h1>

      {/* CONTENT */}
      <div className="text-slate-700 text-left leading-relaxed text-base">

        <p className="mb-3">
          <strong>Goodwillstores</strong> — Your trusted home for classy second-hand products.
        </p>

        <p className="mb-3">
          <strong>We're located at:</strong>
        </p>

        {/* ================= USA ================= */}
        <strong>USA</strong>

        <AddressLine
          line1="South San Francisco, CA"
          line2="66174"
        />

        <AddressLine
          line1="Jupiter, Florida"
          line2="58298"
        />

        <AddressLine
          line1="Rio Rancho, New Mexico"
          line2="91956"
        />

        <AddressLine
          line1="Mission, Texas"
          line2="81050"
        />

        <AddressLine
          line1="Bismarck, North Dakota"
          line2="67034"
        />

        <br />

        {/* ================= CANADA ================= */}
        <strong>Canada</strong>

        <AddressLine
          line1="303 Perry St, Whitby, ON"
          line2="L1N 4C2"
        />

        <AddressLine
          line1="Near 524 Corbin Ct, Mississauga, ON"
          line2="L5A 1M3"
        />

        <AddressLine
          line1="519 Wilson St, Quesnel, BC"
          line2="V2J 2W2"
        />

        <AddressLine
          line1="194 Av. Brien, Laval, QC"
          line2="H7N 3M5"
        />

        <br />

        {/* ================= AUSTRALIA ================= */}
        <strong>Australia</strong>

        <AddressLine
          line1="12 John St, Blackburn VIC"
          line2="3130"
        />

        <AddressLine
          line1="54 Pitt St, Parramatta NSW"
          line2="2150"
        />

        <AddressLine
          line1="12 Telford St, Proserpine QLD"
          line2="4800"
        />

        <AddressLine
          line1="55 Gairloch St, Applecross WA"
          line2="6153"
        />

        <AddressLine
          line1="24 Wattle Rd, Dodges Ferry TAS"
          line2="7173"
        />

        <AddressLine
          line1="Near St Albans VIC"
          line2="3021"
        />

        <AddressLine
          line1="Near 12 Damson Pl, Elanora QLD"
          line2="4221"
        />

        <br />

        {/* ================= HOURS ================= */}
        <p className="mb-2">
          <strong>We're Open:</strong>
        </p>

        <ul className="list-disc pl-4 text-slate-700 space-y-1">
          <li>Monday – Friday: 8:00 AM – 6:30 PM</li>
          <li>Saturday: 9:00 AM – 4:00 PM</li>
          <li>Sunday: Closed</li>
        </ul>

      </div>
    </div>
  );
}
