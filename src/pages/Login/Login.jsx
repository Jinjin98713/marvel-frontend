import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "https://site--marvel-backend--8x9r8cyv4xks.code.run/user/login",
        {
          email: email,
          password: password,
        },
      );

      // Enregistre le token de l'utilisateur connecté
      localStorage.setItem("token", response.data.token);

      // Redirige vers la page Mon Compte
      navigate("/account");
    } catch (error) {
      console.log("Erreur lors de la connexion :", error.message);

      setErrorMessage(
        "Connexion impossible. Vérifie ton email et ton mot de passe.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <p className="login-subtitle">MARVEL : MY UNIVERSE</p>

        <h1>CONNEXION</h1>

        <p className="login-intro">
          Connecte-toi pour retrouver ton univers Marvel.
        </p>
        {location.state?.fromFavorite && (
          <p className="login-favorite-message">
            ❤️ Connecte-toi pour ajouter ce favori à ton univers Marvel.
          </p>
        )}
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Adresse email</label>
          <input
            type="email"
            id="email"
            placeholder="Ton adresse email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            placeholder="Ton mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {errorMessage && <p className="login-error">{errorMessage}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="login-button-loading">
                <span className="login-spinner" aria-hidden="true"></span>
                Connexion à l'univers Marvel...
              </span>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <p className="login-signup">
          Pas encore de compte ? <Link to="/signup">Créer un compte</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
