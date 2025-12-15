import React from "react";

const TableControls = ({ entries, setEntries, search, setSearch }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <div className="text-sm">
        Show{" "}
        <select
          className="form-select d-inline w-auto"
          value={entries}
          onChange={(e) => {
            setEntries(Number(e.target.value));
          }}
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>{" "}
        entries
      </div>
      <div className="text-sm d-flex justify-content-between align-items-center flex-wrap gap-2">
        <label htmlFor="Search">Search : </label>
        <input
          type="text"
          placeholder="Search"
          className="form-control w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TableControls;
