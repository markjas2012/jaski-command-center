import GamingRoom from "../../components/GamingRoom";

export default function GamesPage() {
  return (
    <>
      <a
        href="/"
        aria-label="Return to Jaski Home"
        style={{
          position: "fixed",
          top: "112px",
          left: "30px",
          zIndex: 9999,
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          padding: "9px 12px",
          border: "1px solid rgba(119, 181, 255, 0.24)",
          borderRadius: "10px",
          background: "rgba(7, 15, 28, 0.86)",
          color: "#b9dcff",
          textDecoration: "none",
          fontFamily: "inherit",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.04em",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.16)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span aria-hidden="true">←</span>
        Home
      </a>

      <GamingRoom />
    </>
  );
}
