import React from "react";

export default function QueryLog({ history }) {
  return (
    <div
      // className="max-h-[500px] mt-[1rem]"
      style={{
        marginTop: "1rem",
        fontSize: "0.8rem",
        fontFamily: "Courier New",
        maxHeight: "500px",
        overflowY: "auto",
        paddingRight: "6px",
      }}
    >
      <strong>Query History:</strong>
      {history.map((entry, i) => (
        <div
          key={i}
          style={{
            background: entry.match ? "#d4f4dd" : "#f8d7da",
            border: entry.match ? "1px solid #5cb85c" : "1px solid #d9534f",
            color: "black",
            padding: "4px",
            marginBottom: "2px",
          }}
        >
          #{i + 1}: {entry.text}
        </div>
      ))}
    </div>
  );
}
