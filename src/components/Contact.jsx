export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-left text-slate-700">

      {/* PAGE TITLE */}
      <h1
        className="font-bold mb-2"
        style={{ fontSize: "24px" }}
      >
        Contact & Support
      </h1>

      <p className="mb-6 text-slate-600">
        We’re here to help. Rea /ch out to our support team using any of the options
        below. We typically respond within one business day.
      </p>

      {/* PHONE */}
      <div className="mb-5">
        <h2
          className="font-semibold mb-1"
          style={{ fontSize: "20px" }}
        >
          📞 Phone Support
        </h2>
        <p>
          <strong>USA</strong><br />
          +1 417-539-9237<br /><br />
          <strong>Australia</strong><br />
          +61427612892<br /><br />
          <strong>Canada</strong><br />
          +1 416-872-6723<br /><br />
          <span className="text-sm text-slate-600">
            Monday – Friday, 8:00 AM – 6:00 PM
          </span>
        </p>
      </div>

      {/* EMAIL */}
      <div className="mb-5">
        <h2
          className="font-semibold mb-1"
          style={{ fontSize: "20px" }}
        >
          ✉️ Email Support
        </h2>
        <p>
          support@goodwillstores.com<br />
          <span className="text-sm text-slate-600">
            Available 24/7 (responses during business hours)
          </span>
        </p>
      </div>

      {/* HOURS */}
      <div className="mb-6">
        <h2
          className="font-semibold mb-1"
          style={{ fontSize: "20px" }}
        >
          📍 Business Hours
        </h2>
        <p className="text-sm">
          Monday – Friday: 8:00 AM – 6:00 PM<br />
          Saturday: 9:00 AM – 4:00 PM<br />
          Sunday: Closed
        </p>
      </div>

      {/* SUPPORT LIST */}
      <div className="border-t pt-4">
        <h3
          className="font-semibold mb-2"
          style={{ fontSize: "18px" }}
        >
          Need help with:
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Raffle entries & ticket issues</li>
          <li>Payments & confirmations</li>
          <li>Product questions</li>
          <li>Store locations & availability</li>
        </ul>
      </div>

    </div>
  );
}
