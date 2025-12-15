import React from "react";

const PaginationControls = ({
  currentPage,
  setCurrentPage,
  entries,
  totalCount,
}) => {
  const totalPages = Math.ceil(totalCount / entries);
  const start = (currentPage - 1) * entries + 1;
  const end = Math.min(currentPage * entries, totalCount);

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2 text-sm dataTables_info">
      <div>
        Showing {start} to {end} of {totalCount} entries
      </div>
      <div className="btn-group">
        <button
          className="previous-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>
        <span className="center-num-btn disabled">{currentPage}</span>
        <button
          className="next-btn"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
