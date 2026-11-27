import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import "./FavoriteButton.css";

const API_URL = "https://site--marvel-backend--8x9r8cyv4xks.code.run";

const FavoriteButton = ({ itemId, itemType, title, image }) => {
  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFavorite = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/user/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const existingFavorite = response.data.favorites.find((item) => {
          return item.itemId === itemId && item.itemType === itemType;
        });

        setFavorite(existingFavorite || null);
      } catch (error) {
        console.log(
          "Erreur lors de la récupération des favoris :",
          error.message,
        );
        setErrorMessage("Impossible de vérifier les favoris.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorite();
  }, [itemId, itemType]);

  const handleFavorite = async () => {
    const token = localStorage.getItem("token");

    // Pour ce premier test, les favoris sont liés au compte.
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let response;

      if (favorite) {
        // Attention : suppression avec l'ID MongoDB du favori.
        response = await axios.delete(
          `${API_URL}/user/favorites/${favorite._id}`,
          config,
        );
      } else {
        response = await axios.post(
          `${API_URL}/user/favorites`,
          {
            itemId: itemId,
            itemType: itemType,
            title: title,
            image: image,
          },
          config,
        );
      }

      // Met à jour l'affichage à partir de la réponse du backend.
      const updatedFavorite = response.data.favorites.find((item) => {
        return item.itemId === itemId && item.itemType === itemType;
      });

      setFavorite(updatedFavorite || null);
    } catch (error) {
      console.log("Erreur lors de la modification du favori :", error.message);

      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setErrorMessage("Impossible de modifier ce favori.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="favorite-button-container">
      <button
        type="button"
        className={`favorite-button ${favorite ? "active" : ""}`}
        onClick={handleFavorite}
        disabled={isLoading}
        aria-pressed={Boolean(favorite)}
      >
        {favorite ? <FaHeart /> : <FaRegHeart />}

        <span>
          {isLoading
            ? "Chargement..."
            : favorite
              ? "Retirer des favoris"
              : "Ajouter aux favoris"}
        </span>
      </button>

      {errorMessage && (
        <p className="favorite-button-error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FavoriteButton;
