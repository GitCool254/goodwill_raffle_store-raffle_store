import React from "react";

export default function TermsOfUse({ onBack }) {
  return (
    <div
      className="max-w-4xl mx-auto p-8 text-left"
      style={{
        backgroundColor: "#f8fafc",
        fontFamily:
          '"Inter", "Segoe UI", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
        lineHeight: 1.6,
        color: "#1e293b",
      }}
    >
      {/* Header with back button (calls onBack) */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-sky-600 hover:text-sky-800 text-sm font-medium inline-flex items-center gap-1 bg-transparent border-none cursor-pointer"
        >
          ← Back to About
        </button>
      </div>

      <h1
        className="font-bold mb-6 tracking-tight"
        style={{ fontSize: "32px", letterSpacing: "-0.5px" }}
      >
        Terms of Use
      </h1>
      <p className="text-sm text-slate-500 mb-8">Last Updated: March 18, 2026</p>

      {/* 1. Acceptance */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          1. Acceptance of Terms
        </h2>
        <p className="text-base text-slate-700 leading-relaxed mb-2">
          Welcome to Goodwillstores. By accessing or using our website, mobile
          application, or any services offered by Goodwillstores (collectively,
          the "Services"), you agree to be bound by these Terms of Use (the
          "Terms"). If you do not agree to these Terms, you may not use the
          Services.
        </p>
        <p className="text-base text-slate-700 leading-relaxed">
          Goodwillstores operates in the <strong>United States, Canada, and
          Australia</strong>. By using the Services, you represent that you are
          at least the age of majority in your jurisdiction (18 or 19 depending
          on province/state) and that you have the legal capacity to enter into
          these Terms.
        </p>
      </section>

      {/* 2. Eligibility */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          2. Eligibility and Participation
        </h2>
        <ul className="list-disc pl-5 text-base text-slate-700 leading-relaxed space-y-2">
          <li>
            <strong>Age Requirement:</strong> Participants must be of legal age
            in their country/state/province. In the USA and Australia, you must
            be 18 or older. In Canada, you must be 19 or older (18 in Alberta,
            Manitoba, and Quebec). Goodwillstores may request age verification.
          </li>
          <li>
            <strong>Geographic Restrictions:</strong> Our Services are intended
            for users in the USA, Canada, and Australia. If you access from
            outside these regions, you do so at your own risk and are
            responsible for compliance with local laws.
          </li>
          <li>
            <strong>One Account Per User:</strong> Each user may maintain only
            one account. Duplicate accounts may be suspended or terminated.
          </li>
        </ul>
      </section>

      {/* 3. Raffles and Ticket Purchases */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          3. Raffles and Ticket Purchases
        </h2>
        <p className="text-base text-slate-700 leading-relaxed mb-2">
          Goodwillstores conducts promotional raffles where participants may
          purchase tickets for a chance to win prizes. By purchasing a ticket,
          you acknowledge and agree that:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-700 leading-relaxed space-y-2">
          <li>
            <strong>No Purchase Necessary:</strong> Where required by law,
            alternative methods of entry (e.g., mail‑in entries) may be
            available. Contact us for details.
          </li>
          <li>
            <strong>Ticket Limits:</strong> The maximum number of tickets a
            participant may purchase is clearly stated in each raffle.
            Automated, robotic, or bulk entries are prohibited.
          </li>
          <li>
            <strong>Payment:</strong> All payments are processed securely
            through third‑party providers. You agree to pay all fees and taxes
            associated with your ticket purchases.
          </li>
          <li>
            <strong>Refunds:</strong> Ticket purchases are final and
            non‑refundable except as required by law or in the event of raffle
            cancellation by Goodwillstores.
          </li>
        </ul>
      </section>

      {/* 4. Prize Draw and Winner Selection */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          4. Prize Draw and Winner Selection
        </h2>
        <ul className="list-disc pl-5 text-base text-slate-700 leading-relaxed space-y-2">
          <li>
            <strong>Random Draw:</strong> Winners are selected by a random
            process (e.g., random number generator) supervised by
            Goodwillstores or its designee.
          </li>
          <li>
            <strong>Notification:</strong> Winners will be notified via email
            or phone within a reasonable time after the draw. If a winner does
            not respond within 7 days, an alternate winner may be selected.
          </li>
          <li>
            <strong>Odds:</strong> The odds of winning depend on the number of
            eligible entries received.
          </li>
          <li>
            <strong>Taxes:</strong> Winners are solely responsible for any
            applicable federal, state/provincial, or local taxes.
          </li>
        </ul>
      </section>

      {/* 5. Prize Fulfillment and Delivery */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          5. Prize Fulfillment and Delivery
        </h2>
        <p className="text-base text-slate-700 leading-relaxed mb-2">
          Prizes are tangible items (e.g., electronics, furniture, etc.). Delivery options include:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-700 leading-relaxed space-y-2">
          <li>
            <strong>In‑Person Collection:</strong> Winners may arrange to pick
            up the prize at a designated location.
          </li>
          <li>
            <strong>Complimentary Delivery:</strong> Within a 100‑mile radius
            of the prize’s location, delivery is free of charge.
          </li>
          <li>
            <strong>Beyond 100 Miles:</strong> For winners outside the
            100‑mile radius, delivery arrangements and costs will be discussed
            individually. Goodwillstores may assist with shipping at the
            winner’s expense.
          </li>
        </ul>
        <p className="text-base text-slate-700 leading-relaxed mt-2">
          Delivery timelines depend on location and logistics. Goodwillstores is
          not liable for delays caused by third‑party carriers or events beyond
          its control.
        </p>
      </section>

      {/* 6. Donations and Community Impact */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          6. Donations and Community Impact
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          A portion of proceeds from ticket sales may be allocated to
          charitable programs, including academic sponsorships, palliative care,
          and emergency relief. These donations are made at the discretion of
          Goodwillstores and are not tax‑deductible for participants unless
          otherwise stated. Participants do not acquire any ownership or voting
          rights in these programs.
        </p>
      </section>

      {/* 7. Intellectual Property */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          7. Intellectual Property
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          All content on the Services, including logos, text, graphics, and
          software, is the property of Goodwillstores or its licensors and is
          protected by copyright, trademark, and other laws. You may not
          reproduce, distribute, or create derivative works without express
          written permission.
        </p>
      </section>

      {/* 8. Limitation of Liability */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          8. Limitation of Liability
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          To the fullest extent permitted by law, Goodwillstores, its
          affiliates, directors, employees, and agents shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages
          arising out of or related to your use of the Services or participation
          in any raffle. In no event shall Goodwillstores’ total liability
          exceed the amount you paid to Goodwillstores in the six months
          preceding the claim.
        </p>
      </section>

      {/* 9. Indemnification */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          9. Indemnification
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          You agree to indemnify and hold harmless Goodwillstores and its
          officers, directors, employees, and agents from any claims, losses,
          liabilities, damages, costs, and expenses (including reasonable
          attorneys’ fees) arising out of your violation of these Terms or your
          use of the Services.
        </p>
      </section>

      {/* 10. Governing Law and Dispute Resolution */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          10. Governing Law and Dispute Resolution
        </h2>
        <p className="text-base text-slate-700 leading-relaxed mb-2">
          These Terms are governed by the laws of the State of Delaware, USA,
          without regard to its conflict of laws principles. For users in
          Canada, the laws of the Province of Ontario apply; for users in
          Australia, the laws of New South Wales apply.
        </p>
        <p className="text-base text-slate-700 leading-relaxed">
          Any dispute arising out of or related to these Terms or the Services
          shall be resolved exclusively through binding arbitration in
          accordance with the rules of the American Arbitration Association
          (for US users), the ADR Institute of Canada (for Canadian users), or
          the Australian Centre for International Commercial Arbitration (for
          Australian users). The arbitration shall take place in the
          jurisdiction most convenient to the user, and judgment on the award
          may be entered in any court having jurisdiction.
        </p>
      </section>

      {/* 11. Modifications to Terms */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          11. Modifications to Terms
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          Goodwillstores may revise these Terms from time to time. The most
          current version will be posted on our website with the “Last Updated”
          date. By continuing to use the Services after changes become
          effective, you agree to be bound by the revised Terms.
        </p>
      </section>

      {/* 12. Contact Information */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          12. Contact Us
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="text-base text-slate-700 leading-relaxed mt-2">
          <strong>Email:</strong> support@goodwillstores.com<br />
          <strong>Mailing Address:</strong> Goodwillstores Legal Dept., 123
          Raffle Way, Suite 100, Dover, DE 19901, USA
        </p>
      </section>

      <div className="border-t border-slate-200 pt-6 mt-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Goodwillstores. All rights reserved.
      </div>
    </div>
  );
}
