import React, { useEffect, useState } from "react";
import "../assets/style/LandingPage.css";
import { Dumbbell, HeartPulse, Apple, Brain } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import LandingHero from "../components/LandingHero";
import { useAuth } from "../context/AuthContext";
import { userType } from "../services/Helpers";
import { sectionList } from "../services/Constants";
import { toast } from "sonner";

const LandingPage = () => {
  const { currentUser } = useAuth();
  const { setAcountState, setCurrentSection } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.4,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          window.history.replaceState(null, "", `#${id}`);
          setCurrentSection(id);
        }
      });
    }, options);
    sectionList.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page-container">
      <section id="hero">
        <LandingHero
          ButtonClick={() => {
            const type = userType(currentUser);
            if (type === "noUser") {
              setAcountState("login");
            } else if (type === "notVerified") {
              navigate(`/user-details/${currentUser._id}`);
            } else if (type === "verified") {
              navigate(`/dashboard/${currentUser._id}`);
            } else {
              return toast.error(
                "User type undetermined. Please log in again."
              );
            }
          }}
        />
      </section>
      <section id="features" className="landing-page-features-section">
        <h2 className="landing-page-section-title">Core Fitness Features</h2>

        <div className="landing-page-features-grid">
          <div
            className="landing-page-feature-card"
          >
            <div className="landing-page-feature-icon">
              <Dumbbell />
            </div>
            <h3 className="landing-page-feature-title">AI Workout Generator</h3>
            <p className="landing-page-feature-text">
              Personalized routines based on your fitness level, injuries, and
              goals.
            </p>
          </div>

          <div
            className="landing-page-feature-card"
          >
            <div className="landing-page-feature-icon">
              <Apple />
            </div>
            <h3 className="landing-page-feature-title">AI Diet Planner</h3>
            <p className="landing-page-feature-text">
              Custom diet plans with calorie tracking and macro optimization.
            </p>
          </div>

          <div
            className="landing-page-feature-card"
          >
            <div className="landing-page-feature-icon">
              <HeartPulse />
            </div>
            <h3 className="landing-page-feature-title">Progress Tracking</h3>
            <p className="landing-page-feature-text">
              Track weight, body fat, calories, and daily fitness habits.
            </p>
          </div>

          <div
            className="landing-page-feature-card"
          >
            <div className="landing-page-feature-icon">
              <Brain />
            </div>
            <h3 className="landing-page-feature-title">
              24/7 AI Fitness Coach
            </h3>
            <p className="landing-page-feature-text">
              Get instant guidance on workouts, diet, supplements, and more.
            </p>
          </div>
        </div>
      </section>

      <section id="workflow" className="landing-page-workflow-section">
        <h2 className="landing-page-section-title">How ShapeSense Works</h2>

        <div className="landing-page-workflow-steps">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <h4>Set Your Goal</h4>
            <p>Weight loss, muscle gain, strength, endurance — your choice.</p>
          </div>

          <div className="workflow-step">
            <div className="step-number">2</div>
            <h4>Get Your AI Plan</h4>
            <p>AI generates optimized diet + workout routines for you.</p>
          </div>

          <div className="workflow-step">
            <div className="step-number">3</div>
            <h4>Track & Improve</h4>
            <p>Your plan evolves based on progress, habits, and feedback.</p>
          </div>
        </div>
      </section>

      <section id="why" className="landing-page-why-section">
        <h2 className="landing-page-section-title">
          Why Choose ShapeSense AI?
        </h2>

        <div className="landing-page-why-grid">
          <div className="landing-page-why-card">
            <h3>Personalized Fitness</h3>
            <p>Every plan is tailored to you — no generic workout routines.</p>
          </div>

          <div className="landing-page-why-card">
            <h3>Real-Time AI Adjustments</h3>
            <p>Plans evolve weekly based on your performance and feedback.</p>
          </div>

          <div className="landing-page-why-card">
            <h3>Easy to Track</h3>
            <p>Visual charts and reports keep your progress crystal clear.</p>
          </div>
        </div>
      </section>

      <section id="tools" className="landing-page-tools-section">
        <h2 className="landing-page-section-title">Fitness Tools</h2>

        <div className="landing-page-tools-grid">
          <div className="landing-page-tool-card">
            <h3 className="landing-page-tool-title">Workout Builder</h3>
            <p className="landing-page-tool-text">
              Create custom workouts using AI based on your goal & equipment.
            </p>
          </div>

          <div className="landing-page-tool-card">
            <h3 className="landing-page-tool-title">Meal Planner</h3>
            <p className="landing-page-tool-text">
              Generate diet plans aligned with your macros and calories.
            </p>
          </div>

          <div className="landing-page-tool-card">
            <h3 className="landing-page-tool-title">AI Coach Chat</h3>
            <p className="landing-page-tool-text">
              Ask fitness questions anytime — AI coach answers instantly.
            </p>
          </div>

          <div className="landing-page-tool-card">
            <h3 className="landing-page-tool-title">Analytics Dashboard</h3>
            <p className="landing-page-tool-text">
              Track your entire fitness transformation visually.
            </p>
          </div>
        </div>
      </section>
      <section id="testimonials" className="landing-page-testimonial-section">
        <h2 className="landing-page-section-title">Success Stories</h2>

        <div className="landing-page-testimonial-grid">
          <div className="testimonial-card">
            <p>“I lost 9kg in 6 weeks. The AI diet planner is spot on!”</p>
            <h4>— Sarah F.</h4>
          </div>

          <div className="testimonial-card">
            <p>
              “The workout generator gave me better routines than my trainer!”
            </p>
            <h4>— Bilal Khan</h4>
          </div>

          <div className="testimonial-card">
            <p>“Tracking progress is so easy and motivating. Love it!”</p>
            <h4>— Aisha Malik</h4>
          </div>
        </div>
      </section>

      <section id="faq" className="landing-page-faq-section">
        <h2 className="landing-page-section-title">
          Frequently Asked Questions
        </h2>

        <div className="faq-item">
          <h4>Is ShapeSense free?</h4>
          <p>Yes! You can start with full access to basic tools.</p>
        </div>

        <div className="faq-item">
          <h4>Do I need equipment?</h4>
          <p>No — AI can create bodyweight-only routines too.</p>
        </div>

        <div className="faq-item">
          <h4>Does it support diet personalization?</h4>
          <p>Yes! It adapts to your preferences, allergies, and goals.</p>
        </div>
      </section>

      <section id="about" className="landing-page-about-section">
        <div className="landing-page-about-content">
          <h2 className="landing-page-about-title">About ShapeSense AI</h2>
          <p className="landing-page-about-text">
            ShapeSense AI is designed to transform your fitness journey with
            personalized AI-driven workouts, diets, and coaching. Our mission is
            simple: help you reach your goals through smart, adaptive
            technology.
          </p>
        </div>
      </section>

      <footer className="landing-page-footer">
        <p className="landing-page-footer-text">
          © {new Date().getFullYear()} ShapeSense AI — All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
