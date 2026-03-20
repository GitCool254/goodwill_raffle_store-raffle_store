import React, { useState } from "react";

export default function Donations() {
  const programs = [
    {
      id: 1,
      title: "Academic Sponsorships",
      description: "We fund school fees, supplies, and learning materials for students from under-resourced backgrounds, giving them a chance to build a better future.",
      image: "/WonderfoldN1.jpg",
      images: [
        "/WonderfoldN1.jpg",
        "/Wonderfold1.jpg",
        "/Wonderfold2.jpg",
        "/Wonderfold3.jpg",
        "/Wonderfold4.jpg",
      ],
      quote: "“Education gave me hope. Now I can dream of becoming a teacher.”",
      quoteName: "-Juliana George, ",
      quotePosition: "Texas College Academic Sponsorship Beneficiary",
    },
    {
      id: 2,
      title: "Palliative Care Support",
      description: "We support home-based care, medical assistance, and daily necessities for the elderly and those with chronic illnesses, ensuring dignity and comfort.",
      image: "/Beachcroft Patio.jpg",
      images: [
        "/Beachcroft Patio.jpg",
        "/Beachcroft Patio1.jpg",
        "/Beachcroft Patio2.jpg",
      ],
      quote: "“Dignity and comfort in every moment.”",
      quoteName: "-Elena Martinez, ",
      quotePosition: "Palliative Care Recipient",
    },
    {
      id: 3,
      title: "Emergency Relief",
      description: "From food parcels and clothing to urgent financial assistance during crises, we stand ready to help families facing hardship.",
      image: "/WonderfoldN1.jpg",
      images: [
        "/WonderfoldN1.jpg",
        "/Wonderfold1.jpg",
        "/Wonderfold2.jpg",
        "/Wonderfold3.jpg",
        "/Wonderfold4.jpg",
      ],
      quote: "“Hope arrives when help is needed most.”",
      quoteName: "-David Ochieng,",
      quotePosition: "Emergency Relief Recipient",
    },
    {
      id: 4,
      title: "Community Projects",
      description: "Partnering with local churches and associations to build small-scale infrastructure, feeding programs, and more.",
      image: "/Coolster 125cc.png",
      images: [
        "/Coolster 125cc.png",
        "/Coolster 125cc1.png",
        "/Coolster 125cc2.png",
        "/Coolster 125cc3.png",
        "/Coolster 125cc4.png",
      ],
      quote: "“Stronger communities, brighter futures.”",
      quoteName: "-Sarah Njoroge,",
      quotePosition: "Community Project Coordinator",
    }
  ];

  // State for Academic Sponsorships carousel (id 1)
  const [currentIndex, setCurrentIndex] = useState(0);
  const academicProgram = programs[0];
  const totalImages = academicProgram.images.length;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalImages - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === totalImages - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // State for carousels of programs 2,3,4
  const [programIndices, setProgramIndices] = useState({
    2: 0,
    3: 0,
    4: 0,
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
          if (program.id === 1) {
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
                    style={{ fontWeight: "500" }}
                  >
                    {program.description}
                  </p>
                </div>
                {/* Image container with white background and padding */}
                <div
                  className="bg-white rounded-lg"
                  style={{ backgroundColor: '#ffffff', marginLeft: '10px', marginRight: '10px', marginTop: '10px', marginBottom: '10px', padding: '10px' }}
                >
                  <div className="flex items-center justify-center">
                    <img
                      src={program.images[currentIndex]}
                      alt={`${program.title} - ${currentIndex + 1}`}
                      className="max-w-full h-auto object-contain rounded-md"
                    />
                  </div>
                </div>
                {/* Quote */}
                <p className="mt-4 leading-tight text-lg italic font-heading">
                  {program.quote}
                </p>
                {/* Name and position */}
                <div 
                  className="mt-2 text-sm mb-0"
                  style={{ marginBottom: "10px" }}
                >
                  <span><strong>{program.quoteName}</strong></span>{" "}
                  
                  <span>{program.quotePosition}</span>
                </div>

                <br />
                
                {/* Navigation arrows */}
                <div className="mt-4 flex justify-center">
                  <div
                    className="flex items-center bg-gray-200 px-3 py-1 rounded-full"
                    style={{ gap: '20px' }}
                  >
                    <button
                      onClick={goToPrevious}
                      className="bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/50 transition"
                    >
                      ❮
                    </button>
                    <button
                      onClick={goToNext}
                      className="bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/50 transition"
                    >
                      ❯
                    </button>
                  </div>
                </div>
              </div>
            );
          } else {
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
                  <p className="text-lg text-slate-600 leading-normal">
                    {program.description}
                  </p>
                </div>
                {/* Image container with white background and padding */}
                <div
                  className="bg-white rounded-lg"
                  style={{ backgroundColor: '#ffffff', marginLeft: '10px', marginRight: '10px', marginTop: '10px', marginBottom: '10px', padding: '10px' }}
                >
                  <div className="flex items-center justify-center">
                    <img
                      src={program.images[currentImageIndex]}
                      alt={`${program.title} - ${currentImageIndex + 1}`}
                      className="max-w-full h-auto object-contain rounded-md"
                    />
                  </div>
                </div>
                {/* Quote */}
                <p className="mt-4 text-sm text-emerald-700 italic border-l-2 border-emerald-500 pl-2">
                  {program.quote}
                </p>
                {/* Name and position */}
                <div className="mt-2 text-slate-700 text-sm">
                  <span className="font-bold">{program.quoteName}</span>{" "}
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
          }
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
        <p className="mt-4 text-sm text-slate-500">
          Your support helps us continue these programs. Thank you!
        </p>
      </div>
    </div>
  );
}
