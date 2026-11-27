import "./Pagination.css";

const Pagination = ({ page, totalPages, setPage }) => {
  // On affiche au maximum cinq pages autour de la page actuelle.
  const pages = [];

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Précédent
      </button>

      {start > 1 && (
        <>
          <button type="button" onClick={() => setPage(1)}>
            1
          </button>

          {start > 2 && <span>...</span>}
        </>
      )}

      {pages.map((number) => {
        return (
          <button
            type="button"
            key={number}
            className={page === number ? "active" : ""}
            aria-current={page === number ? "page" : undefined}
            onClick={() => setPage(number)}
          >
            {number}
          </button>
        );
      })}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span>...</span>}

          <button type="button" onClick={() => setPage(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
      >
        Suivant
      </button>
    </nav>
  );
};

export default Pagination;
