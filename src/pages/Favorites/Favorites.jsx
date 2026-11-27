import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaBookOpen } from "react-icons/fa";
import "./Favorites.css";

const Favorites = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = "https://site--marvel-backend--8x9r8cyv4xks.code.run";

  // Récupère les favoris enregistrés dans MongoDB.
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/user/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFavorites(response.data.favorites);
      } catch (error) {
        console.log("Erreur lors du chargement des favoris :", error.message);

        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        setErrorMessage("Impossible de charger tes favoris.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  // Sépare les personnages et les comics.
  const characterFavorites = favorites.filter((favorite) => {
    return favorite.itemType === "character";
  });

  const comicFavorites = favorites.filter((favorite) => {
    return favorite.itemType === "comic";
  });

  // Filtre les favoris en fonction du bouton sélectionné.
  const filteredFavorites = favorites.filter((favorite) => {
    if (filter === "all") {
      return true;
    }

    return favorite.itemType === filter;
  });

  // Supprime un favori depuis la collection.
  const handleDeleteFavorite = async (favoriteId) => {
    if (isDeleting) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      const response = await axios.delete(
        `${API_URL}/user/favorites/${favoriteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFavorites(response.data.favorites);
    } catch (error) {
      console.log("Erreur lors de la suppression du favori :", error.message);

      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setErrorMessage("Impossible de supprimer ce favori.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="favorites-page">
      <section className="favorites-banner">
        <div className="favorites-banner-container">
          <p className="favorites-subtitle">
            MARVEL : MY UNIVERSE / COLLECTION
          </p>

          <h1>MON UNIVERS</h1>

          <p className="favorites-intro">
            Retrouve les personnages et les comics qui composent ton univers
            Marvel.
          </p>
        </div>
      </section>

      <section className="favorites-content">
        {isLoading ? (
          <p className="favorites-loading">
            Chargement de ta collection Marvel...
          </p>
        ) : (
          <>
            {errorMessage && (
              <p className="favorites-error" role="alert">
                {errorMessage}
              </p>
            )}

            <div className="favorites-heading">
              <div>
                <p className="favorites-heading-label">
                  TA COLLECTION PERSONNELLE
                </p>

                <h2>MES FAVORIS</h2>
              </div>

              <span className="favorites-total">
                {favorites.length} favoris
              </span>
            </div>

            {/* Filtres de la collection */}
            <div className="favorites-filters">
              <button
                type="button"
                className={filter === "all" ? "active" : ""}
                onClick={() => setFilter("all")}
                aria-pressed={filter === "all"}
              >
                Tous ({favorites.length})
              </button>

              <button
                type="button"
                className={filter === "character" ? "active" : ""}
                onClick={() => setFilter("character")}
                aria-pressed={filter === "character"}
              >
                <FaHeart />
                Personnages ({characterFavorites.length})
              </button>

              <button
                type="button"
                className={filter === "comic" ? "active" : ""}
                onClick={() => setFilter("comic")}
                aria-pressed={filter === "comic"}
              >
                <FaBookOpen />
                Comics ({comicFavorites.length})
              </button>
            </div>

            {/* Message lorsque la sélection est vide */}
            {filteredFavorites.length === 0 ? (
              <div className="favorites-empty">
                <FaHeart className="favorites-empty-icon" />

                <h3>TON UNIVERS T'ATTEND</h3>

                <p>
                  {favorites.length === 0
                    ? "Tu n'as pas encore ajouté de favoris."
                    : "Aucun favori dans cette catégorie."}
                </p>

                <div className="favorites-empty-links">
                  <Link to="/personnages">Explorer les personnages</Link>

                  <Link to="/comics">Explorer les comics</Link>
                </div>
              </div>
            ) : (
              <div className="favorites-grid">
                {filteredFavorites.map((favorite) => {
                  return (
                    <article className="favorites-card" key={favorite._id}>
                      {favorite.itemType === "character" ? (
                        <Link
                          to={`/personnage/${favorite.itemId}`}
                          className="favorites-card-image-link"
                          aria-label={`Découvrir ${favorite.title}`}
                        >
                          {favorite.image ? (
                            <img
                              src={favorite.image}
                              alt={favorite.title}
                              loading="lazy"
                            />
                          ) : (
                            <div className="favorites-image-placeholder">
                              <FaHeart />
                            </div>
                          )}
                        </Link>
                      ) : favorite.image ? (
                        <img
                          src={favorite.image}
                          alt={favorite.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="favorites-image-placeholder">
                          <FaBookOpen />
                        </div>
                      )}

                      <div className="favorites-card-info">
                        <p className="favorites-card-type">
                          {favorite.itemType === "character"
                            ? "PERSONNAGE"
                            : "COMIC"}
                        </p>

                        <h3>{favorite.title}</h3>

                        <button
                          type="button"
                          className="favorites-delete"
                          onClick={() => handleDeleteFavorite(favorite._id)}
                          disabled={isDeleting}
                        >
                          <FaHeart />
                          Retirer des favoris
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default Favorites;
