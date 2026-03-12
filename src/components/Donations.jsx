import React from "react";

export default function Donations() {
  const programs = [
    {
      id: 1,
      title: "Academic Sponsorships",
      description: "We fund school fees, supplies, and learning materials for students from under-resourced backgrounds, giving them a chance to build a better future.",
      image: "/donation-education.jpg" // placeholder – replace with actual image
    },
    {
      id: 2,
      title: "Palliative Care Support",
      description: "We support home-based care, medical assistance, and daily necessities for the elderly and those with chronic illnesses, ensuring dignity and comfort.",
      image: "/donation-palliative.jpg"
    },
    {
      id: 3,
      title: "Emergency Relief",
      description: "From food parcels and clothing to urgent financial assistance during crises, we stand ready to help families facing hardship.",
      image: "/donation-emergency.jpg"
    },
    {
      id: 4,
      title: "Community Projects",
      description: "Partnering with local churches and associations to build small-scale infrastructure, feeding programs, and more.",
      image: "/donation-community.jpg"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">Make a Difference</h1>
      <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
        Your donations and participation in our raffles directly support these impactful programs. Every contribution counts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {programs.map(program => (
          <div key={program.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 h-32 md:h-auto bg-gray-200">
              <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 md:w-2/3">
              <h2 className="font-semibold text-lg mb-2 text-slate-800">{program.title}</h2>
              <p className="text-sm text-slate-600">{program.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => alert("Donation functionality coming soon!")}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition inline-flex items-center gap-2 text-lg font-medium"
        >
          <span>❤️</span>
          <span>Make a Donation</span>
        </button>
        <p className="mt-4 text-sm text-slate-500">
          Your support helps us continue these programs. Thank you!
        </p>
      </div>
    </div>
  );
}
