import { useState } from "react";
import Navbar from "./components/Navbar.js";
import {
  FIELDS,
  OPERATORS,
  PROMPT_FIELDS,
  evaluateQuery,
  isNameGuess,
  parseQuery,
  pickRandom,
  validateForMode,
} from "./utils/kql.js";
import Dropdown from "./components/Dropdown.js";
import CharacterCard from "./components/CharacterCard.js";
import Banner from "./components/Banner.js";
import LeftPanel from "./components/LeftPanel.js";
import RightPanel from "./components/RightPanel.js";
import { FEEDBACK_COLORS, MODES } from "./config.js";
import createRound from "./utils/createRound.js";
import VictoryBanner from "./components/VictoryBanner.js";

function celebrate() {
  new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
    .play()
    .catch(() => {}); // browsers block autoplay before interaction; not worth failing over
  window.confetti?.({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

export default function App() {
  const [mode, setMode] = useState("normal");
  const [round, setRound] = useState(() => createRound("normal"));
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [builder, setBuilder] = useState({
    field: FIELDS[0],
    op: OPERATORS[0],
    value: "",
  });

  const queryCount = round.history.length;

  function startRound(nextMode = mode) {
    setRound(createRound(nextMode));
    setQuery("");
    setFeedback(null);
  }

  function handleModeChange(event) {
    const nextMode = event.target.value;
    setMode(nextMode);
    startRound(nextMode);
  }

  function buildClause() {
    const { field, op, value } = builder;
    if (!value.trim()) return;
    setQuery(`where ${field} ${op} "${value.trim()}"`);
  }

  function runQuery() {
    const text = query.trim();
    if (!text) return;

    const parsed = parseQuery(text);
    const errors = [
      ...parsed.errors,
      ...validateForMode(parsed, mode, round.promptField),
    ];

    if (errors.length) {
      setFeedback({ tone: "error", text: `❌ ${errors.join("\n")}` });
      return;
    }

    const matchesTarget = evaluateQuery(round.target, parsed);
    const accusation = isNameGuess(parsed);
    const next = {
      ...round,
      history: [...round.history, { text, match: matchesTarget }],
    };

    if (accusation && matchesTarget) {
      next.hasWon = true;
      celebrate();
      setFeedback({
        tone: "win",
        text: `🎉 You caught ${round.target.Name}! It took you ${next.history.length} ${
          next.history.length === 1 ? "query" : "queries"
        }.`,
      });
    } else if (matchesTarget) {
      const eliminated = new Set(round.eliminated);
      round.characters.forEach((char) => {
        if (!evaluateQuery(char, parsed)) eliminated.add(char.Name);
      });
      next.eliminated = [...eliminated];
      if (mode === "prompt")
        next.promptField = pickRandom(PROMPT_FIELDS, round.promptField);
      setFeedback({
        tone: "good",
        text: "✅ Yes! You're one step closer to finding the attacker.",
      });
    } else {
      setFeedback({
        tone: "bad",
        text: accusation
          ? "❌ That's not your attacker. Keep filtering."
          : "❌ Hmm... that doesn't seem to help.",
      });
    }

    setRound(next);
    setQuery("");
  }

  return (
    <>
      <Navbar />
      <div className="layout flex flex-row w-full min-h-screen  ">
        <LeftPanel round={round} />

        <main className="flex flex-1 flex-col items-center p-6 bg-main-background inset-shadow-sm">
          <Banner />

          <div className="query-box">
            <input
              type="text"
              id="kqlInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runQuery()}
              placeholder='e.g., where Species == "Raccoon"'
              className="w-[350px] mr-2 p-[0.6rem] border border-input-border font-courier text-[0.9rem] bg-nav-background! text-foreground!"
            />
            <button onClick={runQuery}>Run Query</button>
            <p className="text-center mt-2.5 text-xs">
              🕵️ To catch the attacker, use:{" "}
              <code>where Name == "Full Name"</code>
            </p>
          </div>

          {mode === "prompt" && round.promptField && (
            <div
              style={{
                marginTop: "1rem",
                fontWeight: "bold",
                color: "gold",
                textAlign: "center",
              }}
            >
              🎯 Use only this filter category:{" "}
              <strong>{round.promptField}</strong>
            </div>
          )}

          <div
            id="kqlKeyboard"
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <Dropdown
              value={builder.field}
              onChange={(e) =>
                setBuilder({ ...builder, field: e.target.value })
              }
              options={FIELDS}
            />
            <Dropdown
              value={builder.op}
              onChange={(e) => setBuilder({ ...builder, op: e.target.value })}
              options={OPERATORS}
            />

            <input
              type="text"
              value={builder.value}
              onChange={(e) =>
                setBuilder({ ...builder, value: e.target.value })
              }
              placeholder="Value..."
            />
            <button onClick={buildClause}>🧠 Build Query</button>
          </div>

          <div className="mode-box">
            <label>
              Game Mode:
              {/* <Dropdown
                value={mode}
                onChange={handleModeChange}
                options={MODES}
              /> */}
              <select value={mode} onChange={handleModeChange}>
                {MODES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {feedback && (
            <div
              style={{
                marginTop: "1rem",
                fontWeight: "bold",
                whiteSpace: "pre-line",
                color: FEEDBACK_COLORS[feedback.tone],
              }}
            >
              {feedback.text}
            </div>
          )}

          <button
            onClick={() => startRound()}
            className=" my-4 cursor-pointer text-white! bg-button! rounded! px-4! py-2! hover:bg-button-hover!"
          >
            🔄 New Round
          </button>

          <div className="mt-4 text-xs">🔁 Queries Used: {queryCount}</div>

          <div id="characters">
            {round.characters.map((char) => (
              <CharacterCard
                key={char.Name}
                char={char}
                mode={mode}
                eliminated={round.eliminated.includes(char.Name)}
                caught={round.hasWon && char.Name === round.target.Name}
              />
            ))}
          </div>

          {round.hasWon && <VictoryBanner />}
        </main>

        <RightPanel />
      </div>
    </>
  );
}
