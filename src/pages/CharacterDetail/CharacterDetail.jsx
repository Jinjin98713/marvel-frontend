import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./CharacterDetail.css";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton";
import formatMarvelDescription from "../../utils/formatMarvelDescription";

const CharacterDetail = () => {
  const { characterId } = useParams();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Deux routes de notre backend déjà présentes dans le projet.
        const responseCharacter = await axios.get(
          `https://site--marvel-backend--8x9r8cyv4xks.code.run/character/${characterId}`,
        );
        const responseComics = await axios.get(
          `https://site--marvel-backend--8x9r8cyv4xks.code.run/comics/character/${characterId}`,
        );
        setCharacter(responseCharacter.data);
        setComics(
          responseComics.data.comics || responseComics.data.results || [],
        );
      } catch (error) {
        console.log("Erreur lors du chargement de la fiche :", error.message);
        setError("Impossible de charger ce personnage pour le moment.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [characterId]);

  if (isLoading) {
    return (
      <main className="detail-message">
        Chargement de l'univers du personnage...
      </main>
    );
  }

  if (error || !character) {
    return (
      <main className="detail-message">
        <p>{error || "Personnage introuvable."}</p>
        <Link to="/personnages">Retour aux personnages</Link>
      </main>
    );
  }

  const image = `${character.thumbnail.path}/portrait_incredible.${character.thumbnail.extension}`;

  return (
    <main className="character-detail-page">
      <section className="character-detail-hero">
        <div
          className="character-detail-background"
          style={{ backgroundImage: `url("${image}")` }}
        />
        <div className="character-detail-container">
          <Link className="character-detail-back" to="/personnages">
            ← Retour aux personnages
          </Link>
          <div className="character-detail-main">
            <img
              className="character-detail-portrait"
              src={image}
              alt={character.name}
            />
            <div className="character-detail-text">
              <p className="character-detail-kicker">
                MARVEL : MY UNIVERSE / PERSONNAGE
              </p>
              <h1>{character.name}</h1>
              <p>
                {character.description ||
                  "Aucune description disponible pour ce personnage."}
              </p>
              <div className="character-detail-actions">
                <a
                  className="character-detail-comics-link"
                  href="#character-comics"
                >
                  Découvrir ses comics ↓
                </a>
                <FavoriteButton
                  itemId={character._id}
                  itemType="character"
                  title={character.name}
                  image={`${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="character-detail-comics" id="character-comics">
        <div className="character-detail-container">
          <p className="character-detail-kicker">LA COLLECTION</p>
          <h2>SES COMICS</h2>
          {comics.length === 0 ? (
            <p className="character-detail-empty">
              Aucun comic associé à ce personnage.
            </p>
          ) : (
            <div className="character-detail-comics-grid">
              {comics.map((comic) => (
                <article className="character-detail-comic" key={comic._id}>
                  {comic.thumbnail && (
                    <img
                      src={`${comic.thumbnail.path}/portrait_incredible.${comic.thumbnail.extension}`}
                      alt={comic.title}
                      loading="lazy"
                    />
                  )}
                  <div className="character-detail-comic-info">
                    <h3>{comic.title}</h3>
                    <p>{formatMarvelDescription(comic.description)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CharacterDetail;
