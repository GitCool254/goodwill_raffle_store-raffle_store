import React, { useState, useEffect, useRef } from "react";

export default function Donations() {
  const programs = [
    {
      id: 1,
      title: "Academic Sponsorships",
      description: "We fund school fees, supplies, and learning materials for students from under-resourced backgrounds, giving them a chance to build a better future.",
      image: "/tima-miroshnichenko-6549907.jpg",
      images: [
        "/tima-miroshnichenko-6549907.jpg",
        "/cottonbro-6209804.jpg",
        "/gabby-k-6238120.jpg",
        "/charlotte-may-5965993.jpg",
        "/IMG_185002_26326_1774540235493.jpg",
        "/mary-taylor-5896589.jpg",
        "/Lighting up the world.jpg",
      ],
      quote: "“Before this sponsorship, I had given up on ever returning to school. Now I’m in my second year of college, pursuing a degree in education—a dream I once thought was impossible. The support didn’t just pay my fees; it restored my confidence and gave me a clear path forward. I want every young person in my community to know that with the right opportunity, their future is within reach.”",
      quoteName: "—Juliana George,",
      quotePosition: "Academic Sponsorship Beneficiary",
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

  // Counter animation state
  const [counts, setCounts] = useState({
    churchPartners: 0,
    childrenYouth: 0,
    counties: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const targetValues = {
    churchPartners: 473,
    childrenYouth: 134813,
    counties: 31,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000; // 2 seconds
          const stepTime = 20; // update every 20ms
          const steps = duration / stepTime;

          const increments = {
            churchPartners: targetValues.churchPartners / steps,
            childrenYouth: targetValues.childrenYouth / steps,
            counties: targetValues.counties / steps,
          };

          let currentStep = 0;
          const interval = setInterval(() => {
            currentStep++;
            setCounts({
              churchPartners: Math.min(
                Math.floor(increments.churchPartners * currentStep),
                targetValues.churchPartners
              ),
              childrenYouth: Math.min(
                Math.floor(increments.childrenYouth * currentStep),
                targetValues.childrenYouth
              ),
              counties: Math.min(
                Math.floor(increments.counties * currentStep),
                targetValues.counties
              ),
            });
            if (currentStep >= steps) {
              setCounts(targetValues);
              clearInterval(interval);
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

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

      {/* Compassion Kenya "Our Reach" Section - Fully Styled */}
      <div 
        ref={sectionRef}
        className="relative mb-16 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0B2B4F 0%, #1A4A6F 100%)",
        }}
      >
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.2\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            backgroundRepeat: "repeat",
          }}
        ></div>

        <div className="relative z-10 py-12 px-6 md:py-16">
          {/* Section Title */}
          <div className="text-center mb-10">
            <h2 
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              style={{ letterSpacing: '-0.02em' }}
            >
              Our Reach
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Church Partners */}
            <div 
              className="text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderBottom: '3px solid #FFD966',
              }}
            >
              <div 
                className="text-4xl md:text-5xl font-bold text-white mb-2"
                style={{ letterSpacing: '-0.02em' }}
              >
                {counts.churchPartners.toLocaleString()}
              </div>
              <div className="text-white/90 text-lg font-medium">Church Partners</div>
            </div>

            {/* Children and Youth */}
            <div 
              className="text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderBottom: '3px solid #FFD966',
              }}
            >
              <div 
                className="text-4xl md:text-5xl font-bold text-white mb-2"
                style={{ letterSpacing: '-0.02em' }}
              >
                {counts.childrenYouth.toLocaleString()}
              </div>
              <div className="text-white/90 text-lg font-medium">Children and Youth</div>
            </div>

            {/* Counties */}
            <div 
              className="text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderBottom: '3px solid #FFD966',
              }}
            >
              <div 
                className="text-4xl md:text-5xl font-bold text-white mb-2"
                style={{ letterSpacing: '-0.02em' }}
              >
                {counts.counties.toLocaleString()}
              </div>
              <div className="text-white/90 text-lg font-medium">Counties</div>
            </div>
          </div>

          {/* Learn More Button */}
          <div className="text-center mt-10">
            <a
              href="/about"
              className="inline-block px-8 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
              style={{ letterSpacing: '0.02em' }}
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

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
              {/* Quote – only on the first image */}
              {currentImageIndex === 0 && (
                <>
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
                </>
              )}
              {/* Navigation arrows - both with white arrows inside black circles */}
              <div className="mt-4 flex justify-center" style={{ gap: '12px' }}>
                <button
                  onClick={() => handlePrevious(program.id)}
                  aria-label="Previous slide"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#000000',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleNext(program.id)}
                  aria-label="Next slide"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#000000',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donation Button - Fixed clickable area */}
      <div className="text-center">
        <a
          href="https://www.sandbox.paypal.com/donate/?hosted_button_id=PH4HCPSBP5HQJ"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: '48px',
            fontSize: '16px',
            fontWeight: 500,
            color: '#FFFFFF',
            backgroundColor: '#8AA954',
            border: '0px solid #000000',
            borderRadius: '6px',
            paddingLeft: '24px',
            paddingRight: '24px',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 0 0 0 transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#7a9849';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#8AA954';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
            }}
          >
            <span
              style={{
                position: 'absolute',
                width: '242px',
                height: '242px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                opacity: 0,
                transform: 'scale(0)',
                transition: 'transform 0.6s ease-out, opacity 0.3s ease-out',
              }}
              className="pulse-ripple"
            />
            <svg
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: '#FFFFFF', position: 'relative', zIndex: 1 }}
              className="pulse-heart"
            >
              <path
                d="m11.5629 20.2764c.2603.1588.6136.1588.874 0 18.1291-11.05776 4.2437-21.68512-.437-13.20902-4.68039-8.47609-18.56579 2.15126-.437 13.20902z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span>Donate</span>
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
