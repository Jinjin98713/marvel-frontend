import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SmokeCanvas from "./SmokeCanvas";
import "./DoomLanding.css";

const DoomLanding = () => {
  const stageRef = useRef(null);
  const portraitRef = useRef(null);
  const [isReduced, setIsReduced] = useState(false);

  // Respecte les personnes qui préfèrent limiter les animations.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setIsReduced(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // Le curseur révèle le portrait à travers un masque circulaire.
  const handlePointerMove = (event) => {
    if (!stageRef.current || !portraitRef.current) return;
    if (event.pointerType === "touch") return;

    const rectangle = stageRef.current.getBoundingClientRect();
    portraitRef.current.style.setProperty(
      "--mouse-x",
      `${event.clientX - rectangle.left}px`,
    );
    portraitRef.current.style.setProperty(
      "--mouse-y",
      `${event.clientY - rectangle.top}px`,
    );
    portraitRef.current.style.setProperty("--reveal-opacity", "1");
  };

  const handlePointerLeave = () => {
    if (portraitRef.current) {
      portraitRef.current.style.setProperty("--reveal-opacity", "0");
    }
  };

  return (
    <section
      className="doom-landing"
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label="Appel à rejoindre les Avengers"
    >
      <div className="doom-landing-ambient" aria-hidden="true" />

      <div
        className="doom-landing-portrait"
        ref={portraitRef}
        aria-hidden="true"
      >
        <div className="doom-landing-portrait-shadow" />
        <div className="doom-landing-portrait-reveal" />
        <div className="doom-landing-vignette" />
      </div>

      {!isReduced && (
        <SmokeCanvas stageRef={stageRef} intensity={78} enabled={true} />
      )}

      <div className="doom-landing-inner">
        <p className="doom-landing-side-note">DOOM // SIGNAL 001</p>

        <div className="doom-landing-content">
          <p className="doom-landing-eyebrow">● TRANSMISSION INTERCEPTÉE</p>
          <p className="doom-landing-overline">
            INITIATIVE AVENGERS / ACCÈS PRIORITAIRE
          </p>
          <h1>
            DOOM <span>EST DÉJÀ LÀ.</span>
          </h1>
          <h2>LES AVENGERS ONT BESOIN DE TOI.</h2>
          <p className="doom-landing-description">
            Une menace se cache dans l'ombre.{" "}
            <strong>Déplace ton curseur</strong>
            pour révéler Doctor Doom. Choisis ensuite le héros qui t'inspire et
            rassemble tes alliés pour défendre ton univers.
          </p>
          <div className="doom-landing-actions">
            <Link to="/signup" className="doom-landing-primary">
              Rejoindre les Avengers <span aria-hidden="true">↗</span>
            </Link>
            <Link to="/personnages" className="doom-landing-secondary">
              Explorer les héros
            </Link>
          </div>
          <p className="doom-landing-login">
            Déjà une recrue ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
      <div className="doom-landing-bottom">
        <span>MARVEL : MY UNIVERSE</span>
        <span>BOUGE LA SOURIS POUR RÉVÉLER LA MENACE</span>
      </div>
    </section>
  );
};

export default DoomLanding;
