import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./Characters.css";

const Characters = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(100);
  const [transition, setTransition] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const navigate = useNavigate();

  const totalPages = Math.ceil(count / limit);

  // Texte saisi localement : la recherche ne part qu'à la validation du formulaire.
  const [searchInput, setSearchInput] = useState(search);

  const handleSearch = (event) => {
    // Empêche le rechargement de la page lors de la soumission
    event.preventDefault();

    // Lance la recherche des personnages Marvel.
    setSearch(searchInput);
    setPage(1);
  };

  // La carte reste un vrai Link : on retarde seulement la navigation pendant l'animation.
  const handleCharacterClick = (event, character) => {
    if (transition) {
      event.preventDefault();
      return;
    }

    // Respecte les utilisateurs qui préfèrent limiter les animations.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const imageElement = event.currentTarget.querySelector(
      ".character-image img",
    );
    if (!imageElement) {
      return;
    }

    // On conserve l'adresse et la taille de l'image cliquée avant de zoomer.
    const rectangle = imageElement.getBoundingClientRect();
    event.preventDefault();

    setTransition({
      id: character._id,
      name: character.name,
      image: imageElement.src,
      left: rectangle.left,
      top: rectangle.top,
      width: rectangle.width,
      height: rectangle.height,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `https://site--marvel-backend--8x9r8cyv4xks.code.run/characters?page=${page}&name=${encodeURIComponent(search)}`,
        );
        setCharacters(response.data.results);
        setCount(response.data.count);
        setLimit(response.data.limit);
      } catch (error) {
        console.log(
          "Erreur lors du chargement des personnages :",
          error.message,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [search, page]);

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
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavorite = async (character) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (isUpdatingFavorite || isLoadingFavorites) {
      return;
    }

    setIsUpdatingFavorite(true);

    const existingFavorite = favorites.find((favorite) => {
      return (
        favorite.itemId === character._id && favorite.itemType === "character"
      );
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let response;

      if (existingFavorite) {
        response = await axios.delete(
          `https://site--marvel-backend--8x9r8cyv4xks.code.run/user/favorites/${existingFavorite._id}`,
          config,
        );
      } else {
        response = await axios.post(
          "https://site--marvel-backend--8x9r8cyv4xks.code.run/user/favorites",
          {
            itemId: character._id,
            itemType: "character",
            title: character.name,
            image: `${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}`,
          },
          config,
        );
      }

      setFavorites(response.data.favorites);
    } catch (error) {
      console.log("Erreur lors de la modification du favori :", error.message);

      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      alert("Impossible de modifier ce favori pour le moment.");
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  return (
    <main className="characters-page">
      <section className="characters-banner">
        <p className="characters-subtitle">MARVEL : MY UNIVERSE</p>
        <h1>PERSONNAGES</h1>
        <p className="characters-intro">
          Explore l'univers Marvel et découvre ses personnages.
        </p>
      </section>

      <section className="characters-content">
        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="search"
            name="search_text"
            id="search_text"
            placeholder="Rechercher un personnage..."
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

        {/* Affiche un message pendant le chargement des Personnages */}
        {isLoading ? (
          <p className="characters-loading">Chargement des Personnages...</p>
        ) : (
          <div className="characters-grid">
            {/* Parcourt le tableau characters pour afficher chaque personnage Marvel */}
            {characters.map((character) => {
              return (
                <article className="character-card" key={character._id}>
                  <Link
                    to={`/personnage/${character._id}`}
                    className="character-card-link"
                    onClick={(event) => handleCharacterClick(event, character)}
                    aria-label={`Découvrir ${character.name}`}
                  >
                    <div className="character-image">
                      <img
                        src={`${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}`}
                        alt={character.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="character-infos">
                      <h2>{character.name}</h2>
                      {character.description ? (
                        <p>{character.description}</p>
                      ) : (
                        <p>Aucune description disponible</p>
                      )}
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="character-favorite-button"
                    onClick={() => handleFavorite(character)}
                    disabled={isLoadingFavorites || isUpdatingFavorite}
                    aria-label={
                      favorites.some((favorite) => {
                        return (
                          favorite.itemId === character._id &&
                          favorite.itemType === "character"
                        );
                      })
                        ? `Retirer ${character.name} des favoris`
                        : `Ajouter ${character.name} aux favoris`
                    }
                  >
                    {favorites.some((favorite) => {
                      return (
                        favorite.itemId === character._id &&
                        favorite.itemType === "character"
                      );
                    }) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
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

      {/* Calque qui zoome depuis la vraie position de l'image cliquée. */}
      {transition && (
        <div className="portal-overlay" aria-hidden="true">
          <div className="portal-overlay-glow" />
          <img
            className="portal-overlay-image"
            src={transition.image}
            alt=""
            style={{
              "--portal-left": `${transition.left}px`,
              "--portal-top": `${transition.top}px`,
              "--portal-width": `${transition.width}px`,
              "--portal-height": `${transition.height}px`,
            }}
            onAnimationEnd={(event) => {
              if (event.animationName === "portal-zoom") {
                navigate(`/personnage/${transition.id}`);
              }
            }}
          />
          <p className="portal-overlay-label">
            ENTRÉE DANS L'UNIVERS DE {transition.name}
          </p>
        </div>
      )}
    </main>
  );
};

export default Characters;
