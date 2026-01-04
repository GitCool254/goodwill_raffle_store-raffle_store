export default function Address() {
  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* TITLE — smaller + left-aligned */}
      <h1 className="text-lg font-bold mb-3 text-left">
        Visit Our Stores
      </h1>

      {/* CONTENT — left aligned, with bold labels */}
      <div className="text-slate-700 text-left leading-relaxed text-base">

        <p className="mb-3">
          <strong>Goodwillstores</strong> — Your trusted home for classy second-hand products.
        </p>

        <p className="mb-3">
          <strong>We're located at:</strong><br />
          <br />

          {/* USA */}
          
          <strong>USA</strong><br />

          <div className="grid grid-cols-[16px_1fr]">
            <span>•</span>
            <span>South San Francisco, CA</span>

            <span></span>
            <span>66174</span>
          </div>
          <br />
          Jupiter, Florida<br />
          58298
          <br />
          Rio Rancho, New Mexico<br />
          91956
          <br />
          Mission, Texas<br />
          81050
          <br />
          Bismarck, North Dakota<br />
          67034
          <br />
          <br />
          
          {/* Canada */}
          
          <strong>Canada</strong><br />
          303 Perry St<br />
          Whitby, ON L1N 4C2
          <br />
          Near 524 Corbin Ct<br /> 
          Mississauga, ON L5A 1M3
          <br />
          519 Wilson St<br /> 
          Quesnel, BC V2J 2W2
          <br />
          194 Av. Brien<br /> 
          Laval, QC H7N 3M5
          <br />
          <br />

          {/* Australia */}

          <strong>Australia</strong><br />
          12 John St<br />
          Blackburn VIC 3130
          <br />
          54 Pitt St<br />
          Parramatta NSW 2150
          <br />
          12 Telford St<br />
          Proserpine QLD 4800
          <br />
          55 Gairloch St<br />
          Applecross WA 6153
          <br />
          24 Wattle Rd<br />
          Dodges Ferry TAS 7173
          <br />
          Near St Albans VIC 3021
          <br />
          Near 12 Damson Pl<br />
          Elanora QLD 4221
        </p>

        <p className="mb-3">
          <strong>We're Open:</strong><br />
        </p>
          
          <ul className="list-disc pl-0 text-slate-700 space-y-1">  
            <li>Monday – Friday: 8:00 AM – 6:30 PM</li>
            <li>Saturday: 9:00 AM – 4:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>

      </div>
    </div>
  );
}
