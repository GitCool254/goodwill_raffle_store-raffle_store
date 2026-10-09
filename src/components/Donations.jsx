import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import CanonicalTag from "./CanonicalTag";
import { FALLBACK_DONATION_PROGRAMS } from "../data/donations";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

function imgSrc(url) {
  if (!url) return "";
  return url.startsWith("/products/") ? `${BACKEND}${url}` : url;
}

function normalizeProgram(p) {
  return {
    ...p,
    image: imgSrc(p.image),
    overlayImage: imgSrc(p.overlayImage),
    images: Array.isArray(p.images) ? p.images.map(imgSrc) : [],
  };
}

export default function Donations() {
  const [programs, setPrograms] = useState(FALLBACK_DONATION_PROGRAMS);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/donations`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (
          data &&
          Array.isArray(data.programs) &&
          data.programs.length > 0
        ) {
          setPrograms(data.programs.map(normalizeProgram));
        }
      } catch (err) {
        console.warn("Donations fetch skipped:", err);
      }
    })();
  }, []);

  // ---- carousel state ----
  const [programIndices, setProgramIndices] = useState({});

  useEffect(() => {
    setProgramIndices((prev) => {
      const next = { ...prev };
      programs.forEach((p) => {
        if (next[p.id] === undefined) next[p.id] = 0;
      });
      return next;
    });
  }, [programs]);

  const handlePrevious = (programId) => {
    setProgramIndices((prev) => {
      const program = programs.find((p) => p.id === programId);
      if (!program) return prev;
      const images = program.images || [];
      const prevIndex = prev[programId] || 0;
      const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      return { ...prev, [programId]: newIndex };
    });
  };

  const handleNext = (programId) => {
    setProgramIndices((prev) => {
      const program = programs.find((p) => p.id === programId);
      if (!program) return prev;
      const images = program.images || [];
      const prevIndex = prev[programId] || 0;
      const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      return { ...prev, [programId]: newIndex };
    });
  };

  const touchStartXRef = useRef({});

  const handleTouchStart = (e, programId) => {
    touchStartXRef.current[programId] = e.touches[0].clientX;
  };

  const handleTouchEnd = (e, programId) => {
    const startX = touchStartXRef.current[programId];
    if (startX === undefined) return;
    const endX = e.changedTouches[0].clientX;
    const delta = startX - endX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) handleNext(programId);
      else handlePrevious(programId);
    }
    delete touchStartXRef.current[programId];
  };

  const [counts, setCounts] = useState({
    churchPartners: 0,
    childrenYouth: 0,
    countries: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const targetValues = {
    churchPartners: 517,
    childrenYouth: 21055,
    countries: 4,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const stepTime = 20;
          const steps = duration / stepTime;

          const increments = {
            churchPartners: targetValues.churchPartners / steps,
            childrenYouth: targetValues.childrenYouth / steps,
            countries: targetValues.countries / steps,
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
              countries: Math.min(
                Math.floor(increments.countries * currentStep),
                targetValues.countries
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasAnimated]);

  return (
    <>
      <Helmet>
        <title>Donate & Impact – Goodwillstores</title>
        <meta
          name="description"
          content="Support community projects through Goodwillstores. Your donations and participation fund academic sponsorships, palliative care, and emergency relief."
        />
      </Helmet>

      <CanonicalTag path="/donations" />

      <div className="max-w-6xl mx-auto p-6 bg-slate-50 min-h-screen">
        {/* Our Reach Section */}
        <div ref={sectionRef} className="mb-16">
          <div
            className="rounded-xl shadow-md overflow-hidden p-4"
            style={{ backgroundColor: "#e6f3ff", paddingBottom: "20px", marginBottom: "10px" }}
          >
            <div
              className="bg-white rounded-lg p-4 mb-4"
              style={{
                backgroundColor: "#ffffff",
                marginLeft: "20px",
                marginRight: "20px",
                marginTop: "10px",
                marginBottom: "20px",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
            >
              <h2
                className="text-xl md:text-4xl font-bold text-slate-800 mb-2 text-center"
                style={{ letterSpacing: "-0.02em", fontSize: "1.25rem" }}
              >
                Our Reach
              </h2>
              <p
                className="text-lg text-slate-600 leading-normal text-center"
                style={{ fontWeight: "470", padding: "10px", fontSize: "1.1rem" }}
              >
                Your donations and participation in our raffles directly support
                these impactful programs. Every contribution counts.
              </p>
            </div>

            <div
              className="bg-white rounded-lg"
              style={{
                backgroundColor: "#ffffff",
                marginLeft: "10px",
                marginRight: "10px",
                marginTop: "10px",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <div className="flex flex-wrap justify-center" style={{ gap: "24px" }}>
                {[
                  { value: counts.churchPartners, label: "Church Partners" },
                  { value: counts.childrenYouth, label: "Children and Youth" },
                  { value: counts.countries, label: "Countries" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex-1 min-w-[250px] text-center p-6 rounded-xl bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                    style={{
                      border: "3px solid transparent",
                      borderImage:
                        "linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD) 1",
                      borderImageSlice: 1,
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    <div
                      className="text-4xl md:text-5xl font-bold text-emerald-600 mb-3 text-lg text-slate-600 leading-normal"
                      style={{
                        letterSpacing: "-0.02em",
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                        color: "#059669",
                      }}
                    >
                      {s.value.toLocaleString()}
                    </div>
                    <div
                      className="text-lg text-slate-600 leading-normal"
                      style={{ fontWeight: "550", fontSize: "1.15rem" }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {programs.map((program) => {
            const images = program.images || [];
            const currentImageIndex = programIndices[program.id] || 0;
            const currentImage = images[currentImageIndex] || program.image;
            return (
              <div
                key={program.id}
                className="rounded-xl shadow-md overflow-hidden p-4"
                style={{ backgroundColor: "#e6f3ff", paddingBottom: "20px", marginBottom: "10px" }}
              >
                <div
                  className="bg-white rounded-lg p-4 mb-4"
                  style={{
                    backgroundColor: "#ffffff",
                    marginLeft: "20px",
                    marginRight: "20px",
                    marginTop: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <h2
                    className="font-semibold text-lg mb-2 text-slate-800"
                    style={{ fontSize: "1.19rem" }}
                  >
                    {program.title}
                  </h2>
                  <p
                    className="text-lg text-slate-600 leading-normal"
                    style={{ fontWeight: "470", padding: "10px", fontSize: "1.1rem" }}
                  >
                    {program.description}
                  </p>
                </div>

                <div
                  className="bg-white rounded-lg relative"
                  style={{
                    backgroundColor: "#ffffff",
                    marginLeft: "10px",
                    marginRight: "10px",
                    marginTop: "10px",
                    marginBottom: "10px",
                    padding: "10px",
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    onTouchStart={(e) => handleTouchStart(e, program.id)}
                    onTouchEnd={(e) => handleTouchEnd(e, program.id)}
                  >
                    <img
                      src={currentImage}
                      alt={`${program.title} - ${currentImageIndex + 1}`}
                      loading="lazy"
                      className="max-w-full h-auto object-contain rounded-md"
                    />
                  </div>
                  {currentImageIndex === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "20%",
                        height: "auto",
                        aspectRatio: "1/1",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        zIndex: 5,
                      }}
                    >
                      <img
                        src={program.overlayImage || program.image}
                        alt="overlay"
                        loading="lazy"
                        style={{
                          width: "98%",
                          height: "98%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                </div>

                {currentImageIndex === 0 && (
                  <>
                    <p
                      className="mt-4 leading-tight italic font-heading pl-2"
                      style={{ fontSize: "1.125rem", padding: "10px" }}
                    >
                      {program.quote}
                    </p>
                    <div
                      className="mt-2 mb-0 pl-2"
                      style={{ fontSize: "0.875rem", padding: "10px" }}
                    >
                      <span style={{ fontWeight: "bold" }}>{program.quoteName}</span>{" "}
                      <span>{program.quotePosition}</span>
                    </div>
                  </>
                )}

                <div className="mt-4 flex justify-center" style={{ gap: "12px" }}>
                  <button
                    onClick={() => handlePrevious(program.id)}
                    aria-label="Previous slide"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#000000",
                      borderRadius: "50%",
                      border: "1px solid rgba(255, 255, 255, 0.8)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleNext(program.id)}
                    aria-label="Next slide"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#000000",
                      borderRadius: "50%",
                      border: "1px solid rgba(255, 255, 255, 0.8)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Donate button */}
        <div style={{ textAlign: "center" }}>
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=NH9S7JC5F3FPE"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              height: "48px",
              fontSize: "16px",
              fontWeight: 500,
              color: "#FFFFFF",
              backgroundColor: "#8AA954",
              border: "0px solid #000000",
              borderRadius: "6px",
              paddingLeft: "24px",
              paddingRight: "24px",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 0 0 0 transparent",
              position: "relative",
              overflow: "visible",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#7a9849";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#8AA954";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <span
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "16px",
                height: "16px",
                zIndex: 2,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  opacity: 0,
                  pointerEvents: "none",
                  animation: "pulseRipple 1.5s infinite ease-out",
                }}
                className="pulse-ripple"
              />
              <svg
                fill="none"
                height="16"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: "#FFFFFF", position: "relative", zIndex: 1 }}
                className="pulse-heart"
              >
                <path
                  d="m11.5629 20.2764c.2603.1588.6136.1588.874 0 18.1291-11.05776 4.2437-21.68512-.437-13.20902-4.68039-8.47609-18.56579 2.15126-.437 13.20902z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span style={{ zIndex: 2 }}>Donate</span>
          </a>
        </div>

        <p
          className="text-center text-slate-600 mb-10 max-w-2xl mx-auto"
          style={{
            fontFamily:
              "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "1.6",
            letterSpacing: "0.01em",
            color: "#334155",
          }}
        >
          Your support helps us continue these programs. Thank you!
        </p>

        <style>{`
          @keyframes pulseRipple {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
            70% { transform: translate(-50%, -50%) scale(2.5); opacity: 0.2; }
            100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
          }
        `}</style>
      </div>
    </>
  );
}
