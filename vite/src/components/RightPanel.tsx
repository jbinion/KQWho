import { useState } from "react";
import { FILTER_HELP } from "../config";

export default function RightPanel() {
  return (
    <aside className="right-panel">
      <h4 className="heading">🧠 Available Filters:</h4>
      <ul id="filterList">
        {Object.entries(FILTER_HELP).map(([name, values]) => (
          <FilterDropdown title={name} values={values} />
        ))}
      </ul>
    </aside>
  );
}

function FilterDropdown({ title, values }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="filter-item" key={title}>
      <div className="filter-header" onClick={() => setOpen(!open)}>
        {title}
      </div>
      {open && (
        <div className="filter-content">
          {values.map((value) => (
            <div key={value}>{value}</div>
          ))}
        </div>
      )}
    </li>
  );
}
