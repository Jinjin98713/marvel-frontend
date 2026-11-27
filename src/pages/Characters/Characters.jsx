import "./Characters.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Characters = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [electricActive, setElectricActive] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(100);

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `https://site--marvel-backend--8x9r8cyv4xks.code.run/characters?page=${page}&name=${encodeURIComponent(search)}`,
        );
        //console.log(response.data.results);
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

  return (
    <main className="characters-page">
      {/* Filtre SVG pour créer des déformations électriques */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        style={{ position: "absolute" }}
      >
        <defs>
          <filter
            id="electric-distortion"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.025"
              numOctaves="3"
              seed="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.025;0.04;0.025"
                dur="0.3s"
                repeatCount="indefinite"
              />
            </feTurbulence>

            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
          </filter>
        </defs>
      </svg>

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
            {characters.map((character, index) => {
              return (
                <article
                  className={`character-card ${
                    index === 0
                      ? "effect-hover"
                      : index === 1
                        ? `effect-click ${electricActive ? "electric-active" : ""}`
                        : ""
                  }`}
                  key={character._id}
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

                  {/* Test électrique uniquement sur les deux premières cartes */}
                  {index < 2 && (
                    <svg
                      className="electric-border"
                      viewBox="0 0 300 450"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      {/* Contour lumineux */}
                      <path
                        className="electric-base"
                        d="M 12 3 H 288 Q 297 3 297 12 V 438 Q 297 447 288 447 H 12 Q 3 447 3 438 V 12 Q 3 3 12 3 Z"
                      />

                      {/* Décharge principale irrégulière */}
                      <path
                        className="electric-arc"
                        d="M 12 4 L 32 4 L 39 1 L 45 7 L 51 3 L 84 4 L 93 1 L 98 6 L 106 4 L 155 4 L 164 0 L 170 8 L 178 4 L 224 4 L 231 1 L 237 7 L 243 4 L 288 4 L 296 12 L 296 48 L 299 55 L 293 62 L 296 69 L 296 120 L 299 127 L 293 134 L 296 141 L 296 203 L 299 211 L 293 219 L 296 226 L 296 290 L 299 299 L 293 305 L 296 312 L 296 376 L 299 385 L 293 393 L 296 400 L 296 438 L 288 446 L 247 446 L 239 449 L 231 443 L 224 446 L 179 446 L 171 449 L 164 442 L 155 446 L 107 446 L 99 449 L 92 442 L 84 446 L 45 446 L 38 449 L 31 443 L 12 446 L 4 438 L 4 400 L 1 393 L 7 385 L 4 378 L 4 312 L 1 305 L 7 297 L 4 290 L 4 226 L 1 219 L 7 211 L 4 204 L 4 140 L 1 134 L 7 126 L 4 119 L 4 69 L 1 62 L 7 55 L 4 48 L 4 12 Z"
                      />

                      {/* Petites décharges secondaires */}
                      <path
                        className="electric-sparks"
                        d="M 40 4 L 44 14 L 49 3
                           M 163 4 L 168 15 L 175 4
                           M 296 92 L 285 99 L 296 107
                           M 296 280 L 285 287 L 296 296
                           M 240 446 L 235 434 L 228 446
                           M 96 446 L 90 435 L 84 446
                           M 4 350 L 15 343 L 4 335
                           M 4 160 L 16 153 L 4 146"
                      />
                    </svg>
                  )}

                  {/* Bouton temporaire pour comparer l'activation au clic */}
                  {index === 1 && (
                    <button
                      type="button"
                      className="effect-click-target"
                      aria-label={`Activer ou désactiver l'électricité sur ${character.name}`}
                      aria-pressed={electricActive}
                      onClick={() => {
                        setElectricActive(!electricActive);
                      }}
                    />
                  )}
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

export default Characters;
