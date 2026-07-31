export default function CharacterCard({ char, mode, eliminated, caught }) {
  return (
    <div
      className={`character-card${caught ? " wiggle" : ""}`}
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "0.75rem",
        opacity: eliminated ? 0.2 : 1,
        filter: eliminated ? "grayscale(100%)" : "none",
        boxShadow: caught ? "0 0 15px 5px limegreen" : "none",
      }}
    >
      {mode !== "data" && <img src={char.Image} alt={char.Name} />}
      <div>
        <strong>{char.Name}</strong>
        {mode !== "image" && (
          <>
            <br />
            <strong>Hostname:</strong> {char.Hostname}
            <br />
            <strong>IP:</strong> {char.IP}
            <br />
            <strong>Login:</strong> {char.LoginAccount}
            <br />
            <strong>Visited:</strong>
            <ul style={{ margin: 0, paddingLeft: "1rem" }}>
              {char.VisitedDomains?.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <strong>Files:</strong> {char.FilesDownloaded?.join(", ")}
            <br />
            <strong>Activity:</strong> {char.SuspiciousActivity}
            <br />
            <strong>Processes:</strong>
            <ul style={{ margin: "0 0 0.3rem", paddingLeft: "1rem" }}>
              {char.ProcessesRun?.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
