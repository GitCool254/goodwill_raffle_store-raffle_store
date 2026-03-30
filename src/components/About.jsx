import React from "react";

export default function About({ navigate }) {
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

      <p className="text-base text-slate-700 leading-relaxed mb-6">
        <strong>Collection & Delivery:</strong> Prize items may be collected in
        person or delivered complimentary within a 100-mile radius. Delivery
        arrangements are tailored to each winner and confirmed individually to
        ensure a smooth, secure, and timely experience.
      </p>

      <p className="text-sm text-slate-500 leading-relaxed mb-6">
        Delivery eligibility, scheduling, and logistics are subject to location
        verification and confirmation at the time of winner notification.
      </p>

      {/* SECTION: MISSION */}
      <h2
        className="font-semibold mt-8 mb-2 tracking-tight"
        style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
      >
        ❖  Our Mission
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
        ❖  Our Vision
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
        ❖  Our Core Values
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
        ❖  What Makes Us Different
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
        <li>
          <strong>Cash‑Out Option</strong> — Winners can choose the prize item or
          receive its fair market value in cash. Enjoy flexibility and peace of mind.
        </li>
      </ul>

      {/* SECTION: COMMITMENT */}
      <h2
        className="font-semibold mt-8 mb-2 tracking-tight"
        style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
      >
        ❖  Our Commitment
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

      {/* SECTION: COMMUNITY & IMPACT */}
      <h2
        className="font-semibold mt-8 mb-2 tracking-tight"
        style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
      >
        ❖  Community & Impact
      </h2>
      <div className="w-16 h-[2px] bg-sky-600/70 mb-4" />

      <p className="text-base text-slate-700 leading-relaxed mb-4">
        Through our raffle campaigns, we actively support local churches,
        community associations, and charitable organizations — but our impact
        goes further. A portion of every campaign is dedicated to direct aid
        programs:
      </p>

      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mb-4">
        <li>
          <strong>Academic Sponsorships</strong> — We fund school fees,
          supplies, and learning materials for students from under‑resourced
          backgrounds, giving them a chance to build a better future.
        </li>
        <li>
          <strong>Palliative Care for the Vulnerable</strong> — We support
          home‑based care, medical assistance, and daily necessities for the
          elderly and those with chronic illnesses, ensuring they receive the
          dignity and comfort they deserve.
        </li>
        <li>
          <strong>Donations & Emergency Relief</strong> — From food parcels and
          clothing to urgent financial assistance during crises, we stand ready
          to help families facing hardship.
        </li>
      </ul>

      <p className="text-base text-slate-700 leading-relaxed mb-4">
        Importantly, our <strong>participants are the heart of this mission</strong>.
        When you purchase a ticket, you are not just entering a raffle — you are
        becoming a partner in change. A portion of every entry directly fuels
        these sponsorship and care programs, meaning that you, our valued
        participant, are the one making academic dreams come true and bringing
        comfort to the vulnerable.
      </p>

      <p className="text-base text-slate-700 leading-relaxed mb-6">
        In recognition of your contribution, we occasionally offer special
        appreciation draws and community shout‑outs. More importantly, you have
        the satisfaction of knowing that your participation creates tangible,
        positive impact in the lives of others.
      </p>

      {/* SECTION: BUILT ON TRUST */}
      <h2
        className="font-semibold mt-8 mb-2 tracking-tight"
        style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
      >
        ❖  Built on Trust
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
