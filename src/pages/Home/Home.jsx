import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaArrowRight,
  FaBookOpen,
  FaHeart,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";
import DoomLanding from "../../components/DoomLanding/DoomLanding";
import "./Home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [hero, setHero] = useState(null);
  const [comics, setComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "https://site--marvel-backend--8x9r8cyv4xks.code.run";

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      const token = localStorage.getItem("token");

      // Un visiteur non connecté voit l'accueil Doctor Doom.
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const responseUser = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isCancelled) return;
        setUser(responseUser.data);

        // Récupère le héros choisi lors de l'inscription.
        if (responseUser.data.favoriteHero) {
          const responseHero = await axios.get(
            `${API_URL}/character/${responseUser.data.favoriteHero}`,
          );
          if (isCancelled) return;
          setHero(responseHero.data);

          // Même route que dans CharacterDetail.jsx.
          const responseComics = await axios.get(
            `${API_URL}/comics/character/${responseUser.data.favoriteHero}`,
          );
          if (isCancelled) return;
          setComics(
            responseComics.data.comics || responseComics.data.results || [],
          );
        }
      } catch (error) {
        console.log("Erreur lors du chargement de l'accueil :", error.message);
        if (!isCancelled && error.response?.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="home-loading">
        <FaShieldAlt />
        <p>Identification de la recrue...</p>
      </main>
    );
  }

  // ==================================
  // ACCUEIL PUBLIC : DOCTOR DOOM
  // ==================================
  if (!user) {
    return (
      <main className="home-page home-public">
        <DoomLanding />
      </main>
    );
  }

  // ==================================
  // ACCUEIL CONNECTÉ : MON UNIVERS
  // ==================================
  return (
    <main
      className={`home-page home-member ${
        hero?.name === "Spider-Man" ? "home-theme-spiderman" : ""
      }`}
    >
      {/* Héros préféré */}
      <section className="home-member-hero">
        <div className="home-member-container">
          <div className="home-member-intro">
            <p className="home-member-label">
              DOSSIER AVENGERS / RECRUE IDENTIFIÉE
            </p>
            <h1>
              BON RETOUR,<span>{user.username}.</span>
            </h1>
            <p className="home-member-description">
              Ton identité héroïque est activée. Doctor Doom est toujours une
              menace. Explore les histoires de ton héros préféré et rassemble
              les alliés de ton univers.
            </p>
            <div className="home-member-actions">
              <Link to="/favoris" className="home-member-button-primary">
                <FaHeart /> Ma collection
              </Link>
              <Link to="/account" className="home-member-button-secondary">
                Mon dossier
              </Link>
            </div>
          </div>
          <div className="home-member-hero-card">
            {hero && hero.thumbnail ? (
              <>
                <img
                  src={`${hero.thumbnail.path}/portrait_incredible.${hero.thumbnail.extension}`}
                  alt={hero.name}
                />
                <div className="home-member-hero-info">
                  <p>TON HÉROS DE RÉFÉRENCE</p>
                  <h2>{hero.name}</h2>
                  <Link to={`/personnage/${hero._id}`}>
                    Découvrir mon héros <FaArrowRight />
                  </Link>
                </div>
              </>
            ) : (
              <div className="home-member-no-hero">
                <FaShieldAlt />
                <p>Héros indisponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comics du héros préféré */}
      <section className="home-member-comics">
        <div className="home-member-container">
          <div className="home-member-section-title">
            <div>
              <p className="home-member-label">ARCHIVES MARVEL</p>
              <h2>LES HISTOIRES DE {hero ? hero.name : "TON HÉROS"}</h2>
            </div>
            <Link to="/comics">
              Tous les comics <FaArrowRight />
            </Link>
          </div>
          {comics.length > 0 ? (
            <div className="home-member-comics-grid">
              {comics.slice(0, 4).map((comic) => (
                <article className="home-member-comic-card" key={comic._id}>
                  {comic.thumbnail && (
                    <img
                      src={`${comic.thumbnail.path}/portrait_incredible.${comic.thumbnail.extension}`}
                      alt={comic.title}
                      loading="lazy"
                    />
                  )}
                  <div className="home-member-comic-info">
                    <h3>{comic.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="home-member-empty">
              Aucun comic associé disponible pour le moment.
            </p>
          )}
        </div>
      </section>

      {/* Navigation vers les fonctionnalités existantes */}
      <section className="home-member-explore">
        <div className="home-member-container">
          <p className="home-member-label">POURSUIS TA MISSION</p>
          <h2>CONSTRUIS TON UNIVERS.</h2>
          <div className="home-member-links">
            <Link to="/personnages">
              <FaUsers />
              <span>Explorer les personnages</span>
              <FaArrowRight />
            </Link>
            <Link to="/comics">
              <FaBookOpen />
              <span>Découvrir les comics</span>
              <FaArrowRight />
            </Link>
            <Link to="/favoris">
              <FaHeart />
              <span>Retrouver mes favoris</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
