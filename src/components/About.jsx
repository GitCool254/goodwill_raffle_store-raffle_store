export default function About() {
  return (
    <div
      className="max-w-3xl mx-auto p-6 text-left"
      style={{
        backgroundColor: "#f8fafc",
        fontFamily:
          '"Inter", "Segoe UI", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* PAGE TITLE */}
      <h1
        className="font-bold mb-5 tracking-tight"
        style={{ fontSize: "24px", letterSpacing: "-0.3px" }}
      >
        ℹ️ About Us
      </h1>

      {/* INTRO */}
      <p className="text-base text-slate-700 leading-relaxed mb-4">
        <strong>
          Goodwillstores — Where Value, Trust, and Opportunity Meet
        </strong>
      </p>

      <p className="text-base text-slate-700 leading-relaxed mb-4">
        At Goodwillstores, we believe great products deserve a second chance —
        and our customers deserve exciting opportunities to win them.
      </p>

      <p className="text-base text-slate-700 leading-relaxed mb-6">
        For over <strong>5 years</strong>, we have proudly served thousands of
        customers by offering carefully selected second-hand and surplus items
        through affordable, transparent raffle campaigns. Every raffle is
        designed to be fair, secure, and easy to understand.
      </p>

      {/* SECTION: MISSION */}
      <h2
        className="font-semibold mt-8 mb-2 tracking-tight"
        style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
      >
        🎯 Our Mission
      </h2>
      <div className="w-16 h-[2px] bg-sky-600/70 mb-4" />

      <p className="text-base text-slate-700 leading-relaxed mb-6">
        Our mission is to make quality products accessible through fair,
        transparent raffle experiences — empowering our customers with real
        opportunities to win while maintaining trust, integrity, and value in
        everything we do.
      </p>

      {/* SECTION: VISION */}
      <h2
        className="font-semibold mt-8 mb-2 tracking-tight"
        style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
      >
        🔭 Our Vision
      </h2>
      <div className="w-16 h-[2px] bg-sky-600/70 mb-4" />

      <p className="text-base text-slate-700 leading-relaxed mb-6">
        We envision a trusted global marketplace where sustainability,
        opportunity, and excitement come together — creating a community where
        everyone has a fair chance and every product finds a meaningful second
        life.
      </p>

      {/* SECTION: CORE VALUES */}
      <h2
        className="font-semibold mt-8 mb-2 tracking-tight"
        style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
      >
        💎 Our Core Values
      </h2>
      <div className="w-16 h-[2px] bg-sky-600/70 mb-4" />

      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mb-6">
        <li>
          <strong>Transparency</strong> — Clear rules, visible outcomes, and
          honest operations.
        </li>
        <li>
          <strong>Fairness</strong> — Equal opportunity for every participant.
        </li>
        <li>
          <strong>Trust</strong> — A secure platform backed by real customer
          support.
        </li>
        <li>
          <strong>Sustainability</strong> — Reducing waste by extending product
          life.
        </li>
        <li>
          <strong>Community</strong> — Growing together and giving back.
        </li>
      </ul>

      {/* SECTION: WHAT MAKES US DIFFERENT */}
      <h2
        className="font-semibold mt-8 mb-2 tracking-tight"
        style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
      >
        🎟️ What Makes Us Different
      </h2>
      <div className="w-16 h-[2px] bg-sky-600/70 mb-4" />

      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mb-6">
        <li>
          <strong>Transparent & Fair Draws</strong> — Clear ticket limits and
          visible outcomes for every raffle.
        </li>
        <li>
          <strong>Real Products, Real Winners</strong> — Thousands of satisfied
          winners across multiple categories.
        </li>
        <li>
          <strong>Affordable Participation</strong> — Low ticket prices give
          everyone a fair chance to win.
        </li>
      </ul>

      {/* SECTION: COMMITMENT */}
      <h2
        className="font-semibold mt-8 mb-2 tracking-tight"
        style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
      >
        🌍 Our Commitment
      </h2>
      <div className="w-16 h-[2px] bg-sky-600/70 mb-4" />

      <p className="text-base text-slate-700 leading-relaxed mb-4">
        We go beyond raffles. Goodwillstores is committed to sustainability and
        community empowerment. By extending the life of quality products, we
        reduce waste, promote responsible consumption, and support initiatives
        that positively impact our communities.
      </p>

      <p className="text-base text-slate-700 leading-relaxed mb-6">
        Every ticket purchased helps keep valuable products in circulation while
        supporting a value-driven, responsible marketplace.
      </p>

      {/* SECTION: TRUST */}
      <h2
        className="font-semibold mt-8 mb-2 tracking-tight"
        style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
      >
        🤝 Built on Trust
      </h2>
      <div className="w-16 h-[2px] bg-sky-600/70 mb-4" />

      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mb-6">
        <li>Operating for over 5 years</li>
        <li>Secure and transparent platform</li>
        <li>Customer-first support</li>
        <li>Growing community of repeat participants</li>
      </ul>

      {/* CLOSING */}
      <p
        className="text-slate-700 leading-relaxed mt-8 font-medium tracking-tight"
        style={{ fontSize: "18px", letterSpacing: "-0.2px" }}
      >
        Goodwillstores isn’t just about winning — it’s about trust,
        transparency, and giving everyone a fair chance.
      </p>
    </div>
  );
}
