// src/utils/kql.js
// Query engine for KQ Who?
//
// Grammar (no parentheses, connectors evaluate left to right):
//   where <Field> <op> "<value>" [and|or <Field> <op> "<value>" ...]

export const FIELDS = [
  "Name",
  "LoginAccount",
  "Hostname",
  "IP",
  "VisitedDomains",
  "FilesDownloaded",
  "ColorScheme",
  "ProcessesRun",
  "SuspiciousActivity",
  "Species",
  "Hair",
  "Accessory",
];

export const OPERATORS = [
  "==",
  "!=",
  "contains",
  "!contains",
  "has",
  "has_any",
];

export const PROMPT_FIELDS = [
  "Species",
  "Accessory",
  "ColorScheme",
  "VisitedDomains",
  "FilesDownloaded",
  "Hostname",
  "IP",
  "ProcessesRun",
];

// Longer operators first so "has_any" wins over "has" and "!contains" over "contains".
const CLAUSE_RE =
  /^([A-Za-z_]\w*)\s*(==|!=|!contains|contains|has_any|has)\s*(?:"([^"]*)"|'([^']*)'|(\S+))$/i;

/* ---------------------------------- utils --------------------------------- */

export function shuffle(list) {
  const copy = [...list]; // never mutate the imported JSON
  for (let m = copy.length; m > 1; ) {
    const i = Math.floor(Math.random() * m--);
    [copy[m], copy[i]] = [copy[i], copy[m]];
  }
  return copy;
}

export function pickRandom(list, exclude) {
  const pool =
    exclude && list.length > 1 ? list.filter((v) => v !== exclude) : list;
  return pool[Math.floor(Math.random() * pool.length)];
}

const lower = (v) => (typeof v === "string" ? v.toLowerCase() : v);

function readField(char, field) {
  const key = Object.keys(char).find(
    (k) => k.toLowerCase() === field.toLowerCase(),
  );
  return key === undefined ? undefined : char[key];
}

function asBoolean(value) {
  if (/^true$/i.test(value)) return true;
  if (/^false$/i.test(value)) return false;
  return null;
}

/* ---------------------------------- parse --------------------------------- */

/**
 * @returns {{clauses: Array<{field:string,op:string,value:string}>,
 *            connectors: string[], errors: string[]}}
 */
export function parseQuery(raw) {
  const text = (raw ?? "").trim();
  const errors = [];

  if (!text)
    return { clauses: [], connectors: [], errors: ["Type a query to run."] };

  if (!/^where\b/i.test(text)) errors.push("Start the query with 'where'.");

  const logic = text.replace(/^where\b/i, "").trim();
  if (!logic) {
    errors.push(
      "Add a condition after 'where', e.g. where Species == \"Raccoon\".",
    );
    return { clauses: [], connectors: [], errors };
  }

  const parts = logic.split(/\s+(and|or)\s+/i);
  const clauses = [];
  const connectors = [];

  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      connectors.push(part.toLowerCase());
      return;
    }

    const piece = part.trim();
    const match = piece.match(CLAUSE_RE);

    if (!match) {
      if (/[^=!<>]=([^=]|$)/.test(piece)) {
        errors.push(`Use '==' instead of '=' in: ${piece}`);
      } else {
        errors.push(`Can't read this condition: ${piece}`);
      }
      return;
    }

    const [, field, op, doubleQuoted, singleQuoted, bare] = match;

    if (!FIELDS.some((f) => f.toLowerCase() === field.toLowerCase())) {
      errors.push(`Unknown field: ${field}`);
      return;
    }

    clauses.push({
      field,
      op: op.toLowerCase(),
      value: doubleQuoted ?? singleQuoted ?? bare,
    });
  });

  return { clauses, connectors, errors };
}

/* -------------------------------- evaluate -------------------------------- */

export function evaluateClause(char, { field, op, value }) {
  const raw = readField(char, field);
  if (raw === undefined || raw === null) return false;

  const list = Array.isArray(raw) ? raw.map(lower) : null;
  const single = list ? null : lower(raw);
  const needle = lower(value);
  const bool = asBoolean(value);

  const includesExact = () =>
    list ? list.includes(needle) : single === needle;
  const includesText = () =>
    list
      ? list.some((v) => String(v).includes(needle))
      : String(single).includes(needle);

  switch (op) {
    case "==":
      if (typeof raw === "boolean") return bool !== null && raw === bool;
      return includesExact();
    case "!=":
      if (typeof raw === "boolean") return bool !== null && raw !== bool;
      return !includesExact();
    case "contains":
      return includesText();
    case "!contains":
      return !includesText();
    case "has":
      return includesExact();
    case "has_any": {
      const wanted = String(needle)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return list
        ? wanted.some((w) => list.includes(w))
        : wanted.includes(single);
    }
    default:
      return false;
  }
}

export function evaluateQuery(char, parsed) {
  if (!parsed.clauses.length) return false;

  let result = evaluateClause(char, parsed.clauses[0]);
  parsed.connectors.forEach((connector, i) => {
    const next = parsed.clauses[i + 1];
    if (!next) return;
    const value = evaluateClause(char, next);
    result = connector === "or" ? result || value : result && value;
  });
  return result;
}

/* ------------------------------- mode rules ------------------------------- */

/** True when the query is a single accusation against a name. */
export function isNameGuess(parsed) {
  return (
    parsed.clauses.length === 1 &&
    parsed.clauses[0].field.toLowerCase() === "name" &&
    (parsed.clauses[0].op === "==" || parsed.clauses[0].op === "contains")
  );
}

/** Prompt Challenge only allows the round's field, plus Name for the final guess. */
export function validateForMode(parsed, mode, promptField) {
  if (mode !== "prompt" || !promptField) return [];

  const allowed = new Set([promptField.toLowerCase(), "name"]);
  const offLimits = parsed.clauses
    .map((c) => c.field)
    .filter((f) => !allowed.has(f.toLowerCase()));

  if (!offLimits.length) return [];
  return [
    `This round only allows ${promptField} — or Name to make your guess.`,
  ];
}
