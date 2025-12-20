import { useSearchParams } from "react-router-dom";

const PaginationComponent = ({ currentPage, totalPages }) => {
  const [query, setQuery] = useSearchParams({ page: "1" });
  const page = parseInt(query.get("page") || "1", 10);

  const goToPage = (newPage) => {
    setQuery({ page: newPage.toString() });
  };

  const handlePrev = () => {
    if (page > 1) goToPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) goToPage(page + 1);
  };

  const pages = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      <button
        onClick={handlePrev}
        disabled={page <= 1}
        className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition-colors"
      >
        Prev
      </button>

      {page > 3 && (
        <>
          <button
            onClick={() => goToPage(1)}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            1
          </button>
          <span className="px-1 text-gray-500">...</span>
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`px-3 py-1 rounded transition-colors ${
            p === page
              ? "bg-blue-600 text-white font-bold"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {p}
        </button>
      ))}

      {page < totalPages - 2 && (
        <>
          <span className="px-1 text-gray-500">...</span>
          <button
            onClick={() => goToPage(totalPages)}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={handleNext}
        disabled={page >= totalPages}
        className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export { PaginationComponent };