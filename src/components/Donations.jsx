import React, { useState } from "react";

export default function Donations() {
  const programs = [
    {
      id: 1,
      title: "Academic Sponsorships",
      description: "We fund school fees, supplies, and learning materials for students from under-resourced backgrounds, giving them a chance to build a better future.",
      image: "/Wonderfold.jpg",
      images: [
        "/Wonderfold.jpg",
        "/Wonderfold1.jpg",
        "/Wonderfold2.jpg",
        "/Wonderfold3.jpg",
        "/Wonderfold4.jpg",
      ],
      quote: "“Education gave me hope. Now I can dream of becoming a teacher.”",
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
    },
    {
      id: 3,
      title: "Emergency Relief",
      description: "From food parcels and clothing to urgent financial assistance during crises, we stand ready to help families facing hardship.",
      image: "/Wonderfold.jpg",
      images: [
        "/Wonderfold.jpg",
        "/Wonderfold1.jpg",
        "/Wonderfold2.jpg",
        "/Wonderfold3.jpg",
        "/Wonderfold4.jpg",
      ],
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
    }
  ];

  // State for carousel indices of programs 2, 3, 4
  const [carouselIndices, setCarouselIndices] = useState({ 2: 0, 3: 0, 4: 0 });

  // Renamed: handlePrevImage / handleNextImage
  const handlePrevImage = (id, imagesLength) => {
    setCarouselIndices(prev => ({
      ...prev,
      [id]: prev[id] === 0 ? imagesLength - 1 : prev[id] - 1
    }));
  };

  const handleNextImage = (id, imagesLength) => {
    setCarouselIndices(prev => ({
      ...prev,
      [id]: prev[id] === imagesLength - 1 ? 0 : prev[id] + 1
    }));
  };

  // Academic Sponsorships carousel (unchanged)
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">Make a Difference</h1>
      <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
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
                {/* Title */}
                <h2 className="font-semibold text-lg mb-2 text-slate-800">{program.title}</h2>
                {/* Description */}
                <p className="text-sm text-slate-600 mb-3">{program.description}</p>
                {/* Image carousel */}
                <div
                  className="bg-gray-200 relative flex items-center justify-center"
                  style={{ height: '200px' }}
                >
                  <img
                    src={program.images[currentIndex]}
                    alt={`${program.title} - ${currentIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Quote */}
                <p className="mt-4 text-sm text-emerald-700 italic border-l-2 border-emerald-500 pl-2">
                  {program.quote}
                </p>
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
            const currentIdx = carouselIndices[program.id] || 0;
            const images = program.images;
            return (
              <div
                key={program.id}
                className="bg-white rounded-xl shadow-md overflow-hidden p-4"
              >
                {/* Two-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column: image carousel */}
                  <div>
                    <div
                      className="bg-gray-200 relative flex items-center justify-center rounded-lg overflow-hidden"
                      style={{ height: '200px' }}
                    >
                      <img
                        src={images[currentIdx]}
                        alt={`${program.title} - ${currentIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Navigation arrows (below image) */}
                    <div className="mt-3 flex justify-center">
                      <div
                        className="flex items-center bg-gray-200 px-3 py-1 rounded-full"
                        style={{ gap: '20px' }}
                      >
                        <button
                          onClick={() => handlePrevImage(program.id, images.length)}
                          className="bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/50 transition"
                        >
                          ❮
                        </button>
                        <button
                          onClick={() => handleNextImage(program.id, images.length)}
                          className="bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/50 transition"
                        >
                          ❯
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right column: title and description */}
                  <div className="flex flex-col justify-center">
                    <h2 className="text-xl font-semibold mb-2 text-slate-800">{program.title}</h2>
                    <p className="text-lg leading-relaxed text-slate-600">
                      {program.description}
                    </p>
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
