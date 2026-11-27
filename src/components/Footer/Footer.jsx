import Logo from "../../assets/marvel-logo.svg";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src={Logo} alt="Marvel" />
          <span>MY UNIVERSE</span>
        </div>

        <p className="footer-credit">
          Fait avec ❤️ par <strong>Tevai</strong> au Réacteur.
        </p>

        <p className="footer-copyright">© 2026 — Projet pédagogique</p>
      </div>
    </footer>
  );
};

export default Footer;
