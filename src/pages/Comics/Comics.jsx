import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import "./Comics.css";

const Comics = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [comics, setComics] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(100);

  // Gestion des favoris
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");

  const totalPages = Math.ceil(count / limit);

  // Texte saisi localement : la recherche ne part qu'à la validation du formulaire.
  const [searchInput, setSearchInput] = useState(search);

  const handleSearch = (event) => {
    // Empêche le rechargement de la page lors de la soumission
    event.preventDefault();

    // Lance la recherche des comics Marvel.
    setSearch(searchInput);
    setPage(1);
  };

  // Récupère les comics depuis notre backend.
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `https://site--marvel-backend--8x9r8cyv4xks.code.run/comics?page=${page}&title=${encodeURIComponent(search)}`,
        );

        setComics(response.data.results);
        setCount(response.data.count);
        setLimit(response.data.limit);
      } catch (error) {
        console.log("Erreur lors du chargement des comics :", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [search, page]);

  // Récupère les favoris une seule fois au chargement de la page.
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoadingFavorites(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://site--marvel-backend--8x9r8cyv4xks.code.run/user/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setFavorites(response.data.favorites);
      } catch (error) {
        console.log("Erreur lors du chargement des favoris :", error.message);
        setFavoriteError("Impossible de charger tes favoris.");
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, []);

  // Ajoute ou supprime un comic des favoris.
  const handleFavorite = async (comic) => {
    const token = localStorage.getItem("token");

    // Pour ce premier test, les favoris sont liés au compte.
    if (!token) {
      navigate("/login");
      return;
    }

    if (isUpdatingFavorite || isLoadingFavorites) {
      return;
    }

    setIsUpdatingFavorite(true);
    setFavoriteError("");

    const existingFavorite = favorites.find((favorite) => {
      return favorite.itemId === comic._id && favorite.itemType === "comic";
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let response;

      if (existingFavorite) {
        // Suppression avec l'identifiant MongoDB du favori.
        response = await axios.delete(
          `https://site--marvel-backend--8x9r8cyv4xks.code.run/user/favorites/${existingFavorite._id}`,
          config,
        );
      } else {
        // Ajout du comic aux favoris.
        response = await axios.post(
          "https://site--marvel-backend--8x9r8cyv4xks.code.run/user/favorites",
          {
            itemId: comic._id,
            itemType: "comic",
            title: comic.title,
            image: `${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`,
          },
          config,
        );
      }

      // Met à jour les cœurs à partir de la réponse du backend.
      setFavorites(response.data.favorites);
    } catch (error) {
      console.log("Erreur lors de la modification du favori :", error.message);

      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setFavoriteError("Impossible de modifier ce favori pour le moment.");
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  return (
    <main className="comics-page">
      <section className="comics-banner">
        <p className="comics-subtitle">MARVEL : MY UNIVERSE</p>
        <h1>COMICS</h1>
        <p className="comics-intro">
          Explore l'univers Marvel et découvre ses comics.
        </p>
      </section>

      <section className="comics-content">
        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="comics-search-container">
          <input
            type="search"
            name="search_text"
            id="search_text"
            placeholder="Rechercher un comic..."
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);

              if (event.target.value === "") {
                setSearch("");
                setPage(1);
              }
            }}
          />
          <button type="submit">Rechercher</button>
        </form>

        {/* Message en cas d'erreur sur les favoris */}
        {favoriteError && (
          <p className="comics-favorite-error" role="alert">
            {favoriteError}
          </p>
        )}

        {/* Affiche un message pendant le chargement des Comics */}
        {isLoading ? (
          <p>Chargement des comics...</p>
        ) : (
          <div className="comics-grid">
            {/* Parcourt le tableau comics pour afficher chaque comic Marvel */}
            {comics.map((comic) => {
              const isFavorite = favorites.some((favorite) => {
                return (
                  favorite.itemId === comic._id && favorite.itemType === "comic"
                );
              });

              return (
                <article className="comic-card" key={comic._id}>
                  <div className="comic-image">
                    <img
                      src={`${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`}
                      alt={comic.title}
                      loading="lazy"
                    />
                  </div>

                  {/* Bouton favori indépendant de la carte */}
                  <button
                    type="button"
                    className="comic-favorite-button"
                    onClick={() => handleFavorite(comic)}
                    disabled={isLoadingFavorites || isUpdatingFavorite}
                    aria-pressed={isFavorite}
                    aria-label={
                      isFavorite
                        ? `Retirer ${comic.title} des favoris`
                        : `Ajouter ${comic.title} aux favoris`
                    }
                  >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                  </button>

                  <div className="comic-infos">
                    <h2>{comic.title}</h2>

                    {comic.description ? (
                      <p>{comic.description}</p>
                    ) : (
                      <p>Aucune description disponible</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Précédent
            </button>

            <span>
              Page {page} sur {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Suivant
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Comics;
