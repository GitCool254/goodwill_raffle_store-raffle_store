import React, { useState } from "react";

export default function Donations() {
  const programs = [
    {
      id: 1,
      title: "Academic Sponsorships",
      description: "We fund school fees, supplies, and learning materials for students from under-resourced backgrounds, giving them a chance to build a better future.",
      image: "/tima-miroshnichenko-6549907.jpg",
      images: [
        "/cottonbro-6209804.jpg",
        "/gabby-k-6238120.jpg",
        "/charlotte-may-5965993.jpg",
        "/IMG_185002_26326_1774540235493.jpg",
        "/mary-taylor-5896589.jpg",
        "/Grad-151516161616~2.jpg",
      ],
      quote: "“Education opened a door I thought was forever closed. Today, I’m building a future for my family and showing others in my community that with support, anything is possible.”",
      quoteName: "—Juliana George,",
      quotePosition: "Texas College Academic Sponsorship Beneficiary",
      overlayImage: "/IMG_185101_26326_1774540300928.jpg",
    },
    {
      id: 2,
      title: "Palliative Care Support",
      description: "We support home-based care, medical assistance, and daily necessities for the elderly and those with chronic illnesses, ensuring dignity and comfort.",
      image: "/Palliative Outreach 14.jpg",
      images: [
        "/Palliative Outreach 13.jpg",
        "/Palliative Outreach 14.jpg",
        "/Palliative Outreach 11.jpg",
        "/Community Project Theme.jpg",
      ],
      quote: "“Because of this program, my mother received the care she deserved in the place she loved most – her home. It gave us comfort and hope during the hardest days.”",
      quoteName: "—Elena Martinez,",
      quotePosition: "Palliative Care Recipient",
      overlayImage: "/Palliative Outreach 12.jpg",
    },
    {
      id: 3,
      title: "Community Projects",
      description: "Partnering with local churches and associations to build small-scale infrastructure, feeding programs, and more.",
      image: "/Community Outreach 2.jpg",
      images: [
        "/Community Outreach 1.jpg",
        "/Community Outreach 4.jpg",
        "/Children Orphanage 1.jpg",
        "/Community Outreach 3.jpg",
        "/Outreach team - USA.jpg",
        "/Community Outreach2.jpg",
      ],
      quote: "“Our community came together with Goodwillstores to build a shared garden and a safe space for our children. Now we grow food, hope, and lasting friendships.”",
      quoteName: "—Sarah Njoroge,",
      quotePosition: "Community Project Coordinator",
      overlayImage: "/Outreach theme1.jpg",
    }
  ];

  // State for carousels of all programs
  const [programIndices, setProgramIndices] = useState({
    1: 0,
    2: 0,
    3: 0,
  });

  const handlePrevious = (programId) => {
    setProgramIndices((prev) => {
      const images = programs.find(p => p.id === programId).images;
      const prevIndex = prev[programId];
      const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      return { ...prev, [programId]: newIndex };
    });
  };

  const handleNext = (programId) => {
    setProgramIndices((prev) => {
      const images = programs.find(p => p.id === programId).images;
      const prevIndex = prev[programId];
      const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      return { ...prev, [programId]: newIndex };
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50 min-h-screen">
      <p
        className="text-center text-slate-600 mb-10 max-w-2xl mx-auto"
        style={{
          fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '1.6',
          letterSpacing: '0.01em',
          color: '#334155'
        }}
      >
        Your donations and participation in our raffles directly support these impactful programs. Every contribution counts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {programs.map((program) => {
          const currentImageIndex = programIndices[program.id];
          return (
            <div
              key={program.id}
              className="rounded-xl shadow-md overflow-hidden p-4"
              style={{ backgroundColor: '#e6f3ff', paddingBottom: '20px', marginBottom: '10px' }}
            >
              {/* White container for title + description with 20px left/right margins */}
              <div
                className="bg-white rounded-lg p-4 mb-4"
                style={{ backgroundColor: '#ffffff', marginLeft: '20px', marginRight: '20px', marginTop: '10px', marginBottom: '20px' }}
              >
                <h2 className="font-semibold text-lg mb-2 text-slate-800">{program.title}</h2>
                <p
                  className="text-lg text-slate-600 leading-normal"
                  style={{ fontWeight: "470", padding: "10px", fontSize: "1.1rem" }}
                >
                  {program.description}
                </p>
              </div>
              {/* Image container with white background and padding */}
              <div
                className="bg-white rounded-lg relative"
                style={{ backgroundColor: '#ffffff', marginLeft: '10px', marginRight: '10px', marginTop: '10px', marginBottom: '10px', padding: '10px' }}
              >
                <div className="flex items-center justify-center">
                  <img
                    src={program.images[currentImageIndex]}
                    alt={`${program.title} - ${currentImageIndex + 1}`}
                    className="max-w-full h-auto object-contain rounded-md"
                  />
                </div>
                {/* Circular overlay image – only on the first image */}
                {currentImageIndex === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '120px',
                      height: '120px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      zIndex: 5,
                    }}
                  >
                    <img
                      src={program.overlayImage || program.image}
                      alt="overlay"
                      style={{
                        width: '97%',
                        height: '97%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
              </div>
              {/* Quote with left margin */}
              <p
                className="mt-4 leading-tight italic font-heading pl-2"
                style={{ fontSize: '1.125rem', padding: "10px" }}
              >
                {program.quote}
              </p>
              {/* Name and position with left margin */}
              <div className="mt-2 mb-0 pl-2" style={{ fontSize: '0.875rem', padding: "10px" }}>
                <span style={{ fontWeight: 'bold' }}>{program.quoteName}</span>{" "}
                <span>{program.quotePosition}</span>
              </div>
              {/* Navigation arrows */}
              <div className="mt-4 flex justify-center">
                <div
                  className="flex items-center bg-gray-200 px-3 py-1 rounded-full"
                  style={{ gap: '20px' }}
                >
                  <button
                    onClick={() => handlePrevious(program.id)}
                    className="bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/50 transition"
                  >
                    ❮
                  </button>
                  <button
                    onClick={() => handleNext(program.id)}
                    className="bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/50 transition"
                  >
                    ❯
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <a
          href="https://www.sandbox.paypal.com/donate/?hosted_button_id=PH4HCPSBP5HQJ"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition inline-flex items-center gap-2 text-lg font-medium"
        >
          <span>Make a Donation</span>
        </a>
        <p
          className="text-center text-slate-600 mb-10 max-w-2xl mx-auto"
          style={{
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '1.6',
            letterSpacing: '0.01em',
            color: '#334155'
          }}
        >
          Your support helps us continue these programs. Thank you!
        </p>
      </div>
    </div>
  );
}
