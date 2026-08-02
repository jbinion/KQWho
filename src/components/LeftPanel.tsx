import PanelContainer from "./PanelContainer";
import QueryLog from "./QueryLog";

export default function LeftPanel({ round }) {
  return (
    <PanelContainer className="left-panel">
      <h2 className="heading" style={{ textAlign: "center" }}>
        Target
      </h2>
      <img
        className="width-full rounded-lg"
        id="targetImg"
        src={
          round.hasWon ? round.target.Image : "images/target-placeholder.png"
        }
        alt={round.hasWon ? round.target.Name : "Unidentified suspect"}
      />
      <p id="targetDisplay">Who is the suspect?</p>
      {round.hasWon && (
        <p style={{ fontWeight: "bold", textAlign: "center" }}>
          🎯 {round.target.Name}
        </p>
      )}

      <QueryLog history={round.history} />
    </PanelContainer>
  );
}
