export default function About() {
  return (
    <div
      className="max-w-3xl mx-auto px-6 py-12 text-left"
      style={{
        backgroundColor: "#f8fafc",
        fontFamily:
          '"Inter", "SF Pro Display", "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* PAGE TITLE */}
      <h1
        className="font-bold mb-3 tracking-tight text-slate-900"
        style={{
          fontSize: "34px",
          lineHeight: "1.2",
          letterSpacing: "-0.6px",
        }}
      >
        ℹ️ About Goodwillstores
      </h1>

      <p className="text-slate-600 mb-8 text-[15px]">
        Established • Trusted • Community-Driven
      </p>

      {/* INTRO */}
      <p className="text-lg text-slate-900 leading-relaxed mb-4 font-semibold">
        Where Value, Trust, and Opportunity Meet
      </p>

      <p className="text-[15.5px] text-slate-700 leading-[1.75] mb-4">
        For over <strong>5 years</strong>, Goodwillstores has proudly served
        thousands of participants through transparent and affordable raffle
        campaigns featuring carefully selected second-hand and surplus products.
      </p>

      <p className="text-[15.5px] text-slate-700 leading-[1.75] mb-10">
        We believe quality products deserve a second life — and customers
        deserve a fair, secure, and clearly structured opportunity to win them.
      </p>

      {/* TRUST METRICS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 text-center">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <p className="text-xl font-bold text-slate-900">5+ Years</p>
          <p className="text-xs text-slate-600 mt-1">Operating Experience</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <p className="text-xl font-bold text-slate-900">Thousands</p>
          <p className="text-xs text-slate-600 mt-1">Satisfied Participants</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <p className="text-xl font-bold text-slate-900">Secure</p>
          <p className="text-xs text-slate-600 mt-1">Transparent Platform</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <p className="text-xl font-bold text-slate-900">Fair</p>
          <p className="text-xs text-slate-600 mt-1">Equal Opportunity Draws</p>
        </div>
      </div>

      {/* MISSION */}
      <h2
        className="font-semibold mt-10 mb-3 tracking-tight text-slate-900"
        style={{
          fontSize: "22px",
          lineHeight: "1.3",
          letterSpacing: "-0.4px",
        }}
      >
        🎯 Our Mission
      </h2>
      <div className="w-16 h-[2px] bg-sky-600/80 mb-5" />

      <p className="text-[15.5px] text-slate-700 leading-[1.75] mb-10">
        To make quality products accessible through fair and transparent raffle
        experiences — empowering customers with real opportunities while
        maintaining integrity, clarity, and customer-first service.
      </p>

      {/* VISION */}
      <h2
        className="font-semibold mt-10 mb-3 tracking-tight text-slate-900"
        style={{
          fontSize: "22px",
          lineHeight: "1.3",
          letterSpacing: "-0.4px",
        }}
      >
        🔭 Our Vision
      </h2>
      <div className="w-16 h-[2px] bg-sky-600/80 mb-5" />

      <p className="text-[15.5px] text-slate-700 leading-[1.75] mb-10">
        To build a trusted marketplace where sustainability, opportunity, and
        community come together — ensuring every raffle is structured fairly
        and every product finds meaningful value.
      </p>

      {/* WHAT MAKES US DIFFERENT */}
      <h2
        className="font-semibold mt-10 mb-3 tracking-tight text-slate-900"
        style={{
          fontSize: "22px",
          lineHeight: "1.3",
          letterSpacing: "-0.4px",
        }}
      >
        🎟️ What Makes Us Different
      </h2>
      <div className="w-16 h-[2px] bg-sky-600/80 mb-5" />

      <ul className="list-disc pl-6 text-[15px] text-slate-700 space-y-3 mb-10 leading-[1.7]">
        <li>
          <strong>Clearly Defined Ticket Limits</strong> — Every raffle has
          transparent participation rules.
        </li>
        <li>
          <strong>Visible & Structured Draw Process</strong> — Designed for
          fairness and clarity.
        </li>
        <li>
          <strong>Affordable Entry Points</strong> — Giving everyone a fair
          chance to participate.
        </li>
        <li>
          <strong>Real Products, Real Winners</strong> — Authentic outcomes and
          satisfied participants.
        </li>
      </ul>

      {/* COMMITMENT */}
      <h2
        className="font-semibold mt-10 mb-3 tracking-tight text-slate-900"
        style={{
          fontSize: "22px",
          lineHeight: "1.3",
          letterSpacing: "-0.4px",
        }}
      >
        🌍 Our Commitment
      </h2>
      <div className="w-16 h-[2px] bg-sky-600/80 mb-5" />

      <p className="text-[15.5px] text-slate-700 leading-[1.75] mb-4">
        Beyond raffles, we are committed to sustainability and responsible
        product circulation. By extending the life of quality goods, we reduce
        waste while creating accessible opportunities.
      </p>

      <p className="text-[15.5px] text-slate-700 leading-[1.75] mb-12">
        Every ticket supports a value-driven marketplace built on fairness,
        structure, and customer trust.
      </p>

      {/* CLOSING TRUST STATEMENT */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <p
          className="text-slate-900 font-semibold tracking-tight text-center"
          style={{
            fontSize: "19px",
            lineHeight: "1.6",
            letterSpacing: "-0.3px",
          }}
        >
          Goodwillstores isn’t just about winning —
          <br />
          it’s about transparency, integrity, and giving everyone a fair chance.
        </p>
      </div>
    </div>
  );
}
