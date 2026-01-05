function AddressLine({ line1, line2 }) {
  const query = encodeURIComponent(`${line1} ${line2}`);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="grid grid-cols-[16px_1fr] gap-y-0">
      <span>•</span>

      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-sky-600 hover:underline transition-colors"
      >
        {line1}
      </a>

      <span></span>
      <span className="text-sm text-slate-500">{line2}</span>
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
          line1="313 Pine Ave, South San Francisco, CA"
          line2="94080"
        />

        <AddressLine
          line1="506 W Whitney Dr, Jupiter, FL"
          line2="33458"
        />

        <AddressLine
          line1="Near 882 Buckboard Rd SE, Rio Rancho, NM"
          line2="87124"
        />

        <AddressLine
          line1="1211 N Keralum Ave, Mission, TX"
          line2="78572"
        />

        <AddressLine
          line1="512 Sunset Pl, Bismarck, ND"
          line2="58504"
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
