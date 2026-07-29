import React, { useState, useEffect } from "react";

function AddressLine({ line1, line2, enabled = true }) {
  if (!enabled) {
    return (
      <div className="grid grid-cols-[16px_1fr] gap-y-0">
        <span>•</span>
        <span className="text-slate-700">{line1}</span>
        <span></span>
        <span className="text-sm text-slate-500">{line2}</span>
      </div>
    );
  }

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
  // Initialize state from localStorage if available, else default all false
  const getInitialToggles = () => {
    const stored = localStorage.getItem("addressToggles");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // ignore
      }
    }
    // Default: all false (conservative) until we fetch from backend
    return {
      usa: false,
      canada: false,
      australia: false,
      newZealand: false,
    };
  };

  const [toggles, setToggles] = useState(getInitialToggles);

  useEffect(() => {
    const fetchToggles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/address_toggles`);
        if (response.ok) {
          const data = await response.json();
          const newToggles = {
            usa: data.usa ?? false,
            canada: data.canada ?? false,
            australia: data.australia ?? false,
            newZealand: data.newZealand ?? false,
          };
          setToggles(newToggles);
          localStorage.setItem("addressToggles", JSON.stringify(newToggles));
        } else {
          // If response not ok, keep what we have (from localStorage or default)
          console.warn("Failed to fetch toggles, using stored values.");
        }
      } catch (error) {
        console.error("Failed to fetch address toggles:", error);
        // keep existing toggles (from localStorage or default)
      }
    };
    fetchToggles();
  }, []);

  // Define all country data in one place
  const countriesData = [
    {
      key: "usa",
      label: "USA",
      enabled: toggles.usa,
      addresses: [
        ["313 Pine Ave, South San Francisco, CA", "94080"],
        ["506 W Whitney Dr, Jupiter, FL", "33458"],
        ["Near 882 Buckboard Rd SE, Rio Rancho, NM", "87124"],
        ["1211 N Keralum Ave, Mission, TX", "78572"],
        ["512 Sunset Pl, Bismarck, ND", "58504"],
      ],
    },
    {
      key: "canada",
      label: "Canada",
      enabled: toggles.canada,
      addresses: [
        ["303 Perry St, Whitby, ON", "L1N 4C2"],
        ["Near 524 Corbin Ct, Mississauga, ON", "L5A 1M3"],
        ["519 Wilson St, Quesnel, BC", "V2J 2W2"],
        ["194 Av. Brien, Laval, QC", "H7N 3M5"],
      ],
    },
    {
      key: "australia",
      label: "Australia",
      enabled: toggles.australia,
      addresses: [
        ["12 John St, Blackburn VIC", "3130"],
        ["54 Pitt St, Parramatta NSW", "2150"],
        ["12 Telford St, Proserpine QLD", "4800"],
        ["55 Gairloch St, Applecross WA", "6153"],
        ["24 Wattle Rd, Dodges Ferry TAS", "7173"],
        ["Near St Albans VIC", "3021"],
        ["Near 12 Damson Pl, Elanora QLD", "4221"],
      ],
    },
    {
      key: "newZealand",
      label: "New Zealand",
      enabled: toggles.newZealand,
      addresses: [
        ["20A Trewavas Street, Motueka", "7120"],
        ["Near 19A Saxon Street, Motueka", "7120"],
        ["1B Fry Street, Motueka", "7120"],
        ["126 Whakarewa Street, Motueka", "7120"],
        ["Near 11 West Avenue, Richmond", "7020"],
        ["36 William Street, Richmond", "7020"],
        ["7A Green Street, Tāhunanui, Nelson", "7011"],
      ],
    },
  ];

  // Sort: enabled first, then alphabetically by label (optional)
  const sortedCountries = [...countriesData].sort((a, b) => {
    if (a.enabled && !b.enabled) return -1;
    if (!a.enabled && b.enabled) return 1;
    return a.label.localeCompare(b.label);
  });

  return (
    <div
      className="max-w-2xl mx-auto p-6"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <h1
        className="text-lg font-bold mb-3 text-left"
        style={{ fontSize: "1.25rem" }}
      >
        Visit Our Stores
      </h1>

      <div className="text-slate-700 text-left leading-relaxed text-base">
        <p className="mb-3">
          <strong>Goodwillstores</strong> — Your trusted home for classy second-hand products.
        </p>

        <p className="mb-3">
          <strong>We're located at:</strong>
        </p>

        {sortedCountries.map((country) => (
          <React.Fragment key={country.key}>
            <strong>{country.label}</strong>
            {country.addresses.map(([line1, line2], idx) => (
              <AddressLine
                key={idx}
                line1={line1}
                line2={line2}
                enabled={country.enabled}
              />
            ))}
            <br />
          </React.Fragment>
        ))}

        {/* HOURS */}
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
