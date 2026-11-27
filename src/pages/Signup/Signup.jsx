import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const API_URL = "https://site--marvel-backend--8x9r8cyv4xks.code.run";

// Les cinq héros proposés à l'inscription.
// Leurs identifiants seront récupérés depuis notre backend.
const heroChoices = [
  { name: "Spider-Man", color: "#e52b35" },
  { name: "Iron Man", color: "#d5a339" },
  { name: "Thor", color: "#5199d4" },
  { name: "Black Panther", color: "#8653c6" },
  { name: "Captain America", color: "#4978cf" },
];

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteHero, setFavoriteHero] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHeroes, setIsLoadingHeroes] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Récupère les cinq héros depuis notre backend.
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const results = await Promise.all(
          heroChoices.map(async (hero) => {
            const response = await axios.get(
              `${API_URL}/characters?page=1&name=${encodeURIComponent(hero.name)}`,
            );

            // Recherche le nom exact parmi les résultats.
            const character = response.data.results.find(
              (item) => item.name === hero.name,
            );

            if (!character) {
              throw new Error(`Héros introuvable : ${hero.name}`);
            }

            return {
              ...character,
              color: hero.color,
            };
          }),
        );

        setCharacters(results);
      } catch (error) {
        console.log("Erreur lors du chargement des héros :", error.message);
        setErrorMessage(
          "Impossible de charger les héros Marvel. Actualise la page pour réessayer.",
        );
      } finally {
        setIsLoadingHeroes(false);
      }
    };

    fetchCharacters();
  }, []);

  const handleSubmit = async (event) => {
    // Empêche le rechargement de la page.
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_URL}/user/signup`, {
        username: username,
        email: email,
        password: password,
        favoriteHero: favoriteHero,
        newsletter: newsletter,
      });

      // Enregistre le token de l'utilisateur.
      localStorage.setItem("token", response.data.token);

      // Affiche la confirmation avant d'accéder au compte.
      setIsSuccess(true);
    } catch (error) {
      console.log("Erreur lors de l'inscription :", error.message);

      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Impossible de créer le compte. Réessaie plus tard.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectedHero = characters.find(
    (character) => character._id === favoriteHero,
  );

  return (
    <main className="signup-page">
      <section className="signup-container">
        {isSuccess ? (
          <div className="signup-success">
            <div className="signup-success-icon">✓</div>

            <p className="signup-subtitle">MARVEL : MY UNIVERSE</p>

            <h1>BIENVENUE DANS L'UNIVERS</h1>

            <p className="signup-success-message">
              Bienvenue, <strong>{username}</strong> !
            </p>

            <p className="signup-intro">
              Ton identité héroïque a été créée avec succès. Ton aventure Marvel
              commence maintenant.
            </p>

            {selectedHero && (
              <div className="signup-success-hero">
                <img
                  src={`${selectedHero.thumbnail.path}/portrait_uncanny.${selectedHero.thumbnail.extension}`}
                  alt={selectedHero.name}
                />
                <p>
                  Ton héros : <strong>{selectedHero.name}</strong>
                </p>
              </div>
            )}

            <button
              type="button"
              className="signup-success-button"
              onClick={() => navigate("/account")}
            >
              ACCÉDER À MON COMPTE
            </button>
          </div>
        ) : (
          <>
            <p className="signup-subtitle">MARVEL : MY UNIVERSE</p>

            <h1>REJOINS L'UNIVERS</h1>

            <p className="signup-intro">
              Crée ton compte et choisis le héros qui représentera ton univers
              Marvel.
            </p>

            <form onSubmit={handleSubmit} className="signup-form">
              <label htmlFor="username">Pseudo</label>
              <input
                type="text"
                id="username"
                placeholder="Choisis ton pseudo"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />

              <label htmlFor="signup-email">Adresse email</label>
              <input
                type="email"
                id="signup-email"
                placeholder="pseudo+test@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                pattern="[a-zA-Z0-9._-]+\+test@example\.com"
                title="Utilise une adresse au format pseudo+test@example.com"
                required
              />

              <p className="signup-help">
                Compte de démonstration : utilise une adresse au format
                pseudo+test@example.com.
              </p>

              <label htmlFor="signup-password">Mot de passe</label>
              <input
                type="password"
                id="signup-password"
                placeholder="Choisis ton mot de passe"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
              />

              <p className="signup-hero-title">CHOISIS TON HÉROS</p>

              <p className="signup-hero-description">
                Ton héros déterminera plus tard les couleurs de ton univers
                personnalisé.
              </p>

              {isLoadingHeroes ? (
                <p className="signup-heroes-loading">
                  Chargement des héros Marvel...
                </p>
              ) : (
                <div className="signup-heroes">
                  {characters.map((character) => {
                    return (
                      <button
                        type="button"
                        key={character._id}
                        className={`signup-hero-card ${
                          favoriteHero === character._id ? "selected" : ""
                        }`}
                        style={{
                          "--hero-color": character.color,
                        }}
                        aria-pressed={favoriteHero === character._id}
                        onClick={() => setFavoriteHero(character._id)}
                      >
                        <img
                          src={`${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}`}
                          alt=""
                          loading="lazy"
                        />

                        <span>{character.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <label className="signup-newsletter">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(event) => setNewsletter(event.target.checked)}
                />
                <span>Je souhaite recevoir la newsletter Marvel.</span>
              </label>

              {errorMessage && (
                <p className="signup-error" role="alert">
                  {errorMessage}
                </p>
              )}

              {isLoading && (
                <div className="signup-creating" role="status">
                  <div className="signup-spinner"></div>
                  <p>Création de ton identité héroïque en cours...</p>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isLoading ||
                  isLoadingHeroes ||
                  characters.length === 0 ||
                  !favoriteHero
                }
              >
                {isLoading ? "CRÉATION EN COURS..." : "REJOINDRE L'UNIVERS"}
              </button>
            </form>

            <p className="signup-login">
              Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
};

export default Signup;
