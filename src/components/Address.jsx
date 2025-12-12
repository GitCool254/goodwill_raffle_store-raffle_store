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
          Street Address<br />
          City, Region
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
