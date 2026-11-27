import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Characters from "./pages/Characters/Characters";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<h1>Accueil personnalisé — Marvel: My Universe</h1>}
        />
        <Route path="/personnages" element={<Characters />} />
        <Route path="/comics" element={<h1>Catalogue des Comics</h1>} />
        <Route path="/account" element={<h1>Mon Compte</h1>} />
        <Route path="/login" element={<h1>Connexion</h1>} />
        <Route path="/signup" element={<h1>Inscription</h1>} />
      </Routes>
    </>
  );
}

export default App;
