import { useState, useEffect } from "react";
import "./Header.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/marvel-logo.svg";
import { FaUsers, FaBookOpen, FaHeart, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const API_URL = "https://site--marvel-backend--8x9r8cyv4xks.code.run";

  // Vérifie la connexion et récupère le pseudo de l'utilisateur.
  useEffect(() => {
    let isCancelled = false;

    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUsername("");
        setIsLoadingUser(false);
        return;
      }

      setIsLoadingUser(true);
      setUsername("");

      try {
        const response = await axios.get(`${API_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!isCancelled) {
          setUsername(response.data.username);
        }
      } catch (error) {
        console.log(
          "Erreur lors de la récupération de l'utilisateur :",
          error.message,
        );

        if (!isCancelled) {
          setUsername("");

          if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingUser(false);
        }
      }
    };

    fetchUser();

    return () => {
      isCancelled = true;
    };
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src={Logo} alt="Logo Marvel" />
          <span>MY UNIVERSE</span>
        </Link>

        <nav className="header-nav">
          <NavLink
            to="/personnages"
            className={({ isActive }) =>
              isActive || location.pathname.startsWith("/personnage/")
                ? "header-link active"
                : "header-link"
            }
          >
            <FaUsers />
            <span>Personnages</span>
          </NavLink>

          <NavLink
            to="/comics"
            className={({ isActive }) =>
              isActive ? "header-link active" : "header-link"
            }
          >
            <FaBookOpen />
            <span>Comics</span>
          </NavLink>

          <NavLink
            to="/favoris"
            className={({ isActive }) =>
              isActive ? "header-link active" : "header-link"
            }
          >
            <FaHeart />
            <span>Favoris</span>
          </NavLink>

          <Link
            to={username ? "/account" : "/login"}
            className={
              location.pathname === "/account" || location.pathname === "/login"
                ? "header-link active"
                : "header-link"
            }
          >
            <FaUserCircle />

            {isLoadingUser ? (
              <span>Mon Compte</span>
            ) : username ? (
              <span className="header-user">
                <span className="header-username">{username}</span>
                <span className="header-status-dot" aria-hidden="true"></span>
              </span>
            ) : (
              <span>Se connecter</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
