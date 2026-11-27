import "./Header.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../../assets/marvel-logo.svg";
import { FaUsers, FaBookOpen, FaHeart, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const location = useLocation();

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
              isActive ? "header-link active" : "header-link"
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

          <Link
            to="/account#favorites"
            className={
              location.pathname === "/account" && location.hash === "#favorites"
                ? "header-link active"
                : "header-link"
            }
          >
            <FaHeart />
            <span>Favoris</span>
          </Link>

          <Link
            to="/account"
            className={
              location.pathname === "/account" && !location.hash
                ? "header-link active"
                : "header-link"
            }
          >
            <FaUserCircle />
            <span>Mon Compte</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
