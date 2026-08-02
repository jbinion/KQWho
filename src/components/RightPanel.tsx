import { useState } from "react";
import { FILTER_HELP } from "../config";
import PanelContainer from "./PanelContainer";

export default function RightPanel() {
  return (
    <PanelContainer>
      <h4 className="heading">🧠 Available Filters:</h4>
      <ul className="space-y-1">
        {Object.entries(FILTER_HELP).map(([name, values]) => (
          <FilterDropdown title={name} values={values} />
        ))}
      </ul>
    </PanelContainer>
  );
}

function FilterDropdown({ title, values }) {
  const [open, setOpen] = useState(false);
  return (
    <li
      className="filter-item text-li-background text-center bg-white rounded p-1"
      key={title}
    >
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
