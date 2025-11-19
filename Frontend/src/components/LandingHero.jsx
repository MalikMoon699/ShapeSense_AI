import React, { useState, useEffect } from "react";
import { landingHeroSlides } from "../services/Constants";

const LandingHero = ({ ButtonClick }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % landingHeroSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-hero-container">
      {landingHeroSlides.map((slide, index) => (
        <div
          key={index}
          className={`landing-hero-slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide})` }}
        >
          <div className="landing-hero-overlay">
            <div className="landing-hero-content">
              <p className="landing-hero-subtitle">
                {" "}
                Your personal AI fitness companion
              </p>
              <h1 className="landing-hero-title">Your 24/7 AI Fitness Coach</h1>
              <p className="landing-hero-description">
                Shape your body smarter, not harder, with AI-driven fitness
                guidance.
              </p>
              <button onClick={ButtonClick} className="landing-page-cta">
                Start Journey
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LandingHero;
