import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserCircle,
  FaHeart,
  FaBookOpen,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Account.css";

const Account = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [hero, setHero] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = "https://site--marvel-backend--8x9r8cyv4xks.code.run";

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      // Si aucun token n'est enregistré, retour à la connexion.
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Le backend vérifie le token dans le header Authorization.
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Récupère les informations de l'utilisateur.
        const userResponse = await axios.get(`${API_URL}/user/me`, config);

        setUser(userResponse.data);

        // Récupère les favoris enregistrés dans MongoDB.
        const favoritesResponse = await axios.get(
          `${API_URL}/user/favorites`,
          config,
        );

        setFavorites(favoritesResponse.data.favorites);

        // Récupère les informations du héros préféré.
        if (userResponse.data.favoriteHero) {
          const heroResponse = await axios.get(
            `${API_URL}/character/${userResponse.data.favoriteHero}`,
          );

          setHero(heroResponse.data);
        }
      } catch (error) {
        console.log("Erreur lors du chargement du compte :", error.message);

        // Token absent de la base ou invalide.
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        setErrorMessage(
          "Impossible de charger toutes les informations de ton compte.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Compte les personnages favoris.
  const characterFavorites = favorites.filter((favorite) => {
    return favorite.itemType === "character";
  });

  // Compte les comics favoris.
  const comicFavorites = favorites.filter((favorite) => {
    return favorite.itemType === "comic";
  });

  const handleLogout = () => {
    // Supprime le token enregistré dans le navigateur.
    localStorage.removeItem("token");

    // Redirige vers la connexion.
    navigate("/login", { replace: true });
  };

  return (
    <main className="account-page">
      <section className="account-banner">
        <p className="account-subtitle">MARVEL : MY UNIVERSE</p>

        <h1>MON COMPTE</h1>

        <p className="account-intro">
          Retrouve ton identité héroïque et ton univers personnel.
        </p>
      </section>

      <section className="account-content">
        {isLoading ? (
          <p className="account-loading">Chargement de ton univers Marvel...</p>
        ) : !user ? (
          <p className="account-error">Impossible de récupérer ton profil.</p>
        ) : (
          <>
            {errorMessage && (
              <p className="account-error" role="alert">
                {errorMessage}
              </p>
            )}

            {/* Informations du compte */}
            <div className="account-profile">
              <div className="account-identity">
                <FaUserCircle className="account-avatar" />

                <div>
                  <p className="account-label">IDENTITÉ HÉROÏQUE</p>

                  <h2>{user.username}</h2>

                  <p className="account-email">{user.email}</p>

                  <p className="account-member">
                    Membre de Marvel: My Universe
                  </p>
                </div>
              </div>

              {/* Héros préféré */}
              <div className="account-hero">
                <p className="account-label">MON HÉROS PRÉFÉRÉ</p>

                {hero ? (
                  <div className="account-hero-content">
                    <img
                      src={`${hero.thumbnail.path}/portrait_uncanny.${hero.thumbnail.extension}`}
                      alt={hero.name}
                    />

                    <div className="account-hero-info">
                      <h3>{hero.name}</h3>

                      <p>Le héros qui représente ton univers Marvel.</p>

                      <Link
                        to={`/personnage/${hero._id}`}
                        className="account-hero-link"
                      >
                        Découvrir mon héros
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="account-muted">
                    Héros indisponible pour le moment.
                  </p>
                )}
              </div>
            </div>

            {/* Résumé des favoris */}
            <div className="account-favorites">
              <div className="account-favorites-heading">
                <div>
                  <p className="account-label">MA COLLECTION PERSONNELLE</p>

                  <h2>MES FAVORIS</h2>

                  <p className="account-muted">
                    Retrouve les personnages et les comics qui composent ton
                    univers.
                  </p>
                </div>

                <Link to="/favoris" className="account-collection-link">
                  <FaHeart />
                  Voir ma collection
                </Link>
              </div>

              <div className="account-stats">
                <div className="account-stat-card">
                  <FaHeart className="account-stat-icon" />

                  <span className="account-stat-number">
                    {characterFavorites.length}
                  </span>

                  <p>Personnages favoris</p>
                </div>

                <div className="account-stat-card">
                  <FaBookOpen className="account-stat-icon" />

                  <span className="account-stat-number">
                    {comicFavorites.length}
                  </span>

                  <p>Comics favoris</p>
                </div>
              </div>

              {favorites.length === 0 && (
                <div className="account-empty">
                  <FaHeart />

                  <h3>TON UNIVERS T'ATTEND</h3>

                  <p>
                    Tu n'as pas encore ajouté de favoris. Explore les catalogues
                    pour découvrir tes personnages et comics préférés.
                  </p>

                  <div className="account-empty-links">
                    <Link to="/personnages">Découvrir les personnages</Link>

                    <Link to="/comics">Explorer les comics</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Déconnexion */}
            <div className="account-actions">
              <button
                type="button"
                className="account-logout"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                Se déconnecter
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Account;
