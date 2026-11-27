import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaExclamationTriangle,
  FaArrowRight,
  FaSatelliteDish,
} from "react-icons/fa";
import "./DoomIntro.css";

const DoomIntro = () => {
  const navigate = useNavigate();

  // L'introduction ne s'affiche qu'une fois par session.
  const [isVisible, setIsVisible] = useState(() => {
    const alreadySeen = sessionStorage.getItem("marvel-doom-intro-seen");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return !alreadySeen && !reducedMotion;
  });

  const [isExiting, setIsExiting] = useState(false);
  const [doomImage, setDoomImage] = useState("");

  const API_URL = "https://site--marvel-backend--8x9r8cyv4xks.code.run";

  // Récupère le portrait de Doctor Doom depuis notre backend.
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    let isCancelled = false;

    const fetchDoom = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/characters?page=1&name=${encodeURIComponent("Doctor Doom")}`,
        );

        const character = response.data.results.find((item) => {
          return item.name === "Doctor Doom";
        });

        if (character && character.thumbnail && !isCancelled) {
          setDoomImage(
            `${character.thumbnail.path}/portrait_incredible.${character.thumbnail.extension}`,
          );
        }
      } catch (error) {
        console.log(
          "Erreur lors du chargement de Doctor Doom :",
          error.message,
        );
      }
    };

    fetchDoom();

    return () => {
      isCancelled = true;
    };
  }, [isVisible]);

  // La disparition est déclenchée uniquement par l'utilisateur.
  const closeIntro = () => {
    if (isExiting) {
      return;
    }

    setIsExiting(true);
    sessionStorage.setItem("marvel-doom-intro-seen", "true");
  };

  // Attend la fin de la transition avant de retirer l'écran.
  useEffect(() => {
    if (!isExiting) {
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 650);

    return () => {
      clearTimeout(timer);
    };
  }, [isExiting]);

  // Permet de passer l'introduction avec la touche Échap.
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeIntro();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, isExiting]);

  const handleExplore = () => {
    sessionStorage.setItem("marvel-doom-intro-seen", "true");
    navigate("/personnages");
  };

  if (!isVisible) {
    return null;
  }

  return createPortal(
    <div
      className={`doom-intro ${isExiting ? "doom-intro-exit" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Transmission interceptée par Doctor Doom"
    >
      {/* Ambiance visuelle */}
      <div className="doom-intro-background"></div>
      <div className="doom-intro-grid"></div>
      <div className="doom-intro-scanlines"></div>

      {/* Barre de transmission */}
      <div className="doom-intro-top">
        <span className="doom-intro-alert">
          <FaExclamationTriangle />
          ALERTE S.H.I.E.L.D.
        </span>

        <button
          type="button"
          className="doom-intro-skip"
          onClick={closeIntro}
          disabled={isExiting}
          autoFocus
        >
          Passer l'introduction →
        </button>
      </div>

      {/* Scène principale */}
      <div className="doom-intro-content">
        <div className="doom-intro-character">
          <div className="doom-intro-character-glow"></div>

          {doomImage ? (
            <img
              src={doomImage}
              alt="Doctor Doom"
              className="doom-intro-portrait"
              onError={() => setDoomImage("")}
            />
          ) : (
            <div className="doom-intro-silhouette">
              <span>DOOM</span>
            </div>
          )}

          <span className="doom-intro-character-name">VICTOR VON DOOM</span>
        </div>

        <div className="doom-intro-message">
          <p className="doom-intro-signal">
            <FaSatelliteDish />
            TRANSMISSION INTERCEPTÉE
          </p>

          <p className="doom-intro-chapter">
            MARVEL : MY UNIVERSE / MENACE 001
          </p>

          <h1>
            DOOM
            <span>IS COMING.</span>
          </h1>

          <div className="doom-intro-divider"></div>

          <p className="doom-intro-quote">« VOTRE UNIVERS M'APPARTIENT. »</p>

          <p className="doom-intro-description">
            Doctor Doom a pris le contrôle des transmissions du S.H.I.E.L.D.
            L'Initiative Avengers recherche de nouveaux alliés.
            <br />
            <br />À toi de rassembler les héros capables de lui faire face.
          </p>

          <div className="doom-intro-actions">
            <button
              type="button"
              className="doom-intro-primary"
              onClick={closeIntro}
              disabled={isExiting}
            >
              Répondre à l'appel
              <FaArrowRight />
            </button>

            <button
              type="button"
              className="doom-intro-secondary"
              onClick={handleExplore}
              disabled={isExiting}
            >
              Explorer librement
            </button>
          </div>
        </div>
      </div>

      <div className="doom-intro-footer">
        <span>MARVEL : MY UNIVERSE</span>
        <span>TRANSMISSION NON AUTORISÉE / DOOM</span>
      </div>
    </div>,
    document.body,
  );
};

export default DoomIntro;
