export default function Dropdown({ value, onChange, options }) {
  return (
    <select value={value} onChange={onChange}>
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  );
}
