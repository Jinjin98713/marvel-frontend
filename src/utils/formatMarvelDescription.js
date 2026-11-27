const formatMarvelDescription = (description) => {
  if (!description) {
    return "Aucune description disponible";
  }

  // Convertit le HTML fourni par Marvel en document temporaire.
  const parser = new DOMParser();
  const document = parser.parseFromString(description, "text/html");

  // Récupère uniquement le texte, sans afficher les balises HTML.
  const text = document.body.textContent.trim();

  return text || "Aucune description disponible";
};

export default formatMarvelDescription;
