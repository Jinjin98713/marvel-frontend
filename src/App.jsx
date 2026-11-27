import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Characters from "./pages/Characters/Characters";
import CharacterDetail from "./pages/CharacterDetail/CharacterDetail";
import Comics from "./pages/Comics/Comics";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Account from "./pages/Account/Account";
import Favorites from "./pages/Favorites/Favorites";

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
        <Route path="/personnage/:characterId" element={<CharacterDetail />} />
        <Route path="/comics" element={<Comics />} />
        <Route path="/account" element={<Account />} />
        <Route path="/favoris" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
