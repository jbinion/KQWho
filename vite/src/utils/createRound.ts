import { BOARD_SIZE } from "../config";
import characterData from "../data/characters.json";

import { PROMPT_FIELDS, pickRandom, shuffle } from "./kql";

export default function createRound(mode) {
  const characters = shuffle(characterData).slice(0, BOARD_SIZE);
  return {
    characters,
    target: pickRandom(characters),
    eliminated: [], // names, not objects — cheap to compare
    history: [], // { text, match }
    hasWon: false,
    promptField: mode === "prompt" ? pickRandom(PROMPT_FIELDS) : null,
  };
}
