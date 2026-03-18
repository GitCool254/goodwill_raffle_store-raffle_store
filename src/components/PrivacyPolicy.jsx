import React from "react";

export default function PrivacyPolicy({ onBack }) {
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
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-sky-600 hover:text-sky-800 text-sm font-medium inline-flex items-center gap-1 bg-transparent border-none cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <h1
        className="font-bold mb-6 tracking-tight"
        style={{ fontSize: "32px", letterSpacing: "-0.5px" }}
      >
        Privacy Policy
      </h1>
      <p className="text-sm text-slate-500 mb-8">Last Updated: March 19, 2026</p>

      {/* 1. Introduction */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          1. Introduction
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          Goodwillstores ("we," "our," or "us") respects your privacy and is committed
          to protecting it through this Privacy Policy. This policy describes the types
          of information we may collect from you or that you may provide when you visit
          our website or use our raffle and donation services, and our practices for
          collecting, using, maintaining, protecting, and disclosing that information.
        </p>
        <p className="text-base text-slate-700 leading-relaxed mt-2">
          This policy applies to users in the <strong>United States, Canada, and Australia</strong>.
          By accessing or using our services, you agree to this Privacy Policy.
        </p>
      </section>

      {/* 2. Information We Collect */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          2. Information We Collect
        </h2>
        <p className="text-base text-slate-700 leading-relaxed mb-2">
          We may collect several types of information from and about users of our services,
          including:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-700 leading-relaxed space-y-2">
          <li>
            <strong>Personal Information:</strong> Name, email address, postal address,
            phone number, and date of birth (for age verification).
          </li>
          <li>
            <strong>Payment Information:</strong> Credit/debit card details, PayPal email,
            or other payment method information (processed by third-party payment processors).
          </li>
          <li>
            <strong>Transaction Information:</strong> Raffle ticket purchases, donation amounts,
            and prize fulfillment details.
          </li>
          <li>
            <strong>Technical Information:</strong> IP address, browser type, device
            information, and usage data collected via cookies and similar technologies.
          </li>
        </ul>
      </section>

      {/* 3. How We Use Your Information */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          3. How We Use Your Information
        </h2>
        <p className="text-base text-slate-700 leading-relaxed mb-2">
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-700 leading-relaxed space-y-2">
          <li>Process and fulfill raffle ticket purchases and donations.</li>
          <li>Administer your account and communicate with you about your entries and prizes.</li>
          <li>Verify your eligibility and age as required by law.</li>
          <li>Improve our website, services, and customer experience.</li>
          <li>Comply with legal obligations and enforce our terms.</li>
          <li>Send you promotional offers or updates (you may opt out at any time).</li>
        </ul>
      </section>

      {/* 4. Sharing and Disclosure */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          4. Sharing and Disclosure
        </h2>
        <p className="text-base text-slate-700 leading-relaxed mb-2">
          We do not sell, rent, or trade your personal information. We may share your
          information only in the following circumstances:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-700 leading-relaxed space-y-2">
          <li>
            <strong>Service Providers:</strong> With third-party vendors who assist us in
            payment processing, email delivery, and website analytics (all bound by
            confidentiality agreements).
          </li>
          <li>
            <strong>Legal Requirements:</strong> If required to do so by law or in response
            to valid requests by public authorities.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of a merger, acquisition, or
            sale of assets, your information may be transferred to the acquiring entity.
          </li>
        </ul>
      </section>

      {/* 5. Cookies and Tracking */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          5. Cookies and Tracking Technologies
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          We use cookies and similar tracking technologies to enhance your experience,
          analyze trends, and administer the website. You can control cookies through your
          browser settings. However, disabling cookies may affect the functionality of our
          services.
        </p>
      </section>

      {/* 6. Data Security */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          6. Data Security
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          We implement reasonable technical and organizational measures to protect your
          personal information against unauthorized access, alteration, disclosure, or
          destruction. However, no method of transmission over the internet or electronic
          storage is 100% secure. While we strive to protect your information, we cannot
          guarantee its absolute security.
        </p>
      </section>

      {/* 7. Your Rights and Choices */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          7. Your Rights and Choices
        </h2>
        <p className="text-base text-slate-700 leading-relaxed mb-2">
          Depending on your jurisdiction, you may have the right to:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-700 leading-relaxed space-y-2">
          <li>Access, correct, or delete your personal information.</li>
          <li>Object to or restrict certain processing of your data.</li>
          <li>Withdraw consent at any time (where processing is based on consent).</li>
          <li>Lodge a complaint with a supervisory authority.</li>
        </ul>
        <p className="text-base text-slate-700 leading-relaxed mt-2">
          To exercise these rights, please contact us at the email below.
        </p>
      </section>

      {/* 8. International Transfers */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          8. International Transfers
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          Your information may be transferred to and maintained on servers located in the
          United States or other countries. If you are accessing our services from Canada
          or Australia, please be aware that your information may be transferred to,
          processed, and stored in the United States, where data protection laws may differ
          from those in your country. By using our services, you consent to such transfer.
        </p>
      </section>

      {/* 9. Children's Privacy */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          9. Children's Privacy
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          Our services are not directed to individuals under the age of majority in their
          jurisdiction (18 or 19 depending on location). We do not knowingly collect
          personal information from minors. If you believe we have inadvertently collected
          such information, please contact us so we can delete it.
        </p>
      </section>

      {/* 10. Changes to This Privacy Policy */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          10. Changes to This Privacy Policy
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          We may update this Privacy Policy from time to time. The most current version
          will be posted on this page with the "Last Updated" date. Your continued use of
          our services after any changes indicates your acceptance of the updated policy.
        </p>
      </section>

      {/* 11. Contact Information */}
      <section className="mb-8">
        <h2
          className="font-semibold mb-3 tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.2px" }}
        >
          11. Contact Us
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          If you have any questions or concerns about this Privacy Policy or our data
          practices, please contact us at:
        </p>
        <p className="text-base text-slate-700 leading-relaxed mt-2">
          <strong>Email:</strong> privacy@goodwillstores.com<br />
          <strong>Mailing Address:</strong> Goodwillstores Privacy Dept., 123 Raffle Way,
          Suite 100, Dover, DE 19901, USA
        </p>
      </section>
    </div>
  );
}
