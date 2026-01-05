export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-left">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold mb-5">
        ℹ️ About Goodwillstores
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

      <p className="text-base text-slate-700 leading-relaxed mb-4">
        For over <strong>5 years</strong>, we have proudly served thousands of
        customers by offering carefully selected second-hand and surplus items
        through affordable, transparent raffle campaigns. Every raffle is
        designed to be fair, secure, and easy to understand.
      </p>

      {/* SECTION: WHAT MAKES US DIFFERENT */}
      <h2 className="text-xl font-semibold mt-8 mb-3">
        🎟️ What Makes Us Different
      </h2>

      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mb-6">
        <li>
          <strong>Transparent & Fair Draws</strong> — Clear ticket limits and
          visible outcomes for every raffle.
        </li>
        <li>
          <strong>Real Products, Real Winners</strong> — Thousands of satisfied
          winners across multiple product categories.
        </li>
        <li>
          <strong>Affordable Participation</strong> — Low ticket prices give
          everyone a fair chance to win.
        </li>
      </ul>

      {/* SECTION: COMMITMENT */}
      <h2 className="text-xl font-semibold mt-8 mb-3">
        🌍 Our Commitment
      </h2>

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
      <h2 className="text-xl font-semibold mt-8 mb-3">
        🤝 Built on Trust
      </h2>

      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mb-4">
        <li>Operating for over 5 years</li>
        <li>Secure and transparent platform</li>
        <li>Customer-first support</li>
        <li>Growing community of repeat participants</li>
      </ul>

      {/* TRUST BADGE ROW */}
      <div className="flex flex-wrap gap-3 mt-4">
        <span className="px-4 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
          🔒 Secure
        </span>
        <span className="px-4 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
          👁️ Transparent
        </span>
        <span className="px-4 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-700">
          ✅ Verified Platform
        </span>
      </div>

      {/* CLOSING */}
      <p className="text-lg text-slate-700 leading-relaxed mt-8 font-medium">
        Goodwillstores isn’t just about winning — it’s about trust,
        transparency, and giving everyone a fair chance.
      </p>
    </div>
  );
}
